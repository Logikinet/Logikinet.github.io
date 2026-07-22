---
title: zhishen-dun
summary: Zhishen Dun secure review backend source release
source: github
repoLabel: Logikinet/zhishen-dun
language: Python
stars: 0
syncedAt: "2026-07-22"
isPrivateRepo: false
topics: []
---
# 智审盾（Zhishen Dun）

面向网络敏感信息审核的后端服务发布副本，提供规则检测、语义检测、脱敏、审核报告与模型接口适配能力。

## 发布范围

本仓库仅保留王子健编写并获授权发布的 FastAPI 后端业务源码、AI 模型接口适配逻辑、依赖清单和安全配置示例。

未包含以下内容：

- `.env`、Token、API Key、测试账号与真实配置
- 数据库文件、日志、审核记录、上传文件与用户数据
- `node_modules`、构建产物、压缩包、模型文件和数据集
- 无法确认版权的图片、视频与素材
- 前端构建产物；当前授权路径中未发现 Vue 3 前端源码，故不以产物替代源码发布

## 技术栈

- Python / FastAPI
- SQLAlchemy、Redis、MySQL（由运行环境配置）
- OpenAI、DeepSeek、Qwen 的环境变量接口适配

## 主要入口

`backend/app/main.py`

## 安装与启动

1. 复制 `.env.example` 为本地 `.env`，仅填写自己拥有且有效的配置。
2. 创建 Python 虚拟环境并安装 `backend/requirements.txt`。
3. 按项目实际部署方式启动 FastAPI 服务。

本次仅做静态安全整理，未连接数据库、未调用外部模型服务，也未完成完整生产构建验证。

## 安全配置

- `.env` 已被 Git 忽略，禁止提交真实配置。
- 必须提供 `SECRET_KEY`、数据库/缓存连接和所选模型提供商的凭据后，相关功能才能运行。
- 未配置的模型凭据不会写入日志或仓库。

## 当前限制

前端源码、生产数据库迁移资产和真实审核数据不在本发布副本中；需要从受控来源另行获得并完成版权与安全复核。

## 作者

王子健 · GitHub: [Logikinet](https://github.com/Logikinet)

## 第三方说明

第三方库仅通过 `backend/requirements.txt` 声明，未复制依赖源码。使用、部署或再发布时，请分别遵守各依赖的许可证。
