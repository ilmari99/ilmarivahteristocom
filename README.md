# ilmarivahteristo.com

The site of a computer vision and AI/ML consultant. Two languages: English at `/`, Finnish
at `/fi/`.

Each page is a written document — heading, the offer, work, sensors and methods, contact —
with an interactive terminal as the hero above it. Type a command (`whoami`, `consult`,
`work`, `sensors`, `help`) or tap a chip.

## The text is real HTML

The terminal paints to `<canvas>`, so nothing it draws is indexable. The page underneath it
is therefore generated as ordinary HTML **at build time** and lives in the shipped
`index.html`, readable with JavaScript off. The terminal is a layer on top of that text, not
a replacement for it.

`staticContent()` in [`vite.config.ts`](vite.config.ts) does this: for each HTML entry it
picks the matching locale (via `ctx.path`) and substitutes four placeholders —
`<!--seo-head-->`, `<!--seo-langswitch-->`, `<!--seo-content-->`, `<!--seo-jsonld-->` — with
markup from [`src/seo.ts`](src/seo.ts).

## PreTeXt does the terminal

Every command's output is laid out and rendered by [PreTeXt](https://github.com/chenglou/pretext),
not the DOM:

- Each output line is typeset with PreTeXt's `rich-inline` engine (mixed weights + links),
  which returns exact wrapped lines by pure arithmetic — no `getBoundingClientRect`, no reflow.
- The text then **types out on a `<canvas>`** like a real terminal.
- Because PreTeXt owns the layout, **resizing re-typesets the entire scrollback instantly**,
  and links stay clickable via canvas hit-testing.
- A visually-hidden DOM mirror carries the same text + real `<a>` tags for screen readers
  and copy-paste.

The header is also PreTeXt: the name + role assemble from a sparse point cloud and scatter
under your cursor.

## Editing content

Everything is under [`src/content/`](src/content/):

| File | What |
|---|---|
| `types.ts` | the `Content` interface — **the contract both languages must satisfy** |
| `en.ts` / `fi.ts` | all copy, including chrome (headings, buttons, boot lines, help text) |
| `profile.ts` | language-neutral facts: name, email, links, and the site URLs |

A field missing from one language is a **compile error**, so a translation cannot silently
fall back to English. That is the whole point of the split — add a field to `types.ts` and
`npm run build` tells you exactly what to translate.

Terminal command *names* stay English in both languages (they read as shell commands); only
their descriptions and output are localized. The terminal knows which language it is on by
reading `document.documentElement.lang`, which the build writes per page.

Adding a post: append to `posts` in a locale file; it becomes readable with `read <slug>`.
If a locale's `posts` is empty, the notes section is dropped from that page and the terminal
points at the language that has them (`ui.blogElsewhere`).

## Two-language plumbing

When adding a third language, touch all of: `types.ts` `Locale`, `PATHS`/`URLS` in
`profile.ts`, `locales` in `content/index.ts`, a new `<lang>/index.html`, the
`rollupOptions.input` map, the `ctx.path` branch, and `public/sitemap.xml`. The `hreflang`
tags are generated from `URLS` in `headTags()`, so they follow automatically.

There is deliberately **no automatic redirect by `Accept-Language`** — it breaks crawling and
overrides a deliberate choice. The switcher above the terminal is a plain `<a>`.

## Develop / build

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, outputs static site to dist/
npm run preview   # serves dist/ — check /fi/ too
```

**Gotcha:** the dev server imports `src/content/` through `vite.config.ts`, so **content edits
need a dev-server restart**, not just a reload. Terminal and CSS changes hot-reload fine.

## Stack

- Vite + TypeScript (vanilla, no framework), two HTML entries
- `@chenglou/pretext` and `@chenglou/pretext/rich-inline`
- One screen, monospace, stark. Everything static.

## Deploy

`dist/` is fully static. GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
publishes it to GitHub Pages on every push to `main`; `public/CNAME` pins the apex domain.

Note that `base` is `"/"`, which assumes the site is served from a **domain root**. Deploying
under a subpath (e.g. `user.github.io/repo/`) needs that changed.
