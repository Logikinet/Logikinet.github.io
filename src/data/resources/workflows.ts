/** Types only — content in src/content/resources/workflows/ */
export type WorkflowCategory =
  | "AGENTS.md"
  | "项目约束"
  | "开发流程"
  | "安全发布"
  | "验收清单"
  | "计划与实现"
  | "Agent Hooks"
  | "Harness 规则";

export const WORKFLOW_CATEGORIES: WorkflowCategory[] = [
  "AGENTS.md",
  "项目约束",
  "开发流程",
  "安全发布",
  "验收清单",
  "计划与实现",
  "Agent Hooks",
  "Harness 规则",
];

export interface ResourceWorkflow {
  id: string;
  title: string;
  summary: string;
  category: WorkflowCategory;
  content: string;
  tags: string[];
  updatedAt: string;
  draft?: boolean;
  private?: boolean;
}
