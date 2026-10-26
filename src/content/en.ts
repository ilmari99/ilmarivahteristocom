import type { Content } from "./types";

export const en: Content = {
  locale: "en",

  meta: {
    title: "Ilmari Vahteristo — machine learning and computer vision engineer",
    description:
      "ML and computer vision engineer in Helsinki. Real-time perception on edge hardware with " +
      "cameras, LiDAR, radar and lasers, shipped to industry. Published research in optimization " +
      "and computational imaging. MSc (Tech), LUT University.",
    ogTitle: "Ilmari Vahteristo — machine learning and computer vision engineer",
    ogDescription:
      "Perception systems that run in the real world: multi-camera tracking, 3D reconstruction " +
      "of moving vehicles, laser measurement, CT reconstruction. Helsinki, Finland.",
    ogLocale: "en_US",
  },

  role: "Machine learning and computer vision engineer",
  tagline: "I teach computers to see.",
  intro:
    "I build perception systems that run in the real world: cameras, LiDAR, radar and lasers " +
    "on edge hardware, in factories and heavy industry.",
  availability: "Open to roles in computer vision and applied ML · Helsinki",

  sections: {
    experience: {
      heading: "Experience",
      rows: [
        {
          lead: "2025–26",
          title: "Software Engineer, ML / CV · Virelabs",
          note: "Real-time perception for heavy industry, on edge hardware.",
          points: [
            "Multi-camera tracking through occlusions — 5 cm at 6 m",
            "3D reconstruction of moving vehicles — line cameras, LiDAR, radar",
            "Veneer quality control by laser triangulation — 0.5 mm from over 1 m",
            "OCR on industrial packaging, with majority voting — 99.9 %",
          ],
        },
        { lead: "2024", title: "Research Assistant · LUT University", note: "Deep learning for limited-angle CT reconstruction." },
        { lead: "2024–25", title: "Freelance data scientist", note: "Predicted restaurant customer volume from the menu, to cut food waste." },
        { lead: "2020–21", title: "Peacekeeper · UNIFIL, Lebanon", note: "Squad co-lead, then squad lead and team co-lead." },
      ],
    },
    publications: {
      heading: "Publications",
      rows: [
        {
          lead: "2026",
          title: "New spherical codes by tuning an annealing solver",
          note: "Preprint, sole author. New best-known codes for 15 % of 29,670 cases.",
          links: [
            { label: "arXiv", url: "https://arxiv.org/abs/2610.19988" },
            { label: "code", url: "https://github.com/ilmari99/tammes_BLASE" },
          ],
        },
        {
          lead: "2025",
          title: "Data-efficient limited-angle CT using deep priors and regularization",
          note: "SCIA (IEEE), first author.",
          links: [{ label: "arXiv", url: "https://arxiv.org/abs/2502.12293" }],
        },
        {
          lead: "2025",
          title: "Stationary LiDAR, moving target: pure LiDAR solution for motion estimation and 3D reconstruction",
          note: "Master's thesis, LUT University, with Virelabs.",
          links: [{ label: "pdf", url: "https://urn.fi/URN:NBN:fi-fe2025082784786" }],
        },
        {
          lead: "2023",
          title: "Man vs machine: beating humans in a multiplayer card game without lookahead",
          note: "Bachelor's thesis, LUT University.",
          links: [{ label: "pdf", url: "https://urn.fi/URN:NBN:fi-fe2023051644576" }],
        },
      ],
    },
    projects: {
      heading: "Projects",
      rows: [
        {
          lead: "Moska",
          title: "Card-game AI that beats top human players",
          note: "Now also a benchmark of how LLMs play a game they have never seen.",
          links: [{ label: "moska.eu", url: "https://moska.eu/" }],
        },
        {
          lead: "PolyGate",
          title: "MCP server for LLM agents on prediction markets",
          links: [{ label: "github", url: "https://github.com/ilmari99/polygate" }],
        },
      ],
    },
    competitions: {
      heading: "Competitions",
      rows: [
        { lead: "2025", title: "Junction — won the ElevenLabs challenge", links: [{ label: "demo", url: "https://youtu.be/WhviYsdgZNE" }] },
        { lead: "2024", title: "Junction — top 5 % in peer review", links: [{ label: "demo", url: "https://www.youtube.com/watch?v=jerwB3SQ5Ok" }] },
        { lead: "2024", title: "Kaggle LLM 20 Questions — 7th of 800" },
        { lead: "2023", title: "Visma coding competition — 1st of 20 teams" },
        { lead: "2022", title: "IndySCC supercomputing — 3rd of 10 universities" },
      ],
    },
    education: {
      heading: "Education",
      rows: [
        { lead: "2025", title: "MSc (Tech), Computer Vision · LUT University", note: "GPA 4.2 / 5. Exchange at IST Lisbon." },
        { lead: "now", title: "MSc, Robotics and Automation · Aalto University" },
      ],
    },
    skills: {
      heading: "Skills",
      rows: [
        { lead: "Sensors", title: "Cameras · LiDAR · radar · laser triangulation · IMU" },
        { lead: "Methods", title: "Deep learning · 3D vision · tracking · sensor fusion · optimization" },
        { lead: "Tools", title: "Python · C · Docker · Git · Linux · edge compute · PLC" },
      ],
    },
  },

  // Reads like the output of a real `whoami`: a card, not a speech.
  whoami: [
    { lead: "name", title: "Ilmari Vahteristo" },
    { lead: "role", title: "Machine learning and computer vision engineer" },
    { lead: "builds", title: "Perception on edge hardware — cameras, LiDAR, radar, lasers" },
    { lead: "degree", title: "MSc (Tech), LUT · now MSc Robotics, Aalto" },
    { lead: "based", title: "Helsinki, Finland" },
    { lead: "status", title: "Open to roles in computer vision and applied ML" },
  ],

  why:
    "I think an era of abundant digital intelligence is beginning, and the interesting problem " +
    "is converting it into economically useful work: observe the real world with sensors, turn " +
    "that into a digital representation, and have software and hardware do something valuable " +
    "with it.",

  irl: [
    "Ice hockey, the odd game of football, and orienteering.",
    "Poker nights, time with friends, and organizing events for them.",
    "Audiobooks on long drives, and any excuse to be outdoors.",
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
    contact: "Contact",
    emailMe: "email me",
    cv: "CV (PDF)",
    switchLabel: "Suomeksi",

    termAria: "Interactive terminal",
    chipsAria: "command suggestions",
    noteAria: "Note",
    sayHi: "say hi",
    backToTerminal: "back to terminal",
    more: "more: ",
    blogHeader: "# Ground Truth — half-formed thoughts, sharpened in public",
    tapNote: "tap a note to open it.",
    blogElsewhere: "The notes are written in English — read them on the English site.",
    commandNotFound: "command not found: ",
    noSuchNote: "no such note: ",
    tryCmd: "  — try ",
    sudo: {
      before: "Nice try. If you want to escalate my privileges, ",
      link: "just ask",
      after: ".",
    },
    boot: [
      "// Machine learning and computer vision engineer. Helsinki.",
      "// Tap a command, or just scroll.",
    ],
    helpDesc: {
      whoami: "who I am, briefly",
      experience: "roles and results",
      publications: "papers and theses",
      projects: "side projects",
      competitions: "competitions",
      education: "degrees",
      skills: "sensors, methods, tools",
      cv: "download my CV",
      contact: "how to reach me",
      clear: "clear the screen",
      why: "what I'm betting on",
      irl: "life away from the screen",
      blog: "notes — Ground Truth",
    },
  },

  schema: {
    knowsAbout: [
      "Computer vision", "Machine learning", "Deep learning", "3D reconstruction",
      "Object tracking", "LiDAR", "Radar", "Laser triangulation", "Sensor fusion",
      "Edge computing", "Numerical optimization", "Computed tomography", "Python", "C",
    ],
    locality: "Helsinki",
  },
};
