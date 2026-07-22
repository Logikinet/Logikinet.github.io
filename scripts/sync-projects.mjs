/**
 * 同步 GitHub 仓库元数据与 README → 站点项目内容
 *
 * - 公开仓库：列表发现 + 拉取 README（无需 Token，有 Token 更稳）
 * - 私有仓库：仅当设置 GITHUB_TOKEN 时拉取 README；绝不写入私有仓库 URL 到页面数据
 * - 输出：
 *   - src/data/projects/sync-meta.json
 *   - src/content/projects/{id}.md
 *
 * 用法：
 *   node scripts/sync-projects.mjs
 *   GITHUB_TOKEN=xxx node scripts/sync-projects.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "src/content/projects");
const metaPath = path.join(root, "src/data/projects/sync-meta.json");
const catalogPath = path.join(root, "src/data/projects/catalog.ts");

const GITHUB_USER = process.env.GITHUB_USER || "Logikinet";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
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

function stripSecrets(md) {
  return md
    .replace(/\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g, "[REDACTED_TOKEN]")
    .replace(/\bsk-[A-Za-z0-9]{20,}\b/g, "[REDACTED_KEY]")
    .replace(
      /(?<=(?:api[_-]?key|token|password|secret)\s*[:=]\s*)["'][^"']+["']/gi,
      '"[REDACTED]"',
    )
    .replace(/C:\\\\Users\\\\[^\\s]+/gi, "{{LOCAL_PATH}}")
    .replace(/\/Users\/[^/\s]+/g, "{{LOCAL_PATH}}");
}

function yamlEscape(s) {
  if (s == null) return "";
  const t = String(s);
  if (/[:#{}[\],&*?|>!%@`]/.test(t) || t.includes("\n") || t.includes('"')) {
    return `"${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
  }
  return t;
}

/** 从 catalog.ts 解析 remote 配置（轻量正则，避免引入 TS 运行时） */
async function parseCatalogRemotes() {
  const src = await fs.readFile(catalogPath, "utf8");
  const projects = [];
  const blocks = src.split(/\{\s*\n\s*id:\s*"/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^"]+)"/)?.[1];
    if (!id) continue;
    const remoteMatch = block.match(
      /remote:\s*\{\s*platform:\s*"(\w+)"\s*,\s*owner:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*isPrivate:\s*(true|false)/,
    );
    const title = block.match(/title:\s*"([^"]+)"/)?.[1];
    const autoSync = !/autoSync:\s*false/.test(block.split(/\n\s*\},/)[0] || block);
    projects.push({
      id,
      title,
      autoSync,
      remote: remoteMatch
        ? {
            platform: remoteMatch[1],
            owner: remoteMatch[2],
            name: remoteMatch[3],
            isPrivate: remoteMatch[4] === "true",
          }
        : null,
    });
  }
  return projects;
}

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (res.status === 404) return { ok: false, status: 404, data: null };
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status} ${url}: ${text.slice(0, 200)}`);
  }
  return { ok: true, status: res.status, data: await res.json() };
}

async function fetchPublicRepos() {
  const repos = [];
  let page = 1;
  while (page <= 5) {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&type=public&sort=updated`;
    const { ok, data } = await ghJson(url);
    if (!ok || !Array.isArray(data) || data.length === 0) break;
    repos.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return repos.filter((r) => !r.fork);
}

async function fetchRepo(owner, name) {
  return ghJson(`https://api.github.com/repos/${owner}/${name}`);
}

async function fetchReadme(owner, name) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers: { ...headers, Accept: "application/vnd.github.raw" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.warn(`  README skip ${owner}/${name}: HTTP ${res.status}`);
    return null;
  }
  return await res.text();
}

async function writeReadmeFile(id, body, front) {
  await fs.mkdir(contentDir, { recursive: true });
  const fm = [
    "---",
    front.title ? `title: ${yamlEscape(front.title)}` : null,
    front.summary ? `summary: ${yamlEscape(front.summary)}` : null,
    `source: ${front.source}`,
    front.repoLabel ? `repoLabel: ${yamlEscape(front.repoLabel)}` : null,
    front.homepage ? `homepage: ${yamlEscape(front.homepage)}` : null,
    front.language ? `language: ${yamlEscape(front.language)}` : null,
    typeof front.stars === "number" ? `stars: ${front.stars}` : null,
    front.syncedAt ? `syncedAt: "${String(front.syncedAt).replace(/"/g, "")}"` : null,
    `isPrivateRepo: ${front.isPrivateRepo ? "true" : "false"}`,
    front.topics?.length
      ? `topics:\n${front.topics.map((t) => `  - ${yamlEscape(t)}`).join("\n")}`
      : "topics: []",
    "---",
    "",
  ]
    .filter((l) => l != null)
    .join("\n");

  const cleaned = stripSecrets(body || "");
  const file = path.join(contentDir, `${id}.md`);
  await fs.writeFile(file, `${fm}${cleaned.trim()}\n`, "utf8");
  return file;
}

async function ensureLocalStub(id, title, summary) {
  const file = path.join(contentDir, `${id}.md`);
  try {
    await fs.access(file);
    return false;
  } catch {
    /* create stub */
  }
  await writeReadmeFile(
    id,
    `# ${title}\n\n${summary}\n\n> 本地说明稿。配置 remote 并运行 \`npm run sync:projects\`（私有仓需 GITHUB_TOKEN）后，将由仓库 README 覆盖。\n`,
    {
      title,
      summary,
      source: "local",
      isPrivateRepo: true,
      syncedAt: new Date().toISOString().slice(0, 10),
      topics: [],
    },
  );
  return true;
}

