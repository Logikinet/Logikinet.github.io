/**
 * 向 project-repositories 中 notifyEnabled 的仓库安装
 * templates/notify-aqualeap.yml → .github/workflows/notify-aqualeap.yml
 *
 * 需要：gh 已登录且具备 workflow 写权限。
 * 不设置 Secret（AQUALEAP_TRIGGER_TOKEN 须人工在各仓库配置）。
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "templates/notify-aqualeap.yml");
const mapPath = path.join(root, "src/data/project-repositories.ts");

function parseNotifyRepos() {
  const src = fs.readFileSync(mapPath, "utf8");
  const repos = [];
  const blocks = src.split(/\{\s*\n\s*projectId:\s*"/).slice(1);
  for (const block of blocks) {
    const repository = block.match(/repository:\s*"([^"]+)"/)?.[1];
    const notify = /notifyEnabled:\s*true/.test(block.split(/\n\s*\},/)[0] || block);
    if (repository && notify) repos.push(repository);
  }
  return repos;
}

function putWorkflow(repo, contentB64, sha) {
  const body = {
    message: "ci: add Notify AquaLeap workflow for README sync",
    content: contentB64,
    branch: undefined,
  };
  if (sha) body.sha = sha;
  const args = [
    "api",
    "-X",
    "PUT",
    `repos/${repo}/contents/.github/workflows/notify-aqualeap.yml`,
    "--input",
    "-",
  ];
  execFileSync("gh", args, {
    input: JSON.stringify(body),
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function getFileSha(repo) {
  try {
    const out = execFileSync(
      "gh",
      [
        "api",
        `repos/${repo}/contents/.github/workflows/notify-aqualeap.yml`,
        "--jq",
        ".sha",
      ],
      { encoding: "utf8" },
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

function getDefaultBranch(repo) {
  try {
    return execFileSync("gh", ["api", `repos/${repo}`, "--jq", ".default_branch"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "main";
  }
}

const template = fs.readFileSync(templatePath);
const contentB64 = template.toString("base64");
const repos = parseNotifyRepos();

console.log(`Installing notify workflow to ${repos.length} repos…`);
const results = { ok: [], fail: [] };

for (const repo of repos) {
  try {
    const branch = getDefaultBranch(repo);
    const sha = getFileSha(repo);
    const body = {
      message: "ci: add Notify AquaLeap workflow for README sync",
      content: contentB64,
      branch,
    };
    if (sha) body.sha = sha;
    execFileSync(
      "gh",
      [
        "api",
        "-X",
        "PUT",
        `repos/${repo}/contents/.github/workflows/notify-aqualeap.yml`,
        "--input",
        "-",
      ],
      { input: JSON.stringify(body), encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    );
    console.log(`  ✓ ${repo} (branch ${branch})`);
    results.ok.push({ repo, branch });
  } catch (e) {
    const msg = e.stderr?.toString?.() || e.message;
    console.warn(`  ✗ ${repo}: ${msg.slice(0, 200)}`);
    results.fail.push({ repo, error: msg.slice(0, 200) });
  }
}

console.log(
  JSON.stringify(
    {
      installed: results.ok,
      failed: results.fail,
      note: "Configure secret AQUALEAP_TRIGGER_TOKEN on each project repo (fine-grained PAT: actions:write on Logikinet.github.io).",
    },
    null,
    2,
  ),
);
