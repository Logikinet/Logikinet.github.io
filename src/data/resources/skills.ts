export type SkillOwnership = "original" | "modified" | "third-party" | "unknown";

export type SkillStatus = "available" | "experimental" | "draft" | "retired";

export interface ResourceSkill {
  id: string;
  name: string;
  summary: string;
  platform: string[];
  author: string;
  /** 人类可读来源说明 */
  origin: string;
  license: string;
  ownership: SkillOwnership;
  status: SkillStatus;
  /** 仅 original/modified 且可公开时填写；third-party/unknown 不得填可下载路径 */
  repository?: string;
  documentation?: string;
  tags: string[];
  /** 是否允许在公开页展示仓库/下载链接 */
  allowPublicLink: boolean;
  notes?: string;
}

export const resourceSkills: ResourceSkill[] = [
  {
    id: "aqualeap-commit-style",
    name: "中文 Commit 规范助手",
    summary:
      "按 AquaLeap 约定生成含问题描述、实现思路与可选复现路径的提交说明。",
    platform: ["Claude Code", "Cursor", "通用 Agent"],
    author: "王子健",
    origin: "AquaLeap 原创实践",
    license: "整理中，暂不提供下载包",
    ownership: "original",
    status: "draft",
    tags: ["Git", "Commit", "中文"],
    allowPublicLink: false,
    notes: "对应站内 Git Commit 生成器的规则化版本；SKILL 包尚未单独开源。",
  },
  {
    id: "agent-constraint-checklist",
    name: "Agent 工程约束清单",
    summary: "任务启动前检查目标、权限、预算与证据四类约束是否齐全。",
    platform: ["通用 Agent", "Harness"],
    author: "王子健",
    origin: "原创 / 与博客主题配套",
    license: "整理中",
    ownership: "original",
    status: "experimental",
    tags: ["Agent", "约束", "Harness"],
    allowPublicLink: false,
    notes: "公开下载待许可证与仓库路径确认。",
  },
  {
    id: "token-budget-runner",
    name: "低 Token 工作流提示包",
    summary: "引导自动编程任务做范围裁剪、摘要回传与验收熔断。",
    platform: ["CLI Agent", "Harness"],
    author: "王子健",
    origin: "本人修改版 / 基于个人自动编程实践",
    license: "整理中",
    ownership: "modified",
    status: "experimental",
    tags: ["Token", "工作流"],
    allowPublicLink: false,
  },
  {
    id: "third-party-skill-placeholder",
    name: "第三方 Skill 登记占位",
    summary:
      "示例：第三方 Skill 仅登记作者、许可证与来源说明，不在本站提供下载。",
    platform: ["—"],
    author: "[待补充：原作者]",
    origin: "第三方收藏 · 来源待填写",
    license: "遵循上游许可证",
    ownership: "third-party",
    status: "draft",
    tags: ["第三方", "登记"],
    allowPublicLink: false,
    notes: "确认许可证与上游仓库后再私有使用；公开页不托管第三方文件。",
  },
];
