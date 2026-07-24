import { getCollection } from "astro:content";
import type {
  LinkData,
  PromptData,
  SkillData,
  WorkflowData,
} from "./schemas";

function isPublic(entry: { data: { draft?: boolean; private?: boolean } }): boolean {
  return !entry.data.draft && !entry.data.private;
}

/** Public site: published prompts (body as content). */
export async function getPublishedPrompts(): Promise<
  Array<PromptData & { content: string }>
> {
  const all = await getCollection("resourcePrompts");
  return all
    .filter(isPublic)
    .map((e) => ({
      ...e.data,
      content: (e.body ?? "").trim(),
    }))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export async function getPublishedSkills(): Promise<
  Array<SkillData & { notes: string }>
> {
  const all = await getCollection("resourceSkills");
  return all
    .filter(isPublic)
    .map((e) => ({
      ...e.data,
      notes: (e.body ?? "").trim(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

export async function getPublishedLinks(): Promise<LinkData[]> {
  const all = await getCollection("resourceLinks");
  return all
    .filter(isPublic)
    .map((e) => e.data)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title, "zh-CN");
    });
}

export async function getPublishedWorkflows(): Promise<
  Array<WorkflowData & { content: string }>
> {
  const all = await getCollection("resourceWorkflows");
  return all
    .filter(isPublic)
    .map((e) => ({
      ...e.data,
      content: (e.body ?? "").trim(),
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getResourceCounts(): Promise<Record<string, number>> {
  const [prompts, skills, links, workflows] = await Promise.all([
    getPublishedPrompts(),
    getPublishedSkills(),
    getPublishedLinks(),
    getPublishedWorkflows(),
  ]);
  return {
    prompts: prompts.length,
    skills: skills.length,
    links: links.length,
    workflows: workflows.length,
  };
}
