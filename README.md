# AquaLeap

王子健（[Logikinet](https://github.com/Logikinet)）的个人技术空间与项目作品集。

- **正式域名**：<https://aqualeap.dev>
- **开源仓库**：<https://github.com/Logikinet/Logikinet.github.io>
- **定位**：个人主页 + 技术博客 + AI Agent / 鸿蒙作品集 + 在线工具箱 + 实验室 Demo

---

## 🌟 核心特色与交互设计

本站点深度汲取了 `oooo.so` (CatsJuice 风格) 的现代 Web 交互与微动效理念，全站具备：

- **iPad 磁性流体光标 (`MagneticCursor.astro`)**：桌面端支持具备弹簧物理惯性的双层光标，鼠标靠近按钮、导航与标签时自动产生磁性吸附与形变包裹；触摸屏与移动端自动降级。
- **macOS 悬浮 Glass Dock 导航栏 (`Header.astro`)**：半透明毛玻璃胶囊形态，内置鼠标扫过时的**鱼眼放缩 (Fisheye Scaling)** 悬停效果与主题切光动效。
- **3D Tilt 与指针聚光灯卡片 (`global.css`)**：项目与博客卡片在鼠标悬停时产生三维立体倾斜视角（3D Tilt），内部呈现跟随鼠标坐标移动的 Aqua 聚光灯 (Spotlight Glow)。
- **代码 Typing 动态 Header**：首页展示动态打字机 Tag 切换（`<developer />` / `<agent_builder />` / `<fullstack_dev />`）与呼吸脉冲在线 status。

---

## 🛠️ 技术栈

- **框架**：[Astro 5](https://astro.build/)（SSG 静态生成）
- **语言**：TypeScript
- **样式**：Tailwind CSS v4 + Vanilla CSS
- **搜索**：Pagefind（极轻量静态全文检索）
- **部署**：GitHub Actions → GitHub Pages (`aqualeap.dev`)

---

## 🚀 本地开发

要求：Node.js ≥ 20（推荐 22）

```bash
npm install
npm run dev
```

本地访问地址：<http://localhost:4321>

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run check` | 运行 Astro 与 TypeScript 类型检查 |
| `npm run build` | 执行项目构建（内容同步 + 类型检查 + 静态打包 + Pagefind 索引） |
| `npm run preview` | 本地预览构建产物 `dist` |
| `npm run sync:projects` | 同步 GitHub 项目 README 及元数据 |

---

## 📦 部署与自动化（GitHub Pages）

1. 部署源仓库为用户主页仓库 `Logikinet.github.io`。
2. 绑定自定义域名 `aqualeap.dev`（`public/CNAME` 自动输出至构建根目录）。
3. 每次提交推送至 `main` 分支时，由 `.github/workflows/deploy.yml` 自动触发构建、搜索索引生成并部署发布。

---

## 📝 内容维护指南

### 写文章

在 `src/content/blog/` 新增 `.md` 或 `.mdx` 文件，配置 Frontmatter：

```yaml
---
title: 文章标题
description: 文章摘要说明
pubDatetime: 2026-07-24T16:00:00+08:00
author: 王子健
category: Agent 工程
tags: [Agent, Harness]
featured: false
draft: false
---
```

### 项目作品集同步

编辑 `src/data/projects.ts` 或 `src/data/projects/catalog.ts` 登记项目。构建时会自动运行 `scripts/sync-projects.mjs` 拉取并安全处理项目 README。

```bash
# 仅同步项目数据
npm run sync:projects
```

### 资源库与工具箱

- **工具箱** (`/tools/`)：在 `src/data/tools.ts` 登记卡片，在 `src/pages/tools/` 编写客户端纯前端逻辑工具。
- **资源库** (`/resources/`)：托管 Prompt 模板、Agent Skills 规范与团队工作流规约。

---

## 📁 目录结构概览

```text
src/
  components/     # 磁性光标、Glass Dock 导航栏、3D Spotlight 卡片等
  content/blog/   # 博客文章集合（Content Collections）
  data/           # 项目作品集、工具箱、实验室数据配置
  layouts/        # 页面基础布局与 SEO 规范
  pages/          # 路由页面 (首页、项目、博客、工具、实验室、关于)
  styles/         # 全局 AquaLeap 设计系统与 3D/Glow 样式
public/
  CNAME           # 部署自定义域名配置
  assets/         # Logo 与静态图像资源
```

---

## 📄 许可协议

站点内容与代码归作者 **王子健（Logikinet）** 所有。第三方依赖与组件遵循其各自开源许可证。
