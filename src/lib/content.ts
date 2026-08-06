import { getCollection, type CollectionEntry } from 'astro:content';

import { sections } from '../data/sections';

const compareMonthsDescending = (left: string, right: string) => right.localeCompare(left);

export interface PortfolioContent {
  experience: CollectionEntry<'experience'>[];
  featuredProjects: CollectionEntry<'project'>[];
  additionalProjects: CollectionEntry<'project'>[];
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const [experienceEntries, projectEntries] = await Promise.all([
    getCollection('experience', ({ data }) => data.enabled),
    getCollection('project', ({ data }) => data.enabled),
  ]);

  const collectionCounts = new Map([
    ['experience', experienceEntries.length],
    ['project', projectEntries.length],
  ]);

  for (const section of sections) {
    if (
      section.enabled &&
      section.contentSource !== 'site' &&
      collectionCounts.get(section.contentSource) === 0
    ) {
      throw new Error(`Enabled section "${section.id}" has no ${section.contentSource} content.`);
    }
  }

  const projectOrders = new Set<number>();

  for (const project of projectEntries) {
    if (projectOrders.has(project.data.order)) {
      throw new Error(`Duplicate project order: ${project.data.order}`);
    }

    projectOrders.add(project.data.order);
  }

  const projects = projectEntries.toSorted((left, right) => left.data.order - right.data.order);

  return {
    experience: experienceEntries.toSorted((left, right) =>
      compareMonthsDescending(left.data.start, right.data.start),
    ),
    featuredProjects: projects.filter(({ data }) => data.featured),
    additionalProjects: projects.filter(({ data }) => !data.featured),
  };
}
