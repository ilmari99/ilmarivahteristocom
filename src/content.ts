// Single source of truth. Keep it short and human — edit the strings, the terminal reads them.
// TODO markers show where to add your own words later.

export const profile = {
  name: "Ilmari Vahteristo",
  // Shown in the interactive header.
  tagline: "I teach computers to be smart.",
  host: "ilmari@vahteristo",
  email: "i.vahteristo@gmail.com",
  github: "https://github.com/ilmari99",
  linkedin: "https://www.linkedin.com/in/ilmariv/",
};

// `whoami`
export const whoami: string[] = [
  "Hi — I'm Ilmari.",
  "Day job: perception systems for heavy industry — cameras, LiDAR, and lasers — at a",
  "startup in Pori, Finland. MSc in computer vision; a second MSc in robotics in progress at Aalto.",
  "Eternal student, balanced builder and curious researcher, with an entrepreneurial mind.",
];

// `now`
export const now: string[] = [
  "→ Building measurement systems that run in real time on the factory floor.",
  "→ Finishing a robotics master's at Aalto.",
  "→ Increasingly drawn to the founder path. If you're building something bold,",
  "  let's talk.",
];

// `irl` — the human behind the keyboard
export const irl: string[] = [
  "Away from the screen:",
  "• Ice hockey, the odd game of football, and orienteering.",
  "• Poker nights and time with friends.",
  "• Audiobooks on long drives, and any excuse to be outdoors.",
  "• I like organizing events for friends.",
  "• Military leadership experience from a peacekeeping deployment: can dispose bombs if necessary.",
];

// `projects` — a handful. { one-liner, link }
export const projects: { line: string; url: string; label: string }[] = [
  { line: "PolyGate — an MCP server that lets LLM agents research & trade prediction markets.", label: "github", url: "https://github.com/ilmari99/polygate" },
  { line: "Data-efficient limited-angle CT — my first-author IEEE paper (SCIA).", label: "arXiv", url: "https://arxiv.org/abs/2502.12293" },
  { line: "BLASE — a global optimizer for spherical codes that beat 1,550 known records (20.7%).", label: "github", url: "https://github.com/ilmari99/tammes_BLASE" },
  { line: "LiDAR 3D reconstruction — rigid motion-compensated 3D reconstruction of moving trucks from LiDAR alone, ~37 mm.", label: "thesis", url: "https://lutpub.lut.fi/handle/10024/170362" },
  { line: "Moska — an RL agent that outranks the best humans at a Finnish card game.", label: "thesis", url: "https://urn.fi/URN:NBN:fi-fe2023051644576" },
];

// `record` — competitions & hackathons. { line, optional link, or a section head }
export const record: { line: string; label?: string; url?: string; head?: boolean }[] = [
  { line: "Hackathons", head: true },
  { line: "Junction 2025 — won the ElevenLabs voice-AI challenge.", label: "demo", url: "https://youtu.be/WhviYsdgZNE" },
  { line: "Junction 2024 — top 5% of ~300 teams with EquipSnap.", label: "demo", url: "https://www.youtube.com/watch?v=jerwB3SQ5Ok" },
  { line: "Koodausta ja kisailua (Visma) — 1st of 20 teams." },
  { line: "Competitions", head: true },
  { line: "Kaggle · LLM 20 Questions — 7th of 800." },
  { line: "Google Foobar — 9 puzzles deep, which earned a Google interview.", label: "solutions", url: "https://github.com/ilmari99/google-foobar" },
  { line: "IndySCC — supercomputing, 3rd of 10 universities worldwide." },
];

// `stack`
export const stack =
  "Python · PyTorch · TensorFlow · OpenCV · NumPy/pandas · C · Linux · Git";

// `writing` — add posts here; each becomes readable with `read <slug>`.
export type Post = { slug: string; title: string; date: string; body: string[] };
export const posts: Post[] = [
  {
    slug: "ground-truth",
    title: "Ground truth",
    date: "2026-07-05",
    body: [
      "In machine learning, the ground truth is the real answer — the thing you measure",
      "everything else against. I'd like this blog held to the same standard: the real",
      "thought, not the tidy version of it.",
      "",
      "Expect notes on what perception systems actually do once they leave the lab,",
      "opinions I'm willing to argue for, and the occasional honest life update.",
      "",
      "// TODO(ilmari): placeholder — replace with the first real post.",
    ],
  },
];
