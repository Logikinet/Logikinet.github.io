import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.coerce.date(),
    modDatetime: z.coerce.date().optional(),
    author: z.string().default("王子健"),
    category: z.string().default("工程实践"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

/**
 * 项目 README / 长文说明。
 * id = 文件名（不含扩展名），应对齐 project.id。
 * 由 scripts/sync-projects.mjs 从 GitHub/Gitee 同步，或手写本地稿。
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    source: z.enum(["github", "gitee", "local", "manual"]).default("manual"),
    /** 仅公开仓库可写 owner/name；私有仓不要写可点击 URL */
    repoLabel: z.string().optional(),
    homepage: z.string().optional(),
    topics: z.array(z.string()).default([]),
    language: z.string().optional(),
    stars: z.number().optional(),
    // YAML 可能把 2026-07-22 解析成 Date
    syncedAt: z.union([z.string(), z.coerce.date()]).optional().transform((v) => {
      if (!v) return undefined;
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      return String(v);
    }),
    isPrivateRepo: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
