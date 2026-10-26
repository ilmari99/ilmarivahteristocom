// The shape every language must fill.
//
// Both the written page (src/seo.ts) and the terminal (src/main.ts) read a `Content`, so a
// field missing from a translation is a compile error rather than an English string quietly
// surfacing on the Finnish page. Everything language-dependent belongs here — including the
// chrome (section headings, button labels, boot lines), which is the part that leaks.
//
// Prose is stored one string per paragraph, never pre-wrapped: both the page and the
// terminal wrap to their own width, and a hard break baked into the text shows up as a
// ragged line on any screen narrower than the one it was wrapped for.

export type Locale = "en" | "fi";

export type Link = { label: string; url: string };

/**
 * One row of a section: a short dim lead (a year, a label), the line itself, an optional
 * one-sentence note under it, results under it (a role's), and links. Keep each to a glance.
 */
export type Row = { lead?: string; title: string; note?: string; points?: string[]; links?: Link[] };

/**
 * Section ids, in page order. They are also the terminal commands that print them.
 *
 * Every item lives in exactly one section, chosen by what kind of thing it is: a job
 * (experience — its results listed under it), leading people outside a job (leadership),
 * something published (publications), something built on my own time (projects), a ranking
 * someone else gave (competitions), a degree (education). No "selected work" section that
 * repeats them.
 */
export const SECTION_IDS = [
  "experience", "leadership", "publications", "projects", "competitions", "education", "skills",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
export type Section = { heading: string; rows: Row[] };

export type Post = { slug: string; title: string; date: string; body: string[] };

// Command names stay English in every language (they read as shell commands, and `whoami`
// or `clear` need no translation). Only their descriptions and output are localized.
export type ChipCommand = "whoami" | SectionId | "cv" | "contact" | "clear";
export type ExtraCommand = "why" | "irl" | "blog";

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

  /** Under the name, on the page and in the banner; jobTitle in the structured data. */
  role: string;
  tagline: string;
  /** One sentence under the role. */
  intro: string;
  /** What kind of work I'm open to. */
  availability: string;

  sections: Record<SectionId, Section>;

  /** Terminal only: a short key/value card. */
  whoami: Row[];
  why: string;
  irl: string[];
  posts: Post[];

  /** Chrome. Every literal that would otherwise be hardcoded in seo.ts or main.ts. */
  ui: {
    contact: string;
    emailMe: string;
    /** Label of the résumé download link. */
    cv: string;
    /** One line under the contact links, shown only while analytics is on. */
    analyticsNote: string;
    /** Language switcher: what to call the *other* language, in that other language. */
    switchLabel: string;

    // --- terminal ---
    termAria: string;
    chipsAria: string;
    noteAria: string;
    sayHi: string;
    backToTerminal: string;
    /** Lead-in to the links for the commands that have no chip. */
    more: string;
    blogHeader: string;
    tapNote: string;
    /** Shown instead of the note list when this language has no posts of its own. */
    blogElsewhere: string;
    commandNotFound: string;
    noSuchNote: string;
    tryCmd: string;
    sudo: { before: string; link: string; after: string };
    boot: string[];
    helpDesc: Record<ChipCommand | ExtraCommand, string>;
  };

  /** Language-specific strings for the JSON-LD graph. */
  schema: {
    knowsAbout: string[];
    locality: string;
  };
}
