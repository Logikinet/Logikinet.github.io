export type ProjectStatus = "进行中" | "已完成" | "整理中" | "实验中";

/** 站点列表可见性：unpublished 不进入作品集 */
export type ProjectVisibility = "public" | "private" | "unpublished";

export type RepositoryStatus = "public" | "private" | "unpublished";

export type RepositoryProvider = "github" | "gitee";

export type ReadmeSource = "github" | "gitee" | "local" | "none";

export type ProjectOwnership = "original" | "collaborative" | "fork" | "unknown";

export type VerificationStatus =
  | "verified"
  | "partial"
  | "pending"
  | "unverified";

export interface Project {
  id: string;
  title: string;
  summary: string;
  /** 无可用 README 时的回退文案 */
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  /** 是否出现在作品集列表（与仓库 public/private 独立） */
  visibility: ProjectVisibility;

  repositoryOwner?: string;
  repositoryName?: string;
  /**
   * 仓库 URL。
   * - public + exposeRepositoryUrl：可写、可展示
   * - private + exposeRepositoryUrl：可写、可展示（注明需权限）
   * - exposeRepositoryUrl=false：可写在 catalog 供 sync，但渲染前必须剥离，不得进 HTML
   */
  repositoryUrl?: string;
  repositoryProvider?: RepositoryProvider;
  repositoryStatus: RepositoryStatus;
  /** 是否在页面上输出可点击的仓库链接 */
  exposeRepositoryUrl?: boolean;

  readmeSource?: ReadmeSource;
  /** 相对仓库根的本地 README，如 src/content/projects-local/foo.md */
  localReadmePath?: string;
  /**
   * 私有仓 README 是否允许进入公开构建。
   * 公开仓默认可视为 true；私有仓须人工确认。
   */
  readmePublicSafe?: boolean;
  /** 是否参与 sync-projects 元数据/README 拉取 */
  syncMetadata?: boolean;

  demo?: string;
  year?: string;
  updatedAt?: string;
  ownership: ProjectOwnership;
  verificationStatus: VerificationStatus;
}

/** sync 写入 src/generated/projects/<id>.json 的安全子集 */
export interface GeneratedProjectMeta {
  id: string;
  name: string;
  description: string;
  repositoryProvider: RepositoryProvider;
  repositoryOwner: string;
  repositoryName: string;
  /** 仅当 catalog.exposeRepositoryUrl 为 true 时写入 */
  repositoryUrl?: string;
  repositoryStatus: RepositoryStatus;
  defaultBranch: string;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  homepage: string | null;
  pushedAt: string | null;
  syncedAt: string;
  readmeIncluded: boolean;
  readmePublicSafe: boolean;
  /** 敏感扫描是否通过（未通过则不写 md） */
  securityScanPassed: boolean;
}

export interface GeneratedIndex {
  generatedAt: string;
  githubUser: string;
  projectIds: string[];
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
