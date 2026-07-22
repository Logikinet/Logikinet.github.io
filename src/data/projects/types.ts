export type ProjectStatus = "进行中" | "已完成" | "整理中" | "实验中";

/** 公开作品集可见性：unpublished 不生成页面、不进入列表 */
export type ProjectVisibility = "public" | "private" | "unpublished";

export type RepositoryStatus =
  | "public"
  | "private"
  | "none"
  | "archived"
  | "整理中";

export type SourcePlatform = "github" | "gitee" | "local" | "other" | "none";

export type ProjectOwnership = "original" | "collaborative" | "fork" | "unknown";

export type VerificationStatus =
  | "verified"
  | "partial"
  | "pending"
  | "unverified";

/**
 * 远程仓库定位（用于构建期拉取 README）。
 * - public：可写 owner/name，页面可展示公开 URL
 * - private：可写 owner/name 供带 Token 的同步脚本使用，但站点不得输出完整仓库 URL
 */
export interface ProjectRemote {
  platform: "github" | "gitee";
  owner: string;
  name: string;
  /** 与 repositoryStatus 对齐；true 时永不在页面输出仓库链接 */
  isPrivate: boolean;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  /** 无 README 时的回退短文，有 README 时降级为侧栏「站点摘要」 */
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  visibility: ProjectVisibility;
  repositoryStatus: RepositoryStatus;
  sourcePlatform: SourcePlatform;
  remote?: ProjectRemote;
  /**
   * 仅 public 仓库可填完整 URL，供页面外链。
   * private 禁止填写。
   */
  github?: string;
  gitee?: string;
  demo?: string;
  year?: string;
  updatedAt?: string;
  ownership: ProjectOwnership;
  verificationStatus: VerificationStatus;
  /**
   * content/projects 下的文档 id，默认等于 project.id。
   * 由 sync 脚本写入 README Markdown。
   */
  readmeId?: string;
  /** 是否允许 sync 用 GitHub 公开列表自动创建/更新条目 */
  autoSync?: boolean;
}

/** 构建期 / 同步脚本写入的元数据覆盖（不含 private URL） */
export interface ProjectSyncMeta {
  id: string;
  title?: string;
  summary?: string;
  homepage?: string;
  topics?: string[];
  language?: string | null;
  stars?: number;
  forks?: number;
  defaultBranch?: string;
  pushedAt?: string;
  /** 仅 public 时出现 */
  htmlUrl?: string;
  platform?: "github" | "gitee";
  isPrivate?: boolean;
  syncedAt: string;
  readmeSynced?: boolean;
  readmeSource?: "remote" | "local" | "none";
}

export interface ProjectSyncFile {
  generatedAt: string;
  githubUser: string;
  projects: ProjectSyncMeta[];
  discovered: Array<{
    id: string;
    name: string;
    description: string;
    htmlUrl: string;
    language: string | null;
    topics: string[];
    pushedAt: string;
    stars: number;
  }>;
}
