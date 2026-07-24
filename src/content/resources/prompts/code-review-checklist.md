---
id: code-review-checklist
title: 结构化代码审查
summary: 对 diff 或 PR 按优先级审查，先找正确性与安全问题。
category: 代码审查
tags:
  - Review
  - 清单
  - 风险
models:
  - 通用
version: 1.0
updatedAt: 2026-05-20
featured: true
draft: false
private: false
---

请审查下列变更，按严重程度输出：

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
{{PR/改动说明}}
