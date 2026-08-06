import { readFile } from 'node:fs/promises';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'dist', 'index.html');
const siteConfigPath = path.join(process.cwd(), 'src', 'data', 'site.json');
const robotsPath = path.join(process.cwd(), 'dist', 'robots.txt');
const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
const site = JSON.parse(await readFile(siteConfigPath, 'utf8'));
const [html, robots, sitemap, socialImage] = await Promise.all([
  readFile(outputPath, 'utf8'),
  readFile(robotsPath, 'utf8').catch(() => null),
  readFile(sitemapPath, 'utf8').catch(() => null),
  readFile(path.join(process.cwd(), 'dist', site.socialImage.path.replace(/^\//, ''))).catch(
    () => null,
  ),
]);
const errors = [];
const seed = '8b14ca40';
const finish =
  'unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md';
const inlineScriptBudget = 4096;
const requiredSections = ['experience', 'work', 'about', 'contact'];
const requiredContent = [
  'Zebra Technologies',
  'Inokta',
  'Searchington',
  'ChromaMap',
  'GanttWise',
  'University of Toronto',
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasHref = (href) =>
  new RegExp(`<a\\b[^>]*\\bhref=["']${escapeRegExp(href)}["']`, 'i').test(html);

if (!/<body[^>]*>\s*<!--[\s\S]*?8b14ca40[\s\S]*?-->/.test(html)) {
  errors.push('The direction contract is not the first non-whitespace child of body.');
}

if ((html.match(new RegExp(seed, 'g')) ?? []).length !== 1) {
  errors.push('The direction seed must appear exactly once in the built home page.');
}

if (!html.includes(finish)) {
  errors.push('The required FINISH sentence did not survive the production build.');
}

if (/<script\b[^>]*\bsrc=/i.test(html)) {
  errors.push('The home page contains external executable JavaScript.');
}

const inlineScriptBytes = [
  ...html.matchAll(/<script(?<attributes>\s[^>]*)?>(?<content>[\s\S]*?)<\/script>/gi),
]
  .filter((match) => !/\btype=["']application\/ld\+json["']/i.test(match.groups?.attributes ?? ''))
  .reduce((total, match) => total + Buffer.byteLength(match.groups?.content ?? '', 'utf8'), 0);

if (inlineScriptBytes > inlineScriptBudget) {
  errors.push(
    `Inline JavaScript is ${inlineScriptBytes} bytes; the static-site ceiling is ${inlineScriptBudget} bytes.`,
  );
}

if (!html.includes('<link rel="canonical" href="https://shaibalmuhtadee.com/">')) {
  errors.push('The canonical home URL is missing or incorrect.');
}

const socialImageUrl = new URL(site.socialImage.path, site.url).href;
const requiredMetadata = [
  '<meta name="robots" content="index, follow">',
  '<link rel="sitemap" href="/sitemap.xml" type="application/xml">',
  `<meta property="og:image" content="${socialImageUrl}">`,
  `<meta property="og:image:secure_url" content="${socialImageUrl}">`,
  '<meta property="og:image:type" content="image/png">',
  `<meta property="og:image:width" content="${site.socialImage.width}">`,
  `<meta property="og:image:height" content="${site.socialImage.height}">`,
  `<meta property="og:image:alt" content="${site.socialImage.alt}">`,
  '<meta name="twitter:card" content="summary_large_image">',
  `<meta name="twitter:image" content="${socialImageUrl}">`,
  `<meta name="twitter:image:alt" content="${site.socialImage.alt}">`,
];

for (const metadata of requiredMetadata) {
  if (!html.includes(metadata)) errors.push(`Required Phase 5 metadata is missing: ${metadata}`);
}

const jsonLdMatches = [
  ...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ),
];

if (jsonLdMatches.length !== 1) {
  errors.push('The home page must contain exactly one JSON-LD block.');
} else {
  try {
    const data = JSON.parse(jsonLdMatches[0][1]);
    if (data['@context'] !== 'https://schema.org' || data['@type'] !== 'ProfilePage') {
      errors.push('Structured data must describe a schema.org ProfilePage.');
    }
    if (
      data.mainEntity?.['@type'] !== 'Person' ||
      data.mainEntity?.name !== site.name ||
      JSON.stringify(data.mainEntity?.sameAs) !==
        JSON.stringify([site.social.linkedin, site.social.github])
    ) {
      errors.push('Structured data Person identity or public profiles are incorrect.');
    }
    if (/email|telephone|mailto:|tel:/i.test(JSON.stringify(data))) {
      errors.push('Structured data exposes a private contact field or path.');
    }
  } catch (error) {
    errors.push(`The JSON-LD block is invalid JSON: ${error.message}`);
  }
}

const expectedRobots =
  'User-agent: *\nAllow: /\nSitemap: https://shaibalmuhtadee.com/sitemap.xml\n';
if (robots !== expectedRobots) {
  errors.push('robots.txt is missing or does not advertise the sitemap.');
}
if (!sitemap?.includes('<loc>https://shaibalmuhtadee.com/</loc>')) {
  errors.push('sitemap.xml is missing or does not contain the canonical home URL.');
}

if (!socialImage || socialImage.length < 24) {
  errors.push('The 1200×630 social image is missing from the production build.');
} else {
  const pngSignature = socialImage.subarray(0, 8).toString('hex');
  const width = socialImage.readUInt32BE(16);
  const height = socialImage.readUInt32BE(20);
  if (pngSignature !== '89504e470d0a1a0a' || width !== 1200 || height !== 630) {
    errors.push(`The social image must be a 1200×630 PNG; found ${width}×${height}.`);
  }
}

for (const sectionId of requiredSections) {
  if (!new RegExp(`<section\\b[^>]*\\bid=["']${sectionId}["']`, 'i').test(html)) {
    errors.push(`The required Phase 3 section #${sectionId} is missing.`);
  }
}

for (const content of requiredContent) {
  if (!html.includes(content)) {
    errors.push(`Required Phase 3 content is missing: ${content}.`);
  }
}

for (const [label, href] of Object.entries(site.social)) {
  if (!hasHref(href)) {
    errors.push(`The ${label} profile link is missing or does not match site.json.`);
  }
}

if (/mailto:|tel:/i.test(html)) {
  errors.push('The build exposes a private email or phone contact path.');
}

if (site.resume.enabled) {
  if (!hasHref(site.resume.path)) {
    errors.push('The enabled public resume link is missing or does not match site.json.');
  }
} else if (/\/resume\/|\.pdf(?:[?#"'])/i.test(html)) {
  errors.push('The build exposes a resume while the resume is disabled in site.json.');
}

if (/(?:more than|over)?\s*300\s*(?:%|percent)/i.test(html)) {
  errors.push('The build exposes the unverified ChromaMap 300% performance claim.');
}

const placeholderPatterns = [
  /\blorem(?:\s+ipsum)?\b/i,
  /\bplaceholder(?:\s+(?:copy|content|text))?\b/i,
  /\bcoming soon\b/i,
  /\b(?:TBD|TODO)\b/,
  /\breplace me\b/i,
  /\[(?:add|insert)\s+[^\]]+\]/i,
];

if (placeholderPatterns.some((pattern) => pattern.test(html))) {
  errors.push('The build contains placeholder copy.');
}

if (errors.length > 0) {
  console.error(`Build verification failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

process.stdout.write(`Build verification passed; inline JavaScript: ${inlineScriptBytes} bytes.\n`);
