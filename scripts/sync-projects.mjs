/**
 * 同步仓库元数据 + README → src/generated/projects/
 *
 * 环境变量：
 *   PROJECTS_READ_TOKEN  私有仓只读 Token（Contents + Metadata），禁止写入
 *   GITHUB_TOKEN         回退（公开请求可用）
 *   GITHUB_USER          默认 Logikinet
 *   SYNC_SKIP_REMOTE=1   跳过网络
 *
 * 输出（不含 Token / 响应头）：
 *   src/generated/projects/_index.json
 *   src/generated/projects/<id>.json
 *   src/generated/projects/<id>.md   （仅通过安全扫描且允许公开的 README）
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "src/generated/projects");
const catalogPath = path.join(root, "src/data/projects/catalog.ts");

const GITHUB_USER = process.env.GITHUB_USER || "Logikinet";
const TOKEN =
  process.env.PROJECTS_READ_TOKEN ||
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  "";
const SKIP_REMOTE = process.env.SYNC_SKIP_REMOTE === "1";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "aqualeap-sync-projects",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SECRET_PATTERNS = [
  /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /(?<=(?:api[_-]?key|token|password|secret|authorization)\s*[:=]\s*)["'][^"'\n]{8,}["']/gi,
  /C:\\\\Users\\\\[^\s"'`]+/gi,
  /\/Users\/[^\s"'`/]+/g,
  /\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)[^\s)'"`]*/gi,
];

function scanSecrets(text) {
  const hits = [];
  for (const re of SECRET_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(text)) hits.push(String(re));
  }
  return hits;
}

function redactSecrets(md) {
  let out = md;
  for (const re of SECRET_PATTERNS) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

/** 轻量解析 catalog.ts */
async function parseCatalog() {
  const src = await fs.readFile(catalogPath, "utf8");
  const items = [];
  const blocks = src.split(/\{\s*\n\s*id:\s*"/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^"]+)"/)?.[1];
    if (!id) continue;
    const field = (k) => block.match(new RegExp(`${k}:\\s*"([^"]*)"`))?.[1];
    const bool = (k, d = false) => {
      const m = block.match(new RegExp(`${k}:\\s*(true|false)`));
      return m ? m[1] === "true" : d;
    };
    items.push({
      id,
      title: field("title") || id,
      repositoryOwner: field("repositoryOwner"),
      repositoryName: field("repositoryName"),
      repositoryUrl: field("repositoryUrl"),
      repositoryProvider: field("repositoryProvider") || "github",
      repositoryStatus: field("repositoryStatus") || "private",
      exposeRepositoryUrl: bool("exposeRepositoryUrl", false),
      readmeSource: field("readmeSource") || "none",
      readmePublicSafe: bool("readmePublicSafe", false),
      syncMetadata: bool("syncMetadata", false),
      localReadmePath: field("localReadmePath"),
    });
  }
  return items;
}

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (res.status === 404) return { ok: false, status: 404, data: null };
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status}: ${text.slice(0, 180)}`);
  }
  return { ok: true, status: res.status, data: await res.json() };
}

async function fetchPublicRepos() {
  const repos = [];
  let page = 1;
  while (page <= 5) {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&type=public&sort=updated`;
    const { ok, data } = await ghJson(url);
    if (!ok || !Array.isArray(data) || !data.length) break;
    repos.push(...data.filter((r) => !r.fork));
    if (data.length < 100) break;
    page++;
  }
  return repos;
}

async function fetchRepo(owner, name) {
  return ghJson(`https://api.github.com/repos/${owner}/${name}`);
}

async function fetchReadmeRaw(owner, name) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers: { ...headers, Accept: "application/vnd.github.raw" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.warn(`  README HTTP ${res.status} ${owner}/${name}`);
    return null;
  }
  return res.text();
}

async function writeJson(id, obj) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, `${id}.json`), JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function writeMd(id, body) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, `${id}.md`), body.trim() + "\n", "utf8");
}

