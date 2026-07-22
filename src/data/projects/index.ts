import { projectCatalog } from "./catalog";
import type {
  GeneratedIndex,
  GeneratedProjectMeta,
  Project,
  RepositoryProvider,
} from "./types";

export type * from "./types";
export { projectCatalog } from "./catalog";

function slugifyRepoName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const generatedJsonModules = import.meta.glob<{ default: GeneratedProjectMeta }>(
  "../../generated/projects/*.json",
  { eager: true },
);

function getGeneratedIndex(): GeneratedIndex | null {
  for (const [path, mod] of Object.entries(generatedJsonModules)) {
    if (path.endsWith("_index.json")) {
      return mod.default as unknown as GeneratedIndex;
    }
  }
  return null;
}

function getAllGeneratedMeta(): Map<string, GeneratedProjectMeta> {
  const map = new Map<string, GeneratedProjectMeta>();
  for (const [path, mod] of Object.entries(generatedJsonModules)) {
    if (path.endsWith("_index.json")) continue;
    const data = mod.default;
    if (data?.id) map.set(data.id, data);
  }
  return map;
}

function discoveredProjects(index: GeneratedIndex | null): Project[] {
  if (!index?.discovered?.length) return [];
  const catalogIds = new Set(projectCatalog.map((p) => p.id));
  const catalogRepos = new Set(
    projectCatalog
      .filter((p) => p.repositoryName)
      .map(
        (p) =>
          `${p.repositoryProvider ?? "github"}:${p.repositoryOwner}/${p.repositoryName}`.toLowerCase(),
      ),
  );

  return index.discovered
    .filter((d) => {
      const id = slugifyRepoName(d.name);
      if (catalogIds.has(id)) return false;
      if (d.name === "Logikinet.github.io") return false;
      const key = `github:logikinet/${d.name}`.toLowerCase();
      if (catalogRepos.has(key)) return false;
      return true;
    })
    .map((d) => {
      const id = slugifyRepoName(d.name);
      return {
        id,
        title: d.name,
        summary: d.description?.trim() || `${d.name}（公开仓库，自动收录）`,
        description:
          d.description?.trim() ||
          "由 GitHub 公开仓库列表自动生成。正文优先展示同步后的 README。",
        stack: d.language ? [d.language] : ["整理中"],
        status: "整理中" as const,
        featured: false,
        visibility: "public" as const,
        repositoryOwner: "Logikinet",
        repositoryName: d.name,
        repositoryUrl: d.htmlUrl,
        repositoryProvider: "github" as const,
        repositoryStatus: "public" as const,
        exposeRepositoryUrl: true,
        readmeSource: "github" as const,
        readmePublicSafe: true,
        syncMetadata: true,
        year: d.pushedAt ? d.pushedAt.slice(0, 4) : undefined,
        updatedAt: d.pushedAt ? d.pushedAt.slice(0, 10) : undefined,
        ownership: "original" as const,
        verificationStatus: "pending" as const,
      } satisfies Project;
    });
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function mergeMeta(p: Project, m: GeneratedProjectMeta | undefined): Project {
  if (!m) return toPageSafeProject(p);

  const next: Project = { ...p };

  if (m.description && (!p.summary || p.summary.includes("自动收录"))) {
    next.summary = m.description;
  }
  if (m.language && (p.stack[0] === "整理中" || !p.stack.length)) {
    next.stack = [m.language, ...p.stack.filter((s) => s !== "整理中" && s !== m.language)];
  }
  if (m.pushedAt) next.updatedAt = m.pushedAt.slice(0, 10);
  if (m.homepage && isSafeHttpUrl(m.homepage) && !next.demo) {
    next.demo = m.homepage;
  }
  if (m.repositoryOwner) next.repositoryOwner = m.repositoryOwner;
  if (m.repositoryName) next.repositoryName = m.repositoryName;
  if (m.repositoryProvider) next.repositoryProvider = m.repositoryProvider;

  if (p.exposeRepositoryUrl && m.repositoryUrl) {
    next.repositoryUrl = m.repositoryUrl;
  }

  return toPageSafeProject(next);
}

export function getAllProjectsRaw(): Project[] {
  const index = getGeneratedIndex();
  const metaMap = getAllGeneratedMeta();
  const merged = [...projectCatalog, ...discoveredProjects(index)];
  return merged.map((p) => mergeMeta(p, metaMap.get(p.id)));
}

export const projects: Project[] = getAllProjectsRaw();

export function getListedProjects(): Project[] {
  return getAllProjectsRaw().filter((p) => p.visibility !== "unpublished");
}

export function getFeaturedProjects(limit = 4): Project[] {
  return getListedProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProjectById(id: string): Project | undefined {
  return getListedProjects().find((p) => p.id === id);
}

export function getGeneratedMeta(id: string): GeneratedProjectMeta | undefined {
  return getAllGeneratedMeta().get(id);
}

export function getExposedRepositoryUrl(project: Project): string | undefined {
  if (project.repositoryStatus === "unpublished") return undefined;
  if (!project.exposeRepositoryUrl) return undefined;
  if (project.repositoryUrl) return project.repositoryUrl;
  if (project.repositoryOwner && project.repositoryName) {
    const provider: RepositoryProvider = project.repositoryProvider ?? "github";
    if (provider === "github") {
      return `https://github.com/${project.repositoryOwner}/${project.repositoryName}`;
    }
    if (provider === "gitee") {
      return `https://gitee.com/${project.repositoryOwner}/${project.repositoryName}`;
    }
  }
  return undefined;
}

export function repositoryLabel(project: Project): string {
  if (project.repositoryStatus === "private") return "私有仓库";
  if (project.repositoryStatus === "public") return "公开仓库";
  if (project.repositoryStatus === "unpublished") return "无公开仓库";
  return "仓库";
}

export function getProviderLabel(project: Project): string {
  if (project.repositoryProvider === "gitee") return "Gitee";
  return "GitHub";
}

/** 渲染前剥离：!expose 时不得把 URL 带进页面数据 */
export function toPageSafeProject(project: Project): Project {
  const safe = { ...project };
  if (!safe.exposeRepositoryUrl || safe.repositoryStatus === "unpublished") {
    delete safe.repositoryUrl;
  }
  return safe;
}

/** @deprecated 兼容旧名 */
export function getPublicGithubUrl(project: Project): string | undefined {
  if (project.repositoryProvider === "gitee") return undefined;
  return getExposedRepositoryUrl(project);
}

export function getPublicGiteeUrl(project: Project): string | undefined {
  if (project.repositoryProvider !== "gitee") return undefined;
  return getExposedRepositoryUrl(project);
}
