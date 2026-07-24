---
id: security-static-pass
title: 安全快速检查
summary: 发布前对变更面做轻量安全扫视，不替代专业审计。
category: 安全检查
tags:
  - Security
  - 密钥
  - 注入
models:
  - 通用
version: 1.0
updatedAt: 2026-05-20
featured: false
draft: false
private: false
safetyNote: 检查对象请脱敏；不要把真实 Token 贴进对话。
---

对下列代码/配置做发布前安全快速检查，关注：

- 密钥、Token、私钥是否泄漏
- 用户输入是否进入危险 sink（命令、SQL、路径、HTML）
- 鉴权/授权是否被绕过
- 依赖与构建产物中的明显风险

输出：
- 发现项（严重度 + 位置 + 理由）
- 未覆盖范围（诚实说明本次看不到什么）
- 建议的下一步验证

范围：
{{文件/功能范围}}
