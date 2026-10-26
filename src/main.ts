import "./style.css";
import { createGlyphField } from "./glyphfield";
import { Terminal, type Run, type Paragraph, type Output } from "./terminal";
import { track, once, describeLink, trackPageLinks, trackSectionViews } from "./analytics";
import {
  locales, isLocale, other, profile, PATHS, URLS, SECTION_IDS,
  type ChipCommand, type ExtraCommand, type Content, type Row, type SectionId,
} from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// Which language's page is this? The build writes <html lang> per page; nothing else in the
// bundle knows, so this one read is what keeps the terminal in step with the page under it.
const langAttr = document.documentElement.lang;
const locale = isLocale(langAttr) ? langAttr : "en";
const c: Content = locales[locale];
const alt = other(locale);

const C = { text: "#e7e7e9", dim: "#8f949c", green: "#7dd3a0", acc: "#4ade80", err: "#f87171", name: "#f4f4f5" };
const t = (text: string, color = C.text, weight = 500): Run => ({ text, color, weight });
const link = (text: string, href: string): Run => ({ text, href, color: C.acc });
const cmdlink = (text: string, cmd: string): Run => ({ text, cmd, color: C.acc });

// Never pre-wrap: each Paragraph is wrapped by PreTeXt to the terminal's actual width, so a
// hard break in the text would show up as a ragged line on any narrower screen.

// A section as the page shows it: dim lead, the line in green, its links; the note and any
// results under it. Leads are padded to the section's longest, so the lines start together —
// with no-break spaces, because PreTeXt collapses runs of ordinary ones like CSS does.
const rowsOut = (rs: Row[]): Output => {
  const pad = Math.max(0, ...rs.map((r) => (r.lead ?? "").length)) + 2;
  const spaced = rs.some((r) => r.note || r.points);
  return rs.flatMap((r): Paragraph[] => [
    [
      ...(pad > 2 ? [t((r.lead ?? "").padEnd(pad, "\u00a0"), C.dim)] : []),
      t(r.title, C.green),
      ...(r.links ?? []).flatMap((l) => [t(" "), link("[" + l.label + "]", l.url)]),
    ],
    ...(r.note ? [[t(r.note)] as Paragraph] : []),
    ...(r.points ?? []).map((x): Paragraph => [t("• " + x, C.dim)]),
    ...(spaced ? [[t("")] as Paragraph] : []),
  ]);
};

const app = document.querySelector<HTMLDivElement>("#app")!;

// Command names stay English in every language — they read as shell commands. Only their
// descriptions and output are localized.
const CHIP_CMDS: ChipCommand[] = ["whoami", ...SECTION_IDS, "cv", "contact", "clear"];
// No chip: reached from the links at the end of `whoami`, and listed by `help`.
const EXTRA_CMDS: ExtraCommand[] = ["why", "irl", "blog"];
const HELP: [string, string][] = [...CHIP_CMDS, ...EXTRA_CMDS].map((cmd) => [cmd, c.ui.helpDesc[cmd]]);

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

// Commands run from a link printed in the terminal (`more: why · irl · blog`, `projects`, …).
const term = new Terminal(
  screen,
  (x) => {
    track("terminal-command", { cmd: x.split(/\s+/)[0], via: "link" });
    run(x);
  },
  {
    onLink: (href) => {
      const d = describeLink(href);
      if (d) track("link-click", { ...d, from: "terminal" });
    },
    onDrag: () => once("terminal-drag"),
  }
);

const commands: Record<string, (args: string[]) => Output | void> = {
  whoami: () => [
    ...rowsOut(c.whoami),
    [t("")],
    [t(c.ui.more, C.dim), ...EXTRA_CMDS.flatMap((x, i) => [...(i ? [t(" · ", C.dim)] : []), cmdlink(x, x)])],
  ],
  why: () => [[t(c.why)]],
  irl: () => c.irl.map((l): Paragraph => [t("• " + l)]),
  ...Object.fromEntries(
    SECTION_IDS.map((id: SectionId) => [id, () => rowsOut(c.sections[id].rows)])
  ),
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
  cv: () => [[t("→ "), link(c.ui.cv, profile.cv)]],
  contact: () => [
    [link(profile.email, "mailto:" + profile.email)],
    [link(profile.linkedinLabel, profile.linkedin)],
    [link(profile.githubLabel, profile.github)],
    [link(profile.scholarLabel, profile.scholar)],
    [link(c.ui.cv, profile.cv)],
    [t(c.schema.locality, C.dim)],
  ],
  ls: () => [[t(HELP.map(([x]) => x.split(" ")[0]).join("  "), C.dim)]],
  help: () => HELP.map(([x, d]): Paragraph => [cmdlink(x.padEnd(13), x), t(" " + d, C.dim)]),
  clear: () => term.clear(),
  sudo: () => [[t(c.ui.sudo.before), link(c.ui.sudo.link, "mailto:" + profile.email), t(c.ui.sudo.after)]],
};

// a few aliases so the obvious guesses land somewhere
commands.sensors = commands.skills;
commands.stack = commands.skills;
commands.resume = commands.cv;
commands.papers = commands.publications;
commands.research = commands.publications;
commands.awards = commands.competitions;
commands.hire = commands.contact;
commands.consult = commands.contact;
commands.email = commands.contact;

function run(raw: string) {
  const cmd = raw.trim();
  if (!cmd) return;
  term.print([[t(profile.host + ":~$ ", C.acc), t(cmd)]], { instant: true, command: true });
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
  const cmd = el.getAttribute("data-cmd")!;
  track("terminal-command", { cmd, via: "chip" });
  run(cmd);
});

// boot
for (const l of c.ui.boot) term.print([[t(l, C.dim)]], { instant: true });
run("whoami");

// analytics (src/analytics.ts): the banner, and the written page's sections and links
document.getElementById("banner")!.addEventListener("pointerdown", () => once("banner-play"));
trackSectionViews(document.querySelectorAll("#site section"));
trackPageLinks(document);
