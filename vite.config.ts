import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-extension-files",
      closeBundle() {
        // Copy manifest and other extension files to dist
        const files = ["manifest.json", "background.js", "icon.png"];
        files.forEach((file) => {
          copyFileSync(
            path.resolve(__dirname, `public/${file}`),
            path.resolve(__dirname, `dist/${file}`)
          );
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        contentScript: path.resolve(__dirname, "src/contentScript.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "contentScript" 
            ? "contentScript.js" 
            : "assets/[name]-[hash].js";
        },
      },
    },
  },
});
