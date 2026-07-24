// One-shot migration: data/resources TS arrays -> content/resources markdown files
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resourcePrompts } from "../src/data/resources/prompts.ts";
import { resourceSkills } from "../src/data/resources/skills.ts";
import { resourceLinks } from "../src/data/resources/links.ts";
import { resourceWorkflows } from "../src/data/resources/workflows.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = path.join(ROOT, "src/content/resources");

function yamlEscape(s: string): string {
  if (s === "") return '""';
  if (/[:#\[\]{},&*!|>'"%@`]|\n/.test(s) || s.trim() !== s) {
    return JSON.stringify(s);
  }
  return s;
}

function yamlList(items: string[], indent = 0): string {
  if (!items.length) return "[]";
  const pad = "  ".repeat(indent);
  return items.map((i) => `${pad}- ${yamlEscape(i)}`).join("\n");
}

function writeMd(relDir: string, id: string, frontmatter: string, body: string) {
  const dir = path.join(BASE, relDir);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${id}.md`);
  const content = `---\n${frontmatter}\n---\n\n${body.replace(/\r\n/g, "\n").trim()}\n`;
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", path.relative(ROOT, file));
}

function modelsToArray(models: string): string[] {
  return models
    .split(/[/|·,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Prompts
for (const p of resourcePrompts) {
  const fm = [
    `id: ${yamlEscape(p.id)}`,
    `title: ${yamlEscape(p.title)}`,
    `summary: ${yamlEscape(p.summary)}`,
    `category: ${yamlEscape(p.category)}`,
    `tags:`,
    yamlList(p.tags, 1),
    `models:`,
    yamlList(modelsToArray(p.models), 1),
    `version: ${yamlEscape(p.version)}`,
    `updatedAt: ${yamlEscape(p.updatedAt)}`,
    `featured: ${p.featured}`,
    `draft: false`,
    `private: false`,
    ...(p.safetyNote ? [`safetyNote: ${yamlEscape(p.safetyNote)}`] : []),
  ].join("\n");
  writeMd("prompts", p.id, fm, p.content);
}

// Skills
for (const s of resourceSkills) {
  const isDraft = s.status === "draft";
  const fm = [
    `id: ${yamlEscape(s.id)}`,
    `name: ${yamlEscape(s.name)}`,
    `summary: ${yamlEscape(s.summary)}`,
    `platform:`,
    yamlList(s.platform, 1),
    `author: ${yamlEscape(s.author)}`,
    `origin: ${yamlEscape(s.origin)}`,
    `license: ${yamlEscape(s.license)}`,
    `ownership: ${yamlEscape(s.ownership)}`,
    `status: ${yamlEscape(s.status)}`,
    ...(s.repository ? [`repository: ${yamlEscape(s.repository)}`] : []),
    ...(s.documentation ? [`documentation: ${yamlEscape(s.documentation)}`] : []),
    `tags:`,
    yamlList(s.tags, 1),
    `allowPublicLink: ${s.allowPublicLink}`,
    `draft: ${isDraft}`,
    `private: false`,
  ].join("\n");
  writeMd("skills", s.id, fm, s.notes ?? "");
}

// Links
for (const l of resourceLinks) {
  const fm = [
    `id: ${yamlEscape(l.id)}`,
    `title: ${yamlEscape(l.title)}`,
    `description: ${yamlEscape(l.description)}`,
    `url: ${yamlEscape(l.url)}`,
    `category: ${yamlEscape(l.category)}`,
    `tags:`,
    yamlList(l.tags, 1),
    `featured: ${l.featured}`,
    `lastChecked: ${yamlEscape(l.lastChecked)}`,
    `draft: false`,
    `private: false`,
  ].join("\n");
  writeMd("links", l.id, fm, "");
}

// Workflows
for (const w of resourceWorkflows) {
  const fm = [
    `id: ${yamlEscape(w.id)}`,
    `title: ${yamlEscape(w.title)}`,
    `summary: ${yamlEscape(w.summary)}`,
    `category: ${yamlEscape(w.category)}`,
    `tags:`,
    yamlList(w.tags, 1),
    `updatedAt: ${yamlEscape(w.updatedAt)}`,
    `draft: false`,
    `private: false`,
  ].join("\n");
  writeMd("workflows", w.id, fm, w.content);
}

console.log("\nMigration complete.");
