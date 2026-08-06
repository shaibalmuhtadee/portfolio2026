import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const site = JSON.parse(await readFile(path.resolve('src/data/site.json'), 'utf8'));
const siteOrigin = new URL(site.url).origin;
const checkExternal = process.argv.includes('--external');
const errors = [];
const inconclusive = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else files.push(file);
  }
  return files;
}

const isFile = async (file) => (await stat(file).catch(() => null))?.isFile() ?? false;

const outputPathForUrl = async (url) => {
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const candidate = path.resolve(distRoot, relative || 'index.html');
  if (candidate !== distRoot && !candidate.startsWith(`${distRoot}${path.sep}`)) return null;
  if (await isFile(candidate)) return candidate;
  if (await isFile(path.join(candidate, 'index.html'))) return path.join(candidate, 'index.html');
  if (!path.extname(candidate) && (await isFile(`${candidate}.html`))) return `${candidate}.html`;
  return null;
};

const collectStructuredUrls = (value, urls) => {
  if (typeof value === 'string' && /^https:\/\//.test(value)) {
    const url = new URL(value);
    url.hash = '';
    urls.add(url.href);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStructuredUrls(item, urls));
  }
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStructuredUrls(item, urls));
  }
};

const htmlFiles = (await walk(distRoot)).filter((file) => file.endsWith('.html'));
const externalUrls = new Set();

const validateTarget = async (target, baseUrl, source, checkFragment = false) => {
  if (/^(?:data:|javascript:|mailto:|tel:)/i.test(target)) return;
  let url;
  try {
    url = new URL(target, baseUrl);
  } catch {
    errors.push(`${source}: malformed URL ${target}`);
    return;
  }

  if (url.origin === siteOrigin) {
    const outputFile = await outputPathForUrl(url);
    if (!outputFile) {
      errors.push(`${source}: local target is missing for ${url.href}`);
      return;
    }
    if (checkFragment && url.hash && outputFile.endsWith('.html')) {
      const targetHtml = await readFile(outputFile, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid=["']${escaped}["']`, 'i').test(targetHtml)) {
        errors.push(`${source}: fragment target #${id} is missing in ${url.pathname}`);
      }
    }
    return;
  }

  if (url.protocol !== 'https:') {
    errors.push(`${source}: external URL must use HTTPS: ${url.href}`);
  }
  if (url.origin !== 'https://schema.org') externalUrls.add(url.href);
};

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const documentPath = `/${path.relative(distRoot, htmlFile).replaceAll(path.sep, '/')}`;
  const baseUrl = new URL(
    documentPath.endsWith('/index.html') ? documentPath.slice(0, -10) : documentPath,
    site.url,
  );
  const discovered = new Set();

  for (const match of html.matchAll(/\b(?:href|poster|src)=["']([^"']+)["']/gi)) {
    discovered.add(match[1]);
  }
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/, 1)[0];
      if (url) discovered.add(url);
    }
  }
  for (const match of html.matchAll(
    /<meta\b[^>]*(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image)["'][^>]*content=["']([^"']+)["']/gi,
  )) {
    discovered.add(match[1]);
  }
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      collectStructuredUrls(JSON.parse(match[1]), discovered);
    } catch (error) {
      errors.push(`${documentPath}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const target of discovered) {
    await validateTarget(target, baseUrl, documentPath, true);
  }
}

const cssFiles = (await walk(distRoot)).filter((file) => file.endsWith('.css'));
for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, 'utf8');
  const relative = path.relative(distRoot, cssFile).replaceAll(path.sep, '/');
  const baseUrl = new URL(`/${relative}`, site.url);
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    await validateTarget(match[1], baseUrl, `/${relative}`);
  }
}

const builtSitemap = path.join(distRoot, 'sitemap.xml');
if (await isFile(builtSitemap)) {
  const sitemap = await readFile(builtSitemap, 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
    await validateTarget(match[1], new URL('/', site.url), '/sitemap.xml');
  }
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const probe = async (url) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'shaibalmuhtadee.com release link checker',
        },
      });
      if (response.status >= 200 && response.status < 400) return { status: response.status };
      if ([401, 403, 405, 429, 999].includes(response.status)) {
        return { status: response.status, inconclusive: true };
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await wait(attempt * 250);
  }
  throw lastError;
};

if (checkExternal) {
  for (const url of [...externalUrls].sort()) {
    try {
      const result = await probe(url);
      if (result.inconclusive) {
        inconclusive.push(`${url} returned bot-protection status ${result.status}`);
      }
      else process.stdout.write(`External link reachable (${result.status}): ${url}\n`);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
}

if (errors.length > 0 || inconclusive.length > 0) {
  if (errors.length > 0) console.error(`Broken-link check failed:\n- ${errors.join('\n- ')}`);
  if (inconclusive.length > 0) {
    console.error(
      `External checks were inconclusive and require a manual browser pass:\n- ${inconclusive.join('\n- ')}`,
    );
  }
  process.exit(1);
}

process.stdout.write(
  `Link check passed for ${htmlFiles.length} HTML route(s)` +
    (checkExternal ? ` and ${externalUrls.size} external URL(s).\n` : '.\n'),
);
