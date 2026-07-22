/**
 * 同步仓库元数据 + README → src/generated/projects/
 *
 * 环境变量：
 *   PROJECTS_READ_TOKEN  私有仓只读（勿打印）
 *   GITHUB_TOKEN         公开请求回退
 *   GITHUB_USER          默认 Logikinet
 *   SOURCE_REPOSITORY    可选 owner/name，优先同步
 *   SOURCE_SHA           可选触发提交
 *   SYNC_REASON          可选原因
 *   SYNC_SKIP_REMOTE=1   跳过网络
 *
 * 映射来源：src/data/project-repositories.ts（显式配置，禁止猜名）
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "src/generated/projects");
const repoMapPath = path.join(root, "src/data/project-repositories.ts");
const catalogPath = path.join(root, "src/data/projects/catalog.ts");

const GITHUB_USER = process.env.GITHUB_USER || "Logikinet";
const HAS_PROJECTS_TOKEN = Boolean(process.env.PROJECTS_READ_TOKEN);
const TOKEN =
  process.env.PROJECTS_READ_TOKEN ||
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  "";
const SKIP_REMOTE = process.env.SYNC_SKIP_REMOTE === "1";
const SOURCE_REPOSITORY = (process.env.SOURCE_REPOSITORY || "").trim();
const SOURCE_SHA = (process.env.SOURCE_SHA || "").trim();
const SYNC_REASON = (process.env.SYNC_REASON || "manual").trim();

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "aqualeap-sync-projects",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

/** 硬风险：阻断发布新 README，保留上一次安全版本 */
const HARD_SECRET_PATTERNS = [
  { name: "github_token", re: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g },
  { name: "github_pat", re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { name: "openai_key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "aws_key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  {
    name: "kv_secret",
    re: /(?<=(?:api[_-]?key|token|password|secret|authorization|cookie)\s*[:=]\s*)["'][^"'\n]{8,}["']/gi,
  },
  { name: "id_card_cn", re: /(?<!\d)\d{17}[\dXx](?!\d)/g },
  { name: "phone_cn", re: /(?<!\d)1[3-9]\d{9}(?!\d)/g },
];

/** 软风险：脱敏后仍允许发布（避免误杀整篇公开 README） */
const SOFT_SECRET_PATTERNS = [
  { name: "win_path", re: /C:\\\\Users\\\\[^\s"'`]+/gi },
  { name: "unix_home", re: /\/Users\/[A-Za-z0-9._-]+(?:\/[^\s"'`]*)?/g },
  {
    name: "private_ip_url",
    re: /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(?::\d+)?[^\s)'"`]*/gi,
  },
  { name: "student_id_hint", re: /学号\s*[:：]?\s*\d{6,}/g },
];

function scanPatterns(text, patterns) {
  const hits = [];
  for (const { name, re } of patterns) {
    re.lastIndex = 0;
    if (re.test(text)) hits.push(name);
  }
  return hits;
}

function redactSecrets(md) {
  let out = md;
  for (const { re } of [...HARD_SECRET_PATTERNS, ...SOFT_SECRET_PATTERNS]) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

/** 解析 project-repositories.ts 数组项 */
async function parseRepositoryMap() {
  const src = await fs.readFile(repoMapPath, "utf8");
  const items = [];
  const blocks = src.split(/\{\s*\n\s*projectId:\s*"/).slice(1);
  for (const block of blocks) {
    const projectId = block.match(/^([^"]+)"/)?.[1];
    if (!projectId) continue;
    const field = (k) => block.match(new RegExp(`${k}:\\s*"([^"]*)"`))?.[1];
    const bool = (k, d = false) => {
      const m = block.match(new RegExp(`${k}:\\s*(true|false)`));
      return m ? m[1] === "true" : d;
    };
    const repository = field("repository");
    if (!repository || !repository.includes("/")) continue;
    const [owner, name] = repository.split("/");
    items.push({
      projectId,
      repository,
      owner,
      name,
      provider: field("provider") || "github",
      visibility: field("visibility") || "private",
      defaultBranch: field("defaultBranch") || "main",
      exposeRepositoryUrl: bool("exposeRepositoryUrl", false),
      readmePublicSafe: bool("readmePublicSafe", false),
      syncReadme: bool("syncReadme", true),
      syncMetadata: bool("syncMetadata", true),
      notifyEnabled: bool("notifyEnabled", false),
    });
  }
  return items;
}

async function parseLocalReadmePaths() {
  try {
    const src = await fs.readFile(catalogPath, "utf8");
    const map = new Map();
    const blocks = src.split(/\{\s*\n\s*id:\s*"/).slice(1);
    for (const block of blocks) {
      const id = block.match(/^([^"]+)"/)?.[1];
      const p = block.match(/localReadmePath:\s*"([^"]+)"/)?.[1];
      if (id && p) map.set(id, p);
    }
    return map;
  } catch {
    return new Map();
  }
}

async function loadCache() {
  const cache = new Map();
  try {
    for (const f of await fs.readdir(outDir)) {
      if (f === "_index.json") continue;
      const id = f.replace(/\.(json|md)$/, "");
      if (!cache.has(id)) cache.set(id, {});
      const entry = cache.get(id);
      const full = path.join(outDir, f);
      if (f.endsWith(".json")) entry.json = JSON.parse(await fs.readFile(full, "utf8"));
      if (f.endsWith(".md")) entry.md = await fs.readFile(full, "utf8");
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
    throw new Error(`GitHub HTTP ${res.status}`);
  }
  return { ok: true, status: res.status, data: await res.json() };
}

async function fetchReadmeRaw(owner, name, ref) {
  const q = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${name}/readme${q}`,
    { headers: { ...headers, Accept: "application/vnd.github.raw" } },
  );
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

async function syncOne(cfg, cache, report, now, localPaths) {
  const { projectId: id, owner, name, visibility, exposeRepositoryUrl } = cfg;
  const isPrivate = visibility === "private";

  if (cfg.provider !== "github") {
    console.warn(`  skip non-github ${id}`);
    if (await restoreCache(id, cache)) report.cached.push(id);
    return;
  }

  if (isPrivate && !TOKEN) {
    console.log(`  private ${owner}/${name}: no token → cache`);
    report.privateSkippedNoToken.push(id);
    if (await restoreCache(id, cache)) report.cached.push(id);
    return;
  }

  try {
    const { ok, data: repo } = await ghJson(`https://api.github.com/repos/${owner}/${name}`);
    if (!ok || !repo) {
      console.warn(`  not found ${owner}/${name} → cache`);
      if (await restoreCache(id, cache)) report.cached.push(id);
      return;
    }

    const branch = cfg.defaultBranch || repo.default_branch || "main";
    const ref = SOURCE_SHA && SOURCE_REPOSITORY.toLowerCase() === `${owner}/${name}`.toLowerCase()
      ? SOURCE_SHA
      : branch;

    let readmeIncluded = false;
    let securityScanPassed = false;
    let readmeSource = "none";
    let riskTypes = [];

    // 公开仓始终同步 README；私有仓仅当 readmePublicSafe 时把正文写入公开构建
    const allowReadme = cfg.syncReadme && (!isPrivate || cfg.readmePublicSafe);

    if (allowReadme) {
      const readmeRef =
        SOURCE_SHA &&
        SOURCE_REPOSITORY.toLowerCase() === `${owner}/${name}`.toLowerCase()
          ? SOURCE_SHA
          : undefined;
      const raw = await fetchReadmeRaw(owner, name, readmeRef);
      if (raw) {
        const hard = scanPatterns(raw, HARD_SECRET_PATTERNS);
        const soft = scanPatterns(raw, SOFT_SECRET_PATTERNS);
        if (hard.length) {
          riskTypes = hard;
          console.warn(`  ⚠ hard secret scan ${owner}/${name}: ${hard.join(",")}`);
          report.readmeBlocked.push({ id, reasons: hard, file: "README.md", severity: "hard" });
          const prev = cache.get(id);
          if (prev?.md) {
            await writeMd(id, prev.md);
            readmeIncluded = true;
            securityScanPassed = true;
            readmeSource = "cache";
            console.log(`  · kept previous safe README ${id}`);
          }
        } else {
          if (soft.length) {
            console.warn(`  · soft redact ${owner}/${name}: ${soft.join(",")}`);
            report.readmeBlocked.push({ id, reasons: soft, file: "README.md", severity: "soft" });
          }
          await writeMd(id, redactSecrets(raw));
          readmeIncluded = true;
          securityScanPassed = true;
          readmeSource = soft.length ? "remote-redacted" : "remote";
          console.log(`  ✓ README ${owner}/${name}${soft.length ? " (redacted)" : ""}`);
        }
      }
    } else if (isPrivate && !cfg.readmePublicSafe) {
      console.log(`  · private README not published (readmePublicSafe=false) ${id}`);
      const localRel = localPaths.get(id);
      if (localRel) {
        try {
          const local = await fs.readFile(path.join(root, localRel), "utf8");
          const body = local.replace(/^---[\s\S]*?---\s*/, "");
          const hard = scanPatterns(body, HARD_SECRET_PATTERNS);
          if (!hard.length) {
            await writeMd(id, redactSecrets(body));
            readmeIncluded = true;
            securityScanPassed = true;
            readmeSource = "local";
            console.log(`  ✓ local fallback ${id}`);
          }
        } catch {
          /* */
        }
      }
    }

    // 公开仓始终写入可点击 URL；私有仓仅 expose=true 时写入
    const publicUrl = repo.html_url || `https://github.com/${owner}/${name}`;
    const meta = {
      id,
      name: repo.name,
      description: repo.description || "",
      repositoryProvider: "github",
      repositoryOwner: owner,
      repositoryName: name,
      repositoryStatus: repo.private ? "private" : "public",
      defaultBranch: branch,
      language: repo.language,
      topics: repo.topics || [],
      stars: repo.private && !exposeRepositoryUrl ? 0 : repo.stargazers_count || 0,
      forks: repo.private && !exposeRepositoryUrl ? 0 : repo.forks_count || 0,
      homepage: repo.homepage || null,
      pushedAt: repo.pushed_at || null,
      syncedAt: now,
      sourceSha: SOURCE_SHA || null,
      syncReason: SYNC_REASON,
      readmeIncluded,
      readmePublicSafe: readmeIncluded && securityScanPassed,
      securityScanPassed,
      readmeSource,
      riskTypes: riskTypes.length ? riskTypes : undefined,
    };
    if (!repo.private || exposeRepositoryUrl) {
      meta.repositoryUrl = publicUrl;
    }

    await writeJson(id, meta);
    report.synced.push({ id, readme: readmeSource, repository: `${owner}/${name}` });
  } catch (e) {
    console.warn(`  error ${owner}/${name}: ${e.message} → cache`);
    report.errors.push({ id, type: e.message });
    if (await restoreCache(id, cache)) report.cached.push(id);
  }
}

async function main() {
  console.log("AquaLeap sync-projects");
  console.log(
    `  reason=${SYNC_REASON} source=${SOURCE_REPOSITORY || "(all)"} sha=${SOURCE_SHA || "(none)"}`,
  );
  console.log(
    `  projects_token=${HAS_PROJECTS_TOKEN ? "yes" : "no"} auth=${TOKEN ? "yes" : "no"} skip=${SKIP_REMOTE}`,
  );

  const cache = await loadCache();
  await fs.mkdir(outDir, { recursive: true });

  // 备份后清空再写；失败 restore
  for (const f of await fs.readdir(outDir).catch(() => [])) {
    if (f.endsWith(".json") || f.endsWith(".md")) {
      await fs.unlink(path.join(outDir, f)).catch(() => {});
    }
  }

  const allConfigs = await parseRepositoryMap();
  const localPaths = await parseLocalReadmePaths();
  const now = new Date().toISOString();
  const report = {
    synced: [],
    cached: [],
    readmeBlocked: [],
    privateSkippedNoToken: [],
    errors: [],
  };

  let configs = allConfigs.filter((c) => c.syncMetadata || c.syncReadme);

  if (SOURCE_REPOSITORY) {
    const key = SOURCE_REPOSITORY.toLowerCase();
    const hit = configs.filter((c) => c.repository.toLowerCase() === key);
    if (hit.length) {
      console.log(`  priority sync: ${SOURCE_REPOSITORY}`);
      // 优先同步触发仓，再全量一致性检查
      const rest = configs.filter((c) => c.repository.toLowerCase() !== key);
      configs = [...hit, ...rest];
    } else {
      console.warn(
        `  SOURCE_REPOSITORY ${SOURCE_REPOSITORY} not in project-repositories.ts — full sync`,
      );
    }
  }

  if (SKIP_REMOTE) {
    for (const c of configs) {
      if (await restoreCache(c.projectId, cache)) report.cached.push(c.projectId);
    }
  } else {
    // 先恢复全部缓存作为底，再覆盖成功同步的
    for (const c of configs) {
      await restoreCache(c.projectId, cache);
    }
    for (const c of configs) {
      await syncOne(c, cache, report, now, localPaths);
    }
  }

  // 本地-only catalog 项（无 repository map）
  // 已由 catalog localReadme + 可选 map 覆盖

  const index = {
    generatedAt: now,
    githubUser: GITHUB_USER,
    sourceRepository: SOURCE_REPOSITORY || null,
    sourceSha: SOURCE_SHA || null,
    syncReason: SYNC_REASON,
    projectIds: [
      ...new Set([
        ...report.synced.map((s) => s.id),
        ...report.cached,
        ...configs.map((c) => c.projectId),
      ]),
    ],
    report,
  };
  await fs.writeFile(path.join(outDir, "_index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");
  console.log(
    `  done synced=${report.synced.length} cached=${report.cached.length} blocked=${report.readmeBlocked.length} errors=${report.errors.length}`,
  );
  process.exitCode = 0;
}

main().catch((e) => {
  console.error("sync non-fatal:", e.message);
  process.exitCode = 0;
});
