import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM so the site does not invent day precision.');

const httpsUrl = z.url().refine((value) => value.startsWith('https://'), {
  message: 'Public links must use HTTPS.',
});

const validateTimeline = (
  data: { start: string; end?: string | undefined; current: boolean },
  context: z.RefinementCtx,
) => {
  const hasValidState = (data.current && !data.end) || (!data.current && Boolean(data.end));

  if (!hasValidState) {
    context.addIssue({
      code: 'custom',
      message: 'Use exactly one timeline state: current with no end, or completed with an end.',
      path: ['current'],
    });
  }

  if (data.end && data.end < data.start) {
    context.addIssue({
      code: 'custom',
      message: 'End month cannot be earlier than start month.',
      path: ['end'],
    });
  }
};

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
  schema: z
    .object({
      company: z.string().trim().min(1),
      role: z.string().trim().min(1),
      location: z.string().trim().min(1),
      start: month,
      end: month.optional(),
      current: z.boolean().default(false),
      enabled: z.boolean().default(true),
      summary: z.string().trim().min(1),
      highlights: z.array(z.string().trim().min(1)).min(3).max(5),
      technologies: z.array(z.string().trim().min(1)).min(1),
      companyUrl: httpsUrl.optional(),
    })
    .superRefine(validateTimeline),
});

const project = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(1),
        summary: z.string().trim().min(1),
        start: month,
        end: month.optional(),
        current: z.boolean().default(false),
        enabled: z.boolean().default(true),
        order: z.number().int().positive(),
        featured: z.boolean(),
        contribution: z.string().trim().min(1),
        decisions: z.array(z.string().trim().min(1)).min(1).max(3),
        technologies: z.array(z.string().trim().min(1)).min(1),
        status: z.enum(['private', 'prototype', 'archived', 'live']),
        statusNote: z.string().trim().min(1).optional(),
        supportedOutcome: z.string().trim().min(1).optional(),
        repositoryUrl: httpsUrl.optional(),
        demoUrl: httpsUrl.optional(),
        caseStudy: z.boolean().default(false),
        image: image().optional(),
        imageAlt: z.string().optional(),
        decorativeImage: z.boolean().default(false),
      })
      .superRefine((data, context) => {
        validateTimeline(data, context);

        if (!data.statusNote && !data.supportedOutcome) {
          context.addIssue({
            code: 'custom',
            message: 'Provide a supported outcome or an honest status statement.',
            path: ['statusNote'],
          });
        }

        if (data.image && !data.decorativeImage && !data.imageAlt?.trim()) {
          context.addIssue({
            code: 'custom',
            message: 'An informative image requires non-empty alt text.',
            path: ['imageAlt'],
          });
        }

        if (data.decorativeImage && data.imageAlt !== '') {
          context.addIssue({
            code: 'custom',
            message: 'A decorative image must use an empty alt value.',
            path: ['imageAlt'],
          });
        }
      }),
});

export const collections = { experience, project };
