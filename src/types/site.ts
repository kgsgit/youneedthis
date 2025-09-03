import { LocalizedContent } from './tool';

export interface Site {
  id: string;
  category: string;
  name: string;
  description: LocalizedContent;
  url: string;
  thumbnail: string;
  isPaid: boolean;
  rating: number;
  tags: string[] | LocalizedContent;
  regions: string[];
}

export interface SiteCategory {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  icon: string;
}