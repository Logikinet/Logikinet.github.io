---
id: agents-md-core
title: AGENTS.md 核心约定（站点版）
summary: 给仓库 Agent 的最小行为约定：范围、验证、禁止事项。
category: AGENTS.md
tags:
  - AGENTS.md
  - 约束
updatedAt: 2026-06-01
draft: false
private: false
---

# Agent 约定（摘要）

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
- 关键路径人工可复查
