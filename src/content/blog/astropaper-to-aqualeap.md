---
title: 从 AstroPaper 到 AquaLeap：一次个人技术主页的视觉重构
description: 记录基于 Astro 内容能力搭建 AquaLeap 的过程：结构取舍、视觉方向、资源库与作品集策略，以及仍未完成的事项。不编造 Lighthouse 分数。
pubDatetime: 2026-07-20T13:00:00+08:00
author: 王子健
category: 工程实践
tags:
  - Astro
  - AquaLeap
  - 视觉设计
  - 个人站点
  - 草稿
featured: false
draft: true
---

## 背景

仓库最初只有单页「喜欢你」文字漂浮小游戏。目标是建成：

**个人主页 + 博客 + 项目 + 资源库 + 工具 + 实验室**

技术选型上参考 AstroPaper 的内容组织与博客能力（Collections、RSS、Sitemap、深浅色），但视觉与信息架构按 AquaLeap 独立设计，而不是改个名字交差。

正式域名：`https://aqualeap.dev`  
部署：GitHub Pages + Actions  

## 问题

1. 默认博客模板气质重，品牌感不足。  
2. 项目与知识资产（Prompt/Skill）混进「工具」会语义错误。  
3. 需要保留旧小游戏，又不能挡在首页。  
4. 深色模式易做成死黑 + 廉价发光。  

## 约束

- 静态生成，无服务端运行时。  
- 不引入大型 UI 框架。  
- 不破坏 SEO 基础与可访问性。  
- 尊重 `prefers-reduced-motion`。  
- 不虚构项目数据与访问量。  

## 方案

### 信息架构

| 路径 | 职责 |
| --- | --- |
| `/` | 品牌 Hero + 精选入口 |
| `/projects` | 人工精选作品集 |
| `/blog` | Content Collections |
| `/resources` | 网址 / Prompt / Skills / Workflows |
| `/tools` | 浏览器本地工具 |
| `/lab/love` | 迁移后的小游戏 |

### 视觉方向

- 字体：Sora（显示）+ IBM Plex Sans / Noto Sans SC（正文）  
- 色：石墨深蓝 + 低饱和 aqua  
- 卡片：克制边框与阴影，hover 微位移（可关）  
- Hero：轻网格 + 径向光，避免赛博霓虹  

### 数据策略

- 项目：`src/data/projects.ts` 人工维护  
- 资源：`src/data/resources/*.ts` 分文件  
- 私有仓：不写 URL  

## 执行过程

1. 备份分支 `backup/pre-astro-migration`，迁移小游戏到 `/lab/love/`。  
2. 搭建 Astro + Tailwind v4 站点骨架与导航。  
3. 实现博客、工具、实验室、简历与 SEO 基础。  
4. 首页视觉重构（Hero / 卡片 / 暗色层次）。  
5. 新增资源库一级导航与四子页。  
6. 扩展项目字段（visibility 等）并纳入已确认私有项目条目。  

[待补充：关键 PR/提交区间与耗时感受，非精确工时]

## 结果

- 站点可静态构建并部署到 GitHub Pages。  
- 首页具备独立品牌气质，而非默认模板。  
- 资源库与工具箱职责分离。  
- [待补充：上线后真实待办与反馈，勿编造流量]

## 失败与不足

- 部分项目用途仍 `pending` 核验，描述保守。  
- 内页视觉尚未完全与首页同级统一。  
- Pagefind 对中文无词干，搜索体验一般。  
- 字体依赖 Google Fonts，首屏仍可再优化（子集/自托管）。  
- [待代码核验：Lighthouse 分数——未测则不写数字]

## 可复用方法

1. 参考主题的是**能力**，不是换皮文案。  
2. 知识资产与运行工具分路由。  
3. 作品集人工精选 + 可见性字段，拒绝 GitHub 全量同步。  
4. 视觉先定约束（不要什么），再加点缀。  

## 后续计划

- [ ] 内页 section 与卡片节奏对齐首页  
- [ ] 项目核验完成后更新 zhonghe / OfferPilot 描述  
- [ ] 字体自托管与关键 CSS 体积检查  
- [ ] 将本文 draft 在事实补全后改为正式发布
