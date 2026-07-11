import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      "dominican-republic-map/styles.css": resolve(
        __dirname,
        "../../src/styles/map.css",
      ),
      "dominican-republic-map": resolve(__dirname, "../../src/index.ts"),
    },
  },
});