async function main() {
  console.log("AquaLeap sync-projects → src/generated/projects/");
  console.log(
    `  user=${GITHUB_USER} token=${TOKEN ? "yes" : "no"} skip=${SKIP_REMOTE}`,
  );

  await fs.mkdir(outDir, { recursive: true });
  // 清理旧生成物（保留目录）
  for (const f of await fs.readdir(outDir)) {
    if (f.endsWith(".json") || f.endsWith(".md")) {
      await fs.unlink(path.join(outDir, f));
    }
  }

  const catalog = await parseCatalog();
  const now = new Date().toISOString();
  const projectIds = [];
  const discovered = [];

  if (!SKIP_REMOTE) {
    try {
      const publicRepos = await fetchPublicRepos();
      console.log(`  public repos: ${publicRepos.length}`);
      for (const r of publicRepos) {
        if (r.name === "Logikinet.github.io") continue;
        discovered.push({
          id: slugify(r.name),
          name: r.name,
          description: r.description || "",
          htmlUrl: r.html_url,
          language: r.language,
          topics: r.topics || [],
          pushedAt: r.pushed_at || "",
          stars: r.stargazers_count || 0,
        });
      }
    } catch (e) {
      console.warn("  list public failed:", e.message);
    }
  }

  /** @type {Map<string, any>} */
  const targets = new Map();

  for (const c of catalog) {
    if (!c.syncMetadata || !c.repositoryOwner || !c.repositoryName) {
      // 本地说明不生成远程 meta；可复制 local 到 generated 若 public safe
      if (c.localReadmePath && c.readmePublicSafe) {
        try {
          const local = await fs.readFile(path.join(root, c.localReadmePath), "utf8");
          const body = local.replace(/^---[\s\S]*?---\s*/, "");
          const hits = scanSecrets(body);
          if (hits.length === 0) {
            await writeMd(c.id, redactSecrets(body));
            await writeJson(c.id, {
              id: c.id,
              name: c.title,
              description: "",
              repositoryProvider: c.repositoryProvider,
              repositoryOwner: c.repositoryOwner || "",
              repositoryName: c.repositoryName || "",
              repositoryStatus: c.repositoryStatus,
              defaultBranch: "",
              language: null,
              topics: [],
              stars: 0,
              forks: 0,
              homepage: null,
              pushedAt: null,
              syncedAt: now,
              readmeIncluded: true,
              readmePublicSafe: true,
              securityScanPassed: true,
              ...(c.exposeRepositoryUrl && c.repositoryUrl
                ? { repositoryUrl: c.repositoryUrl }
                : {}),
            });
            projectIds.push(c.id);
            console.log(`  ✓ local README ${c.id}`);
          }
        } catch {
          console.log(`  · no local file ${c.id}`);
        }
      }
      continue;
    }

    targets.set(`${c.repositoryProvider}:${c.repositoryOwner}/${c.repositoryName}`.toLowerCase(), c);
  }

  for (const d of discovered) {
    const key = `github:logikinet/${d.name}`.toLowerCase();
    if (targets.has(key)) continue;
    targets.set(key, {
      id: d.id,
      title: d.name,
      repositoryOwner: GITHUB_USER,
      repositoryName: d.name,
      repositoryProvider: "github",
      repositoryStatus: "public",
      exposeRepositoryUrl: true,
      readmeSource: "github",
      readmePublicSafe: true,
      syncMetadata: true,
    });
  }

  for (const c of targets.values()) {
    if (c.repositoryProvider !== "github") {
      console.warn(`  skip provider ${c.repositoryProvider} ${c.id}`);
      continue;
    }
    if (SKIP_REMOTE) continue;

    const owner = c.repositoryOwner;
    const name = c.repositoryName;
    const isPrivateCatalog = c.repositoryStatus === "private";

    if (isPrivateCatalog && !TOKEN) {
      console.log(`  private ${owner}/${name}: need PROJECTS_READ_TOKEN`);
      continue;
    }

    try {
      const { ok, data: repo } = await fetchRepo(owner, name);
      if (!ok || !repo) {
        console.warn(`  not found ${owner}/${name}`);
        continue;
      }

      const isPrivate = Boolean(repo.private);
      const expose = Boolean(c.exposeRepositoryUrl);
      // 私有 README 仅当人工 readmePublicSafe=true 才写入构建产物
      const allowReadmeBody = isPrivate ? Boolean(c.readmePublicSafe) : true;

      let readmeIncluded = false;
      let securityScanPassed = false;

      if (allowReadmeBody) {
        const raw = await fetchReadmeRaw(owner, name);
        if (raw) {
          const hits = scanSecrets(raw);
          if (hits.length) {
            console.warn(`  ⚠ secret scan failed ${owner}/${name} — README not published`);
            securityScanPassed = false;
          } else {
            securityScanPassed = true;
            const cleaned = redactSecrets(raw);
            await writeMd(c.id, cleaned);
            readmeIncluded = true;
            console.log(`  ✓ README ${owner}/${name} → ${c.id}.md`);
          }
        } else {
          console.log(`  · empty README ${owner}/${name}`);
        }
      } else {
        console.log(`  · skip README body (not public-safe) ${owner}/${name}`);
      }

      /** @type {Record<string, unknown>} */
      const meta = {
        id: c.id,
        name: repo.name,
        description: repo.description || "",
        repositoryProvider: "github",
        repositoryOwner: owner,
        repositoryName: name,
        repositoryStatus: isPrivate ? "private" : "public",
        defaultBranch: repo.default_branch || "main",
        language: repo.language,
        topics: repo.topics || [],
        stars: isPrivate && !expose ? 0 : repo.stargazers_count || 0,
        forks: isPrivate && !expose ? 0 : repo.forks_count || 0,
        homepage: repo.homepage || null,
        pushedAt: repo.pushed_at || null,
        syncedAt: now,
        readmeIncluded,
        readmePublicSafe: allowReadmeBody && securityScanPassed,
        securityScanPassed,
      };

      if (expose && repo.html_url) {
        meta.repositoryUrl = repo.html_url;
      }

      await writeJson(c.id, meta);
      projectIds.push(c.id);
    } catch (e) {
      console.warn(`  error ${owner}/${name}:`, e.message);
    }
  }

  const index = {
    generatedAt: now,
    githubUser: GITHUB_USER,
    projectIds: [...new Set(projectIds)],
    discovered,
  };
  await fs.writeFile(path.join(outDir, "_index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");
  console.log(`  wrote ${outDir} (${projectIds.length} projects)`);
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
