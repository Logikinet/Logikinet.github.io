/**
 * Sync Sticker Forge static export into AquaLeap Lab.
 *
 * Default source: ../sticker-forge/out (sibling worktree)
 * Override:       STICKER_FORGE_SOURCE_DIR
 * Target:         public/lab/sticker-forge
 *
 * Build the tool first:
 *   cd ../sticker-forge
 *   $env:GITHUB_PAGES="true"; $env:BASE_PATH="/lab/sticker-forge"
 *   $env:NEXT_PUBLIC_SITE_URL="https://aqualeap.dev/lab/sticker-forge"
 *   npx next build --webpack
 */
import { cpSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultSource = resolve(siteRoot, "../sticker-forge/out");
const sourceDir = process.env.STICKER_FORGE_SOURCE_DIR
  ? resolve(process.env.STICKER_FORGE_SOURCE_DIR)
  : defaultSource;
const targetDir = resolve(siteRoot, "public/lab/sticker-forge");

function fail(message) {
  console.error(`[sync:sticker-forge] ${message}`);
  process.exit(1);
}

if (!existsSync(sourceDir)) {
  fail(
    `源目录不存在: ${sourceDir}\n` +
      `请先在 sticker-forge 中执行静态构建（BASE_PATH=/lab/sticker-forge）。\n` +
      `或设置 STICKER_FORGE_SOURCE_DIR 指向 out 目录。`,
  );
}

if (!existsSync(resolve(sourceDir, "index.html"))) {
  fail(`源目录缺少 index.html: ${sourceDir}`);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

if (existsSync(resolve(targetDir, "out/index.html"))) {
  fail("检测到 public/lab/sticker-forge/out/index.html — 复制层级错误");
}

const entries = readdirSync(targetDir);
console.log(`[sync:sticker-forge] 已同步 ${sourceDir}`);
console.log(`[sync:sticker-forge] 目标 ${targetDir}`);
console.log(`[sync:sticker-forge] 条目数: ${entries.length}`);
console.log("[sync:sticker-forge] 完成");
