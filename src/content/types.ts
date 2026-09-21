// The shape every language must fill.
//
// Both the written page (src/seo.ts) and the terminal (src/main.ts) read a `Content`, so a
// field missing from a translation is a compile error rather than an English string quietly
// surfacing on the Finnish page. Everything language-dependent belongs here — including the
// chrome (section headings, button labels, boot lines), which is the part that leaks.

export type Locale = "en" | "fi";

export type Work = { title: string; tag?: string; body: string; label?: string; url?: string };
export type Project = { line: string; url: string; label: string };
export type Capability = { label: string; items: string };
export type Post = { slug: string; title: string; date: string; body: string[] };

// Command names stay English in every language (they read as shell commands, and `whoami`
// or `clear` need no translation). Only their descriptions and output are localized.
export type ChipCommand =
  | "whoami" | "consult" | "work" | "sensors"
  | "now" | "why" | "irl" | "blog" | "contact" | "clear";

export interface Content {
  locale: Locale;

  /** <head> of this language's page. */
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    /** OG wants the underscored form: en_US, fi_FI. */
    ogLocale: string;
  };

  /** The <h1> reads "<name> — <headline>". */
  headline: string;
  /** Banner subtitle, and jobTitle in the structured data. */
  role: string;
  tagline: string;

  intro: string[];
  consult: { heading: string; body: string[]; heroCta: string };
  work: Work[];
  alsoShipped: string[];
  projects: Project[];
  capabilities: Capability[];
  why: string[];
  whoami: string[];
  now: string[];
  irl: string[];
  posts: Post[];

  /** Chrome. Every literal that would otherwise be hardcoded in seo.ts or main.ts. */
  ui: {
    /** Section headings on the written page. The ids stay English in both languages. */
    sections: {
      work: string;
      capabilities: string;
      why: string;
      writing: string;
      contact: string;
    };
    alsoInProduction: string;
    sideProjects: string;
    messageOnLinkedIn: string;
    /** Language switcher: what to call the *other* language, in that other language. */
    switchLabel: string;

    // --- terminal ---
    termAria: string;
    chipsAria: string;
    noteAria: string;
    sayHi: string;
    backToTerminal: string;
    bestWayEmail: string;
    blogHeader: string;
    tapNote: string;
    /** Shown instead of the note list when this language has no posts of its own. */
    blogElsewhere: string;
    commandNotFound: string;
    noSuchNote: string;
    tryCmd: string;
    cv: { before: string; link: string; after: string };
    sudo: { before: string; link: string; after: string };
    boot: string[];
    helpDesc: Record<ChipCommand, string>;
  };

  /** Language-specific strings for the JSON-LD graph. */
  schema: {
    knowsAbout: string[];
    areaServed: string;
    locality: string;
  };
}
