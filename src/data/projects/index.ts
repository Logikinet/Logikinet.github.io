import { projectCatalog } from "./catalog";
import type {
  GeneratedIndex,
  GeneratedProjectMeta,
  Project,
  RepositoryProvider,
} from "./types";
import { projectRepositories } from "../project-repositories";

export type * from "./types";
export { projectCatalog } from "./catalog";
export {
  projectRepositories,
  pendingRepositoryMappings,
  findRepoConfigByFullName,
  findRepoConfigByProjectId,
} from "../project-repositories";

const generatedJsonModules = import.meta.glob<{ default: GeneratedProjectMeta }>(
  "../../generated/projects/*.json",
  { eager: true },
);

function getAllGeneratedMeta(): Map<string, GeneratedProjectMeta> {
  const map = new Map<string, GeneratedProjectMeta>();
  for (const [path, mod] of Object.entries(generatedJsonModules)) {
    if (path.endsWith("_index.json")) continue;
    const data = mod.default;
    if (data?.id) map.set(data.id, data);
  }
  return map;
}

function getGeneratedIndex(): GeneratedIndex | null {
  for (const [path, mod] of Object.entries(generatedJsonModules)) {
    if (path.endsWith("_index.json")) {
      return mod.default as unknown as GeneratedIndex;
    }
  }
  return null;
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

  if (m.description?.trim() && (!p.summary || p.verificationStatus === "pending")) {
    // 不覆盖已写好的人工 summary；仅在空/弱时用仓库 description
    if (!p.summary || p.summary.length < 12) next.summary = m.description;
  }
  if (m.language && !p.stack?.length) {
    next.stack = [m.language];
  } else if (m.language && p.stack[0] === "整理中") {
    next.stack = [m.language, ...p.stack.filter((s) => s !== "整理中" && s !== m.language)];
  }
  if (m.pushedAt) next.updatedAt = m.pushedAt.slice(0, 10);
  if (m.homepage && isSafeHttpUrl(m.homepage) && !next.demo) {
    next.demo = m.homepage;
  }
  if (m.repositoryOwner) next.repositoryOwner = m.repositoryOwner;
  if (m.repositoryName) next.repositoryName = m.repositoryName;
  if (p.exposeRepositoryUrl && m.repositoryUrl) {
    next.repositoryUrl = m.repositoryUrl;
  }
  if (m.repositoryStatus === "public" || m.repositoryStatus === "private") {
    next.repositoryStatus = m.repositoryStatus;
  }
  return toPageSafeProject(next);
}

export function getAllProjectsRaw(): Project[] {
  const metaMap = getAllGeneratedMeta();
  // 仅 catalog（仓库映射已内嵌）；不再自动发现未映射仓库
  return projectCatalog.map((p) => mergeMeta(p, metaMap.get(p.id)));
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

export function getSyncFile(): GeneratedIndex | null {
  return getGeneratedIndex();
}

/**
 * 页面可点击仓库链接。
 * - public：始终可跳转（优先 catalog/generated URL，否则拼 owner/name）
 * - private + exposeRepositoryUrl：可跳转真实地址
 * - private + !expose：不返回 URL（不进 HTML）
 */
export function getExposedRepositoryUrl(project: Project): string | undefined {
  if (project.repositoryStatus === "unpublished") return undefined;

  const isPublic = project.repositoryStatus === "public";
  if (!isPublic && !project.exposeRepositoryUrl) return undefined;

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

export function toPageSafeProject(project: Project): Project {
  const safe = { ...project };
  const isPublic = safe.repositoryStatus === "public";
  // 私有且未授权暴露：剥离 URL，避免进 HTML
  if ((!isPublic && !safe.exposeRepositoryUrl) || safe.repositoryStatus === "unpublished") {
    delete safe.repositoryUrl;
  } else if (!safe.repositoryUrl && safe.repositoryOwner && safe.repositoryName) {
    // 公开仓保证一定有可跳转 URL
    const provider = safe.repositoryProvider ?? "github";
    safe.repositoryUrl =
      provider === "gitee"
        ? `https://gitee.com/${safe.repositoryOwner}/${safe.repositoryName}`
        : `https://github.com/${safe.repositoryOwner}/${safe.repositoryName}`;
  }
  return safe;
}

export function getPublicGithubUrl(project: Project): string | undefined {
  if (project.repositoryProvider === "gitee") return undefined;
  return getExposedRepositoryUrl(project);
}

export function getPublicGiteeUrl(project: Project): string | undefined {
  if (project.repositoryProvider !== "gitee") return undefined;
  return getExposedRepositoryUrl(project);
}

export function getNotifyEnabledRepositories(): string[] {
  return projectRepositories.filter((r) => r.notifyEnabled).map((r) => r.repository);
}
