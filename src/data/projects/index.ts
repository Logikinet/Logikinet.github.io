import { projectCatalog } from "./catalog";
import syncMetaFile from "./sync-meta.json";
import type { Project, ProjectSyncFile, ProjectSyncMeta } from "./types";

export type * from "./types";
export { projectCatalog } from "./catalog";

const syncFile = syncMetaFile as ProjectSyncFile;

function slugifyRepoName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** 同步脚本发现的公开仓库 → 自动条目（不覆盖人工 catalog） */
function discoveredProjects(): Project[] {
  const catalogIds = new Set(projectCatalog.map((p) => p.id));
  const catalogRemotes = new Set(
    projectCatalog
      .filter((p) => p.remote)
      .map((p) => `${p.remote!.platform}:${p.remote!.owner}/${p.remote!.name}`.toLowerCase()),
  );

  return (syncFile.discovered ?? [])
    .filter((d) => {
      const id = slugifyRepoName(d.name);
      if (catalogIds.has(id)) return false;
      const key = `github:logikinet/${d.name}`.toLowerCase();
      if (catalogRemotes.has(key)) return false;
      // 站点仓库本身不进作品集
      if (d.name === "Logikinet.github.io") return false;
      return true;
    })
    .map((d) => {
      const id = slugifyRepoName(d.name);
      return {
        id,
        title: d.name,
        summary: d.description?.trim() || `${d.name} 公开仓库（由同步脚本自动收录）。`,
        description:
          d.description?.trim() ||
          "本条目由 GitHub 公开仓库列表自动生成。正文优先展示仓库 README；精选与人工描述可在 catalog 中覆盖。",
        stack: d.language ? [d.language] : ["整理中"],
        status: "整理中" as const,
        featured: false,
        visibility: "public" as const,
        repositoryStatus: "public" as const,
        sourcePlatform: "github" as const,
        remote: {
          platform: "github" as const,
          owner: "Logikinet",
          name: d.name,
          isPrivate: false,
        },
        github: d.htmlUrl,
        demo: undefined,
        year: d.pushedAt ? d.pushedAt.slice(0, 4) : undefined,
        updatedAt: d.pushedAt ? d.pushedAt.slice(0, 10) : undefined,
        ownership: "original" as const,
        verificationStatus: "pending" as const,
        autoSync: true,
        readmeId: id,
      } satisfies Project;
    });
}

function metaById(): Map<string, ProjectSyncMeta> {
  return new Map((syncFile.projects ?? []).map((m) => [m.id, m]));
}

/** 合并 catalog + 自动发现，并叠同步元数据（demo 可用 homepage） */
export function getAllProjectsRaw(): Project[] {
  const meta = metaById();
  const merged = [...projectCatalog, ...discoveredProjects()];

  return merged.map((p) => {
    const m = meta.get(p.id);
    if (!m) return p;

    const next: Project = { ...p };

    if (m.title && p.verificationStatus === "pending" && !projectCatalog.find((c) => c.id === p.id)) {
      next.title = m.title;
    }
    if (m.summary && (!p.summary || p.summary.includes("自动收录"))) {
      next.summary = m.summary;
    }
    if (m.language && (p.stack.length === 0 || p.stack[0] === "整理中")) {
      next.stack = [m.language, ...p.stack.filter((s) => s !== "整理中" && s !== m.language)];
    }
    if (m.pushedAt) {
      next.updatedAt = m.pushedAt.slice(0, 10);
    }
    // 仅 public 且非 private remote 时写入可展示链接
    if (!p.remote?.isPrivate && p.visibility === "public") {
      if (m.htmlUrl && m.platform === "github") next.github = m.htmlUrl;
      if (m.homepage && isSafeHttpUrl(m.homepage)) {
        next.demo = next.demo ?? m.homepage;
      }
    }
    // private：强制剥离链接
    if (p.remote?.isPrivate || p.visibility === "private" || p.repositoryStatus === "private") {
      delete next.github;
      delete next.gitee;
    }
    return next;
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

/** @deprecated use getAllProjectsRaw — 兼容旧 import 名 */
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

export function getPublicGithubUrl(project: Project): string | undefined {
  if (project.visibility !== "public") return undefined;
  if (project.repositoryStatus === "private") return undefined;
  if (project.remote?.isPrivate) return undefined;
  return project.github;
}

export function getPublicGiteeUrl(project: Project): string | undefined {
  if (project.visibility !== "public") return undefined;
  if (project.repositoryStatus === "private") return undefined;
  if (project.remote?.isPrivate) return undefined;
  return project.gitee;
}

export function repositoryLabel(project: Project): string {
  if (project.repositoryStatus === "private" || project.remote?.isPrivate) return "私有仓库";
  if (project.repositoryStatus === "public") return "公开仓库";
  if (project.repositoryStatus === "archived") return "已归档";
  if (project.repositoryStatus === "整理中") return "仓库整理中";
  return "无公开仓库";
}

export function getProjectReadmeId(project: Project): string {
  return project.readmeId ?? project.id;
}

export function getSyncMeta(projectId: string): ProjectSyncMeta | undefined {
  return metaById().get(projectId);
}

export function getSyncFile(): ProjectSyncFile {
  return syncFile;
}
