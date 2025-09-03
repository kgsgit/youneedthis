export interface LocalizedContent {
  ko: string;
  en: string;
}

export interface Tool {
  id: string;
  category: string;
  regions: string[];
  name: LocalizedContent;
  description: LocalizedContent;
  keywords: LocalizedContent;
  icon: string;
  component: string;
}

export interface ToolCategory {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  icon: string;
  color: string;
}