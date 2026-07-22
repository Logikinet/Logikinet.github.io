---
title: Skills、Tools、Hooks 与 Harness 分别解决什么问题
description: 拆解 Agent 工程中四个常见构件：Skills、Tools、Hooks、Harness 的职责边界与组合方式，避免概念混用。
pubDatetime: 2026-04-02T11:00:00+08:00
modDatetime: 2026-04-05T16:20:00+08:00
author: 王子健
category: Agent 工程
tags:
  - Skills
  - Tools
  - Hooks
  - Harness
featured: true
draft: false
---

## 先把词义钉住

在 Agent 相关讨论里，四个词经常被混用：

- **Skills**：可复用的能力说明与工作方法
- **Tools**：可调用的外部动作接口
- **Hooks**：生命周期切入点（前后拦截、校验、审计）
- **Harness**：把以上构件编排成可运行、可约束任务流的工程骨架

它们不是互相替代的「更高级名字」，而是不同抽象层。

## Skills：把经验变成可调用方法

Skills 解决的是「模型怎么做事」的可复用问题：

- 领域步骤（如何做 code review、如何写提交说明）
- 约束声明（禁止事项、输出模板）
- 上下文约定（需要哪些输入）

Skills 偏 **知识与流程封装**，本身通常不直接改变外部系统。

```text
Skill = 目标 + 步骤 + 约束 + 输出契约
```

## Tools：把意图变成动作

Tools 解决的是「系统能做什么」：

- 读文件、跑测试、查 issue
- 调 API、写磁盘、发请求

Tools 需要：

1. 清晰 schema
2. 权限分级
3. 失败语义（可重试 / 不可重试）
4. 副作用说明

没有 Tools，Agent 只能聊天；Tools 过多且无边界，Agent 会变得危险。

## Hooks：在关键节点插入控制

Hooks 解决的是「什么时候必须插入额外逻辑」：

- 工具调用前：权限与参数校验
- 工具调用后：结果脱敏、日志、指标
- 任务结束前：测试门禁、diff 审查

Hooks 适合放 **横切关注点**，而不是业务主流程本身。

## Harness：把零件装成可控系统

Harness 解决的是工程集成问题：

- 任务入口与状态机
- Skills / Tools / Hooks 的装配
- 预算、重试、并发、取消
- 轨迹记录与复现包

可以把它理解为 Agent 的「运行时夹具」：让实验可重复，让上线可运维。

## 一张对照表

| 构件 | 主要问题 | 典型产物 |
| --- | --- | --- |
| Skills | 怎么做 | 说明文档、流程模板 |
| Tools | 能做什么 | 函数/CLI/API |
| Hooks | 何时介入 | 校验器、审计器 |
| Harness | 如何稳定跑起来 | Runner、策略、观测 |

## 组合时的常见误区

1. **把 Skill 当 Tool**：只有说明、没有可执行接口，系统仍无法行动。
2. **把 Hook 写成业务主线**：生命周期逻辑膨胀，调试成本飙升。
3. **没有 Harness 直接堆 Tools**：演示可用，失败不可定位。

## 实践建议

- 先定义任务契约，再选 Tools
- 把稳定流程沉淀为 Skills
- 用 Hooks 守住安全与质量门禁
- 用 Harness 统一运行、观测与复现

下一篇会落到一个更具体的问题：如何设计低 Token 消耗的自动编程工作流。
