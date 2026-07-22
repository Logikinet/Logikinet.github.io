---
title: Aether
summary: Aether —— 个人多智能体工作流平台
source: github
repoLabel: Logikinet/Aether
language: TypeScript
stars: 0
syncedAt: "2026-07-22"
isPrivateRepo: false
topics: []
---
# Aether

自托管多 Agent 工作台（本地版）

A fully local, self-hosted multi-agent workbench. Fixed workflow: **Plan → Research → Execute → Review**, with HITL approval, artifact storage, and configurable models.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What you get (no limits, fully local)

- Projects linked to local git repos (or current dir)
- Todos with layered execution: Plan → Confirm → Build → Review → Merge
- Multiple agents (Chief, Planner, Builder, Reviewer, custom)
- Multiple providers: Ollama (local), OpenAI, Anthropic, Google
- Git worktrees for safe isolated execution
- Conversation + steerable steps
- All features unlocked forever

## First run

On first load it auto-creates:
- A "Personal" team
- A "Local Machine"
- Four starter agents

## Configure models

Go to /app/agents

For pure local:
1. Install Ollama
2. `ollama pull llama3` (or codellama, qwen2.5-coder, etc.)
3. Add agent with provider "ollama"

For cloud:
- Paste API keys when creating agents (stored only in your local data/store.json)

## Architecture notes

This implementation realizes the Aether vision using a local-first approach:

- Step kinds: plan, implement, review, chief + revisions
- Worktrees at `.workspaces/conv-*`
- Branch naming `tds/conv-*` (or configurable)
- Agent assignment per step
- Tools: shell, repo ops, push, web fetch

Data lives in `data/store.json`. Worktrees in `.workspaces/`.

No cloud, no accounts, no machine limits, no paid tiers.

## Run

```bash
npm run dev
```

## License

Private / unspecified.
