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
const lines = (arr: string[], color = C.text): Output => arr.map((l) => [t(l, color)]);

const app = document.querySelector<HTMLDivElement>("#app")!;

const HELP: [string, string][] = [
  ["whoami", "who I am, briefly"],
  ["projects", "things I've built"],
  ["now", "what I'm up to"],
  ["record", "competitions & hackathons"],
  ["irl", "life away from the screen"],
  ["stack", "tools I reach for"],
  ["blog", "the blog — Ground Truth"],
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
    <div class="postview" id="postview" role="dialog" aria-label="Blog post" hidden>
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
  { text: profile.tagline, weight: 500, size: 15, color: C.green },
]);

const term = new Terminal(screen, (c) => run(c));

const commands: Record<string, (args: string[]) => Output | void> = {
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
  blog: () => [
    [t("# Ground Truth — half-formed thoughts, sharpened in public", C.dim)],
    ...posts.map((p): Paragraph => [cmdlink("• " + p.title, "read " + p.slug), t("  — " + p.date, C.dim)]),
    [t("tap a post to open it.", C.dim)],
  ],
  read: (args) => {
    openPost(args[0]);
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
    term.print([[t("command not found: " + name, C.err)]]);
    return;
  }
  const out = fn(args);
  if (out) term.print(out);
}

// group body lines (blank line = paragraph break) and render the post in its own view
function openPost(slug: string) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) {
    term.print([[t("no such post: " + (slug || ""), C.err), t("  — try ", C.dim), cmdlink("blog", "blog")]]);
    return;
  }
  const paras: string[] = [];
  let buf: string[] = [];
  for (const l of p.body) {
    if (l === "") { if (buf.length) { paras.push(buf.join(" ")); buf = []; } }
    else buf.push(l);
  }
  if (buf.length) paras.push(buf.join(" "));

  postbody.innerHTML =
    `<h1>${esc(p.title)}</h1><div class="postmeta">${esc(p.date)}</div>` +
    paras.map((para) => `<p>${esc(para)}</p>`).join("");
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
term.print([[t("// This is my vibe coded website, welcome!", C.dim)]], { instant: true });
term.print([[t("// Tap a command below to explore. Don't drag and bend the text — it might break!", C.dim)]], { instant: true });
run("whoami");
