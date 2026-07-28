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

/**
 * Catalog order = narrative for homepage carousel & project list:
 * Agent 主线 → 工具 → 鸿蒙 → 面试/安全 → 竞赛归档 → 本地汇总
 */
export const projectCatalog: Project[] = [
  // —— Agent / Harness 主线 ——
  withRepo({
    id: "cangjie-ict",
    title: "仓颉 Agent Harness / CLI 优化",
    summary:
      "仓颉 Agent Harness 与 CLI 工程优化：可控执行、可观测链路、Skills / Tools / Hooks 与 Token 预算实践。",
    description: "私有仓库 cangjie-ict。旗舰展示项目。",
    stack: ["仓颉", "Agent", "CLI", "Harness"],
    status: "进行中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/cangjie-ict.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "aether",
    title: "Aether",
    summary:
      "本机优先的多智能体工作台：编排 Planner / Coder / Reviewer 等角色，支持本地模型与安全执行边界。",
    description: "公开仓库 Aether。",
    stack: ["TypeScript", "Agent", "Local AI"],
    status: "进行中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "todos-clone",
    title: "todos-clone · Agent 工作流",
    summary:
      "todos.dev 风格最小复现：为 Todo 指派 Agent，Plan → Confirm → Build 分层执行与流式日志。",
    description: "私有仓库 todos-clone。",
    stack: ["HTML", "JavaScript", "AI Agent"],
    status: "实验中",
    featured: true,
    visibility: "private",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "workbench",
    title: "Workbench",
    summary:
      "Windows 本机「Todo → 计划 → 代理执行 → 审查 → 验收」工作台，串联终端、diff 与本地安全执行。",
    description: "公开仓库 workbench。",
    stack: ["TypeScript", "Agent", "CLI"],
    status: "实验中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "personal-ai-workbench",
    title: "Personal AI Workbench",
    summary:
      "个人向本地 AI 生产力空间：任务、知识库、文档生成与私有模型选择，数据默认不出本机。",
    description: "私有仓库 personal-ai-workbench。",
    stack: ["TypeScript", "AI", "Local AI"],
    status: "实验中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/personal-ai-workbench.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),

  // —— 工具 / Lab ——
  withRepo({
    id: "ai-output-formatter",
    title: "AI Output Formatter",
    summary:
      "浏览器本地 AI 输出整理：Markdown 清洗、场景排版、论文/报告格式与多格式导出，数据不上传。",
    description: "公开工具，Demo 位于 /tools/ai-output-formatter/。",
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
    id: "sticker-forge",
    title: "Sticker Forge",
    summary:
      "WebGL 拟真贴纸工坊：文字或图片生成可撕边贴纸，带厚度、背胶与阴影（AquaLeap Lab）。",
    description: "公开仓库；Demo → /lab/sticker-forge/。",
    stack: ["JavaScript", "WebGL", "Next.js"],
    status: "进行中",
    featured: true,
    visibility: "public",
    demo: "/lab/sticker-forge/",
    year: "2026",
    ownership: "original",
    verificationStatus: "verified",
  }),

  // —— 鸿蒙 ——
  withRepo({
    id: "harmony-ticket-agent",
    title: "Harmony Ticket Agent",
    summary:
      "鸿蒙端票务/工单 Agent：请求理解、方案规划、沙箱校验与安全下单，支持多设备协同状态同步。",
    description: "GitHub 公开镜像；主控仓在 Gitee。",
    stack: ["TypeScript", "HarmonyOS", "Agent"],
    status: "进行中",
    featured: true,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "digital-bomb",
    title: "游戏盒子 · digital-bomb",
    summary:
      "HarmonyOS 小游戏合集：炸弹边界、2048、恐龙跑等，大厅 + 独立游戏页，便于扩展玩法。",
    description: "公开仓库 digital-bomb（ArkTS / HarmonyOS）。",
    stack: ["HarmonyOS", "ArkTS", "TypeScript"],
    status: "实验中",
    featured: false,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),

  // —— 面试 / 安全 ——
  withRepo({
    id: "offer-pilot",
    title: "OfferPilot · 智面官",
    summary:
      "仓颉语言 AI 面试陪练：岗位定制、多轮追问、表现评估与面试报告，面向求职训练场景。",
    description: "私有仓库 OfferPilot。",
    stack: ["仓颉", "AI", "Agent"],
    status: "实验中",
    featured: true,
    visibility: "private",
    localReadmePath: "src/content/projects-local/offer-pilot.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhishen-dun",
    title: "智审盾",
    summary:
      "敏感信息智能审查后端：文档摄入、风险检测、脱敏与安全发布流水线（secure review）。",
    description: "公开仓库 zhishen-dun。",
    stack: ["Python", "Security", "API"],
    status: "进行中",
    featured: false,
    visibility: "public",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhidun",
    title: "智盾 · zhidun",
    summary:
      "智能内容审计系统 MVP：上传分析、语义风险检测、脱敏预览与审计报告导出。",
    description: "公开仓库 zhidun（网络设计大赛相关实践）。",
    stack: ["Python", "Security"],
    status: "已完成",
    featured: false,
    visibility: "public",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  }),

  // —— 竞赛 / 归档 ——
  withRepo({
    id: "smart-silver",
    title: "Smart Silver",
    summary:
      "面向银发健康场景的移动端实践：健康概览、用药提醒、AI 助手与一键 SOS（程序设计大赛）。",
    description: "公开仓库 smart-silver。",
    stack: ["JavaScript", "Mobile"],
    status: "已完成",
    featured: false,
    visibility: "public",
    year: "2024–2025",
    ownership: "original",
    verificationStatus: "partial",
  }),
  withRepo({
    id: "zhonghe",
    title: "zhonghe · 仓库镜像同步",
    summary:
      "GitHub ↔ Gitee 私有仓镜像与 README 校验工作流：分支对等、元数据比对与健康检查。",
    description: "私有仓库 zhonghe（Gitee 镜像相关）。",
    stack: ["TypeScript", "DevOps"],
    status: "整理中",
    featured: false,
    visibility: "private",
    localReadmePath: "src/content/projects-local/zhonghe.md",
    year: "2025–2026",
    ownership: "original",
    verificationStatus: "partial",
  }),

  // —— 本地汇总（无远程映射） ——
  {
    id: "harmonyos-dev",
    title: "HarmonyOS 综合开发",
    summary:
      "鸿蒙设备与应用开发实践汇总：ArkUI 组件、多设备协同、Ability 模板与 DevEco 工具链笔记。",
    description: "本地说明条目，无单一远程仓。",
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
    summary:
      "新能源汽车动力电池安全监测：健康度、温度分布、BMS 实时数据与故障诊断相关实践汇总。",
    description: "本地说明条目。",
    stack: ["嵌入式", "监测系统", "BMS"],
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
