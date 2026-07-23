import type { Project } from "./types";
import { projectRepositories } from "../project-repositories";

/** 展示用字段 + 从 project-repositories 合并仓库配置 */
function withRepo(
  base: Omit<
    Project,
    | "repositoryOwner"
    | "repositoryName"
    | "repositoryUrl"
    | "repositoryProvider"
    | "repositoryStatus"
    | "exposeRepositoryUrl"
    | "readmeSource"
    | "readmePublicSafe"
    | "syncMetadata"
  > & { id: string },
): Project {
  const repo = projectRepositories.find((r) => r.projectId === base.id);
  if (!repo) {
    return {
      ...base,
      repositoryStatus: "unpublished",
      exposeRepositoryUrl: false,
      readmeSource: "local",
      readmePublicSafe: true,
      syncMetadata: false,
    };
  }
  const [owner, name] = repo.repository.split("/");
  return {
    ...base,
    repositoryOwner: owner,
    repositoryName: name,
    repositoryProvider: repo.provider,
    repositoryStatus: repo.visibility,
    exposeRepositoryUrl: repo.exposeRepositoryUrl,
    repositoryUrl:
      repo.exposeRepositoryUrl && repo.provider === "github"
        ? `https://github.com/${repo.repository}`
        : repo.exposeRepositoryUrl && repo.provider === "gitee"
          ? `https://gitee.com/${repo.repository}`
          : undefined,
    readmeSource: repo.provider === "github" ? "github" : "gitee",
    readmePublicSafe: repo.readmePublicSafe,
    syncMetadata: repo.syncMetadata,
  };
}

export const projectCatalog: Project[] = [
  withRepo({
    id: "cangjie-ict",
    title: "仓颉 Agent Harness / CLI 优化",
    summary:
      "仓颉 Agent Harness 与 CLI 工程优化：可控执行、可观测链路与终端工作流实践。",
    description: "私有仓库 cangjie-ict。正文需 PROJECTS_READ_TOKEN 且 readmePublicSafe 确认后同步。",
    stack: ["仓颉", "Agent", "CLI"],
    status: "进行中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/cangjie-ict.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "ai-output-formatter",
    title: "AI Output Formatter",
    summary:
      "浏览器本地运行的 AI 输出整理工具，支持 Markdown 清洗、场景化排版、论文与报告格式转换、Markdown 实时预览及多格式导出。",
    description:
      "面向 ChatGPT、Claude、Gemini、Cursor 等 AI 输出内容的浏览器端整理工作台，核心规则处理默认在本地完成。",
    stack: ["React", "TypeScript", "Vite", "Markdown", "PWA"],
    status: "进行中",
    featured: true,
    visibility: "public",
    demo: "/tools/ai-output-formatter/",
    year: "2026",
    ownership: "original",
    verificationStatus: "verified",
  }),
  withRepo({
    id: "offer-pilot",
    title: "OfferPilot · 智面官",
    summary:
      "基于仓颉语言的 AI 面试陪练智能体：岗位定制、多轮追问、表现评估与面试报告。",
    description: "私有仓库 OfferPilot。详细能力以同步 README 为准。",
    stack: ["仓颉", "AI"],
    status: "实验中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/offer-pilot.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "harmony-ticket-agent",
    title: "Harmony Ticket Agent",
    summary: "鸿蒙票务/工单 Agent（GitHub 公开镜像，描述指向 Gitee 主控仓）。",
    description: "公开仓库。实现细节以 README 为准。",
    stack: ["TypeScript", "HarmonyOS", "Agent"],
    status: "进行中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhonghe",
    title: "zhonghe",
    summary: "私有仓库 zhonghe（Gitee 项目镜像说明）。用途以 README 核验后更新。",
    description: "不根据名称推断业务。",
    stack: [],
    status: "整理中",
    featured: false,
    visibility: "private",
    localReadmePath: "src/content/projects-local/zhonghe.md",
    year: "2025–2026",
    ownership: "unknown",
    verificationStatus: "pending",
  }),
  withRepo({
    id: "personal-ai-workbench",
    title: "Personal AI Workbench",
    summary: "Personal AI Workbench 私有发布仓。",
    description: "私有仓库。以 README 与代码为准。",
    stack: ["TypeScript", "AI"],
    status: "实验中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/personal-ai-workbench.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "workbench",
    title: "Workbench",
    summary: "Windows 本机「Todo → 计划 → 代理执行 → 审查 → 验收」工作台。",
    description: "公开仓库 workbench。",
    stack: ["TypeScript"],
    status: "实验中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "aether",
    title: "Aether",
    summary: "个人多智能体工作流平台。",
    description: "公开仓库 Aether。",
    stack: ["TypeScript"],
    status: "进行中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhishen-dun",
    title: "智审盾",
    summary: "安全审查后端源码发布（Zhishen Dun）。",
    description: "公开仓库 zhishen-dun。",
    stack: ["Python"],
    status: "进行中",
    featured: false,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhidun",
    title: "zhidun",
    summary: "网络设计大赛相关项目。",
    description: "公开仓库 zhidun。",
    stack: ["Python"],
    status: "已完成",
    featured: false,
    visibility: "public",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "smart-silver",
    title: "smart-silver",
    summary: "计算机程序设计大赛相关项目。",
    description: "公开仓库 smart-silver。",
    stack: ["JavaScript"],
    status: "已完成",
    featured: false,
    visibility: "public",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "digital-bomb",
    title: "digital-bomb",
    summary: "公开仓库 digital-bomb。",
    description: "用途以 README 为准。",
    stack: ["TypeScript"],
    status: "实验中",
    featured: false,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "pending",
  }),
  // 本地汇总（无远程映射）
  {
    id: "harmonyos-dev",
    title: "HarmonyOS 综合开发",
    summary: "鸿蒙设备与应用开发实践汇总（无单一远程仓）。",
    description: "本地说明条目。",
    stack: ["HarmonyOS", "ArkTS"],
    status: "整理中",
    featured: false,
    visibility: "private",
    repositoryStatus: "unpublished",
    exposeRepositoryUrl: false,
    readmeSource: "local",
    readmePublicSafe: true,
    syncMetadata: false,
    localReadmePath: "src/content/projects-local/harmonyos-dev.md",
    year: "2024–2026",
    ownership: "original",
    verificationStatus: "partial",
  },
  {
    id: "new-energy-inspection",
    title: "新能智检",
    summary: "新能源汽车动力电池安全监测相关实践（本地汇总）。",
    description: "本地说明条目。",
    stack: ["嵌入式", "监测系统"],
    status: "整理中",
    featured: false,
    visibility: "private",
    repositoryStatus: "unpublished",
    exposeRepositoryUrl: false,
    readmeSource: "local",
    readmePublicSafe: true,
    syncMetadata: false,
    localReadmePath: "src/content/projects-local/new-energy-inspection.md",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  },
];
