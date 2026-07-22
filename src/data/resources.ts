/** 资源库：网址 / Prompt / Skills / Workflows — 知识资产，非在线工具 */

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
    description: "真正复用过的 Prompt 模板，支持分类、标签与一键复制。",
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

// ─── Links ───────────────────────────────────────────────────────────────────

export type LinkCategory =
  | "开发平台"
  | "官方文档"
  | "AI 平台"
  | "开源项目"
  | "设计参考"
  | "论文工具"
  | "其他";

export interface ResourceLink {
  id: string;
  name: string;
  summary: string;
  url: string;
  category: LinkCategory;
  tags: string[];
  favorite: boolean;
  /** ISO date YYYY-MM-DD */
  lastChecked: string;
}

export const resourceLinks: ResourceLink[] = [
  {
    id: "astro-docs",
    name: "Astro Docs",
    summary: "Astro 官方文档，静态站点与 Content Collections 参考。",
    url: "https://docs.astro.build",
    category: "官方文档",
    tags: ["Astro", "SSG", "文档"],
    favorite: true,
    lastChecked: "2026-07-01",
  },
  {
    id: "github",
    name: "GitHub",
    summary: "代码托管与开源协作主平台。",
    url: "https://github.com",
    category: "开发平台",
    tags: ["Git", "开源"],
    favorite: true,
    lastChecked: "2026-07-01",
  },
  {
    id: "mdn",
    name: "MDN Web Docs",
    summary: "Web 标准与前端 API 权威文档。",
    url: "https://developer.mozilla.org",
    category: "官方文档",
    tags: ["Web", "前端"],
    favorite: true,
    lastChecked: "2026-06-20",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    summary: "实用优先的 CSS 框架文档。",
    url: "https://tailwindcss.com/docs",
    category: "官方文档",
    tags: ["CSS", "UI"],
    favorite: false,
    lastChecked: "2026-06-15",
  },
  {
    id: "harmonyos-docs",
    name: "HarmonyOS 开发者文档",
    summary: "鸿蒙应用开发官方文档入口。",
    url: "https://developer.huawei.com/consumer/cn/doc/",
    category: "官方文档",
    tags: ["HarmonyOS", "鸿蒙"],
    favorite: true,
    lastChecked: "2026-06-01",
  },
  {
    id: "openai-platform",
    name: "OpenAI Platform",
    summary: "模型 API 与开发者文档（按需使用，非唯一方案）。",
    url: "https://platform.openai.com",
    category: "AI 平台",
    tags: ["LLM", "API"],
    favorite: false,
    lastChecked: "2026-05-20",
  },
  {
    id: "anthropic-docs",
    name: "Anthropic Docs",
    summary: "Claude 模型与工具使用文档。",
    url: "https://docs.anthropic.com",
    category: "AI 平台",
    tags: ["Claude", "Agent"],
    favorite: true,
    lastChecked: "2026-06-10",
  },
  {
    id: "ros-docs",
    name: "ROS Documentation",
    summary: "Robot Operating System 官方文档。",
    url: "https://docs.ros.org",
    category: "官方文档",
    tags: ["ROS", "机器人"],
    favorite: false,
    lastChecked: "2026-05-01",
  },
  {
    id: "arxiv",
    name: "arXiv",
    summary: "预印本论文检索与阅读。",
    url: "https://arxiv.org",
    category: "论文工具",
    tags: ["论文", "科研"],
    favorite: true,
    lastChecked: "2026-06-01",
  },
  {
    id: "semantic-scholar",
    name: "Semantic Scholar",
    summary: "学术论文检索与引用关系浏览。",
    url: "https://www.semanticscholar.org",
    category: "论文工具",
    tags: ["论文", "检索"],
    favorite: false,
    lastChecked: "2026-05-15",
  },
  {
    id: "astro-paper",
    name: "AstroPaper",
    summary: "可访问、SEO 友好的 Astro 博客主题（本站结构参考之一）。",
    url: "https://github.com/satnaing/astro-paper",
    category: "开源项目",
    tags: ["Astro", "主题"],
    favorite: false,
    lastChecked: "2026-06-20",
  },
  {
    id: "figma",
    name: "Figma",
    summary: "界面与设计协作工具。",
    url: "https://www.figma.com",
    category: "设计参考",
    tags: ["设计", "UI"],
    favorite: false,
    lastChecked: "2026-05-01",
  },
];

