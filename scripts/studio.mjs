/**
 * npm run studio — Astro dev + localhost content API + open /studio/
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_PORT = Number(process.env.CONTENT_SERVER_PORT || 4322);
const ASTRO_PORT = Number(process.env.STUDIO_ASTRO_PORT || 4321);

function waitForPort(port, host = "127.0.0.1", timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = createServer();
      socket.once("error", () => {
        // port in use => service is up (we cannot bind)
        socket.close();
        resolve(true);
      });
      socket.listen(port, host, () => {
        socket.close(() => {
          if (Date.now() - start > timeoutMs) reject(new Error(`timeout waiting ${host}:${port}`));
          else setTimeout(tryOnce, 300);
        });
      });
    };
    // Actually we need connect, not listen
    import("node:net").then(({ default: net }) => {
      const attempt = () => {
        const s = net.connect({ port, host }, () => {
          s.end();
          resolve(true);
        });
        s.on("error", () => {
          if (Date.now() - start > timeoutMs) reject(new Error(`timeout ${host}:${port}`));
          else setTimeout(attempt, 400);
        });
      };
      attempt();
    });
  });
}

function run(cmd, args, env = {}) {
  const child = spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return child;
}

const children = [];

function shutdown() {
  for (const c of children) {
    try {
      c.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("[studio] starting content-server on 127.0.0.1:" + CONTENT_PORT);
children.push(
  run(process.execPath, [path.join(ROOT, "scripts/content-server.mjs")], {
    CONTENT_SERVER_PORT: String(CONTENT_PORT),
  }),
);

console.log("[studio] starting astro dev on port " + ASTRO_PORT);
children.push(
  run("npx", ["astro", "dev", "--host", "127.0.0.1", "--port", String(ASTRO_PORT)]),
);

const studioUrl = `http://127.0.0.1:${ASTRO_PORT}/studio/`;

waitForPort(ASTRO_PORT)
  .then(() => waitForPort(CONTENT_PORT))
  .then(() => {
    console.log(`[studio] ready → ${studioUrl}`);
    console.log("[studio] content API → http://127.0.0.1:" + CONTENT_PORT);
    // open browser
    const openCmd =
      process.platform === "win32"
        ? ["cmd", ["/c", "start", "", studioUrl]]
        : process.platform === "darwin"
          ? ["open", [studioUrl]]
          : ["xdg-open", [studioUrl]];
    try {
      spawn(openCmd[0], openCmd[1], { stdio: "ignore", detached: true }).unref();
    } catch {
      console.log("[studio] open the URL manually:", studioUrl);
    }
  })
  .catch((e) => {
    console.error("[studio] failed:", e.message);
    shutdown();
  });
