import "./style.css";
import { createGlyphField } from "./glyphfield";
import { Terminal, type Run, type Paragraph, type Output } from "./terminal";
import { profile, whoami, now, irl, projects, record, stack, posts } from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const C = { text: "#e7e7e9", dim: "#6b6f76", green: "#7dd3a0", acc: "#4ade80", err: "#f87171", name: "#f4f4f5" };
const t = (text: string, color = C.text, weight = 500): Run => ({ text, color, weight });
const link = (text: string, href: string): Run => ({ text, href, color: C.acc });
const cmdlink = (text: string, cmd: string): Run => ({ text, cmd, color: C.acc });
const BLANK: Paragraph = [];
const lines = (arr: string[], color = C.text): Output => arr.map((l) => [t(l, color)]);

const app = document.querySelector<HTMLDivElement>("#app")!;

const HELP: [string, string][] = [
  ["whoami", "who I am, briefly"],
  ["projects", "things I've built"],
  ["now", "what I'm up to"],
  ["record", "competitions & hackathons"],
  ["irl", "life away from the screen"],
  ["stack", "tools I reach for"],
  ["writing", "the blog — Ground Truth"],
  ["read <slug>", "open a post"],
  ["contact", "how to reach me"],
  ["clear", "clear the screen"],
];

// every command becomes a chip (skip the ones needing an argument); help closes the list.
const CHIP_CMDS = [...HELP.map(([c]) => c).filter((c) => !c.includes(" ")), "help"];

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
    <form class="promptline" id="form" autocomplete="off">
      <span class="ps1">${esc(profile.host)}:~$</span>
      <input id="input" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="terminal input" />
    </form>
    <div class="chips" id="chips" aria-label="command suggestions">
      <span class="chips-lead">⇥ tab</span>
      ${CHIP_CMDS
        .map((c) => `<button data-cmd="${c}"><span class="chips-caret">›</span>${c}</button>`)
        .join("")}
    </div>
  </div>`;

const screen = document.getElementById("screen")!;
const input = document.getElementById("input") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

// interactive header — assembled from a point cloud, scatters under the cursor (also PreTeXt)
createGlyphField(document.getElementById("banner") as HTMLCanvasElement, [
  { text: profile.name, weight: 700, size: 42, color: C.name },
  { text: profile.tagline, weight: 500, size: 15, color: C.green },
]);

const term = new Terminal(screen, (c) => run(c));

const commands: Record<string, (args: string[]) => Output | void> = {
  help: () => [
    [t("commands — tap one or type it", C.dim)],
    ...HELP.map(([c, d]): Paragraph => [cmdlink(c.split(" ")[0], c.split(" ")[0]), t("  " + d, C.dim)]),
  ],
  whoami: () => lines(whoami),
  now: () => lines(now),
  irl: () => lines(irl),
  projects: () => projects.map((w): Paragraph => [t("• " + w.line + " "), link("[" + w.label + "]", w.url)]),
  record: () =>
    record.map((r): Paragraph =>
      r.head
        ? [t(r.line, C.dim)]
        : r.url
          ? [t("★ " + r.line + " "), link("[" + r.label + "]", r.url)]
          : [t("★ " + r.line)]
    ),
  stack: () => [[t(stack)]],
  writing: () => [
    [t("# Ground Truth — half-formed thoughts, sharpened in public", C.dim)],
    ...posts.map((p): Paragraph => [cmdlink(p.title, "read " + p.slug), t("  — " + p.date + " · " + p.slug, C.dim)]),
    [t("read one with: ", C.dim), t("read <slug>")],
  ],
  read: (args) => {
    const p = posts.find((x) => x.slug === args[0]);
    if (!p) return [[t("no such post: " + (args[0] || ""), C.err), t("  — try ", C.dim), cmdlink("writing", "writing")]];
    return [[t(p.title, C.green, 700), t("  — " + p.date, C.dim)], ...p.body.map((l): Paragraph => (l === "" ? BLANK : [t(l)]))];
  },
  contact: () => [
    [t("Best way to reach me is email:", C.dim)],
    [link(profile.email, "mailto:" + profile.email)],
    [link("github.com/ilmari99", profile.github)],
    [link("linkedin.com/in/ilmariv", profile.linkedin)],
  ],
  ls: () => [[t(HELP.map(([c]) => c.split(" ")[0]).join("  "), C.dim)]],
  clear: () => term.clear(),
  cv: () => [[t("résumé lives on my "), link("GitHub", profile.github), t(" for now.")]],
  sudo: () => [[t("Nice try. If you want to escalate my privileges, "), link("just ask", "mailto:" + profile.email), t(".")]],
};

function run(raw: string) {
  const cmd = raw.trim();
  if (!cmd) return;
  term.print([[t(profile.host + ":~$ ", C.acc), t(cmd)]], { instant: true });
  const [name, ...args] = cmd.split(/\s+/);
  const fn = commands[name.toLowerCase()];
  if (!fn) {
    term.print([[t("command not found: " + name, C.err), t("  — type ", C.dim), cmdlink("help", "help")]]);
    return;
  }
  const out = fn(args);
  if (out) term.print(out);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = input.value;
  input.value = "";
  run(v);
});

// Tab completes / cycles through the known commands, like a real shell.
input.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  e.preventDefault();
  const cur = input.value.trim().toLowerCase();
  const matches = CHIP_CMDS.filter((c) => c.startsWith(cur));
  const pool = matches.length ? matches : CHIP_CMDS;
  const next = pool[(pool.indexOf(cur) + 1) % pool.length];
  input.value = next;
});

// chips run commands
document.getElementById("chips")!.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest("[data-cmd]") as HTMLElement | null;
  if (!t) return;
  run(t.getAttribute("data-cmd")!);
  input.focus();
});

// keep focus in the prompt unless a link on the canvas was clicked (mouse only —
// on touch this would pop the keyboard every time you tap to read)
screen.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch") return;
  setTimeout(() => input.focus(), 0);
});

// boot
term.print([[t("// This is my vibe coded website, welcome!", C.dim)]], { instant: true });
term.print([[t("// Type a command or tap one below. Don't drag and bend the text — it might break!", C.dim)]], { instant: true });
run("whoami");
// Only auto-focus on devices with a fine pointer (mouse). On touch, focusing pops the
// on-screen keyboard on load, which shrinks the viewport and misaligns/clips the layout.
if (window.matchMedia("(pointer: fine)").matches) input.focus();
