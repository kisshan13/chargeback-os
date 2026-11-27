import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, repositoryRoot, ["VITE_", "API_PROXY_TARGET"]);
  const apiProxyTarget = rootEnv.API_PROXY_TARGET ?? "http://localhost:5000";

  return {
    envDir: repositoryRoot,
    build: {
      outDir: "../api/public",
      emptyOutDir: true
    },
    server: {
      port: 5173,
      proxy: {
        "/api": apiProxyTarget,
        "/health": apiProxyTarget,
        "/openapi.json": apiProxyTarget
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        cn: fileURLToPath(new URL("./src/lib/utils.ts", import.meta.url))
      }
    },
    plugins: [tailwindcss(), viteReact()]
  };
});
