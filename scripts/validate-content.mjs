import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'astro/zod';
import matter from 'gray-matter';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const sectionPath = path.join(root, 'src', 'data', 'sections.json');
const sitePath = path.join(root, 'src', 'data', 'site.json');
const errors = [];

const text = z.string().trim().min(1);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const httpsUrl = z.url().refine((value) => value.startsWith('https://'), {
  message: 'Public links must use HTTPS.',
});
const expectedSectionSources = {
  experience: 'experience',
  projects: 'project',
  about: 'site',
  education: 'site',
  skills: 'site',
  contact: 'site',
};
const implementedSections = new Set([
  'experience',
  'projects',
  'about',
  'education',
  'skills',
  'contact',
]);

const sectionConfigSchema = z
  .object({
    id: z.enum(['experience', 'projects', 'about', 'education', 'skills', 'contact']),
    label: text,
    order: z.number().int().positive(),
    enabled: z.boolean(),
    navVisible: z.boolean(),
    contentSource: z.enum(['experience', 'project', 'site']),
  })
  .strict()
  .superRefine((section, context) => {
    if (section.contentSource !== expectedSectionSources[section.id]) {
      context.addIssue({
        code: 'custom',
        message: `Section "${section.id}" must use the "${expectedSectionSources[section.id]}" source.`,
        path: ['contentSource'],
      });
    }

    if (section.navVisible && !section.enabled) {
      context.addIssue({
        code: 'custom',
        message: 'A disabled section cannot remain visible in navigation.',
        path: ['navVisible'],
      });
    }
  });

const siteConfigSchema = z
  .object({
    name: text,
    role: text,
    headline: text,
    location: text,
    availability: text,
    workAuthorization: text,
    supportingCopy: text,
    title: text,
    description: text,
    url: httpsUrl,
    locale: z.string().regex(/^[a-z]{2}_[A-Z]{2}$/),
    social: z.object({ linkedin: httpsUrl, github: httpsUrl }).strict(),
    about: z.object({ paragraphs: z.array(text).min(1).max(3) }).strict(),
    education: z
      .array(
        z
          .object({
            institution: text,
            degree: text,
            location: text,
            start: month,
            end: month,
          })
          .strict()
          .refine((entry) => entry.end >= entry.start, {
            message: 'Education end month cannot be earlier than its start month.',
            path: ['end'],
          }),
      )
      .min(1),
    skillGroups: z.array(z.object({ label: text, skills: z.array(text).min(1) }).strict()).min(1),
    contact: z.object({ heading: text, body: text }).strict(),
    eligibilitySummary: text,
    socialImage: z
      .object({
        path: z.string().regex(/^\/images\/[a-z0-9][a-z0-9._-]*\.png$/),
        alt: text,
        width: z.literal(1200),
        height: z.literal(630),
      })
      .strict(),
    resume: z
      .object({
        path: z.string().regex(/^\/resume\/[a-z0-9][a-z0-9._-]*\.pdf$/),
      })
      .strict(),
  })
  .strict();

function parseJsonConfig(source, label, schema) {
  let data;

  try {
    data = JSON.parse(source);
  } catch {
    errors.push(`${label}: invalid JSON.`);
    return undefined;
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const location = issue.path.length > 0 ? ` at ${issue.path.join('.')}` : '';
      errors.push(`${label}${location}: ${issue.message}`);
    }

    return undefined;
  }

  return result.data;
}

async function markdownEntries(collection) {
  const directory = path.join(contentRoot, collection);
  const files = (await readdir(directory, { recursive: true })).filter((file) =>
    file.endsWith('.md'),
  );

  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(directory, file), 'utf8');
      const { data } = matter(source);
      return { collection, file, data };
    }),
  );
}

function validateTimeline(entry) {
  const { end, start } = entry.data;
  const current = entry.data.current ?? false;
  const validState = (current === true && !end) || (current === false && Boolean(end));

  if (!validState) {
    errors.push(`${entry.collection}/${entry.file}: invalid current/end timeline state.`);
  }

  if (end && end < start) {
    errors.push(`${entry.collection}/${entry.file}: end month is earlier than start month.`);
  }
}

