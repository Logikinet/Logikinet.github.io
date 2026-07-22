/**
 * 同步仓库元数据 + README → src/generated/projects/
 *
 * 环境变量：
 *   PROJECTS_READ_TOKEN  私有仓只读（Contents + Metadata），禁止写入；勿打印到日志
 *   GITHUB_TOKEN         公开请求回退
 *   GITHUB_USER          默认 Logikinet
 *   SYNC_SKIP_REMOTE=1   跳过网络，保留缓存
 *
 * 失败策略：
 *   - Token 缺失：公开仓继续同步；私有仓保留已有 generated 缓存
 *   - API 失败：保留该项目上一次安全生成结果，不使进程失败退出
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "src/generated/projects");
const catalogPath = path.join(root, "src/data/projects/catalog.ts");

const GITHUB_USER = process.env.GITHUB_USER || "Logikinet";
const HAS_PROJECTS_TOKEN = Boolean(process.env.PROJECTS_READ_TOKEN);
const TOKEN =
  process.env.PROJECTS_READ_TOKEN ||
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  "";
const SKIP_REMOTE = process.env.SYNC_SKIP_REMOTE === "1";

/** 不自动收录的公开仓库（工具/泄露/站点本身） */
const DISCOVER_BLOCKLIST = new Set([
  "Logikinet.github.io",
  "system_prompts_leaks",
  "Codex-5.5-codex-instruct-5.5",
]);

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

