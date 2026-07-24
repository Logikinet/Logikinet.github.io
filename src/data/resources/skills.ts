/** Types only — content in src/content/resources/skills/ */
export type SkillOwnership = "original" | "modified" | "third-party" | "unknown";
export type SkillStatus = "available" | "experimental" | "draft" | "retired";

export interface ResourceSkill {
  id: string;
  name: string;
  summary: string;
  platform: string[];
  author: string;
  origin: string;
  license: string;
  ownership: SkillOwnership;
  status: SkillStatus;
  repository?: string;
  documentation?: string;
  tags: string[];
  allowPublicLink: boolean;
  notes?: string;
  draft?: boolean;
  private?: boolean;
}
