# AI Output Formatter（网站端）

打开即用的单页文本整理工具：粘贴 AI 输出 → 选择场景 → **浏览器本地**清洗与排版 → 查看差异 → 复制或导出。

- 无需登录、无需安装、无需本地 Agent、无需启动后端
- 基础整理完全本地运行；深度 AI 改写为可选能力
- 支持根路径与子路径静态部署（Vercel / Netlify / Cloudflare Pages / GitHub Pages / 普通静态服务器 / Astro 子路径挂载）

## 开发

```bash
npm install
npm run dev
```

## 质量脚本

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e   # 需先 build；会启动 preview
```

| 脚本 | 说明 |
|---|---|
| `dev` | 本地开发 |
| `lint` | ESLint |
| `typecheck` | TypeScript 工程引用检查 |
| `test` | Vitest 单元 / 回归 |
| `test:e2e` | Playwright 端到端 |
| `build` | 静态产物到 `dist/` |
| `preview` | 预览构建结果 |

## 环境变量

复制 `.env.example` 为 `.env`（不要提交密钥）：

```bash
# 子路径部署，例如：
VITE_BASE_PATH=/tools/ai-output-formatter/
```

## 部署

### 根路径

```bash
npm run build
# 将 dist/ 发布到任意静态托管
```

### 子路径（示例 `/tools/ai-output-formatter/`）

```bash
# Windows PowerShell
$env:VITE_BASE_PATH="/tools/ai-output-formatter/"; npm run build
```

```bash
# bash
VITE_BASE_PATH=/tools/ai-output-formatter/ npm run build
```

托管侧需配置 SPA fallback 到 `index.html`，并保证静态资源在同一 base 下可访问。

### 平台示例

- **Vercel / Netlify / Cloudflare Pages**：构建命令 `npm run build`，输出目录 `dist`
- **GitHub Pages**：设置 `VITE_BASE_PATH` 为仓库子路径，开启 SPA 404→index 规则
- **Astro 个人站**：可将 `dist` 内容拷贝到 `public/tools/ai-output-formatter/`，或以子域独立托管本 Vite 应用

## 架构摘要

```
src/engine/     预处理、解析、保护、生成、场景、去 AI 味、diff、校验、导入导出
src/features/   工作台状态、AI Provider
src/storage/    IndexedDB（历史 / 草稿 / 设置 / 模板）
src/workers/    长文本格式化 Worker
src/components/ UI
```

整理 / 本地去 AI 味 / 深度 AI 改写三者严格分离。`format-only` 不改措辞。

## 隐私

- 默认不上传正文
- 历史仅存当前浏览器 IndexedDB
- API Key 默认仅会话内存，不进历史 / 日志 / 导出
- 详见应用内「隐私说明」与 `docs/privacy.md`

## 许可证与第三方

见 `THIRD_PARTY_NOTICES.md`。

## 任务进度

见 `TASK_STATUS.md` 与 `AI-Output-Formatter-Website-Tickets.md`。
