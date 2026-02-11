import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");

function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",
    apply: "serve", // ⬅️ DEV ONLY (critical)

    configureServer(server: ViteDevServer) {
      if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
      }

      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") return next();

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            fs.appendFileSync(
              path.join(LOG_DIR, "browser.log"),
              body + "\n"
            );
            res.end("ok");
          } catch {
            res.statusCode = 500;
            res.end("error");
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    root: path.resolve(PROJECT_ROOT, "client"),

    plugins: [
      react(),
      tailwindcss(),
      vitePluginManusRuntime(),
      !isProd && vitePluginManusDebugCollector()
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(PROJECT_ROOT, "client/src"),
        "@shared": path.resolve(PROJECT_ROOT, "shared"),
        "@assets": path.resolve(PROJECT_ROOT, "attached_assets")
      }
    },

    build: {
      outDir: path.resolve(PROJECT_ROOT, "dist/public"),
      emptyOutDir: true
    },

    server: {
      port: 3000,
      host: true
    }
  };
});