async function main() {
  console.log("AquaLeap project sync");
  console.log(`  user=${GITHUB_USER} token=${TOKEN ? "yes" : "no"} skipRemote=${SKIP_REMOTE}`);

  await fs.mkdir(contentDir, { recursive: true });
  const catalog = await parseCatalogRemotes();
  const now = new Date().toISOString();
  const metaProjects = [];
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
      console.warn("  public repo list failed:", e.message);
    }
  }

  // 同步 catalog 中带 remote 的项目 + 发现的公开仓库
  const targets = new Map();

  for (const c of catalog) {
    if (!c.remote) {
      await ensureLocalStub(c.id, c.title || c.id, "本地维护项目，无远程 README 源。");
      metaProjects.push({
        id: c.id,
        syncedAt: now,
        readmeSynced: false,
        readmeSource: "local",
        isPrivate: true,
      });
      continue;
    }
    targets.set(`${c.remote.platform}:${c.remote.owner}/${c.remote.name}`.toLowerCase(), {
      id: c.id,
      title: c.title,
      ...c.remote,
    });
  }

  for (const d of discovered) {
    const key = `github:logikinet/${d.name}`.toLowerCase();
    if (!targets.has(key)) {
      targets.set(key, {
        id: d.id,
        title: d.name,
        platform: "github",
        owner: GITHUB_USER,
        name: d.name,
        isPrivate: false,
      });
    }
  }

  for (const t of targets.values()) {
    if (t.platform !== "github") {
      console.warn(`  skip unsupported platform ${t.platform} for ${t.id}`);
      continue;
    }

    if (SKIP_REMOTE) {
      await ensureLocalStub(t.id, t.title || t.id, "SYNC_SKIP_REMOTE=1");
      continue;
    }

    if (t.isPrivate && !TOKEN) {
      console.log(`  private ${t.owner}/${t.name}: no token → keep/create local stub`);
      await ensureLocalStub(
        t.id,
        t.title || t.name,
        "私有仓库。设置 GITHUB_TOKEN 后重新 sync 可拉取 README（页面仍不展示仓库 URL）。",
      );
      metaProjects.push({
        id: t.id,
        syncedAt: now,
        readmeSynced: false,
        readmeSource: "local",
        isPrivate: true,
        platform: "github",
      });
      continue;
    }

    try {
      const { ok, data: repo } = await fetchRepo(t.owner, t.name);
      if (!ok || !repo) {
        console.warn(`  repo not found ${t.owner}/${t.name}`);
        await ensureLocalStub(t.id, t.title || t.name, "远程仓库暂不可访问。");
        metaProjects.push({
          id: t.id,
          syncedAt: now,
          readmeSynced: false,
          readmeSource: "none",
          isPrivate: t.isPrivate,
        });
        continue;
      }

      const isPrivate = Boolean(repo.private);
      const readme = await fetchReadme(t.owner, t.name);
      const summary = repo.description || t.title || t.name;

      if (readme) {
        await writeReadmeFile(t.id, readme, {
          title: repo.name,
          summary,
          source: "github",
          // 私有：只写 label 文本，不写 URL
          repoLabel: isPrivate ? undefined : `${t.owner}/${t.name}`,
          homepage: !isPrivate && repo.homepage ? repo.homepage : undefined,
          language: repo.language || undefined,
          stars: isPrivate ? undefined : repo.stargazers_count,
          syncedAt: now.slice(0, 10),
          isPrivateRepo: isPrivate,
          topics: repo.topics || [],
        });
        console.log(`  ✓ README ${t.owner}/${t.name} → ${t.id}.md${isPrivate ? " (private content)" : ""}`);
      } else {
        await ensureLocalStub(t.id, repo.name, summary || "仓库暂无 README。");
        console.log(`  · no README ${t.owner}/${t.name}`);
      }

      metaProjects.push({
        id: t.id,
        title: repo.name,
        summary,
        homepage: !isPrivate && repo.homepage ? repo.homepage : undefined,
        topics: repo.topics || [],
        language: repo.language,
        stars: isPrivate ? undefined : repo.stargazers_count,
        forks: isPrivate ? undefined : repo.forks_count,
        defaultBranch: repo.default_branch,
        pushedAt: repo.pushed_at,
        htmlUrl: isPrivate ? undefined : repo.html_url,
        platform: "github",
        isPrivate,
        syncedAt: now,
        readmeSynced: Boolean(readme),
        readmeSource: readme ? "remote" : "none",
      });
    } catch (e) {
      console.warn(`  error ${t.owner}/${t.name}:`, e.message);
      await ensureLocalStub(t.id, t.title || t.name, `同步失败：${e.message}`);
      metaProjects.push({
        id: t.id,
        syncedAt: now,
        readmeSynced: false,
        readmeSource: "none",
        isPrivate: t.isPrivate,
      });
    }
  }

  const out = {
    generatedAt: now,
    githubUser: GITHUB_USER,
    projects: metaProjects,
    discovered,
  };
  await fs.writeFile(metaPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`  wrote ${metaPath}`);
  console.log(`  content dir ${contentDir}`);
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
