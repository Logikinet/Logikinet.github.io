---
id: github-release-notes
title: GitHub 发布说明
summary: 根据提交/PR 生成中文发布说明草稿。
category: GitHub 发布
tags:
  - Release
  - Changelog
models:
  - 通用
version: 1.0
updatedAt: 2026-05-01
featured: false
draft: false
private: false
---

根据变更列表生成 Release Notes（中文）。

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
{{commits/PR}}
