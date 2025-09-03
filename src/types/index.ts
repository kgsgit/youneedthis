export type { LocalizedContent, Tool, ToolCategory } from './tool';
export type { Site, SiteCategory } from './site';

export type Region = 'kr' | 'global';
export type Language = 'ko' | 'en';

import type { LocalizedContent, Tool, ToolCategory } from './tool';
import type { Site, SiteCategory } from './site';

export interface SiteConfig {
  name: string;
  description: LocalizedContent;
  url: string;
  toolCategories: ToolCategory[];
  siteCategories: SiteCategory[];
  tools: Tool[];
  sites: Site[];
}