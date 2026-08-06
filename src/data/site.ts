import { z } from 'astro/zod';

import siteData from './site.json';

const text = z.string().trim().min(1);
const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM so the site does not invent day precision.');
const httpsUrl = z.url().refine((value) => value.startsWith('https://'), {
  message: 'Public links must use HTTPS.',
});

export const siteSchema = z
  .object({
    name: text,
    role: text,
    headline: z.tuple([text, text]),
    location: text,
    availability: text,
    workAuthorization: text,
    supportingCopy: text,
    title: text,
    description: text,
    url: httpsUrl,
    locale: z.string().regex(/^[a-z]{2}_[A-Z]{2}$/, 'Use a locale such as en_CA.'),
    social: z
      .object({
        linkedin: httpsUrl,
        github: httpsUrl,
      })
      .strict(),
    about: z
      .object({
        paragraphs: z.array(text).min(1).max(3),
      })
      .strict(),
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
    skillGroups: z
      .array(
        z
          .object({
            label: text,
            skills: z.array(text).min(1),
          })
          .strict(),
      )
      .min(1),
    contact: z
      .object({
        heading: text,
        body: text,
      })
      .strict(),
    resume: z.discriminatedUnion('enabled', [
      z.object({ enabled: z.literal(false) }).strict(),
      z
        .object({
          enabled: z.literal(true),
          path: z
            .string()
            .regex(/^\/resume\/[a-z0-9][a-z0-9._-]*\.pdf$/, 'Use a local PDF under /resume/.'),
        })
        .strict(),
    ]),
  })
  .strict();

export type SiteConfig = z.infer<typeof siteSchema>;

export const site: SiteConfig = siteSchema.parse(siteData);
