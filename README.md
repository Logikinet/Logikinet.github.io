# AquaLeap

王子健（[Logikinet](https://github.com/Logikinet)）的个人技术网站。

- 正式域名：<https://aqualeap.dev>
- 仓库：<https://github.com/Logikinet/Logikinet.github.io>
- 定位：个人主页 + 技术博客 + 项目作品集 + 在线工具箱 + 实验室 Demo

## 技术栈

- [Astro](https://astro.build/)（静态生成）
- TypeScript
- Tailwind CSS v4
- Markdown / MDX + Content Collections
- Pagefind（静态搜索）
- GitHub Actions → GitHub Pages

参考 [AstroPaper](https://github.com/satnaing/astro-paper) 的内容组织与博客能力，视觉与信息架构为 AquaLeap 独立设计。

## 本地开发

要求：Node.js ≥ 20（推荐 22）

```bash
npm install
npm run dev
```

本地默认地址：<http://localhost:4321>

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run check` | Astro / TS 检查 |
| `npm run build` | 类型检查 + 生产构建 + Pagefind 索引 |
| `npm run preview` | 预览 `dist` |

## 部署（GitHub Pages）

1. 仓库为用户主页仓库 `Logikinet.github.io`
2. `astro.config.ts` 中 `site` 为 `https://aqualeap.dev`，**不设置**项目级 `base`
3. `public/CNAME` 内容为 `aqualeap.dev`（会进入构建产物）
4. GitHub 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
5. 推送 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布

自定义域名 DNS（在你的域名服务商配置）：

- `A` / `AAAA` 或 `CNAME` 按 [GitHub Pages 自定义域名文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) 设置
- 建议启用「Enforce HTTPS」

### 备份分支

迁移前已创建备份分支：

```text
backup/pre-astro-migration
```

初版「喜欢你」文字漂浮小游戏已从站点移除（仅保留在备份分支 `backup/pre-astro-migration`）。

## 内容如何更新

### 写文章

1. 在 `src/content/blog/` 新建 `.md` 或 `.mdx`
2. 填写 frontmatter（见示例文章）

```yaml
---
title: 标题
description: 摘要
pubDatetime: 2026-05-08T14:30:00+08:00
modDatetime: 2026-05-10T10:00:00+08:00   # 可选
author: 王子健
category: Agent 工程
tags: [Agent, Harness]
featured: false
draft: false
---
```

3. `draft: true` 的文章不会出现在生产构建列表中
4. 本地 `npm run dev` 预览；`npm run build` 验证

### 添加项目

编辑 `src/data/projects.ts`：

- 增加 `Project` 对象（`id` 唯一，用于 `/projects/[id]/`）
- `github` / `demo` 不确定时省略，页面会显示「整理中」
- `featured: true` 会出现在首页精选

### 扩展工具

1. 在 `src/data/tools.ts` 登记工具卡片
2. 在 `src/pages/tools/` 新增页面（优先客户端本地逻辑，不上传数据）
3. 从 `/tools/` 入口可访问

### 资源库

路径：`/resources/`（导航「资源库」）

| 子页 | 数据文件 |
| --- | --- |
| 常用网址 | `src/data/resources/links.ts` |
| Prompt Library | `src/data/resources/prompts.ts` |
| Skills Registry | `src/data/resources/skills.ts`（third-party/unknown 不提供下载） |
| Workflows / Rules | `src/data/resources/workflows.ts` |

原则：知识资产与「工具箱」分离；Private 仓库 URL 不得写入前端数据。

### 项目作品集（README 驱动）

| 路径 | 作用 |
| --- | --- |
| `src/data/projects/catalog.ts` | 人工目录：精选、字段、`exposeRepositoryUrl`、`readmePublicSafe` |
| `src/generated/projects/<id>.json` | 同步元数据（无 Token） |
| `src/generated/projects/<id>.md` | 通过安全扫描后的 README 正文 |
| `src/content/projects-local/` | 本地回退说明 |
| `scripts/sync-projects.mjs` | 同步脚本 |

```bash
# 构建会先 sync（公开仓可无 Token）
npm run build

# 仅同步
npm run sync:projects

# 私有 README（勿提交 Token）
$env:PROJECTS_READ_TOKEN="github_pat_..."
npm run sync:projects
```

CI：`push` / `workflow_dispatch` / **每日 schedule** / `repository_dispatch`（type: `sync-projects`）均会构建部署。  
其他仓库 README 更新后可触发本站重建（需 PAT）：

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/Logikinet/Logikinet.github.io/dispatches \
  -d '{"event_type":"sync-projects"}'
```

私有仓 URL 是否可展示：见 `docs/private-repo-expose-checklist.md`。

字段要点：

- `repositoryStatus`: public | private | unpublished
- `exposeRepositoryUrl`: 是否在 HTML 中输出可点击仓库链接（与是否 private 独立）
- `readmePublicSafe`: 私有 README 是否允许进入公开构建（须人工确认）
- **无 `demo` 时不显示 Demo 按钮**

详情页正文优先级：generated 安全 README → 本地 localReadmePath → description → 简短状态。

### 实验室 Demo

1. 静态 Demo 可放在 `public/lab/<name>/`
2. 在 `src/data/lab.ts` 增加卡片说明
3. 无条目时首页不展示实验室区块，`/lab/` 显示空状态

## 目录结构（核心）

```text
src/
  components/     # 导航、卡片、分页、目录等
  content/blog/   # 文章（Content Collections）
  data/           # 项目、工具、实验室结构化数据
  layouts/        # 基础布局与 SEO
  pages/          # 路由页面与 RSS
  styles/         # 全局样式（AquaLeap 主题）
  utils/          # 博客工具函数
public/
  CNAME
  favicon.svg
  robots.txt
  site.webmanifest
.github/workflows/deploy.yml
```

## 设计原则（摘要）

- 深色科技感，低饱和深蓝 / 墨黑 / 灰白 + 少量水绿色
- 移动端优先，支持浅色 / 深色，尊重 `prefers-reduced-motion`
- 优先静态生成，避免无必要的大型 UI 框架与客户端 JS
- 不虚构项目链接、用户量或未确认经历

## 许可

站点内容与代码归作者王子健所有。第三方依赖遵循其各自许可证。
