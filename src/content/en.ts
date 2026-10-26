import type { Content } from "./types";

export const en: Content = {
  locale: "en",

  meta: {
    title: "Ilmari Vahteristo — computer vision and ML engineer, Helsinki",
    // Under ~160 characters, or search engines cut it. Who, where, open to what, then proof.
    description:
      "Computer vision and ML engineer in Helsinki, open to new opportunities. Camera, LiDAR " +
      "and radar systems deployed in industry; papers on CT and spherical codes.",
    ogTitle: "Ilmari Vahteristo — computer vision and ML engineer, Helsinki",
    ogDescription:
      "Perception systems that run in the real world: multi-camera tracking, 3D reconstruction " +
      "of moving vehicles, laser measurement, CT reconstruction. Helsinki, Finland.",
    ogLocale: "en_US",
  },

  role: "Computer vision and machine learning engineer",
  tagline: "I teach computers to see.",
  intro:
    "I build perception systems that run in the real world: cameras, LiDAR, radar and lasers " +
    "on edge hardware, in factories and heavy industry. At a seven-person startup I worked " +
    "directly with customers and built four systems that are now deployed.",
  availability: "Based in Helsinki and open to new opportunities — happy to talk over a call or coffee.",

  sections: {
    experience: {
      heading: "Experience",
      rows: [
        {
          lead: "2025–26",
          title: "Software Engineer, ML / CV · Virelabs",
          note: "A team of seven. Worked directly with customers; all four systems are deployed.",
          points: [
            "Multi-camera tracking through occlusions — 5 cm at 6 m",
            "3D reconstruction of moving vehicles, line cameras + LiDAR + radar — 4 cm",
            "Veneer quality control by laser triangulation — 0.5 mm from over 1 m",
            "OCR on industrial packaging, with majority voting — 99.9 %",
          ],
        },
        { lead: "2024", title: "Research Assistant · LUT University", note: "Deep learning for limited-angle CT. First author of the paper; presented it at SCIA 2025." },
        { lead: "2024–25", title: "Freelance data scientist", note: "Predicted restaurant customer volume from the menu, to cut food waste." },
      ],
    },
    leadership: {
      heading: "Leadership",
      rows: [
        { lead: "2021–22", title: "Project Manager · Lateksii, LUT student guild", note: "Led the organizing team and volunteers; events of up to 900 people." },
        { lead: "2020–21", title: "Peacekeeper · UNIFIL, Lebanon", note: "Squad co-lead; promoted to part-time team co-lead." },
      ],
    },
    publications: {
      heading: "Publications",
      rows: [
        {
          lead: "2026",
          title: "New spherical codes by tuning an annealing solver",
          note: "Preprint, sole author. Holds over 3,000 of the current records on spherical-codes.org.",
          links: [
            { label: "arXiv", url: "https://arxiv.org/abs/2610.19988" },
            { label: "code", url: "https://github.com/ilmari99/Spherical-code-solver" },
            { label: "records", url: "https://spherical-codes.org/" },
          ],
        },
        {
          lead: "2025",
          title: "Data-efficient limited-angle CT using deep priors and regularization",
          note: "SCIA 2025 (Springer LNCS). First author and presenter.",
          // The published chapter is paywalled; arXiv is the free copy.
          links: [
            { label: "Springer", url: "https://doi.org/10.1007/978-3-031-95918-9_26" },
            { label: "arXiv", url: "https://arxiv.org/abs/2502.12293" },
          ],
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
        { lead: "2024", title: "Kaggle LLM 20 Questions — gold medal, 7th of 800" },
        { lead: "2023", title: "Visma coding competition — 1st of 20 teams" },
        { lead: "2022", title: "IndySCC supercomputing — 3rd of 10 universities" },
      ],
    },
    education: {
      heading: "Education",
      rows: [
        { lead: "2025", title: "MSc (Tech), Computer Vision · LUT University", note: "GPA 4.2 / 5. Exchange at IST Lisbon." },
        { lead: "now", title: "MSc, Robotics and Automation · Aalto University", note: "Part-time." },
      ],
    },
    skills: {
      heading: "Skills",
      rows: [
        { lead: "Sensors", title: "Cameras · LiDAR · radar · laser triangulation · IMU" },
        { lead: "Methods", title: "Deep learning · 3D vision · tracking · sensor fusion · optimization" },
        { lead: "Tools", title: "Python · PyTorch · TensorFlow · ONNX · OpenCV · C · Docker · Git · Linux" },
        { lead: "Compute", title: "Edge devices · PLC · parallel and supercomputing" },
        { lead: "Languages", title: "Finnish (native) · English (fluent)" },
      ],
    },
  },

  // Reads like the output of a real `whoami`: a card, not a speech.
  whoami: [
    { lead: "name", title: "Ilmari Vahteristo" },
    { lead: "role", title: "Computer vision and machine learning engineer" },
    { lead: "builds", title: "Perception on edge hardware — cameras, LiDAR, radar, lasers" },
    { lead: "degree", title: "MSc (Tech), LUT · MSc Robotics, Aalto (part-time)" },
    { lead: "based", title: "Helsinki, Finland" },
    { lead: "status", title: "Open to new opportunities — happy to talk" },
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
    analyticsNote: "Visits are counted with Umami — no cookies, nothing personal.",
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
    boot: ["// Tap a command, or just scroll."],
    helpDesc: {
      whoami: "who I am, briefly",
      experience: "roles and results",
      leadership: "leading people",
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