// 敏感扫描：避免把版本号误判为 IP
const SECRET_PATTERNS = [
  { name: "github_token", re: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g },
  { name: "github_pat", re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { name: "openai_key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "aws_key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  {
    name: "kv_secret",
    re: /(?<=(?:api[_-]?key|token|password|secret|authorization)\s*[:=]\s*)["'][^"'\n]{8,}["']/gi,
  },
  { name: "win_path", re: /C:\\\\Users\\\\[^\s"'`]+/gi },
  { name: "unix_home", re: /\/Users\/[A-Za-z0-9._-]+(?:\/[^\s"'`]*)?/g },
  {
    name: "private_ip_url",
    re: /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(?::\d+)?[^\s)'"`]*/gi,
  },
];

function scanSecrets(text) {
  const hits = [];
  for (const { name, re } of SECRET_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(text)) hits.push(name);
  }
  return hits;
}

function redactSecrets(md) {
  let out = md;
  for (const { re } of SECRET_PATTERNS) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

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

async function loadCache() {
  /** @type {Map<string, {json?: object, md?: string}>} */
  const cache = new Map();
  try {
    const files = await fs.readdir(outDir);
    for (const f of files) {
      if (f === "_index.json") continue;
      const id = f.replace(/\.(json|md)$/, "");
      if (!cache.has(id)) cache.set(id, {});
      const entry = cache.get(id);
      const full = path.join(outDir, f);
      if (f.endsWith(".json")) {
        entry.json = JSON.parse(await fs.readFile(full, "utf8"));
      } else if (f.endsWith(".md")) {
        entry.md = await fs.readFile(full, "utf8");
      }
    }
  } catch {
    /* empty */
  }
  return cache;
}

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (res.status === 404) return { ok: false, status: 404, data: null };
  if (!res.ok) {
    await res.text().catch(() => "");
    // 绝不把 Token / 完整响应体打到日志
    throw new Error(`GitHub HTTP ${res.status} (${url.split("?")[0]})`);
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
    repos.push(...data.filter((r) => !r.fork && !DISCOVER_BLOCKLIST.has(r.name)));
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

async function restoreCache(id, cache) {
  const c = cache.get(id);
  if (!c) return false;
  if (c.json) await writeJson(id, c.json);
  if (c.md) await writeMd(id, c.md);
  return Boolean(c.json || c.md);
}

async function main() {
  console.log("AquaLeap sync-projects → src/generated/projects/");
  console.log(
    `  user=${GITHUB_USER} projects_token=${HAS_PROJECTS_TOKEN ? "yes" : "no"} auth=${TOKEN ? "yes" : "no"} skip=${SKIP_REMOTE}`,
  );

  const cache = await loadCache();
  await fs.mkdir(outDir, { recursive: true });

  // 先备份缓存内容到内存，再清空目录中将重写的文件
  const catalog = await parseCatalog();
  const now = new Date().toISOString();
  const projectIds = [];
  const discovered = [];
  const report = {
    synced: [],
    cached: [],
    readmeBlocked: [],
    privateSkippedNoToken: [],
    errors: [],
  };

  // 清空后按结果重写；失败则 restore
  for (const f of await fs.readdir(outDir).catch(() => [])) {
    if (f.endsWith(".json") || f.endsWith(".md")) {
      await fs.unlink(path.join(outDir, f)).catch(() => {});
    }
  }

  if (!SKIP_REMOTE) {
    try {
      const publicRepos = await fetchPublicRepos();
      console.log(`  public repos: ${publicRepos.length}`);
      for (const r of publicRepos) {
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
      console.warn("  list public failed (using empty discovered):", e.message);
    }
  }

  const targets = new Map();

  for (const c of catalog) {
    if (!c.syncMetadata || !c.repositoryOwner || !c.repositoryName) {
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
              readmeSource: "local",
              ...(c.exposeRepositoryUrl && c.repositoryUrl
                ? { repositoryUrl: c.repositoryUrl }
                : {}),
            });
            projectIds.push(c.id);
            report.synced.push({ id: c.id, readme: "local" });
            console.log(`  ✓ local ${c.id}`);
          } else {
            report.readmeBlocked.push({ id: c.id, reasons: hits });
            console.warn(`  ⚠ local secret scan ${c.id}: ${hits.join(",")}`);
          }
        } catch {
          if (await restoreCache(c.id, cache)) {
            projectIds.push(c.id);
            report.cached.push(c.id);
          }
        }
      }
      continue;
    }

    targets.set(
      `${c.repositoryProvider}:${c.repositoryOwner}/${c.repositoryName}`.toLowerCase(),
      c,
    );
  }

  // 仅收录 catalog 中未覆盖、且不在 blocklist 的公开仓
  for (const d of discovered) {
    const key = `github:logikinet/${d.name}`.toLowerCase();
    if (targets.has(key)) continue;
    if (DISCOVER_BLOCKLIST.has(d.name)) continue;
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
      console.warn(`  skip provider ${c.repositoryProvider}`);
      continue;
    }
    if (SKIP_REMOTE) {
      if (await restoreCache(c.id, cache)) {
        projectIds.push(c.id);
        report.cached.push(c.id);
      }
      continue;
    }

    const owner = c.repositoryOwner;
    const name = c.repositoryName;
    const isPrivateCatalog = c.repositoryStatus === "private";

    if (isPrivateCatalog && !HAS_PROJECTS_TOKEN && !TOKEN) {
      console.log(`  private ${owner}/${name}: no token → cache`);
      report.privateSkippedNoToken.push(c.id);
      if (await restoreCache(c.id, cache)) {
        projectIds.push(c.id);
        report.cached.push(c.id);
      }
      continue;
    }

    // 私有仓优先要求 PROJECTS_READ_TOKEN（有 GITHUB_TOKEN 也可试）
    if (isPrivateCatalog && !HAS_PROJECTS_TOKEN && TOKEN) {
      console.log(`  private ${owner}/${name}: using fallback token`);
    }

    try {
      const { ok, data: repo } = await fetchRepo(owner, name);
      if (!ok || !repo) {
        console.warn(`  not found ${owner}/${name} → cache`);
        if (await restoreCache(c.id, cache)) {
          projectIds.push(c.id);
          report.cached.push(c.id);
        }
        continue;
      }

      const isPrivate = Boolean(repo.private);
      const expose = Boolean(c.exposeRepositoryUrl);
      const allowReadmeBody = isPrivate ? Boolean(c.readmePublicSafe) : Boolean(c.readmePublicSafe !== false);

      let readmeIncluded = false;
      let securityScanPassed = false;
      let readmeSource = "none";

      if (allowReadmeBody) {
        const raw = await fetchReadmeRaw(owner, name);
        if (raw) {
          const hits = scanSecrets(raw);
          if (hits.length) {
            console.warn(`  ⚠ secret scan ${owner}/${name}: ${hits.join(",")}`);
            report.readmeBlocked.push({ id: c.id, reasons: hits });
            // 尝试缓存旧 md
            const prev = cache.get(c.id);
            if (prev?.md) {
              await writeMd(c.id, prev.md);
              readmeIncluded = true;
              securityScanPassed = true;
              readmeSource = "cache";
              console.log(`  · kept cached README ${c.id}`);
            }
          } else {
            securityScanPassed = true;
            await writeMd(c.id, redactSecrets(raw));
            readmeIncluded = true;
            readmeSource = "remote";
            console.log(`  ✓ README ${owner}/${name}`);
          }
        }
      } else if (isPrivate) {
        console.log(`  · private README not public-safe ${owner}/${name}`);
      }

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
        readmeSource,
      };
      if (expose && repo.html_url) meta.repositoryUrl = repo.html_url;

      await writeJson(c.id, meta);
      projectIds.push(c.id);
      report.synced.push({ id: c.id, readme: readmeSource });
    } catch (e) {
      console.warn(`  error ${owner}/${name}: ${e.message} → cache`);
      report.errors.push({ id: c.id, message: e.message });
      if (await restoreCache(c.id, cache)) {
        projectIds.push(c.id);
        report.cached.push(c.id);
      }
    }
  }

  const index = {
    generatedAt: now,
    githubUser: GITHUB_USER,
    projectIds: [...new Set(projectIds)],
    discovered,
    report,
  };
  await fs.writeFile(path.join(outDir, "_index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");

  console.log(`  done: synced=${report.synced.length} cached=${report.cached.length} blocked=${report.readmeBlocked.length}`);
  // 始终 exit 0 — 不因单仓失败中断构建
  process.exitCode = 0;
}

main().catch((e) => {
  console.error("sync fatal (will not fail build if cache exists):", e.message);
  process.exitCode = 0;
});
