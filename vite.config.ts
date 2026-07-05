import { defineConfig } from "vite";

// Static SPA. Deploys as-is to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
  },
});
