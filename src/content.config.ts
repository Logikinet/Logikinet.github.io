import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import {
  promptSchema,
  skillSchema,
  linkSchema,
  workflowSchema,
} from "./lib/resources/schemas";

const resourcePrompts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/resources/prompts",
  }),
  schema: promptSchema,
});

const resourceSkills = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/resources/skills",
  }),
  schema: skillSchema,
});

const resourceLinks = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/resources/links",
  }),
  schema: linkSchema,
});

const resourceWorkflows = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/resources/workflows",
  }),
  schema: workflowSchema,
});

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

export const collections = {
  blog,
  resourcePrompts,
  resourceSkills,
  resourceLinks,
  resourceWorkflows,
};
