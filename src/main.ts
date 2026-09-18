import "./style.css";
import { createGlyphField } from "./glyphfield";
import { Terminal, type Run, type Paragraph, type Output } from "./terminal";
import {
  profile, whoami, now, irl, work, alsoShipped, projects, capabilities, consult, why, posts,
} from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

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

const HELP: [string, string][] = [
  ["whoami", "who I am, briefly"],
  ["consult", "the free 1-hour session"],
  ["work", "what I've built"],
  ["sensors", "sensors, methods, systems"],
  ["now", "what I'm up to"],
  ["why", "what I'm actually betting on"],
  ["irl", "life away from the screen"],
  ["blog", "notes — Ground Truth"],
  ["contact", "how to reach me"],
  ["clear", "clear the screen"],
];

// every command becomes a chip (skip the ones needing an argument).
const CHIP_CMDS = HELP.map(([c]) => c).filter((c) => !c.includes(" "));

app.innerHTML = `
  <div class="term" role="application" aria-label="Interactive terminal">
    <div class="bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="title">${esc(profile.host)}: ~</span>
      <span class="spacer"></span>
      <a class="bar-link" href="mailto:${esc(profile.email)}">say hi</a>
    </div>
    <canvas id="banner" aria-label="${esc(profile.name)} — ${esc(profile.tagline)}"></canvas>
    <div class="screen" id="screen"></div>
    <div class="chips" id="chips" aria-label="command suggestions">
      ${CHIP_CMDS
        .map((c) => `<button data-cmd="${c}"><span class="chips-caret">›</span>${c}</button>`)
        .join("")}
    </div>
    <div class="postview" id="postview" role="dialog" aria-label="Note" hidden>
      <div class="postbar">
        <button class="postback" id="postback"><span class="chips-caret">‹</span>back to terminal</button>
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
  { text: profile.role, weight: 500, size: 15, color: C.green },
]);

const term = new Terminal(screen, (c) => run(c));

const commands: Record<string, (args: string[]) => Output | void> = {
  whoami: () => lines(whoami),
  now: () => lines(now),
  irl: () => lines(irl),
  why: () => lines(wrap(why.join(" ")), C.text),
  consult: () => [
    [t("# " + consult.heading, C.green)],
    ...consult.body.flatMap((l): Paragraph[] => (l === "" ? [[t("")]] : [[t(l)]])),
    [t(""), ],
    [t("→ "), link(profile.email, "mailto:" + profile.email)],
    [t("→ "), link("linkedin.com/in/ilmariv", profile.linkedin)],
  ],
  work: () => [
    ...work.flatMap((w): Paragraph[] => [
      [t("• " + w.title, C.green), ...(w.tag ? [t("  (" + w.tag + ")", C.dim)] : [])],
      ...wrap(w.body).map((l): Paragraph => [t("  " + l, C.text)]),
      ...(w.url && w.label ? [[t("  "), link("[" + w.label + "]", w.url)] as Paragraph] : []),
      [t("")],
    ]),
    [t("Also in production:", C.dim)],
    ...alsoShipped.flatMap((s) => wrap(s, 76).map((l, i): Paragraph => [t((i ? "    " : "  • ") + l, C.dim)])),
    [t("")],
    [t("Side projects — ", C.dim), cmdlink("projects", "projects")],
  ],
  projects: () => projects.map((w): Paragraph => [t("• " + w.line + " "), link("[" + w.label + "]", w.url)]),
  sensors: () =>
    capabilities.flatMap((c): Paragraph[] => [
      [t(c.label, C.green)],
      ...wrap(c.items).map((l): Paragraph => [t("  " + l)]),
    ]),
  blog: () => [
    [t("# Ground Truth — half-formed thoughts, sharpened in public", C.dim)],
    ...posts.map((p): Paragraph => [cmdlink("• " + p.title, "read " + p.slug), t("  — " + p.date, C.dim)]),
    [t("tap a note to open it.", C.dim)],
  ],
  read: (args) => {
    openPost(args[0]);
  },
  contact: () => [
    [t("Best way to reach me is email:", C.dim)],
    [link(profile.email, "mailto:" + profile.email)],
    [link("linkedin.com/in/ilmariv", profile.linkedin)],
    [link("github.com/ilmari99", profile.github)],
    [t(profile.location, C.dim)],
  ],
  ls: () => [[t(HELP.map(([c]) => c.split(" ")[0]).join("  "), C.dim)]],
  help: () => HELP.map(([c, d]): Paragraph => [cmdlink(c.padEnd(10), c), t(" " + d, C.dim)]),
  clear: () => term.clear(),
  cv: () => [[t("résumé lives on my "), link("LinkedIn", profile.linkedin), t(" for now.")]],
  sudo: () => [[t("Nice try. If you want to escalate my privileges, "), link("just ask", "mailto:" + profile.email), t(".")]],
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
    term.print([[t("command not found: " + name, C.err)]]);
    return;
  }
  const out = fn(args);
  if (out) term.print(out);
}

// group body lines (blank line = paragraph break) and render the note in its own view
function openPost(slug: string) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) {
    term.print([[t("no such note: " + (slug || ""), C.err), t("  — try ", C.dim), cmdlink("blog", "blog")]]);
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
term.print([[t("// Computer vision and sensor systems for manufacturers. Helsinki.", C.dim)]], { instant: true });
term.print([[t("// Tap a command, or just scroll — everything is written out below.", C.dim)]], { instant: true });
run("whoami");
