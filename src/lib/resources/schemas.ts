/** Shared Zod schemas for resource content (Studio API + Astro collections). */
import { z } from "astro/zod";

export const resourceTypes = ["prompts", "skills", "links", "workflows"] as const;
export type ResourceType = (typeof resourceTypes)[number];

export const promptCategorySchema = z.enum([
  "项目规划",
  "代码实现",
  "代码审查",
  "安全检查",
  "文档写作",
  "论文与报告",
  "项目盘点",
  "GitHub 发布",
  "图片与设计",
]);

export const linkCategorySchema = z.enum([
  "开发平台",
  "官方文档",
  "AI 平台",
  "开源项目",
  "设计参考",
  "论文工具",
  "其他",
]);

export const workflowCategorySchema = z.enum([
  "AGENTS.md",
  "项目约束",
  "开发流程",
  "安全发布",
  "验收清单",
  "计划与实现",
  "Agent Hooks",
  "Harness 规则",
]);

export const skillOwnershipSchema = z.enum([
  "original",
  "modified",
  "third-party",
  "unknown",
]);

export const skillStatusSchema = z.enum([
  "available",
  "experimental",
  "draft",
  "retired",
]);

const slugId = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be a safe kebab-case slug");

/** YAML dates may load as Date; normalize to YYYY-MM-DD string */
const dateString = z
  .union([z.string(), z.date()])
  .transform((v) => {
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    const s = String(v).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
  })
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

const optionalUrl = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().url().optional(),
);

export const promptSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  category: promptCategorySchema,
  tags: z.array(z.string()).default([]),
  models: z.array(z.string()).default([]),
  version: z.union([z.string(), z.number()]).transform(String).default("1.0"),
  updatedAt: dateString,
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
  safetyNote: z.string().optional(),
});

export const skillSchema = z.object({
  id: slugId,
  name: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  platform: z.array(z.string()).default([]),
  author: z.string().min(1),
  origin: z.string().min(1),
  license: z.string().min(1),
  ownership: skillOwnershipSchema,
  status: skillStatusSchema,
  repository: optionalUrl,
  documentation: optionalUrl,
  tags: z.array(z.string()).default([]),
  allowPublicLink: z.boolean().default(false),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
});

export const linkSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  url: z.string().url(),
  category: linkCategorySchema,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  lastChecked: dateString,
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
});

export const workflowSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  category: workflowCategorySchema,
  tags: z.array(z.string()).default([]),
  updatedAt: dateString,
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
});

export const schemasByType = {
  prompts: promptSchema,
  skills: skillSchema,
  links: linkSchema,
  workflows: workflowSchema,
} as const;

export type PromptData = z.infer<typeof promptSchema>;
export type SkillData = z.infer<typeof skillSchema>;
export type LinkData = z.infer<typeof linkSchema>;
export type WorkflowData = z.infer<typeof workflowSchema>;
