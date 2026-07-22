# 智审盾（Zhishen-Dun）
网络敏感信息智能审核系统（MVP）

## 1. 项目简介
智审盾用于检测文档或文本中的敏感信息，并给出语义风险判断、脱敏结果和报告统计。  
适合课程设计、毕业设计、比赛演示、内部原型验证。

## 2. 技术栈
- 前端：Vue 3 + TypeScript + Element Plus + ECharts + Axios
- 后端：FastAPI + Python + SQLAlchemy
- 文件处理：python-docx / PyPDF2 / openpyxl
- AI能力：DeepSeek（默认）/ OpenAI / Qwen（可切换）
- 数据库：MySQL（生产建议）或 SQLite（本地快速运行）

## 3. 本地启动操作说明（Windows PowerShell）

### 3.0 运行环境条件（先检查这些）

必需环境（本地开发）：
- Python `3.11+`（建议 3.11 或 3.12）
- Node.js `18+`（建议 LTS）
- npm `9+`
- PowerShell（Windows 场景）
- 可访问互联网（用于安装依赖和调用大模型 API）

可选环境（按需）：
- MySQL `8.0+`（生产建议；本地可用 SQLite）
- Redis `7+`（如需缓存能力）
- Docker Desktop + Docker Compose（如需容器一键部署）

建议端口占用情况：
- `8000`：后端 FastAPI
- `5173`：前端 Vite
- `3306`：MySQL（可选）
- `6379`：Redis（可选）

可先执行以下命令自检：
```powershell
python --version
node -v
npm -v
docker --version
docker compose version
```

### 3.1 准备环境
1. 安装 Python 3.11+
2. 安装 Node.js 18+
3. 进入项目根目录：
```powershell
cd c:\Users\Administrator\Desktop\zhishen-dun
```
4. 复制环境变量模板：
```powershell
Copy-Item .env.example .env
```

### 3.1.1 一键启动（推荐）
在项目根目录执行一条命令即可同时启动前端和后端：
```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```
如果你已经安装好依赖，想跳过 `pip install` 和 `npm install`：
```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1 -SkipInstall
```

### 3.2 配置 AI（以 DeepSeek 为例）
打开 `.env`，至少确认以下配置：
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=你的_deepseek_key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```
如果没配 Key，系统会自动回退到本地启发式语义分析（仍可运行）。

### 3.3 启动后端（终端 1）
```powershell
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
后端启动成功后可访问：
- 健康检查：`[REDACTED]`
- API 文档：`[REDACTED]`

### 3.4 启动前端（终端 2）
```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
前端启动成功后访问：
- MVP 页面：`[REDACTED]`

## 4. 一键容器启动（可选）
```bash
docker-compose up --build
```
默认端口：
- 前端：`[REDACTED]`
- 后端：`[REDACTED]`

## 5. 前端功能说明（你在页面上能做什么）
- 登录/注册
  - 新建账号并登录，登录后可保存和查看个人报告
- 文本检测
  - 输入任意文本，执行规则检测 + AI语义分析 + 可选脱敏
- 文件检测
  - 上传 PDF / DOCX / XLSX / TXT 并自动检测
- 风险结果展示
  - 显示综合风险等级、命中规则、语义评分、原文与脱敏对比
- 报告统计
  - 展示总报告数、高/中/低风险分布图
- 报告历史与详情
  - 查询历史报告，按报告 ID 查看详情

## 6. 后端功能说明（系统如何工作）

### 6.1 文件处理模块
- 验证文件类型和大小
- 支持解析：Word/PDF/Excel/TXT
- 提取文本供后续检测

### 6.2 规则检测模块
- 基于正则表达式识别敏感内容
- 已覆盖：身份证号、手机号、邮箱、学号、工号、API Key、Token、密码字段

### 6.3 AI语义分析模块
- 判断语义风险（未公开科研资料、学生隐私、内部信息泄露等）
- 支持 DeepSeek / OpenAI / Qwen 切换
- API 调用失败或无 Key 时，自动回退本地启发式分析

### 6.4 脱敏模块
- 手机号中间位隐藏
- 身份证中间位隐藏
- 邮箱用户名脱敏
- Token/API Key 替换
- 高风险段落标记

### 6.5 报告模块
- 生成检测报告（风险等级、规则命中、语义结果、统计数据）
- 保存报告历史并支持查询
- 提供统计汇总接口

### 6.6 用户管理模块
- 用户注册/登录（JWT）
- 当前用户信息获取
- 报告按用户隔离访问

### 6.7 API版本与扩展
- `v1`：当前业务主接口
- `v2`：能力预留接口（版本扩展入口）

## 7. 主要后端接口
- `POST /api/v1/auth/register` 用户注册
- `POST /api/v1/auth/login` 用户登录（返回 JWT）
- `GET /api/v1/auth/me` 当前用户信息
- `POST /api/v1/scan/text` 文本检测
- `POST /api/v1/scan/file` 文件检测
- `POST /api/v1/scan/batch` 批量文本检测
- `GET /api/v1/reports` 报告历史列表
- `GET /api/v1/reports/{report_id}` 报告详情
- `GET /api/v1/reports/stats/summary` 报告统计汇总

## 8. 常见问题
- 打开 `[REDACTED]` 显示拒绝连接：
  - 前端默认端口是 `5173`，请访问 `[REDACTED]`
- `/docs` 页面有旧文案：
  - 请 `Ctrl + F5` 强制刷新，或清浏览器缓存
- 未配置 AI Key 是否能运行：
  - 可以，系统会降级到本地语义分析

## 9. 项目结构
```text
zhishen-dun/
├── frontend/      # 前端项目（MVP工作台）
├── backend/       # FastAPI 后端
├── ai_module/     # AI 模块与提示词模板
├── database/      # SQL 脚本
├── docs/          # 其他文档
└── tests/         # 测试
```
