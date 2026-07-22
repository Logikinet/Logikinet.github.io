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
  summary: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  models: string;
  version: string;
  updatedAt: string;
  featured: boolean;
  safetyNote?: string;
}

export const resourcePrompts: ResourcePrompt[] = [
  {
    id: "project-plan-slice",
    title: "功能切片规划",
    summary: "接到模糊需求时，输出可验收切片、风险与非目标。",
    category: "项目规划",
    tags: ["Plan", "分阶段", "验收"],
    models: "通用",
    version: "1.1",
    updatedAt: "2026-06-01",
    featured: true,
    safetyNote: "勿粘贴密钥或真实客户数据；需求用占位符描述。",
    content: `你是资深技术负责人。根据下方需求，输出一份克制的实施规划。

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
    summary: "实现功能时限制改动面，并要求验证步骤。",
    category: "代码实现",
    tags: ["Implement", "约束", "最小改动"],
    models: "通用 / 代码模型",
    version: "1.0",
    updatedAt: "2026-06-01",
    featured: true,
    content: `在现有仓库中实现下列需求，遵守工程约束。

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
    summary: "对 diff 或 PR 按优先级审查，先找正确性与安全问题。",
    category: "代码审查",
    tags: ["Review", "清单", "风险"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-05-20",
    featured: true,
    content: `请审查下列变更，按严重程度输出：

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
    summary: "发布前对变更面做轻量安全扫视，不替代专业审计。",
    category: "安全检查",
    tags: ["Security", "密钥", "注入"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-05-20",
    featured: false,
    safetyNote: "检查对象请脱敏；不要把真实 Token 贴进对话。",
    content: `对下列代码/配置做发布前安全快速检查，关注：

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
    summary: "为项目补「如何运行 / 如何扩展」类章节，语气克制。",
    category: "文档写作",
    tags: ["README", "文档"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-05-01",
    featured: false,
    content: `为项目撰写 README 中的一节。要求：

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
    summary: "根据研究问题生成可写章节骨架，不编造实验结果。",
    category: "论文与报告",
    tags: ["大纲", "结构"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-05-01",
    featured: false,
    content: `根据研究问题，生成论文/技术报告大纲。

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
    summary: "定期梳理多项目状态：进行中 / 整理中 / 可公开。",
    category: "项目盘点",
    tags: ["盘点", "状态"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-07-01",
    featured: true,
    safetyNote: "路径请用 {{磁盘标签}} / {{项目根目录}} 等占位，勿写本机绝对路径。",
    content: `根据项目列表输出盘点表，字段：

| 名称 | 状态 | 是否可公开 | 缺什么 | 下一步（1 条） |

规则：
- 状态只能用：进行中 / 实验中 / 已完成 / 整理中 / 搁置
- 链接不确定就写「整理中」，不要猜 URL
- 不要输出本机绝对路径、用户名或设备序列号
- 下一步必须具体可执行

项目原始笔记：
{{笔记}}`,
  },
  {
    id: "github-release-notes",
    title: "GitHub 发布说明",
    summary: "根据提交/PR 生成中文发布说明草稿。",
    category: "GitHub 发布",
    tags: ["Release", "Changelog"],
    models: "通用",
    version: "1.0",
    updatedAt: "2026-05-01",
    featured: false,
    content: `根据变更列表生成 Release Notes（中文）。

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
    summary: "生成网站 UI 或图标的文生图提示，避免廉价赛博朋克。",
    category: "图片与设计",
    tags: ["设计", "图标", "克制"],
    models: "文生图 / 多模态",
    version: "1.0",
    updatedAt: "2026-05-01",
    featured: false,
    content: `写一条用于生成网站视觉素材的英文 prompt。

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
