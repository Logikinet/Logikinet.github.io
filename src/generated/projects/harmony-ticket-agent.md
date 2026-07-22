# Harmony Ticket Agent

[English](./README.md) | [简体中文](./README.zh-CN.md)

Harmony Ticket Agent is a HarmonyOS-based AI assistant for compliant ticket planning, sandbox execution, device collaboration, and privacy-aware task review.

It turns a natural-language ticket request into a structured task, generates an explainable strategy, runs the workflow inside a self-built sandbox, and keeps sensitive real-world actions behind clear compliance boundaries.

## Highlights

- AI ticket planning from natural language
- Explainable primary and backup ticket strategies
- Sandbox queue, stock, and mock order simulation
- Xiaoyi/Skill/MCP-ready tool gateway
- Multi-device status and failover demonstration
- Risk guard for payment, captcha, real submission, and high-frequency actions
- AI-generated task recap with DeepSeek and mock fallback

## Product Flow

```text
User input
  -> TicketPlanSkill
  -> DeepSeek intent parsing
  -> Strategy generation
  -> Sandbox execution
  -> Device collaboration / failover
  -> Risk guard
  -> AI report
```

## Architecture

```text
HarmonyOS App
  Chat / Task / Strategy / Sandbox / Device / Report pages

AI & Skill Backend
  DeepSeek proxy, TicketPlanSkill, planner, report generator

Sandbox & Collaboration
  Stock simulator, task status timeline, device cluster, failover

Safety Layer
  Compliance policy, sensitive action blocking, mock fallback
```

## Repository Layout

```text
harmony_ticket_agent/
├─ entry/                         # HarmonyOS app module
├─ ticket-agent-server/           # AI, Skill, sandbox and device backend
│  ├─ src/ai/                     # DeepSeek client and output normalization
│  ├─ src/skill/                  # TicketPlanSkill orchestration
│  ├─ src/agent/                  # Strategy and report services
│  ├─ src/sandbox/                # Sandbox ticket workflow
│  ├─ src/device/                 # Device cluster and failover
│  ├─ src/risk/                   # Compliance risk guard
│  ├─ src/routes/                 # REST APIs
│  └─ docs/                       # API contracts and integration templates
└─ docs/                          # Project workstream documents
```

## Tech Stack

- HarmonyOS / ArkTS / ArkUI
- Node.js / TypeScript / Express
- DeepSeek API
- REST JSON API
- Skill Gateway and MCP metadata endpoint

## Quick Start

### Start Backend

```bash
cd ticket-agent-server
npm install
npm run dev
```

Health check:

```bash
curl [REDACTED]
```

### Run HarmonyOS App

Open the repository in DevEco Studio, build the `entry` module, and run it on an emulator or device.

For device testing, make sure the backend is reachable from the device network. In `.env`, `SERVER_HOST=0.0.0.0` is recommended.

## Configuration

Create `ticket-agent-server/.env` from `ticket-agent-server/.env.example`.

Key settings:

- `SERVER_HOST`
- `SERVER_PORT`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`
- `DEMO_MODE`
- `ENABLE_MOCK_FALLBACK`

The backend uses mock fallback when the model is unavailable, so the main demo flow remains stable.

## Main APIs

Recommended entry for assistant integration:

```text
POST /api/skill/xiaoyi/dispatch
```

Core Skill endpoints:

```text
POST /api/skill/parse-ticket-intent
POST /api/skill/generate-ticket-plan
POST /api/skill/create-ticket-task
POST /api/skill/execute-sandbox-plan
POST /api/skill/check-risk-action
POST /api/skill/generate-task-report
GET  /api/skill/manifest
GET  /api/skill/logs
```

MCP metadata:

```text
GET /mcp/tools
```

## Demo Scenario

1. Enter a request such as: "Plan two inner-field concert tickets in Shanghai this Saturday, budget under 1200, use front-row stand seats as backup."
2. The system parses it into a structured ticket task.
3. The planner returns a primary strategy and backup strategy.
4. The sandbox simulates queueing, stock selection, and mock order creation.
5. The device panel shows online devices and failover state.
6. Risk guard blocks real payment, captcha bypass, and real order submission.
7. The report page summarizes the result and next-step suggestions.

## Documentation

- API contract: `ticket-agent-server/docs/api-contract.md`
- Prompt notes: `ticket-agent-server/docs/prompt-notes.md`
- Skill/MCP examples: `ticket-agent-server/docs/skill-mcp-call-examples.md`
- Xiaoyi template: `ticket-agent-server/docs/xiaoyi-skill-config-template.md`

## Compliance

This project does not automate real ticket purchases. It does not call private ticket platform APIs, bypass captcha, submit real orders, or perform payments. Automation is limited to the sandbox environment.

## Status

The backend Skill gateway, Xiaoyi entry, DeepSeek integration, sandbox simulation, risk guard, and integration documents are implemented and ready for project-level integration testing.

## License

No explicit license file is currently provided.

## Private mirror release

This GitHub repository is a private mirror prepared from the user-controlled Gitee repository. No full build or runtime verification was completed in this release workflow. Please follow the existing project documentation and dependency manifests for setup. Author: 王子健. GitHub: Logikinet.
