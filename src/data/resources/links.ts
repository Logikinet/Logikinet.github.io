/** Types only — content in src/content/resources/links/ */
export type LinkCategory =
  | "开发平台"
  | "官方文档"
  | "AI 平台"
  | "开源项目"
  | "设计参考"
  | "论文工具"
  | "其他";

export const LINK_CATEGORIES: LinkCategory[] = [
  "开发平台",
  "官方文档",
  "AI 平台",
  "开源项目",
  "设计参考",
  "论文工具",
  "其他",
];

export interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: LinkCategory;
  tags: string[];
  featured: boolean;
  lastChecked: string;
  draft?: boolean;
  private?: boolean;
}
