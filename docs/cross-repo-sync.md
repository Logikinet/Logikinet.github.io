# 跨仓库 README 即时同步

## 流程

```text
项目仓 README 更新
  → notify-aqualeap.yml
  → workflow_dispatch → Logikinet/Logikinet.github.io deploy.yml
  → sync-projects.mjs（SOURCE_REPOSITORY / SOURCE_SHA）
  → Astro build → GitHub Pages → aqualeap.dev
```

主路径：**workflow_dispatch API**（不 push 空提交）。  
兜底：每日 `cron: "20 18 * * *"`（UTC）。

## Secrets

| 位置 | 名称 | 用途 |
| --- | --- | --- |
| Logikinet.github.io | `PROJECTS_READ_TOKEN` | 读取私有仓 Contents + Metadata |
| 各项目仓 | `AQUALEAP_TRIGGER_TOKEN` | 触发网站 `deploy.yml`（需 `actions: write` 于 github.io） |

**不要**把 Token 写入仓库文件或日志。

## 安装通知工作流

在网站仓执行（需 `gh` 已登录）：

```bash
npm run install:notify
```

然后在每个项目仓 Settings → Secrets 配置 `AQUALEAP_TRIGGER_TOKEN`。

## 映射表

`src/data/project-repositories.ts` — 显式 `projectId ↔ owner/name`，禁止猜名。

未映射项见同文件 `pendingRepositoryMappings`（如 KEYLEY）。
