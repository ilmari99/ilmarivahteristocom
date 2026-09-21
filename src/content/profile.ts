// Language-neutral facts. Not duplicated per locale — a second copy is a second thing to
// forget to update.

export const profile = {
  name: "Ilmari Vahteristo",
  host: "ilmari@vahteristo",
  email: "i.vahteristo@gmail.com",
  github: "https://github.com/ilmari99",
  linkedin: "https://www.linkedin.com/in/ilmariv/",
  githubLabel: "github.com/ilmari99",
  linkedinLabel: "linkedin.com/in/ilmariv",
};

/** Where each language's page lives. Used for canonical, hreflang and the switcher. */
export const SITE = "https://ilmarivahteristo.com/";
export const PATHS = { en: "/", fi: "/fi/" } as const;
export const URLS = { en: SITE, fi: SITE + "fi/" } as const;
