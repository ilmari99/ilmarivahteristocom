import { defineConfig, type Plugin } from "vite";
import { resolve } from "node:path";
import { siteHtml, headTags, jsonLd, langSwitch } from "./src/seo";
import { locales } from "./src/content";

// The site paints to <canvas>, so the shipped HTML would otherwise be an empty <div>. This
// bakes the matching locale's content.ts into each index.html as real markup, plus its
// <head> tags (title, canonical, hreflang, OG) and JSON-LD.
//
// ctx.path is the public path of the page being transformed ("/index.html", "/fi/index.html"),
// which is what tells the two entries apart. Without that branch the Finnish page would
// silently be served English content.
function staticContent(): Plugin {
  return {
    name: "static-content",
    transformIndexHtml(html, ctx) {
      const c = ctx.path.startsWith("/fi/") ? locales.fi : locales.en;
      return html
        .replace("<!--seo-head-->", headTags(c))
        .replace("<!--seo-langswitch-->", langSwitch(c))
        .replace("<!--seo-content-->", siteHtml(c))
        .replace("<!--seo-jsonld-->", jsonLd(c));
    },
  };
}

// Static two-page site: English at /, Finnish at /fi/.
export default defineConfig({
  // Absolute, not "./": the site is served from an apex domain (public/CNAME), and the
  // language switcher links between "/" and "/fi/".
  base: "/",
  plugins: [staticContent()],
  build: {
    target: "es2020",
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        fi: resolve(__dirname, "fi/index.html"),
      },
    },
  },
});
