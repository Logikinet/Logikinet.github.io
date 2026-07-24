---
id: harness-rules
title: Harness 运行规则（摘要）
summary: 预算、证据、熔断：让 Agent 任务可复现。
category: Harness 规则
tags:
  - Harness
  - 预算
updatedAt: 2026-06-01
draft: false
private: false
---

# Harness 规则摘要

1. 每次任务绑定：目标、工具白名单、Token/时间预算
2. 关键决策保留证据（命令、摘要、变更范围）
3. 同错误重复 N 次后熔断，进入人工或降级策略
4. 优先 patch 与局部上下文，避免整库倾倒
5. 无验收条件的任务默认拒绝启动
