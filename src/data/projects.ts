export type ProjectStatus = "进行中" | "已完成" | "整理中" | "实验中";

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  github?: string;
  demo?: string;
  year?: string;
}

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
    year: "2025–2026",
  },
  {
    id: "personal-ai-workbench",
    title: "Personal AI Workbench",
    summary:
      "面向学习、论文、项目管理和 AI 协作的个人智能工作台实验。",
    description:
      "把学习笔记、论文阅读、任务管理与 AI 协作放进同一工作流，验证「从想法到交付」的个人效率闭环。当前仍以实验与原型为主，接口与数据模型持续迭代。",
    stack: ["TypeScript", "AI", "Workbench", "工具链"],
    status: "实验中",
    featured: true,
    year: "2025–2026",
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
    year: "2024–2026",
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
    year: "2024–2025",
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
    year: "2024–2025",
  },
];

export function getFeaturedProjects(limit = 4): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
