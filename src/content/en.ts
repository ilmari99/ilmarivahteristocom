import type { Content } from "./types";

export const en: Content = {
  locale: "en",

  meta: {
    title: "Ilmari Vahteristo — computer vision consultant, Finland",
    description:
      "I help Finnish companies and manufacturers use cameras, sensors and machine learning " +
      "in production, automation and decision-making. Based in Helsinki, on-site in Uusimaa. " +
      "Free 1-hour consultation.",
    ogTitle: "Ilmari Vahteristo — computer vision and sensor systems for manufacturers",
    ogDescription:
      "Computer vision and AI/ML consultant in Helsinki. Cameras, LiDAR, radar and lasers in " +
      "real production. Free 1-hour consultation — bring a problem, leave with an honest answer.",
    ogLocale: "en_US",
  },

  headline: "Computer vision and sensor systems for manufacturers",
  role: "Computer vision and AI/ML consultant",
  tagline: "I teach computers to see.",

  // The one paragraph under the heading. Say what you do, for whom, and where.
  intro: [
    "I help Finnish companies and manufacturers, regardless of size, use cameras, sensors and",
    "machine learning in their production, automation, decision-making and data gathering.",
    "Based in Helsinki; I prefer to meet on-site in the Uusimaa area. I work in Finnish and English.",
  ],

  // The offer — the main reason someone should get in touch.
  consult: {
    heading: "Free 1-hour consultation",
    body: [
      "Bring a problem or an idea. We go through how it could be solved with AI, machine learning",
      "and computer vision tools, what it would need in terms of data and hardware, and what",
      "accuracy and trade-offs are realistic.",
      "",
      "Free, no strings attached — I prefer to meet on-site in the Uusimaa area. If you decide the",
      "problem is worth solving, I can help you solve it, or help you find someone who can.",
      "",
      "If you think the problem is shared across an industry, or there's a scalable business",
      "opportunity in it, I'm all the more interested.",
    ],
    // The hero link points down to this section; the section itself carries the real contact.
    heroCta: "What the free session covers",
  },

  // Four entries. Keep each to a couple of sentences a non-specialist can read.
  work: [
    {
      title: "Multi-camera tracking through occlusions",
      tag: "industry",
      body:
        "Real-time object detection and tracking across a multi-camera system, where targets " +
        "regularly disappear behind obstacles and have to be re-identified when they reappear. " +
        "3 cm accuracy from 6 m away, running on edge hardware on the factory floor.",
    },
    {
      title: "3D reconstruction of moving vehicles",
      tag: "industry",
      body:
        "Rigid, motion-compensated 3D reconstruction of trucks while they drive past — " +
        "correcting for the vehicle's own rotation and acceleration — from LiDAR and radar. " +
        "Around 4 cm accuracy in production.",
      label: "master's thesis",
      url: "https://lutpub.lut.fi/handle/10024/170362",
    },
    {
      title: "CT image reconstruction from X-ray data",
      tag: "academic",
      body:
        "Data-efficient limited-angle computed tomography: usable reconstructions from far " +
        "fewer X-ray projections than a standard scan needs. First-author paper at SCIA (IEEE).",
      label: "arXiv",
      url: "https://arxiv.org/abs/2502.12293",
    },
    {
      title: "Competitions and hackathons",
      body:
        "Junction 2025 — won the ElevenLabs voice-AI challenge. Kaggle LLM 20 Questions — 7th " +
        "of 800. IndySCC supercomputing — 3rd of 10 universities worldwide. Google Foobar — " +
        "nine puzzles deep, which earned a Google interview.",
    },
  ],

  alsoShipped: [
    "Plank thickness and length measurement by laser triangulation — sub-0.5 mm accuracy.",
    "OCR for low-quality packaging print, with majority voting — over 99.5% accuracy.",
  ],

  projects: [
    { line: "PolyGate — an MCP server that lets LLM agents research & trade prediction markets.", label: "github", url: "https://github.com/ilmari99/polygate" },
    { line: "BLASE — a global optimizer for spherical codes that beat 1,550 known records (20.7%).", label: "github", url: "https://github.com/ilmari99/tammes_BLASE" },
    { line: "Moska — an RL agent that outranks the best humans at a Finnish card game.", label: "thesis", url: "https://urn.fi/URN:NBN:fi-fe2023051644576" },
  ],

  capabilities: [
    { label: "Sensors", items: "LiDAR · radar · laser triangulation · cameras · IMU · sound" },
    { label: "Methods", items: "Deep learning · computer vision · optimization · multi-sensor setups · AI/LLM tooling" },
    { label: "Systems", items: "Edge compute · real-time inference · PLC · Python · C · Docker · Git · Linux" },
  ],

  why: [
    "I think an era of abundant digital intelligence is beginning, and the interesting problem",
    "is converting it into economically useful work: observe the real world with sensors, turn",
    "that into a digital representation, and have software and hardware do something valuable",
    "with it. Only a customer knows what counts as valuable to them — which is why I start by",
    "listening rather than by proposing a model.",
  ],

  whoami: [
    "Hi — I'm Ilmari, a computer vision and AI/ML consultant in Helsinki.",
    "I build perception systems for industry: cameras, LiDAR, radar and lasers,",
    "running in real time on the factory floor. MSc in computational mathematics;",
    "a second MSc in robotics in progress at Aalto.",
    "Entrepreneurially minded, and currently taking on client work.",
  ],

  now: [
    "→ Consulting on computer vision and sensor systems for Finnish manufacturers.",
    "→ Offering free 1-hour sessions, on-site in Uusimaa — bring a problem or an idea.",
    "→ Finishing a robotics master's at Aalto.",
  ],

  irl: [
    "Away from the screen:",
    "• Ice hockey, the odd game of football, and orienteering.",
    "• Poker nights and time with friends.",
    "• Audiobooks on long drives, and any excuse to be outdoors.",
    "• I like organizing events for friends.",
    "• Military leadership experience from a peacekeeping deployment in South Lebanon.",
  ],

  posts: [
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
      ],
    },
  ],

  ui: {
    sections: {
      work: "Work",
      capabilities: "Sensors and methods",
      why: "Why",
      writing: "Ground Truth — notes",
      contact: "Contact",
    },
    alsoInProduction: "Also in production:",
    sideProjects: "Side projects",
    messageOnLinkedIn: "message me on LinkedIn",
    switchLabel: "Suomeksi",

    termAria: "Interactive terminal",
    chipsAria: "command suggestions",
    noteAria: "Note",
    sayHi: "say hi",
    backToTerminal: "back to terminal",
    bestWayEmail: "Best way to reach me is email:",
    blogHeader: "# Ground Truth — half-formed thoughts, sharpened in public",
    tapNote: "tap a note to open it.",
    blogElsewhere: "The notes are written in English — read them on the English site.",
    commandNotFound: "command not found: ",
    noSuchNote: "no such note: ",
    tryCmd: "  — try ",
    cv: { before: "résumé lives on my ", link: "LinkedIn", after: " for now." },
    sudo: {
      before: "Nice try. If you want to escalate my privileges, ",
      link: "just ask",
      after: ".",
    },
    boot: [
      "// Computer vision and sensor systems for manufacturers. Helsinki.",
      "// Tap a command, or just scroll — everything is written out below.",
    ],
    helpDesc: {
      whoami: "who I am, briefly",
      consult: "the free 1-hour session",
      work: "what I've built",
      sensors: "sensors, methods, systems",
      now: "what I'm up to",
      why: "what I'm actually betting on",
      irl: "life away from the screen",
      blog: "notes — Ground Truth",
      contact: "how to reach me",
      clear: "clear the screen",
    },
  },

  schema: {
    knowsAbout: [
      "Computer vision", "Machine learning", "LiDAR", "Radar", "Laser triangulation",
      "Sensor fusion", "Edge computing", "Industrial automation", "Python", "C",
    ],
    areaServed: "Uusimaa, Finland",
    locality: "Helsinki",
  },
};
