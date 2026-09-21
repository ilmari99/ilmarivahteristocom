import type { Content, Locale } from "./types";
import { en } from "./en";
import { fi } from "./fi";

export const locales: Record<Locale, Content> = { en, fi };

export const isLocale = (s: string): s is Locale => s === "en" || s === "fi";

/** The other language — what the switcher links to. */
export const other = (l: Locale): Locale => (l === "en" ? "fi" : "en");

export * from "./types";
export * from "./profile";
