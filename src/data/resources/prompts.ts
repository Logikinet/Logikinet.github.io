/** Types only — content in src/content/resources/prompts/ */
export type PromptCategory =
  | "项目规划"
  | "代码实现"
  | "代码审查"
  | "安全检查"
  | "文档写作"
  | "论文与报告"
  | "项目盘点"
  | "GitHub 发布"
  | "图片与设计";

export const PROMPT_CATEGORIES: PromptCategory[] = [
  "项目规划",
  "代码实现",
  "代码审查",
  "安全检查",
  "文档写作",
  "论文与报告",
  "项目盘点",
  "GitHub 发布",
  "图片与设计",
];

export interface ResourcePrompt {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  /** Display string or list joined for UI */
  models: string | string[];
  version: string;
  updatedAt: string;
  featured: boolean;
  safetyNote?: string;
  draft?: boolean;
  private?: boolean;
}
