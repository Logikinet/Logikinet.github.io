# todos.dev Workflow Clone

This is a minimal, working replica focused on the **exact agent assignment to task workflow** and layered execution (Plan → Confirm → Build).

## What it replicates exactly (from reverse engineering)
- Assign specific agent (role + model) to a todo.
- Start build with/without plan layer.
- Machine claims step via the real protocol.
- Plan step: streams plan, "Confirm Plan" gate.
- Build step: streams tool calls, edits, diffs, tests.
- Live streaming updates in UI.
- Uses your original CLI bundle as the executor (adapted).

Sources: CLI bundle (STEP_DEF, machine APIs, phases "planning"/"building", streaming), public todos.dev descriptions + X demos (sidebar, todo list with agent badges, plan document + confirm, live logs/diffs, local mirror hints), your partial .htm/screenshots/JS/CSS.

## Quick Start (self-contained demo)
1. Install: `cd todos-clone && npm install`
2. Run server: `node server.js` (listens on 3001)
3. Open UI: [REDACTED] (or serve the ui.html)
4. In UI:
   - See todos with current assignments.
   - Click a todo → assign agent (e.g. planner:claude-3-5-sonnet or builder:gpt).
   - "Start Build" (check "with plan").
5. The backend creates steps.
6. Run your adapted CLI against this server to execute:
   ```
   TDS_SERVER=[REDACTED] ./tds  # or node dist/index.js after adapting
   ```
   (The CLI will enroll as machine, claim the step, run plan (streams to UI), wait for confirm in UI, then build.)

The CLI bundle from your zip already has the full execution logic (plan/build phases, git worktree-like, tool calls, heartbeats, streaming).

## Adapting the CLI (your todos-dev-cli.zip)
The bundle supports custom server:
- `TDS_SERVER=[REDACTED] node dist/index.js` (or the tds binary)
- Or pass `--server [REDACTED]`

If you want a clean wrapper:
- Extract the zip.
- Create a small launcher that sets the env.
- (We can refine in later stages.)

When the CLI claims a "plan" step, it runs the planner using the assigned model and streams.
On confirm in UI, next claim gets the "implement" step for build.

## Current State
- Backend fully implements the machine protocol from the bundle + web APIs for assignment/start.
- UI is a basic but faithful recreation (sidebar, todo list, agent assignment, plan/build views, live SSE stream).
- Workflow is end-to-end runnable with the real CLI.

## Next (if you want to iterate)
- More faithful UI using your partial .htm/CSS (we inspected: streaming-caret, step-end, panel=todo:ID, "Confirm Plan" style).
- Better worktree simulation in demo.
- Full agent roster, Chief, mobile hints.
- Package as installable.

Run it and tell me what to refine to make the assignment + plan/build process feel *exactly* the same.
## GitHub 发布说明

### 项目名称
todos-clone

### 项目简介
AI Agent / Harness / Token 优化。此说明基于现有项目元数据整理，未对项目功能作未验证的承诺。

### 项目背景
历史项目的 GitHub 发布整理版本。

### 核心功能
AI/Agent 能力或工作流；Token/上下文或成本优化；服务端/API；前端交互

### 技术栈
Node.js/JavaScript

### 目录结构
- 请根据实际代码结构补充。

### 环境要求
请以项目内依赖清单和配置文件为准。

### 安装方法
根据对应依赖清单安装项目依赖；本轮未升级依赖。

### 运行方法
请依据项目现有入口和配置运行。当前未在本机完成完整运行验证。

### 使用说明
建议先阅读项目配置与入口文件，再按实际环境完成运行配置。

### 当前完成度
65/100（终审元数据评估）。

### 已知问题
完整运行验证、许可证和公开范围仍需人工确认。

### 后续计划
补充可复现 Demo、截图和测试说明。

### 作者信息
Logikinet

### GitHub
https://github.com/Logikinet

许可证待人工确认。
