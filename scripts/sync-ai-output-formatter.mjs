/**
 * Sync AI Output Formatter static build into AquaLeap public tools folder.
 *
 * Default source: ../ai-output-formatter/dist (sibling worktree)
 * Override:       AOF_SOURCE_DIR
 * Target:         public/tools/ai-output-formatter
 *
 * Copies the *contents* of dist/, not the dist folder itself.
 */
import { cpSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '..')
const defaultSource = resolve(siteRoot, '../ai-output-formatter/dist')
const sourceDir = resolve(process.env.AOF_SOURCE_DIR || defaultSource)
const targetDir = resolve(siteRoot, 'public/tools/ai-output-formatter')

function fail(message) {
  console.error(`[sync:aof] ${message}`)
  process.exit(1)
}

if (!existsSync(sourceDir)) {
  fail(
    `源目录不存在: ${sourceDir}\n` +
      `请先在 ai-output-formatter 中执行:\n` +
      `  $env:VITE_BASE_PATH="/tools/ai-output-formatter/"; npm run build\n` +
      `或设置 AOF_SOURCE_DIR 指向构建产物目录。`,
  )
}

const indexHtml = join(sourceDir, 'index.html')
if (!existsSync(indexHtml)) {
  fail(`源目录缺少 index.html: ${sourceDir}（请确认复制的是 dist 内容，不是源码目录）`)
}

// Clear target (keep parent tools/ intact)
rmSync(targetDir, { recursive: true, force: true })
mkdirSync(targetDir, { recursive: true })

// Copy contents of source into target
cpSync(sourceDir, targetDir, { recursive: true })

// Sanity: no nested dist/
if (existsSync(join(targetDir, 'dist', 'index.html'))) {
  fail('检测到 public/tools/ai-output-formatter/dist/index.html — 复制层级错误')
}

const entries = readdirSync(targetDir)
console.log(`[sync:aof] 已同步 ${sourceDir}`)
console.log(`[sync:aof] 目标 ${targetDir}`)
console.log(`[sync:aof] 条目数: ${entries.length}`)
for (const name of entries.slice(0, 12)) {
  const p = join(targetDir, name)
  const kind = statSync(p).isDirectory() ? 'dir' : 'file'
  console.log(`  - ${name} (${kind})`)
}
console.log('[sync:aof] 完成')