function validateHttpsUrls(entry) {
  for (const [key, value] of Object.entries(entry.data)) {
    if (!key.endsWith('Url') || value === undefined) continue;

    try {
      const parsed = new URL(value);
      if (parsed.protocol !== 'https:') throw new Error('not HTTPS');
    } catch {
      errors.push(`${entry.collection}/${entry.file}: ${key} must be a valid HTTPS URL.`);
    }
  }
}

const [experience, projects, sectionSource, siteSource] = await Promise.all([
  markdownEntries('experience'),
  markdownEntries('projects'),
  readFile(sectionPath, 'utf8'),
  readFile(sitePath, 'utf8'),
]);

const entries = [...experience, ...projects];

for (const entry of entries) {
  validateTimeline(entry);
  validateHttpsUrls(entry);
}

const projectOrders = new Map();

for (const project of projects) {
  const order = project.data.order;

  if (projectOrders.has(order)) {
    errors.push(
      `projects/${project.file}: order ${order} duplicates projects/${projectOrders.get(order)}.`,
    );
  }

  projectOrders.set(order, project.file);

  if (!project.data.statusNote && !project.data.supportedOutcome) {
    errors.push(`projects/${project.file}: provide supportedOutcome or statusNote.`);
  }

  if (
    project.data.status === 'private' &&
    (project.data.repositoryUrl ||
      project.data.demoUrl ||
      project.data.caseStudy === true ||
      project.data.image)
  ) {
    errors.push(
      `projects/${project.file}: private projects cannot expose links, case studies, or images.`,
    );
  }
}

const sections =
  parseJsonConfig(sectionSource, 'sections.json', z.array(sectionConfigSchema).min(1)) ?? [];
const siteConfig = parseJsonConfig(siteSource, 'site.json', siteConfigSchema);
const ids = new Set();
const orders = new Set();
const counts = { experience: experience.length, project: projects.length };

for (const section of sections) {
  if (ids.has(section.id)) errors.push(`sections.json: duplicate id "${section.id}".`);
  if (orders.has(section.order)) errors.push(`sections.json: duplicate order ${section.order}.`);

  ids.add(section.id);
  orders.add(section.order);

  if (section.enabled && !implementedSections.has(section.id)) {
    errors.push(`sections.json: enabled section "${section.id}" has no registered renderer.`);
  }

  if (section.enabled && section.contentSource !== 'site' && counts[section.contentSource] === 0) {
    errors.push(`sections.json: enabled section "${section.id}" has no backing content.`);
  }
}

if (siteConfig) {
  const groupLabels = new Set();
  const skills = new Set();

  for (const group of siteConfig.skillGroups) {
    const normalizedLabel = group.label.toLocaleLowerCase('en-CA');
    if (groupLabels.has(normalizedLabel)) {
      errors.push(`site.json: duplicate skill-group label "${group.label}".`);
    }
    groupLabels.add(normalizedLabel);

    for (const skill of group.skills) {
      const normalizedSkill = skill.toLocaleLowerCase('en-CA');
      if (skills.has(normalizedSkill)) {
        errors.push(`site.json: duplicate displayed skill "${skill}".`);
      }
      skills.add(normalizedSkill);
    }
  }
}

const textFiles = [
  ...(await readdir(path.join(root, 'src'), { recursive: true }))
    .filter((file) => /\.(astro|css|json|md|ts)$/.test(file))
    .map((file) => path.join(root, 'src', file)),
];

for (const file of textFiles) {
  const source = await readFile(file, 'utf8');

  if (/mailto:|tel:/i.test(source)) {
    errors.push(`${path.relative(root, file)}: public email or telephone action is not allowed.`);
  }

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(source)) {
    errors.push(`${path.relative(root, file)}: public email address is not allowed.`);
  }

  if (/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/.test(source)) {
    errors.push(`${path.relative(root, file)}: public phone number is not allowed.`);
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

process.stdout.write(
  `Content validation passed: ${experience.length} experience and ${projects.length} project entries.\n`,
);
