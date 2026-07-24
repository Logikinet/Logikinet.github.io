# AI Output Formatter（网站端）

打开即用的文档工作台：

**文本整理 + Markdown 阅读 + Word 排版 + LaTeX 排版 + Pandoc 文档转换**

- 无需登录、无需安装；基础能力完全在浏览器本地运行
- 深度 AI 改写与 Document Conversion Service 为可选能力
- 未配置转换服务时，现有文本整理与本地 Word/LaTeX 仍完整可用
- 支持根路径与子路径静态部署（GitHub Pages / AquaLeap `/tools/ai-output-formatter/` 等）

## 功能域

| 域 | 能力 |
|---|---|
| 文本整理 | 场景清洗、Markdown 预览、差异、历史、导出 |
| Word 文档 | DOCX 导入、大纲、中文论文样式、DOCX 导出 |
| LaTeX 排版 | 模板、源码、KaTeX 预览、BibTeX、工程 ZIP、可选在线编译 |
| Pandoc 转换 | 白名单格式矩阵、YAML、reference.docx、批量、任务状态 |

任务进度见 [`TASK_STATUS.md`](./TASK_STATUS.md)。转换服务见 [`services/document-converter/README.md`](./services/document-converter/README.md)。

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

# 可选：独立文档转换服务（Pandoc / XeLaTeX）
VITE_DOCUMENT_SERVICE_URL=https://your-converter.example.com
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
src/engine/document-model/  统一 DocumentModel（MD/HTML/DOCX/LaTeX）
src/engine/word/            Word 样式、导入、DOCX 导出
src/engine/latex/           模板、转义、BibTeX、ZIP
src/engine/                 预处理、场景、diff、导入导出（原有）
src/features/*              文本工作台 + Word/LaTeX/Pandoc 文档域
services/document-converter 可选 Pandoc/TeX 服务（Docker）
src/storage/                IndexedDB（aof: / aof:word: / aof:latex: / aof:pandoc:）
```

整理 / 本地去 AI 味 / 深度 AI 改写三者严格分离。`format-only` 不改措辞。文档域按需懒加载。

## 隐私

- 本地功能不上传正文（文本整理、基础 DOCX、LaTeX 编辑与 ZIP）
- 历史仅存当前浏览器 IndexedDB；不默认保存完整原文件
- Pandoc / 在线 LaTeX 仅在确认后临时上传到自建转换服务，任务结束删除
- API Key / 服务 Token 默认仅会话使用，不进历史 / 日志 / 导出
- 详见应用内「隐私说明」与 `docs/privacy.md`

## 许可证与第三方

见 `THIRD_PARTY_NOTICES.md`。

## 任务进度

见 `TASK_STATUS.md` 与 `AI-Output-Formatter-Website-Tickets.md`。
