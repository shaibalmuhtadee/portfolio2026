import { readFile } from 'node:fs/promises';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'dist', 'index.html');
const siteConfigPath = path.join(process.cwd(), 'src', 'data', 'site.json');
const [html, site] = await Promise.all([
  readFile(outputPath, 'utf8'),
  readFile(siteConfigPath, 'utf8').then((source) => JSON.parse(source)),
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

const inlineScriptBytes = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].reduce(
  (total, match) => total + Buffer.byteLength(match[1] ?? '', 'utf8'),
  0,
);

if (inlineScriptBytes > inlineScriptBudget) {
  errors.push(
    `Inline JavaScript is ${inlineScriptBytes} bytes; the static-site ceiling is ${inlineScriptBudget} bytes.`,
  );
}

if (!html.includes('<link rel="canonical" href="https://shaibalmuhtadee.com/">')) {
  errors.push('The canonical home URL is missing or incorrect.');
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
