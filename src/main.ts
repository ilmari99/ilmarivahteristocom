import "./style.css";
import { createGlyphField } from "./glyphfield";
import { Terminal, type Run, type Paragraph, type Output } from "./terminal";
import {
  locales, isLocale, other, profile, PATHS, URLS,
  type ChipCommand, type Content,
} from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// Which language's page is this? The build writes <html lang> per page; nothing else in the
// bundle knows, so this one read is what keeps the terminal in step with the page under it.
const langAttr = document.documentElement.lang;
const locale = isLocale(langAttr) ? langAttr : "en";
const c: Content = locales[locale];
const alt = other(locale);

const C = { text: "#e7e7e9", dim: "#6b6f76", green: "#7dd3a0", acc: "#4ade80", err: "#f87171", name: "#f4f4f5" };
const t = (text: string, color = C.text, weight = 500): Run => ({ text, color, weight });
const link = (text: string, href: string): Run => ({ text, href, color: C.acc });
const cmdlink = (text: string, cmd: string): Run => ({ text, cmd, color: C.acc });
const lines = (arr: string[], color = C.text): Output => arr.map((l) => [t(l, color)]);

// wrap a long sentence into terminal-width-ish lines so the canvas isn't one endless run
const wrap = (s: string, n = 78): string[] => {
  const out: string[] = [];
  let line = "";
  for (const w of s.split(/\s+/)) {
    if (line && (line + " " + w).length > n) { out.push(line); line = w; }
    else line = line ? line + " " + w : w;
  }
  if (line) out.push(line);
  return out;
};

const app = document.querySelector<HTMLDivElement>("#app")!;

// Command names stay English in every language — they read as shell commands. Only their
// descriptions and output are localized.
const CHIP_CMDS: ChipCommand[] = [
  "whoami", "consult", "work", "sensors", "now", "why", "irl", "blog", "contact", "clear",
];
const HELP: [string, string][] = CHIP_CMDS.map((cmd) => [cmd, c.ui.helpDesc[cmd]]);

app.innerHTML = `
  <div class="term" role="application" aria-label="${esc(c.ui.termAria)}">
    <div class="bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="title">${esc(profile.host)}: ~</span>
      <span class="spacer"></span>
      <a class="bar-link" href="mailto:${esc(profile.email)}">${esc(c.ui.sayHi)}</a>
    </div>
    <canvas id="banner" aria-label="${esc(profile.name)} — ${esc(c.tagline)}"></canvas>
    <div class="screen" id="screen"></div>
    <div class="chips" id="chips" aria-label="${esc(c.ui.chipsAria)}">
      ${CHIP_CMDS
        .map((x) => `<button data-cmd="${x}"><span class="chips-caret">›</span>${x}</button>`)
        .join("")}
    </div>
    <div class="postview" id="postview" role="dialog" aria-label="${esc(c.ui.noteAria)}" hidden>
      <div class="postbar">
        <button class="postback" id="postback"><span class="chips-caret">‹</span>${esc(c.ui.backToTerminal)}</button>
      </div>
      <article class="postbody" id="postbody"></article>
    </div>
  </div>`;

const screen = document.getElementById("screen")!;
const postview = document.getElementById("postview") as HTMLDivElement;
const postbody = document.getElementById("postbody") as HTMLElement;

// interactive header — assembled from a point cloud, scatters under the cursor (also PreTeXt)
createGlyphField(document.getElementById("banner") as HTMLCanvasElement, [
  { text: profile.name, weight: 700, size: 42, color: C.name },
  { text: c.role, weight: 500, size: 15, color: C.green },
]);

const term = new Terminal(screen, (x) => run(x));