// ─── Prompts ─────────────────────────────────────────────────────────────────

export type PromptCategory =
  | "项目规划"
  | "代码实现"
  | "代码审查"
  | "安全检查"
  | "文档写作"
  | "论文与报告"
  | "项目盘点"
  | "GitHub 发布"
  | "图片与设计";

export interface ResourcePrompt {
  id: string;
  title: string;
  category: PromptCategory;
  tags: string[];
  /** 简短说明：何时用、输入是什么 */
  usage: string;
  /** 适用模型备注，如「通用 / Claude / 本地模型」 */
  models: string;
  version: string;
  /** 可复制正文 */
  body: string;
}

export const resourcePrompts: ResourcePrompt[] = [
  {
    id: "project-plan-slice",
    title: "功能切片规划",
    category: "项目规划",
    tags: ["Plan", "分阶段", "验收"],
    usage: "接到模糊需求时，要求输出可验收的切片、风险与非目标。",
    models: "通用",
    version: "1.1",
    body: `你是资深技术负责人。根据下方需求，输出一份克制的实施规划。

要求：
1. 用 3–6 个可独立交付的切片描述范围
2. 每个切片给出：目标、验收标准、主要改动面、依赖
3. 明确「本次不做」清单
4. 标出最高风险点与缓解方式
5. 不要编造不存在的接口或数据

需求：
{{需求描述}}`,
  },
  {
    id: "implement-with-constraints",
    title: "带约束的代码实现",
    category: "代码实现",
    tags: ["Implement", "约束", "最小改动"],
    usage: "实现功能时限制改动面，要求补测试路径说明。",
    models: "通用 / 代码模型",
    version: "1.0",
    body: `在现有仓库中实现下列需求，遵守工程约束。

约束：
- 最小必要改动，不顺手重构无关模块
- 不引入无必要依赖
- 不伪造链接、密钥或业务数据
- 给出改动文件列表与本地验证步骤

需求：
{{需求描述}}

相关上下文：
{{文件/约束摘要}}`,
  },
  {
    id: "code-review-checklist",
    title: "结构化代码审查",
    category: "代码审查",
    tags: ["Review", "清单", "风险"],
    usage: "对 diff 或 PR 做按优先级的审查，先找正确性与安全问题。",
    models: "通用",
    version: "1.0",
    body: `请审查下列变更，按严重程度输出：

1. 正确性 / 边界条件
2. 安全与敏感信息
3. 可维护性（仅指出真正阻碍后续修改的点）
4. 测试缺口
5. 可选改进（明确标注为可选）

规则：
- 不要为了提意见而提意见
- 每条意见尽量对应具体位置
- 区分「必须修」与「建议」

变更说明：
{{PR/改动说明}}`,
  },
  {
    id: "security-static-pass",
    title: "安全快速检查",
    category: "安全检查",
    tags: ["Security", "密钥", "注入"],
    usage: "发布前对变更面做轻量安全扫视，不替代专业审计。",
    models: "通用",
    version: "1.0",
    body: `对下列代码/配置做发布前安全快速检查，关注：

- 密钥、Token、私钥是否泄漏
- 用户输入是否进入危险 sink（命令、SQL、路径、HTML）
- 鉴权/授权是否被绕过
- 依赖与构建产物中的明显风险

输出：
- 发现项（严重度 + 位置 + 理由）
- 未覆盖范围（诚实说明本次看不到什么）
- 建议的下一步验证

范围：
{{文件/功能范围}}`,
  },
  {
    id: "docs-readme-section",
    title: "README 章节撰写",
    category: "文档写作",
    tags: ["README", "文档"],
    usage: "为项目补「如何运行 / 如何扩展」类章节，语气克制。",
    models: "通用",
    version: "1.0",
    body: `为项目撰写 README 中的一节。要求：

- 面向真实使用者，步骤可执行
- 不夸大能力、不虚构指标
- 中文，结构清晰，可用列表与表格
- 标注已知限制

章节主题：
{{章节名}}

项目事实：
{{已知信息}}`,
  },
  {
    id: "paper-outline",
    title: "论文/报告大纲",
    category: "论文与报告",
    tags: ["大纲", "结构"],
    usage: "根据研究问题生成可写的章节骨架，不编造实验结果。",
    models: "通用",
    version: "1.0",
    body: `根据研究问题，生成论文/技术报告大纲。

硬性要求：
- 不编造实验数据、用户量或未做的实验
- 对「待完成工作」单独标注
- 每章给出 2–4 个可写作要点

研究问题：
{{问题}}

已有材料：
{{笔记/文献摘要}}`,
  },
  {
    id: "project-inventory",
    title: "项目盘点表",
    category: "项目盘点",
    tags: ["盘点", "状态"],
    usage: "定期梳理多项目状态：进行中 / 整理中 / 可公开。",
    models: "通用",
    version: "1.0",
    body: `根据项目列表输出盘点表，字段：

| 名称 | 状态 | 是否可公开 | 缺什么 | 下一步（1 条） |

规则：
- 状态只能用：进行中 / 实验中 / 已完成 / 整理中 / 搁置
- 链接不确定就写「整理中」，不要猜 URL
- 下一步必须具体可执行

项目原始笔记：
{{笔记}}`,
  },
  {
    id: "github-release-notes",
    title: "GitHub 发布说明",
    category: "GitHub 发布",
    tags: ["Release", "Changelog"],
    usage: "根据提交/PR 生成中文发布说明草稿。",
    models: "通用",
    version: "1.0",
    body: `根据变更列表生成 Release Notes（中文）。

结构：
- 概要（1–2 句）
- 新功能
- 修复
- 破坏性变更（若无则省略）
- 升级注意

规则：
- 不写空洞形容词
- 面向使用者而非堆砌内部类名

变更列表：
{{commits/PR}}`,
  },
  {
    id: "image-prompt-ui",
    title: "UI / 图标生成提示",
    category: "图片与设计",
    tags: ["设计", "图标", "克制"],
    usage: "生成网站 UI 或图标的文生图提示，避免廉价赛博朋克。",
    models: "文生图 / 多模态",
    version: "1.0",
    body: `写一条用于生成网站视觉素材的英文 prompt。

风格约束：
- minimal, modern, technical, restrained
- deep blue / graphite / soft aqua accent
- no neon cyberpunk, no heavy glassmorphism, no fake logos

主题：
{{主题}}

输出：
1. 主 prompt
2. 负面约束（negative）
3. 建议尺寸`,
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export type SkillOrigin = "原创" | "本人修改版" | "第三方收藏" | "待确认来源";
export type SkillStatus = "可用" | "实验中" | "整理中" | "已停用";

export interface ResourceSkill {
  id: string;
  name: string;
  purpose: string;
  platforms: string[];
  author: string;
  origin: SkillOrigin;
  source?: string;
  license?: string;
  dependencies: string[];
  status: SkillStatus;
  /** 仓库内路径；仅原创/本人修改版可展示 */
  skillPath?: string;
  repoUrl?: string;
  /**
   * 是否允许在公开站提供下载/路径跳转。
   * 第三方收藏、待确认来源必须为 false。
   */
  publicDownload: boolean;
  notes?: string;
}

export const resourceSkills: ResourceSkill[] = [
  {
    id: "aqualeap-commit-style",
    name: "中文 Commit 规范助手",
    purpose: "按 AquaLeap 约定生成含问题描述、实现思路与可选复现路径的提交说明。",
    platforms: ["Claude Code", "Cursor", "通用 Agent"],
    author: "王子健",
    origin: "原创",
    license: "仅个人站点说明，完整 Skill 整理中",
    dependencies: [],
    status: "整理中",
    skillPath: "skills/commit-zh/SKILL.md",
    publicDownload: false,
    notes: "对应站内 Git Commit 生成器工具的规则化版本；SKILL 包尚未单独开源。",
  },
  {
    id: "agent-constraint-checklist",
    name: "Agent 工程约束清单",
    purpose: "任务启动前检查目标、权限、预算与证据四类约束是否齐全。",
    platforms: ["通用 Agent", "Harness"],
    author: "王子健",
    origin: "原创",
    license: "整理中",
    dependencies: [],
    status: "实验中",
    skillPath: "skills/agent-constraints/SKILL.md",
    publicDownload: false,
    notes: "与博客《为什么 Agent 需要工程约束》配套，公开下载待整理。",
  },
  {
    id: "token-budget-runner",
    name: "低 Token 工作流提示包",
    purpose: "引导自动编程任务做范围裁剪、摘要回传与验收熔断。",
    platforms: ["CLI Agent", "Harness"],
    author: "王子健",
    origin: "本人修改版",
    source: "基于个人自动编程实践整理",
    license: "整理中",
    dependencies: ["测试/类型检查命令（项目自定）"],
    status: "实验中",
    skillPath: "skills/low-token-workflow/SKILL.md",
    publicDownload: false,
  },
  {
    id: "third-party-skill-note",
    name: "第三方 Skill 收藏示例位",
    purpose: "占位说明：第三方 Skill 仅登记来源与用途，不在本站提供下载。",
    platforms: ["—"],
    author: "—",
    origin: "第三方收藏",
    source: "待填写官方仓库或文档链接",
    license: "遵循上游许可证",
    dependencies: [],
    status: "整理中",
    publicDownload: false,
    notes: "请在确认许可证与来源后再决定是否私有使用；公开页不托管第三方 Skill 文件。",
  },
];

// ─── Workflows / Rules ───────────────────────────────────────────────────────

export type WorkflowCategory =
  | "AGENTS.md"
  | "项目约束"
  | "开发流程"
  | "安全发布"
  | "验收清单"
  | "计划与实现"
  | "Agent Hooks"
  | "Harness 规则";

export interface ResourceWorkflow {
  id: string;
  title: string;
  category: WorkflowCategory;
  summary: string;
  tags: string[];
  /** 可展开/复制的正文 */
  body: string;
  version: string;
  updated: string;
}

export const resourceWorkflows: ResourceWorkflow[] = [
  {
    id: "agents-md-core",
    title: "AGENTS.md 核心约定（站点版）",
    category: "AGENTS.md",
    summary: "给仓库 Agent 的最小行为约定：范围、验证、禁止事项。",
    tags: ["AGENTS.md", "约束"],
    version: "0.2",
    updated: "2026-06-01",
    body: `# Agent 约定（摘要）

## 目标
- 完成指定任务，保持改动可审查、可验证。

## 必须
- 改动前先读相关文件
- 用仓库既有风格与脚本
- 给出可执行的验证步骤

## 禁止
- 编造 API、链接、指标
- 提交密钥与本地私密配置
- 无必要的大范围重构
- 对用户数据做未声明的上传

## 完成标准
- 类型检查 / 构建（若项目有）通过或说明失败原因
- 关键路径人工可复查`,
  },
  {
    id: "project-constraints",
    title: "个人项目通用约束",
    category: "项目约束",
    summary: "依赖克制、静态优先、不虚构成果的默认约束。",
    tags: ["约束", "依赖"],
    version: "0.1",
    updated: "2026-05-20",
    body: `# 项目约束

1. 优先静态生成与本地运行，不引入无服务端必要的后端
2. 不引入大型 UI 框架，除非有明确收益
3. 内容与视图分离；不确定的链接标注「整理中」
4. 不公开未确认的工作经历、用户量或收入数据
5. 第三方资源只链到来源，不二次托管不明许可内容`,
  },
  {
    id: "dev-flow",
    title: "开发流程：Plan → Implement → Verify",
    category: "开发流程",
    summary: "个人常用的三阶段节奏，避免直接开写。",
    tags: ["流程", "Plan", "Implement"],
    version: "0.2",
    updated: "2026-06-10",
    body: `# 开发流程

## Plan
- 写清目标、非目标、验收标准
- 标出触及的模块与风险

## Implement
- 最小改动实现
- 保持内容/数据与视图分离

## Verify
- 运行 check / build / 关键路径手测
- 失败先修阻塞项，再谈美化

## 可选
- PRD → 技术方案 → Tickets → Plan → Implement
  适合稍大的功能，不适合一句话小修`,
  },
  {
    id: "secure-release",
    title: "安全发布检查清单",
    category: "安全发布",
    summary: "推送到公开仓库前的快速门禁。",
    tags: ["安全", "发布"],
    version: "0.1",
    updated: "2026-05-01",
    body: `# 发布前检查

- [ ] 无密钥、Token、私钥进入提交
- [ ] .env / 本地配置在 .gitignore
- [ ] 第三方资源许可证可接受
- [ ] 生产 site / CNAME / base 配置正确
- [ ] 构建通过；404 与关键内链可用
- [ ] 公开文案无未核实声明`,
  },
  {
    id: "acceptance-checklist",
    title: "代码验收清单",
    category: "验收清单",
    summary: "功能「做完了」之前的自检项。",
    tags: ["验收", "QA"],
    version: "0.1",
    updated: "2026-05-01",
    body: `# 验收清单

- [ ] 需求描述中的主路径可走通
- [ ] 错误态/空态有合理表现
- [ ] 移动端关键布局无严重问题
- [ ] 深浅色模式无不可读对比
- [ ] 键盘可聚焦主要操作
- [ ] 无浏览器控制台阻塞错误`,
  },
  {
    id: "prd-plan-implement",
    title: "PRD → 技术方案 → Tickets → Plan → Implement",
    category: "计划与实现",
    summary: "中大型功能的文档链，防止实现漂移。",
    tags: ["PRD", "Tickets", "Plan"],
    version: "0.1",
    updated: "2026-06-15",
    body: `# 文档链

1. **PRD**：问题、用户、成功标准、非目标
2. **技术方案**：模块边界、数据、风险、备选
3. **Tickets**：可独立合并的任务切片
4. **Plan**：本轮具体步骤与验证
5. **Implement**：按切片交付，每片可验收

原则：没有验收标准的 Ticket 不进入 Implement。`,
  },
  {
    id: "agent-hooks",
    title: "Agent Hooks 使用原则",
    category: "Agent Hooks",
    summary: "把校验、审计放在生命周期点，而不是塞进业务主流程。",
    tags: ["Hooks", "Agent"],
    version: "0.1",
    updated: "2026-06-01",
    body: `# Hooks 原则

- 工具调用前：权限与参数校验
- 工具调用后：结果摘要、脱敏、日志
- 任务结束前：测试门禁 / diff 审查
- Hooks 放横切关注点，不写成长业务脚本
- 失败要有明确退出，而不是无限重试`,
  },
  {
    id: "harness-rules",
    title: "Harness 运行规则（摘要）",
    category: "Harness 规则",
    summary: "预算、证据、熔断：让 Agent 任务可复现。",
    tags: ["Harness", "预算"],
    version: "0.1",
    updated: "2026-06-01",
    body: `# Harness 规则摘要

1. 每次任务绑定：目标、工具白名单、Token/时间预算
2. 关键决策保留证据（命令、摘要、变更范围）
3. 同错误重复 N 次后熔断，进入人工或降级策略
4. 优先 patch 与局部上下文，避免整库倾倒
5. 无验收条件的任务默认拒绝启动`,
  },
];

export function getFavoriteLinks(limit = 6): ResourceLink[] {
  return resourceLinks.filter((l) => l.favorite).slice(0, limit);
}
