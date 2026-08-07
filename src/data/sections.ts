import { z } from 'astro/zod';

import sectionData from './sections.json';

const expectedSources = {
  experience: 'experience',
  projects: 'project',
  about: 'site',
  education: 'site',
  skills: 'site',
  contact: 'site',
} as const;

export const sectionSchema = z
  .object({
    id: z.enum(['experience', 'projects', 'about', 'education', 'skills', 'contact']),
    label: z.string().trim().min(1),
    order: z.number().int().positive(),
    enabled: z.boolean(),
    navVisible: z.boolean(),
    contentSource: z.enum(['experience', 'project', 'site']),
  })
  .strict()
  .superRefine((section, context) => {
    if (section.contentSource !== expectedSources[section.id]) {
      context.addIssue({
        code: 'custom',
        message: `Section "${section.id}" must use the "${expectedSources[section.id]}" source.`,
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

export type SectionConfig = z.infer<typeof sectionSchema>;

const registry = z.array(sectionSchema).min(1).parse(sectionData);
const ids = new Set<string>();
const orders = new Set<number>();
const implementedSections = new Set<SectionConfig['id']>([
  'experience',
  'projects',
  'about',
  'education',
  'skills',
  'contact',
]);

for (const section of registry) {
  if (ids.has(section.id)) {
    throw new Error(`Duplicate section id: ${section.id}`);
  }

  if (orders.has(section.order)) {
    throw new Error(`Duplicate section order: ${section.order}`);
  }

  if (section.enabled && !implementedSections.has(section.id)) {
    throw new Error(`Enabled section "${section.id}" has no registered renderer.`);
  }

  ids.add(section.id);
  orders.add(section.order);
}

export const sections = registry.toSorted((left, right) => left.order - right.order);
