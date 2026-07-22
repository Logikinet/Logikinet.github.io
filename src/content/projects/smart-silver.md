---
title: smart-silver
summary: 计算机程序设计大赛
source: github
repoLabel: Logikinet/smart-silver
language: JavaScript
stars: 0
syncedAt: "2026-07-22"
isPrivateRepo: false
topics: []
---
# 智享银龄（smart-silver-mvp）

智享银龄是基于 `ruoyi-vue-pro` 二次开发的适老化 MVP 项目，聚焦以下能力：
- 微信小程序登录
- AI 对话
- 健康记录
- 提醒闭环
- 一键求助

## 目录
- `server/` 后端（Spring Boot + MyBatis Plus）
- `admin-web/` 管理后台（Vue3 + Element Plus）
- `miniapp/` 微信小程序端（比赛主前台）
- `docs/` 项目文档
- `sql/` SQL 脚本
- `deploy/` 部署模板

## 本地启动（骨架阶段）
1. 启动 MySQL、Redis。
2. 启动后端：在 `server/` 下运行 `mvn -pl yudao-server -am spring-boot:run -DskipTests`。
3. 启动管理端：在 `admin-web/` 下运行 `corepack pnpm dev`。
4. 小程序：使用微信开发者工具导入 `miniapp/`。

## 说明
当前提交为 MVP 工程骨架，后续在 `yudao-module-silver` 中迭代业务实现。
# smart-silver
