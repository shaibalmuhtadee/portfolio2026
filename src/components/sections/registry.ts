import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

import type { SectionConfig } from '../../data/sections';
import AboutSection from './AboutSection.astro';
import ContactSection from './ContactSection.astro';
import EducationSection from './EducationSection.astro';
import ExperienceSection from './ExperienceSection.astro';
import ProfileSection from './ProfileSection.astro';
import ProjectsSection from './ProjectsSection.astro';

export const sectionRegistry = {
  experience: ExperienceSection,
  projects: ProjectsSection,
  about: AboutSection,
  education: EducationSection,
  profile: ProfileSection,
  contact: ContactSection,
} satisfies Record<SectionConfig['id'], AstroComponentFactory>;
