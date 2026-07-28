/**
 * List Logikinet GitHub repos not yet in project-repositories.ts
 *
 * Usage:
 *   GITHUB_TOKEN=$(gh auth token) npm run sync:discover
 *   # or: gh auth token | …  (script uses gh when available)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mapPath = path.join(root, "src/data/project-repositories.ts");

const SKIP_NAMES = new Set([
  "logikinet.github.io",
  "codex-5.5-codex-instruct-5.5",
  "system_prompts_leaks",
]);

function mappedRepos() {
  const src = fs.readFileSync(mapPath, "utf8");
  const set = new Set();
  for (const m of src.matchAll(/repository:\s*"Logikinet\/([^"]+)"/g)) {
    set.add(m[1].toLowerCase());
  }
  return set;
}

function fetchReposViaGh() {
  try {
    const raw = execSync(
      "gh repo list Logikinet --limit 100 --json name,isPrivate,isFork,description,url,updatedAt",
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return JSON.parse(raw);
  } catch (e) {
    console.error("gh repo list failed:", e.message);
    console.error("Install GitHub CLI and run: gh auth login");
    process.exit(1);
  }
}

const mapped = mappedRepos();
const repos = fetchReposViaGh();

const unmapped = [];
const forks = [];
const skipped = [];

for (const r of repos) {
  const key = r.name.toLowerCase();
  if (SKIP_NAMES.has(key)) {
    skipped.push(r);
    continue;
  }
  if (r.isFork) {
    forks.push(r);
    continue;
  }
  if (!mapped.has(key)) unmapped.push(r);
}

console.log("AquaLeap project discover\n");
console.log(`Mapped in project-repositories.ts: ${mapped.size}`);
console.log(`GitHub owner repos (non-skip): ${repos.length - skipped.length}`);
console.log(`Unmapped originals: ${unmapped.length}`);
console.log(`Forks (ignored): ${forks.length}`);
console.log(`Site/skip list: ${skipped.length}\n`);

if (unmapped.length === 0) {
  console.log("✓ No unmapped original repositories.");
} else {
  console.log("— Unmapped (consider adding to catalog + project-repositories) —\n");
  for (const r of unmapped) {
    const vis = r.isPrivate ? "private" : "public";
    const desc = (r.description || "").replace(/\s+/g, " ").slice(0, 80);
    console.log(`  ${r.name}  [${vis}]`);
    console.log(`    ${r.url}`);
    if (desc) console.log(`    ${desc}`);
    console.log(`    updated: ${r.updatedAt?.slice(0, 10) ?? "?"}`);
    console.log("");
  }
}

if (forks.length) {
  console.log("— Forks (not catalogued by default) —");
  for (const r of forks) console.log(`  ${r.name}`);
}
