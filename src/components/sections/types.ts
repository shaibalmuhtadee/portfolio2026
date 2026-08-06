import type { SectionConfig } from '../../data/sections';
import type { SiteConfig } from '../../data/site';
import type { PortfolioContent } from '../../lib/content';

export interface PortfolioSectionProps {
  section: SectionConfig;
  content: PortfolioContent;
  site: SiteConfig;
}
