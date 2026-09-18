import { defineConfig, type Plugin } from "vite";
import { siteHtml, jsonLd } from "./src/seo";

const SITE = "https://ilmarivahteristo.com/";

// The site paints to <canvas>, so the shipped HTML would otherwise be an empty <div>.
// This bakes content.ts into index.html as real markup (plus Person JSON-LD) at build time.
function staticContent(): Plugin {
  return {
    name: "static-content",
    transformIndexHtml(html) {
      return html
        .replace("<!--seo-content-->", siteHtml())
        .replace("<!--seo-jsonld-->", jsonLd(SITE));
    },
  };
}

// Static SPA. Deploys as-is to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
export default defineConfig({
  base: "./",
  plugins: [staticContent()],
  build: {
    target: "es2020",
    outDir: "dist",
  },
});
