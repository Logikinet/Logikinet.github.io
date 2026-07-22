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

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  visibility: ProjectVisibility;
  repositoryStatus: RepositoryStatus;
  sourcePlatform: SourcePlatform;
  /** 仅 public 仓库可填；private 禁止写入 URL */
  github?: string;
  gitee?: string;
  demo?: string;
  year?: string;
  updatedAt?: string;
  ownership: ProjectOwnership;
  verificationStatus: VerificationStatus;
}

/**
 * 人工精选作品集。不自动同步 GitHub 全量仓库。
 * Private 仓库不得写入 github/gitee URL。
 */
export const projects: Project[] = [
  {
    id: "cangjie-agent-harness",
    title: "仓颉 Agent Harness / CLI 优化",
    summary:
      "使用仓颉语言构建 Agent、Skills、Tools 与 Harness 工程，探索自动编程、运行测试和 Token 成本控制。",
    description:
      "面向 Agent 工程化落地：把提示词、Skills、Tools 与 Hooks 收敛为可约束、可观测、可复现的工作流。重点包括 CLI 交互优化、测试闭环，以及降低 Token 消耗的策略设计。部分实现与对外链接仍在整理中。",
    stack: ["仓颉", "Agent", "CLI", "Harness", "Skills"],
    status: "进行中",
    featured: true,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2025–2026",
    updatedAt: "2026-07-01",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "personal-ai-workbench",
    title: "Personal AI Workbench",
    summary:
      "面向学习、论文、项目管理和 AI 协作的个人智能工作台实验。",
    description:
      "把学习笔记、论文阅读、任务管理与 AI 协作放进同一工作流，验证「从想法到交付」的个人效率闭环。当前仍以实验与原型为主，接口与数据模型持续迭代。功能完成度与最初目标是否一致，见博客草稿《Personal AI Workbench 复盘》。",
    stack: ["TypeScript", "AI", "Workbench", "工具链"],
    status: "实验中",
    featured: true,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2025–2026",
    updatedAt: "2026-06-01",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "harmonyos-dev",
    title: "HarmonyOS 综合开发",
    summary: "鸿蒙设备、应用开发及华为生态相关实践。",
    description:
      "覆盖鸿蒙应用开发与生态相关实践，包括设备侧能力、应用交互与工程化流程。部分项目材料与演示链接仍在整理中。",
    stack: ["HarmonyOS", "ArkTS", "华为生态"],
    status: "整理中",
    featured: true,
    visibility: "private",
    repositoryStatus: "整理中",
    sourcePlatform: "none",
    year: "2024–2026",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "welcome-robot",
    title: "迎宾引导机器人",
    summary:
      "基于 ROS 的人脸唤醒、语音交互、导航、讲解及智能检测系统。",
    description:
      "面向场馆/展厅场景的迎宾引导系统：融合人脸唤醒、语音交互、自主导航与讲解流程，并接入智能检测能力。部分源码与部署说明仍在整理中。",
    stack: ["ROS", "Python", "语音交互", "导航", "视觉"],
    status: "已完成",
    featured: true,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "new-energy-inspection",
    title: "新能智检",
    summary:
      "面向新能源汽车动力电池安全监测与风险预警的软硬件系统。",
    description:
      "聚焦动力电池安全监测与风险预警，串联传感、数据处理与预警策略。相关专利与系统细节可在「关于」页成果摘要中对照；公开仓库链接待整理。",
    stack: ["嵌入式", "监测系统", "风险预警", "软硬件"],
    status: "整理中",
    featured: true,
    visibility: "private",
    repositoryStatus: "整理中",
    sourcePlatform: "none",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "harmony-ticket-agent",
    title: "Harmony Ticket Agent",
    summary:
      "鸿蒙场景下的票务/工单类 Agent 实验（仓库私有）。用途细节以实际 README 与代码为准。",
    description:
      "对应私有仓库 harmony-ticket-agent。公开页不展示仓库地址。当前说明基于仓库命名与既有方向归纳：围绕 HarmonyOS 生态的对话/任务 Agent 与票务或工单流程结合。[待代码核验：完整模块划分、技术栈版本与运行方式] [待补充：对外可讲的演示范围与边界]。",
    stack: ["HarmonyOS", "Agent", "TypeScript"],
    status: "进行中",
    featured: false,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2025–2026",
    updatedAt: "2026-07-01",
    ownership: "original",
    verificationStatus: "pending",
  },
  {
    id: "zhonghe",
    title: "zhonghe",
    summary:
      "私有仓库 zhonghe 的作品集条目。展示名称与用途以代码核验后为准，当前不做过度推断。",
    description:
      "GitHub Private 仓库 zhonghe。公开页不展示仓库地址，也不根据仓库名虚构业务场景。[待代码核验：真实用途、技术栈、是否可改展示名] [待补充：一句话产品描述与是否允许精选]。在核验完成前保持低曝光、非精选。",
    stack: ["整理中"],
    status: "整理中",
    featured: false,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2025–2026",
    ownership: "unknown",
    verificationStatus: "pending",
  },
  {
    id: "offer-pilot",
    title: "OfferPilot",
    summary:
      "与求职/Offer 流程相关的个人工具实验（私有仓库）。不重复创建条目，公开页不暴露仓库地址。",
    description:
      "已存在私有仓库 OfferPilot，本站仅维护一条人工条目。名称沿用仓库名；具体能力边界与实现栈需对照 README 与代码。[待代码核验：功能列表、技术栈、是否仍在维护] [待补充：可公开的能力摘要与演示策略]。仓库地址不写入本文件。",
    stack: ["整理中"],
    status: "实验中",
    featured: false,
    visibility: "private",
    repositoryStatus: "private",
    sourcePlatform: "github",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "pending",
  },
];

/** 进入作品集列表/详情的项目（排除 unpublished） */
export function getListedProjects(): Project[] {
  return projects.filter((p) => p.visibility !== "unpublished");
}

export function getFeaturedProjects(limit = 4): Project[] {
  return getListedProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProjectById(id: string): Project | undefined {
  return getListedProjects().find((p) => p.id === id);
}

/** 仅 visibility=public 且存在 github 字段时允许展示外链 */
export function getPublicGithubUrl(project: Project): string | undefined {
  if (project.visibility !== "public") return undefined;
  if (project.repositoryStatus === "private") return undefined;
  if (!project.github) return undefined;
  // 防御：不允许把 private 误标 public 却带敏感路径
  return project.github;
}

export function getPublicGiteeUrl(project: Project): string | undefined {
  if (project.visibility !== "public") return undefined;
  if (project.repositoryStatus === "private") return undefined;
  return project.gitee;
}

export function repositoryLabel(project: Project): string {
  if (project.repositoryStatus === "private") return "私有仓库";
  if (project.repositoryStatus === "public") return "公开仓库";
  if (project.repositoryStatus === "archived") return "已归档";
  if (project.repositoryStatus === "整理中") return "仓库整理中";
  return "无公开仓库";
}
