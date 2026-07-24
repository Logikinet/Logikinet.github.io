/**
 * Localhost-only content write API for Content Studio.
 * Binds exclusively to 127.0.0.1 — never 0.0.0.0.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "src", "content", "resources");
const TRASH_ROOT = path.join(CONTENT_ROOT, ".trash");
const HOST = "127.0.0.1";
const PORT = Number(process.env.CONTENT_SERVER_PORT || 4322);

const TYPES = ["prompts", "skills", "links", "workflows"];

const slugId = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const promptSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  models: z.array(z.string()).default([]),
  version: z.string().default("1.0"),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
  safetyNote: z.string().optional(),
  content: z.string().default(""),
});

const skillSchema = z.object({
  id: slugId,
  name: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  platform: z.array(z.string()).default([]),
  author: z.string().min(1),
  origin: z.string().min(1),
  license: z.string().min(1),
  ownership: z.enum(["original", "modified", "third-party", "unknown"]),
  status: z.enum(["available", "experimental", "draft", "retired"]),
  repository: z.string().optional(),
  documentation: z.string().optional(),
  tags: z.array(z.string()).default([]),
  allowPublicLink: z.boolean().default(false),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
  content: z.string().default(""),
});

const linkSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  url: z.string().url(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
  content: z.string().default(""),
});

const workflowSchema = z.object({
  id: slugId,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  draft: z.boolean().default(false),
  private: z.boolean().default(false),
  content: z.string().default(""),
});

const schemas = {
  prompts: promptSchema,
  skills: skillSchema,
  links: linkSchema,
  workflows: workflowSchema,
};

// --- secret scan (inline copy for zero build-step deps) ---
const SECRET_RULES = [
  { type: "API Key / Token", severity: "block", re: /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}|xox[baprs]-[a-zA-Z0-9-]{10,}|AIza[0-9A-Za-z\-_]{20,})\b/g, placeholder: "{{API_KEY}}" },
  { type: "Bearer / Authorization", severity: "block", re: /\b(Bearer\s+[A-Za-z0-9\-._~+/]+=*)/gi, placeholder: "{{API_KEY}}" },
  { type: "Private key block", severity: "block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, placeholder: "{{PRIVATE_KEY}}" },
  { type: "Password assignment", severity: "block", re: /\b(password|passwd|pwd)\s*[=:]\s*['"]?[^\s'"]{6,}/gi, placeholder: "{{PASSWORD}}" },
  { type: "Cookie header", severity: "block", re: /\bCookie:\s*[^\n]{10,}/gi, placeholder: "{{COOKIE}}" },
  { type: "Connection string", severity: "block", re: /\b(mongodb(\+srv)?:\/\/|postgres(ql)?:\/\/|mysql:\/\/|redis:\/\/)[^\s'"]+/gi, placeholder: "{{DATABASE_URL}}" },
  { type: "中国大陆手机号", severity: "warn", re: /(?<!\d)1[3-9]\d{9}(?!\d)/g, placeholder: "{{PHONE}}" },
  { type: "身份证号", severity: "block", re: /(?<!\d)[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx](?!\d)/g, placeholder: "{{ID_NUMBER}}" },
  { type: "Email", severity: "warn", re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, placeholder: "{{USER_EMAIL}}" },
  { type: "本机绝对路径", severity: "block", re: /(?:[A-Za-z]:\\|\/(?:Users|home|root|var|etc|opt)\/)[^\s'"`]+/g, placeholder: "{{PROJECT_PATH}}" },
  { type: "内网 IP", severity: "warn", re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b/g, placeholder: "{{INTERNAL_IP}}" },
  { type: "疑似学号", severity: "warn", re: /\b(?:学号|student\s*id)\s*[=:：]?\s*[A-Za-z0-9]{6,20}\b/gi, placeholder: "{{STUDENT_ID}}" },
  { type: "测试账号口令", severity: "warn", re: /\b(test(user|pass|account)|admin123|password123|qwerty)\b/gi, placeholder: "{{TEST_CREDENTIAL}}" },
];

function redact(v) {
  if (v.length <= 8) return "***";
  return `${v.slice(0, 3)}…${v.slice(-2)} (len=${v.length})`;
}

function scanSensitive(text) {
  const lines = String(text).split(/\r?\n/);
  const findings = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of SECRET_RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line)) !== null) {
        findings.push({
          type: rule.type,
          severity: rule.severity,
          line: i + 1,
          hint: redact(m[0]),
          placeholder: rule.placeholder,
        });
      }
    }
  }
  return findings;
}

function applyPlaceholders(text) {
  let out = String(text);
  for (const rule of SECRET_RULES) {
    out = out.replace(rule.re, rule.placeholder);
  }
  return out;
}

// --- path safety ---
function assertType(type) {
  if (!TYPES.includes(type)) throw new Error(`invalid type: ${type}`);
}

function safeSlug(id) {
  const s = String(id || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (!s || s.includes("..")) throw new Error("invalid id/slug");
  return s;
}

function resolveEntryPath(type, id) {
  assertType(type);
  const slug = safeSlug(id);
  const dir = path.resolve(CONTENT_ROOT, type);
  const file = path.resolve(dir, `${slug}.md`);
  if (!file.startsWith(dir + path.sep) && file !== dir) {
    throw new Error("path traversal blocked");
  }
  if (!file.startsWith(CONTENT_ROOT)) throw new Error("outside content root");
  return file;
}

function yamlEscape(s) {
  const str = String(s ?? "");
  if (str === "") return '""';
  if (/[:#\[\]{},&*!|>'"%@`\n]/.test(str) || str.trim() !== str) {
    return JSON.stringify(str);
  }
  return str;
}

function yamlList(items) {
  if (!items?.length) return "[]";
  return items.map((i) => `  - ${yamlEscape(i)}`).join("\n");
}

function toFrontmatter(type, data) {
  const lines = [];
  const skip = new Set(["content"]);
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k)) continue;
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      if (!v.length) lines.push("  []");
      else lines.push(yamlList(v));
    } else if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yamlEscape(v)}`);
    }
  }
  return lines.join("\n");
}

function serializeEntry(type, data) {
  const fm = toFrontmatter(type, data);
  const body = (data.content ?? "").replace(/\r\n/g, "\n").trim();
  return `---\n${fm}\n---\n\n${body ? body + "\n" : ""}`;
}

function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { data: {}, body: text };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: text };
  const fm = text.slice(3, end).replace(/^\r?\n/, "");
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const data = {};
  let currentList = null;
  for (const line of fm.split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && currentList) {
      let val = line.replace(/^\s*-\s+/, "").trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = JSON.parse(val.replace(/^'/, '"').replace(/'$/, '"'));
      }
      data[currentList].push(val);
      continue;
    }
    currentList = null;
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (val === "" || val === null) {
      data[key] = [];
      currentList = key;
      continue;
    }
    if (val === "[]") {
      data[key] = [];
      continue;
    }
    if (val === "true") data[key] = true;
    else if (val === "false") data[key] = false;
    else if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      try {
        data[key] = JSON.parse(val);
      } catch {
        data[key] = val.slice(1, -1);
      }
    } else {
      data[key] = val;
    }
  }
  return { data, body: body.replace(/\s+$/, "") };
}

function listEntries(type) {
  assertType(type);
  const dir = path.join(CONTENT_ROOT, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."))
    .map((f) => {
      const id = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, body } = parseFrontmatter(raw);
      return {
        ...data,
        id: data.id || id,
        content: body,
        _file: f,
      };
    })
    .sort((a, b) => String(a.title || a.name || a.id).localeCompare(String(b.title || b.name || b.id), "zh-CN"));
}

function readEntry(type, id) {
  const file = resolveEntryPath(type, id);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, body } = parseFrontmatter(raw);
  return { ...data, id: data.id || safeSlug(id), content: body, _file: path.basename(file) };
}

function listTrash() {
  if (!fs.existsSync(TRASH_ROOT)) return [];
  const out = [];
  for (const type of TYPES) {
    const dir = path.join(TRASH_ROOT, type);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      out.push({ type, file: f, id: f.replace(/\.md$/, "") });
    }
  }
  return out;
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

function allowOrigin(req) {
  const origin = req.headers.origin || "";
  if (!origin) return true;
  try {
    const u = new URL(origin);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowOrigin(req)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function gitStatus() {
  try {
    const out = execSync("git status --porcelain -- src/content/resources", {
      cwd: ROOT,
      encoding: "utf8",
    });
    const lines = out
      .split("\n")
      .map((l) => l.trimEnd())
      .filter(Boolean);
    return {
      count: lines.length,
      files: lines.map((l) => l.replace(/^..\s+/, "")),
      suggest: [
        "git add src/content/resources",
        'git commit -m "content: 更新资源库"',
        "git push",
      ],
    };
  } catch {
    return { count: 0, files: [], suggest: [] };
  }
}

const server = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (!allowOrigin(req) && req.headers.origin) {
    json(res, 403, { error: "origin not allowed" });
    return;
  }

  try {
    const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
    const { pathname } = url;

    if (req.method === "GET" && pathname === "/api/health") {
      json(res, 200, { ok: true, host: HOST, port: PORT, contentRoot: "src/content/resources" });
      return;
    }

    if (req.method === "GET" && pathname === "/api/types") {
      json(res, 200, { types: TYPES });
      return;
    }

    if (req.method === "GET" && pathname === "/api/git-status") {
      json(res, 200, gitStatus());
      return;
    }

    if (req.method === "GET" && pathname === "/api/trash") {
      json(res, 200, { items: listTrash() });
      return;
    }

    if (req.method === "POST" && pathname === "/api/scan") {
      const body = await readBody(req);
      const findings = scanSensitive(body.text || "");
      json(res, 200, {
        findings,
        blocked: findings.some((f) => f.severity === "block"),
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/sanitize") {
      const body = await readBody(req);
      json(res, 200, { text: applyPlaceholders(body.text || "") });
      return;
    }

    const listMatch = pathname.match(/^\/api\/entries\/([a-z]+)$/);
    if (req.method === "GET" && listMatch) {
      const type = listMatch[1];
      json(res, 200, { entries: listEntries(type) });
      return;
    }

    const oneMatch = pathname.match(/^\/api\/entries\/([a-z]+)\/([a-z0-9-]+)$/);
    if (req.method === "GET" && oneMatch) {
      const entry = readEntry(oneMatch[1], oneMatch[2]);
      if (!entry) {
        json(res, 404, { error: "not found" });
        return;
      }
      json(res, 200, { entry });
      return;
    }

    if (req.method === "POST" && listMatch) {
      const type = listMatch[1];
      const body = await readBody(req);
      const forcePlaceholder = !!body.replaceSecrets;
      let payload = { ...body.entry };
      payload.id = safeSlug(payload.id || payload.title || payload.name || "item");
      if (!payload.updatedAt && (type === "prompts" || type === "workflows")) {
        payload.updatedAt = new Date().toISOString().slice(0, 10);
      }
      if (!payload.lastChecked && type === "links") {
        payload.lastChecked = new Date().toISOString().slice(0, 10);
      }

      const scanText = JSON.stringify(payload);
      let findings = scanSensitive(scanText);
      if (forcePlaceholder) {
        payload = JSON.parse(applyPlaceholders(JSON.stringify(payload)));
        findings = scanSensitive(JSON.stringify(payload));
      }
      if (findings.some((f) => f.severity === "block")) {
        json(res, 400, { error: "sensitive content blocked", findings });
        return;
      }

      const parsed = schemas[type].safeParse(payload);
      if (!parsed.success) {
        json(res, 400, { error: "validation failed", issues: parsed.error.issues });
        return;
      }

      const file = resolveEntryPath(type, parsed.data.id);
      if (fs.existsSync(file) && !body.overwrite) {
        json(res, 409, { error: "file exists", id: parsed.data.id });
        return;
      }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, serializeEntry(type, parsed.data), "utf8");
      json(res, 201, { ok: true, id: parsed.data.id, path: path.relative(ROOT, file) });
      return;
    }

    if (req.method === "PUT" && oneMatch) {
      const type = oneMatch[1];
      const id = oneMatch[2];
      const body = await readBody(req);
      const forcePlaceholder = !!body.replaceSecrets;
      let payload = { ...body.entry, id: safeSlug(body.entry?.id || id) };
      if (type === "prompts" || type === "workflows") {
        payload.updatedAt = new Date().toISOString().slice(0, 10);
      }

      let findings = scanSensitive(JSON.stringify(payload));
      if (forcePlaceholder) {
        payload = JSON.parse(applyPlaceholders(JSON.stringify(payload)));
        findings = scanSensitive(JSON.stringify(payload));
      }
      if (findings.some((f) => f.severity === "block")) {
        json(res, 400, { error: "sensitive content blocked", findings });
        return;
      }

      const parsed = schemas[type].safeParse(payload);
      if (!parsed.success) {
        json(res, 400, { error: "validation failed", issues: parsed.error.issues });
        return;
      }

      const oldFile = resolveEntryPath(type, id);
      const newFile = resolveEntryPath(type, parsed.data.id);
      if (!fs.existsSync(oldFile)) {
        json(res, 404, { error: "not found" });
        return;
      }
      if (oldFile !== newFile && fs.existsSync(newFile) && !body.overwrite) {
        json(res, 409, { error: "target id exists" });
        return;
      }
      fs.writeFileSync(newFile, serializeEntry(type, parsed.data), "utf8");
      if (oldFile !== newFile) fs.unlinkSync(oldFile);
      json(res, 200, { ok: true, id: parsed.data.id, path: path.relative(ROOT, newFile) });
      return;
    }

    if (req.method === "DELETE" && oneMatch) {
      const type = oneMatch[1];
      const id = oneMatch[2];
      const file = resolveEntryPath(type, id);
      if (!fs.existsSync(file)) {
        json(res, 404, { error: "not found" });
        return;
      }
      const trashDir = path.join(TRASH_ROOT, type);
      fs.mkdirSync(trashDir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const dest = path.join(trashDir, `${safeSlug(id)}.${stamp}.md`);
      fs.renameSync(file, dest);
      json(res, 200, { ok: true, trash: path.relative(ROOT, dest) });
      return;
    }

    json(res, 404, { error: "not found" });
  } catch (e) {
    json(res, 500, { error: e instanceof Error ? e.message : String(e) });
  }
});

fs.mkdirSync(CONTENT_ROOT, { recursive: true });
fs.mkdirSync(TRASH_ROOT, { recursive: true });

server.listen(PORT, HOST, () => {
  console.log(`[content-server] http://${HOST}:${PORT}  (root: src/content/resources)`);
});
