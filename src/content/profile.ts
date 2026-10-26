// Language-neutral facts. Not duplicated per locale — a second copy is a second thing to
// forget to update.

export const profile = {
  name: "Ilmari Vahteristo",
  host: "ilmari@vahteristo",
  email: "i.vahteristo@gmail.com",
  github: "https://github.com/ilmari99",
  linkedin: "https://www.linkedin.com/in/ilmariv/",
  githubLabel: "github.com/ilmari99",
  scholar: "https://scholar.google.com/citations?user=cN6lZe8AAAAJ",
  scholarLabel: "Google Scholar",
  /** The full legal name, as on the CV — so a search for either finds the same person. */
  fullName: "Esko Ilmari Vahteristo",
  linkedinLabel: "linkedin.com/in/ilmariv",
  /** The résumé, served from public/. Replace the file to update it; keep the name. */
  cv: "/ilmari-vahteristo-cv.pdf",
};

/**
 * Visitor analytics (src/analytics.ts). Nothing loads, and the privacy note is not shown,
 * until websiteId is set — copy it from the Umami dashboard: Settings → Websites → Edit.
 */
export const ANALYTICS = {
  websiteId: "6189f60c-4d8d-4292-98f0-ff640cc5bd3d",
  script: "https://cloud.umami.is/script.js",
  /** Only this host reports, so local previews and forks send nothing. */
  domain: "ilmarivahteristo.com",
};

/** Where each language's page lives. Used for canonical, hreflang and the switcher. */
export const SITE = "https://ilmarivahteristo.com/";
export const PATHS = { en: "/", fi: "/fi/" } as const;
export const URLS = { en: SITE, fi: SITE + "fi/" } as const;
