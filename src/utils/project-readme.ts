import fs from "node:fs";
import path from "node:path";
import type { Project, GeneratedProjectMeta } from "@/data/projects";
import { getGeneratedMeta } from "@/data/projects";

export interface ReadmeHeading {
  depth: number;
  text: string;
  slug: string;
}

export interface ResolvedReadme {
  source: "generated" | "local" | "description" | "status";
  markdown: string;
  meta?: GeneratedProjectMeta;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-");
}

function stripFrontmatter(md: string): string {
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end !== -1) return md.slice(end + 4).replace(/^\s+/, "");
  }
  return md;
}

function readFileSafe(abs: string): string | null {
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return null;
  }
}

/**
 * 优先级：
 * 1. generated 且 readmePublicSafe / readmeIncluded
 * 2. localReadmePath
 * 3. description
 * 4. 简短状态
 */
export function resolveProjectReadme(project: Project, cwd = process.cwd()): ResolvedReadme {
  const meta = getGeneratedMeta(project.id);

  const canUseGenerated =
    meta?.readmeIncluded &&
    meta.securityScanPassed &&
    (project.repositoryStatus === "public" || project.readmePublicSafe === true);

  if (canUseGenerated) {
    const genPath = path.join(cwd, "src/generated/projects", `${project.id}.md`);
    const md = readFileSafe(genPath);
    if (md?.trim()) {
      return { source: "generated", markdown: md, meta };
    }
  }

  if (project.localReadmePath) {
    const localPath = path.isAbsolute(project.localReadmePath)
      ? project.localReadmePath
      : path.join(cwd, project.localReadmePath);
    const raw = readFileSafe(localPath);
    if (raw?.trim()) {
      return {
        source: "local",
        markdown: stripFrontmatter(raw),
        meta,
      };
    }
  }

  if (project.description?.trim()) {
    return {
      source: "description",
      markdown: project.description.trim(),
      meta,
    };
  }

  return {
    source: "status",
    markdown: `**${project.title}** 当前状态：${project.status}。暂无可公开的项目说明。`,
    meta,
  };
}

/** 修正相对图片/链接；公开仓指向 raw/blob */
export function rewriteReadmeUrls(
  markdown: string,
  project: Project,
  meta?: GeneratedProjectMeta,
): string {
  const owner = project.repositoryOwner || meta?.repositoryOwner;
  const name = project.repositoryName || meta?.repositoryName;
  const branch = meta?.defaultBranch || "main";
  const isPublic =
    project.repositoryStatus === "public" ||
    (meta?.repositoryStatus === "public" && project.exposeRepositoryUrl);

  if (!owner || !name || !isPublic) {
    // 私有或不暴露：去掉相对资源，避免坏链
    return markdown
      .replace(/!\[([^\]]*)\]\((?!https?:|data:)([^)]+)\)/g, (_m, alt) => `*[图片: ${alt || "相对路径已省略"}]*`)
      .replace(/\[([^\]]+)\]\((?!https?:|#|mailto:)([^)]+)\)/g, "$1");
  }

  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${name}/blob/${branch}/`;

  return markdown
    .replace(/!\[([^\]]*)\]\((?!https?:|data:)([^)]+)\)/g, (_m, alt, src) => {
      const clean = String(src).replace(/^\.\//, "").replace(/^\//, "");
      return `![${alt}](${rawBase}${clean})`;
    })
    .replace(/\[([^\]]+)\]\((?!https?:|#|mailto:)([^)]+)\)/g, (_m, text, href) => {
      const clean = String(href).replace(/^\.\//, "").replace(/^\//, "");
      return `[${text}](${blobBase}${clean})`;
    });
}

export function extractHeadings(markdown: string): ReadmeHeading[] {
  const headings: ReadmeHeading[] = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/#+$/, "").trim();
    headings.push({
      depth: m[1].length,
      text,
      slug: slugify(text),
    });
  }
  return headings;
}

/** 极简 Markdown → HTML（标题/列表/代码/表格/链接/图片/段落）+ 消毒 */
export function markdownToSafeHtml(markdown: string): string {
  let html = markdown;

  // fenced code
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const escaped = escapeHtml(code.replace(/\n$/, ""));
    const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
    return `<pre><code${cls}>${escaped}</code></pre>`;
  });

  // inline code
  html = html.replace(/`([^`]+)`/g, (_m, c) => `<code>${escapeHtml(c)}</code>`);

  // headings
  html = html.replace(/^(#{1,4})\s+(.+)$/gm, (_m, hashes, text) => {
    const level = hashes.length;
    const t = text.replace(/#+$/, "").trim();
    const id = slugify(t);
    return `<h${level} id="${id}">${inlineFormat(t)}</h${level}>`;
  });

  // images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_m, alt, src) =>
      `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" />`,
  );

  // links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, text, href) => {
      if (/^\s*javascript:/i.test(href)) return escapeHtml(text);
      return `<a href="${escapeAttr(href)}" rel="noopener noreferrer">${inlineFormat(text)}</a>`;
    },
  );

  // tables (simple)
  html = html.replace(/(?:^\|.+\|\s*$\n?)+/gm, (block) => {
    const rows = block.trim().split(/\n/).filter(Boolean);
    if (rows.length < 2) return block;
    const parseRow = (r: string) =>
      r
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());
    const head = parseRow(rows[0]);
    const bodyRows = rows.slice(2).map(parseRow);
    const thead = `<thead><tr>${head.map((c) => `<th>${inlineFormat(c)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${bodyRows
      .map((cells) => `<tr>${cells.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`;
  });

  // lists
  html = html.replace(/(?:^[-*]\s+.+(?:\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l) => l.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean);
    return `<ul>${items.map((i) => `<li>${inlineFormat(i)}</li>`).join("")}</ul>`;
  });

  // ordered lists
  html = html.replace(/(?:^\d+\.\s+.+(?:\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l) => l.replace(/^\d+\.\s+/, "").trim())
      .filter(Boolean);
    return `<ol>${items.map((i) => `<li>${inlineFormat(i)}</li>`).join("")}</ol>`;
  });

  // paragraphs
  html = html
    .split(/\n{2,}/)
    .map((chunk) => {
      const t = chunk.trim();
      if (!t) return "";
      if (/^<(h\d|ul|ol|pre|table|div|p|blockquote)/.test(t)) return t;
      return `<p>${inlineFormat(t.replace(/\n/g, "<br />"))}</p>`;
    })
    .join("\n");

  // strip dangerous tags
  html = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");

  return html;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replaceAll("'", "&#39;");
}
