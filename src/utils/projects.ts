import { getCollection, render, type CollectionEntry } from "astro:content";
import type { Project } from "@/data/projects";
import { getProjectReadmeId } from "@/data/projects";

export type ProjectDoc = CollectionEntry<"projects">;

export async function getProjectDoc(project: Project): Promise<ProjectDoc | undefined> {
  const id = getProjectReadmeId(project);
  const docs = await getCollection("projects");
  return docs.find((d) => d.id === id || d.id === `${id}` || d.id.endsWith(`/${id}`));
}

export async function getProjectReadmeHtml(project: Project): Promise<{
  doc?: ProjectDoc;
  Content?: Awaited<ReturnType<typeof render>>["Content"];
  hasReadme: boolean;
}> {
  const doc = await getProjectDoc(project);
  if (!doc) return { hasReadme: false };
  const { Content } = await render(doc);
  return { doc, Content, hasReadme: true };
}
