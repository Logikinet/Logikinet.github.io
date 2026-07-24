---
id: dev-flow
title: 开发流程：Plan → Implement → Verify
summary: 个人常用的三阶段节奏，避免直接开写。
category: 开发流程
tags:
  - 流程
  - Plan
  - Implement
updatedAt: 2026-06-10
draft: false
private: false
---

# 开发流程

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
  适合稍大的功能，不适合一句话小修
