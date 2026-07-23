/**
 * 项目仓库显式映射（唯一权威来源，禁止按名称猜测）。
 * 仅列入已确认存在的 Logikinet 仓库。
 *
 * 同步脚本与 catalog 均以此为准。
 * 禁止写入任何 Token / Secret。
 */

export type RepoVisibility = "public" | "private";
export type RepoProvider = "github" | "gitee";

export interface ProjectRepositoryConfig {
  projectId: string;
  /** owner/name */
  repository: string;
  provider: RepoProvider;
  visibility: RepoVisibility;
  /** 默认分支：main | master */
  defaultBranch: string;
  /** 是否在 HTML 中输出可点击仓库 URL */
  exposeRepositoryUrl: boolean;
  /** 私有 README 是否允许进入公开构建 */
  readmePublicSafe: boolean;
  syncReadme: boolean;
  syncMetadata: boolean;
  /** 是否安装 notify-aqualeap 即时联动 */
  notifyEnabled: boolean;
  notes?: string;
}

/**
 * 已确认仓库（数据来自 GitHub API 元数据，非臆测）。
 * KEYLEY：账号下未找到对应仓库，不列入。
 */
export const projectRepositories: ProjectRepositoryConfig[] = [
  {
    projectId: "harmony-ticket-agent",
    repository: "Logikinet/harmony-ticket-agent",
    provider: "github",
    visibility: "public",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "GitHub 公开；描述为 Gitee 项目镜像",
  },
  {
    projectId: "zhonghe",
    repository: "Logikinet/zhonghe",
    provider: "github",
    visibility: "private",
    defaultBranch: "main",
    // 允许页面跳转真实私有地址（访客仍需 GitHub 权限）
    exposeRepositoryUrl: true,
    // 正文默认同步到站点；硬敏感项仍会拦截
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
  },
  {
    projectId: "offer-pilot",
    repository: "Logikinet/OfferPilot",
    provider: "github",
    visibility: "private",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "智面官 OfferPilot（仓颉面试陪练）",
  },
  {
    projectId: "cangjie-ict",
    repository: "Logikinet/cangjie-ict",
    provider: "github",
    visibility: "private",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "仓颉 ICT / Agent Harness 对应源码仓",
  },
  {
    projectId: "personal-ai-workbench",
    repository: "Logikinet/personal-ai-workbench",
    provider: "github",
    visibility: "private",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
  },
  {
    projectId: "workbench",
    repository: "Logikinet/workbench",
    provider: "github",
    visibility: "public",
    defaultBranch: "master",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
  },
  {
    projectId: "aether",
    repository: "Logikinet/Aether",
    provider: "github",
    visibility: "public",
    defaultBranch: "master",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
  },
  {
    projectId: "zhishen-dun",
    repository: "Logikinet/zhishen-dun",
    provider: "github",
    visibility: "public",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "智审盾 backend 源码发布",
  },
  {
    projectId: "zhidun",
    repository: "Logikinet/zhidun",
    provider: "github",
    visibility: "public",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "网络设计大赛相关（智盾命名关联，用途以 README 为准）",
  },
  {
    projectId: "smart-silver",
    repository: "Logikinet/smart-silver",
    provider: "github",
    visibility: "public",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
  },
  {
    projectId: "digital-bomb",
    repository: "Logikinet/digital-bomb",
    provider: "github",
    visibility: "public",
    defaultBranch: "master",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: false,
    notes: "默认关闭即时通知；可按需开启",
  },
  {
    projectId: "ai-output-formatter",
    repository: "Logikinet/AI-Output-Formatter",
    provider: "github",
    visibility: "public",
    defaultBranch: "main",
    exposeRepositoryUrl: true,
    readmePublicSafe: true,
    syncReadme: true,
    syncMetadata: true,
    notifyEnabled: true,
    notes: "AI 输出清洗、场景排版与 Markdown 预览工具",
  },
];

/** 未确认 / 不存在映射，需人工处理 */
export const pendingRepositoryMappings: Array<{
  label: string;
  reason: string;
}> = [
  {
    label: "KEYLEY",
    reason: "Logikinet 账号下未找到名为 KEYLEY 的仓库，禁止猜测地址。",
  },
  {
    label: "cangjie-agent-harness",
    reason: "公开/私有列表中无此仓库名；仓颉相关已映射到 cangjie-ict。",
  },
  {
    label: "welcome-robot",
    reason: "账号仓库列表中未检出 welcome-robot，暂不安装 notify。",
  },
];

export function findRepoConfigByFullName(
  fullName: string,
): ProjectRepositoryConfig | undefined {
  const n = fullName.trim().toLowerCase();
  return projectRepositories.find((r) => r.repository.toLowerCase() === n);
}

export function findRepoConfigByProjectId(
  projectId: string,
): ProjectRepositoryConfig | undefined {
  return projectRepositories.find((r) => r.projectId === projectId);
}
