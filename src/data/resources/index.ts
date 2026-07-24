export type ResourceSectionId = "links" | "prompts" | "skills" | "workflows";

export interface ResourceSection {
  id: ResourceSectionId;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
}

export const resourceSections: ResourceSection[] = [
  {
    id: "links",
    title: "常用网址",
    shortTitle: "常用网址",
    description: "开发平台、文档、AI 平台、开源项目、设计参考与论文工具。",
    href: "/resources/links/",
  },
  {
    id: "prompts",
    title: "Prompt Library",
    shortTitle: "Prompt 模板",
    description: "真正复用过的 Prompt 模板，支持分类、标签、搜索与一键复制。",
    href: "/resources/prompts/",
  },
  {
    id: "skills",
    title: "Skills Registry",
    shortTitle: "Agent Skills",
    description: "原创、修改版与第三方收藏的 Skill 登记；来源不明不提供下载。",
    href: "/resources/skills/",
  },
  {
    id: "workflows",
    title: "Workflows / Rules",
    shortTitle: "工作流规则",
    description: "AGENTS.md、约束、发布流程、验收清单与 Harness 规则。",
    href: "/resources/workflows/",
  },
];

// Types & categories (content lives in src/content/resources/**)
export type {
  PromptCategory,
  ResourcePrompt,
} from "./prompts";
export type { ResourceSkill, SkillOwnership, SkillStatus } from "./skills";
export type { LinkCategory, ResourceLink } from "./links";
export type { WorkflowCategory, ResourceWorkflow } from "./workflows";

export {
  PROMPT_CATEGORIES,
} from "./prompts";
export {
  LINK_CATEGORIES,
} from "./links";
export {
  WORKFLOW_CATEGORIES,
} from "./workflows";
