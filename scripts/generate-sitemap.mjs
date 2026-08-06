import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const site = JSON.parse(await readFile(path.resolve('src/data/site.json'), 'utf8'));

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

const rootStats = await stat(distRoot).catch(() => null);
if (!rootStats?.isDirectory()) throw new Error('Run the production build before generating sitemap.xml.');

const htmlFiles = (await walk(distRoot)).filter((file) => file.endsWith('.html'));
const urls = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;

  const relative = path.relative(distRoot, file).replaceAll(path.sep, '/');
  const route = relative === 'index.html' ? '/' : `/${relative.replace(/\/index\.html$/, '')}`;
  urls.push(new URL(route, site.url).href);
}

const escapeXml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const body = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(distRoot, 'sitemap.xml'), body, 'utf8');
process.stdout.write(`Generated sitemap.xml with ${urls.length} route(s).\n`);
