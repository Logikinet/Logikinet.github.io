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
  summary: string;
  category: WorkflowCategory;
  content: string;
  tags: string[];
  updatedAt: string;
}

export const resourceWorkflows: ResourceWorkflow[] = [
  {
    id: "agents-md-core",
    title: "AGENTS.md 核心约定（站点版）",
    summary: "给仓库 Agent 的最小行为约定：范围、验证、禁止事项。",
    category: "AGENTS.md",
    tags: ["AGENTS.md", "约束"],
    updatedAt: "2026-06-01",
    content: `# Agent 约定（摘要）

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
    summary: "依赖克制、静态优先、不虚构成果的默认约束。",
    category: "项目约束",
    tags: ["约束", "依赖"],
    updatedAt: "2026-05-20",
    content: `# 项目约束

1. 优先静态生成与本地运行，不引入无服务端必要的后端
2. 不引入大型 UI 框架，除非有明确收益
3. 内容与视图分离；不确定的链接标注「整理中」
4. 不公开未确认的工作经历、用户量或收入数据
5. 第三方资源只链到来源，不二次托管不明许可内容
6. Private 仓库地址不得写入公开静态站点`,
  },
  {
    id: "dev-flow",
    title: "开发流程：Plan → Implement → Verify",
    summary: "个人常用的三阶段节奏，避免直接开写。",
    category: "开发流程",
    tags: ["流程", "Plan", "Implement"],
    updatedAt: "2026-06-10",
    content: `# 开发流程

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
    summary: "推送到公开仓库前的快速门禁。",
    category: "安全发布",
    tags: ["安全", "发布"],
    updatedAt: "2026-05-01",
    content: `# 发布前检查

- [ ] 无密钥、Token、私钥进入提交
- [ ] .env / 本地配置在 .gitignore
- [ ] 无本机绝对路径、用户名或设备信息
- [ ] 第三方资源许可证可接受
- [ ] 生产 site / CNAME / base 配置正确
- [ ] 构建通过；404 与关键内链可用
- [ ] 公开文案无未核实声明
- [ ] Private 仓库 URL 未写入前端数据`,
  },
  {
    id: "acceptance-checklist",
    title: "代码验收清单",
    summary: "功能「做完了」之前的自检项。",
    category: "验收清单",
    tags: ["验收", "QA"],
    updatedAt: "2026-05-01",
    content: `# 验收清单

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
    summary: "中大型功能的文档链，防止实现漂移。",
    category: "计划与实现",
    tags: ["PRD", "Tickets", "Plan"],
    updatedAt: "2026-06-15",
    content: `# 文档链

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
    summary: "把校验、审计放在生命周期点，而不是塞进业务主流程。",
    category: "Agent Hooks",
    tags: ["Hooks", "Agent"],
    updatedAt: "2026-06-01",
    content: `# Hooks 原则

- 工具调用前：权限与参数校验
- 工具调用后：结果摘要、脱敏、日志
- 任务结束前：测试门禁 / diff 审查
- Hooks 放横切关注点，不写成长业务脚本
- 失败要有明确退出，而不是无限重试`,
  },
  {
    id: "harness-rules",
    title: "Harness 运行规则（摘要）",
    summary: "预算、证据、熔断：让 Agent 任务可复现。",
    category: "Harness 规则",
    tags: ["Harness", "预算"],
    updatedAt: "2026-06-01",
    content: `# Harness 规则摘要

1. 每次任务绑定：目标、工具白名单、Token/时间预算
2. 关键决策保留证据（命令、摘要、变更范围）
3. 同错误重复 N 次后熔断，进入人工或降级策略
4. 优先 patch 与局部上下文，避免整库倾倒
5. 无验收条件的任务默认拒绝启动`,
  },
];