const commands: Record<string, (args: string[]) => Output | void> = {
  whoami: () => lines(c.whoami),
  now: () => lines(c.now),
  irl: () => lines(c.irl),
  why: () => lines(wrap(c.why.join(" ")), C.text),
  consult: () => [
    [t("# " + c.consult.heading, C.green)],
    ...c.consult.body.flatMap((l): Paragraph[] => (l === "" ? [[t("")]] : [[t(l)]])),
    [t("")],
    [t("→ "), link(profile.email, "mailto:" + profile.email)],
    [t("→ "), link(profile.linkedinLabel, profile.linkedin)],
  ],
  work: () => [
    ...c.work.flatMap((w): Paragraph[] => [
      [t("• " + w.title, C.green), ...(w.tag ? [t("  (" + w.tag + ")", C.dim)] : [])],
      ...wrap(w.body).map((l): Paragraph => [t("  " + l, C.text)]),
      ...(w.url && w.label ? [[t("  "), link("[" + w.label + "]", w.url)] as Paragraph] : []),
      [t("")],
    ]),
    [t(c.ui.alsoInProduction, C.dim)],
    ...c.alsoShipped.flatMap((s) => wrap(s, 76).map((l, i): Paragraph => [t((i ? "    " : "  • ") + l, C.dim)])),
    [t("")],
    [t(c.ui.sideProjects + " — ", C.dim), cmdlink("projects", "projects")],
  ],
  projects: () => c.projects.map((w): Paragraph => [t("• " + w.line + " "), link("[" + w.label + "]", w.url)]),
  sensors: () =>
    c.capabilities.flatMap((x): Paragraph[] => [
      [t(x.label, C.green)],
      ...wrap(x.items).map((l): Paragraph => [t("  " + l)]),
    ]),
  blog: () =>
    c.posts.length
      ? [
          [t(c.ui.blogHeader, C.dim)],
          ...c.posts.map((p): Paragraph => [cmdlink("• " + p.title, "read " + p.slug), t("  — " + p.date, C.dim)]),
          [t(c.ui.tapNote, C.dim)],
        ]
      : [
          [t(c.ui.blogHeader, C.dim)],
          [t(c.ui.blogElsewhere, C.dim)],
          [link(URLS[alt], PATHS[alt])],
        ],
  read: (args) => {
    openPost(args[0]);
  },
  contact: () => [
    [t(c.ui.bestWayEmail, C.dim)],
    [link(profile.email, "mailto:" + profile.email)],
    [link(profile.linkedinLabel, profile.linkedin)],
    [link(profile.githubLabel, profile.github)],
    [t(c.schema.locality, C.dim)],
  ],
  ls: () => [[t(HELP.map(([x]) => x.split(" ")[0]).join("  "), C.dim)]],
  help: () => HELP.map(([x, d]): Paragraph => [cmdlink(x.padEnd(10), x), t(" " + d, C.dim)]),
  clear: () => term.clear(),
  cv: () => [[t(c.ui.cv.before), link(c.ui.cv.link, profile.linkedin), t(c.ui.cv.after)]],
  sudo: () => [[t(c.ui.sudo.before), link(c.ui.sudo.link, "mailto:" + profile.email), t(c.ui.sudo.after)]],
};

// a few aliases so the obvious guesses land somewhere
commands.stack = commands.sensors;
commands.hire = commands.consult;
commands.email = commands.contact;

function run(raw: string) {
  const cmd = raw.trim();
  if (!cmd) return;
  term.print([[t(profile.host + ":~$ ", C.acc), t(cmd)]], { instant: true });
  const [name, ...args] = cmd.split(/\s+/);
  const fn = commands[name.toLowerCase()];
  if (!fn) {
    term.print([[t(c.ui.commandNotFound + name, C.err)]]);
    return;
  }
  const out = fn(args);
  if (out) term.print(out);
}

// group body lines (blank line = paragraph break) and render the note in its own view
function openPost(slug: string) {
  const p = c.posts.find((x) => x.slug === slug);
  if (!p) {
    term.print([[t(c.ui.noSuchNote + (slug || ""), C.err), t(c.ui.tryCmd, C.dim), cmdlink("blog", "blog")]]);
    return;
  }
  const out: string[] = [];
  let buf: string[] = [];
  for (const l of p.body) {
    if (l === "") { if (buf.length) { out.push(buf.join(" ")); buf = []; } }
    else buf.push(l);
  }
  if (buf.length) out.push(buf.join(" "));

  postbody.innerHTML =
    `<h1>${esc(p.title)}</h1><div class="postmeta">${esc(p.date)}</div>` +
    out.map((x) => `<p>${esc(x)}</p>`).join("");
  postview.hidden = false;
  postview.scrollTop = 0;
}

document.getElementById("postback")!.addEventListener("click", () => {
  postview.hidden = true;
});

// chips run commands
document.getElementById("chips")!.addEventListener("click", (e) => {
  const el = (e.target as HTMLElement).closest("[data-cmd]") as HTMLElement | null;
  if (!el) return;
  run(el.getAttribute("data-cmd")!);
});

// boot
for (const l of c.ui.boot) term.print([[t(l, C.dim)]], { instant: true });
run("whoami");
