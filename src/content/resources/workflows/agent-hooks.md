---
id: agent-hooks
title: Agent Hooks 使用原则
summary: 把校验、审计放在生命周期点，而不是塞进业务主流程。
category: Agent Hooks
tags:
  - Hooks
  - Agent
updatedAt: 2026-06-01
draft: false
private: false
---

# Hooks 原则

- 工具调用前：权限与参数校验
- 工具调用后：结果摘要、脱敏、日志
- 任务结束前：测试门禁 / diff 审查
- Hooks 放横切关注点，不写成长业务脚本
- 失败要有明确退出，而不是无限重试
