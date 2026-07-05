# ilmarivahteristo.com

A personal site shaped like a terminal you can talk to. Type a command (`whoami`, `work`,
`writing`, `contact`, `help`) or tap a chip.

## PreTeXt does the real work

Every command's output is laid out and rendered by [PreTeXt](https://github.com/chenglou/pretext),
not the DOM:

- Each output line is typeset with PreTeXt's `rich-inline` engine (mixed weights + links),
  which returns exact wrapped lines by pure arithmetic — no `getBoundingClientRect`, no reflow.
- The text then **types out on a `<canvas>`** like a real terminal.
- Because PreTeXt owns the layout, **resizing re-typesets the entire scrollback instantly**,
  and links stay clickable via canvas hit-testing.
- A visually-hidden DOM mirror carries the same text + real `<a>` tags for screen readers,
  SEO, and copy-paste.

The header is also PreTeXt: the name + tagline assemble from a sparse point cloud and
scatter under your cursor.

## Stack

- Vite + TypeScript (vanilla, no framework)
- `@chenglou/pretext` and `@chenglou/pretext/rich-inline`
- One screen, monospace, stark. Everything static.

## Develop / build

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, outputs static site to dist/
npm run preview
```

## Deploy

`dist/` is fully static — deploy anywhere. `netlify.toml` is included; Vercel /
Cloudflare Pages / GitHub Pages all work zero-config. Point the domain at the host.

## Editing content

Everything is in [`src/content.ts`](src/content.ts): bio, projects, competition record,
stack, and blog posts. Add a post to the `posts` array and it's readable in the terminal
with `read <slug>`. `TODO(ilmari)` marks the placeholder to replace first. Command wiring
and colors live in [`src/main.ts`](src/main.ts).
