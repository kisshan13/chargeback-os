import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      cn: fileURLToPath(new URL("./src/lib/utils.ts", import.meta.url))
    }
  },
  plugins: [tailwindcss(), viteReact()]
});
