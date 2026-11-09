// The real page, rendered to HTML at build time from a Content and injected into the matching
// index.html by the plugin in vite.config.ts.
//
// This is the page: plain text a person reads and a crawler indexes, present whether or not
// JavaScript runs. The terminal is the hero above it, an interactive layer on top of this
// content rather than a replacement for it.

import {
  profile, ANALYTICS, INDEXED, URLS, PATHS, SECTION_IDS, other, type Content, type Link, type Locale, type Row,
} from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const a = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

// Section ids stay English in every language: they are not indexed content, and keeping them
// identical means anchors work the same on both pages.
const section = (id: string, heading: string, body: string) =>
  `<section id="${id}"><h2>${esc(heading)}</h2>${body}</section>`;

/**
 * The language switcher, shown one way only: Finnish -> English, never the reverse.
 *
 * The Finnish copy is a machine draft awaiting proofreading, so the English page does not
 * advertise it, and while Finnish is not in INDEXED search engines are told to skip it too.
 *
 * Deliberately NOT a CSS-hidden link: markup served to crawlers but invisible to people is
 * a hidden link, and risks the whole domain to save one <a>. Remove it or keep it honest.
 *
 * To restore the pair once the Finnish reads right, drop the `locale` check and add "fi" to
 * INDEXED.
 */
export function langSwitch(c: Content): string {
  if (c.locale === "en") return "";
  const alt = other(c.locale);
  return `<nav class="langswitch">${a(PATHS[alt], c.ui.switchLabel)}</nav>`;
}

const links = (ls: Link[] = []) =>
  ls.length ? `<span class="links">${ls.map((l) => a(l.url, l.label)).join("")}</span>` : "";

// Every section is the same two-column list: a dim lead, then the line, its note and links.
const rows = (rs: Row[]) =>
  `<ul class="rows">` +
  rs
    .map(
      (r) =>
        `<li><span class="lead">${esc(r.lead ?? "")}</span><div>` +
        `<span class="title">${esc(r.title)}</span>${links(r.links)}` +
        `${r.note ? `<span class="note">${esc(r.note)}</span>` : ""}` +
        `${r.points?.length ? `<ul class="points">${r.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}` +
        `</div></li>`
    )
    .join("") +
  `</ul>`;

export function siteHtml(c: Content): string {
  const mailto = "mailto:" + profile.email;
  return [
    `<main id="site">`,
    `<header class="hero">`,
    // The role sits inside the <h1> so the heading a crawler reads is "name — role"; the
    // joiner is only for that reading, the eye gets the role on its own line.
    `<h1>${esc(profile.name)}<span class="sr"> — </span><span class="role">${esc(c.role)}</span></h1>`,
    `<p>${esc(c.intro)}</p>`,
    `<p class="availability">${esc(c.availability)}</p>`,
    `<p class="cta">${a(mailto, c.ui.emailMe)}${a(profile.cv, c.ui.cv)}` +
      `${a(profile.linkedin, "LinkedIn")}${a(profile.github, "GitHub")}</p>`,
    `</header>`,
    ...SECTION_IDS.map((id) => section(id, c.sections[id].heading, rows(c.sections[id].rows))),
    // Shown as text, not only as links, so they work even where a mailto: opens nothing.
    section(
      "contact",
      c.ui.contact,
      `<p class="contact">${a(mailto, profile.email)}` +
        `${a(profile.linkedin, profile.linkedinLabel)}` +
        `${a(profile.github, profile.githubLabel)}` +
        `${a(profile.scholar, profile.scholarLabel)}` +
        `${a(profile.cv, c.ui.cv)}</p>` +
        (ANALYTICS.websiteId ? `<p class="fineprint">${esc(c.ui.analyticsNote)}</p>` : "")
    ),
    `</main>`,
  ].join("");
}

// hreflang pairs the indexed languages with each other; with only one there is nothing to pair.
const hreflangTags = (): string[] =>
  INDEXED.length < 2
    ? []
    : [
        ...INDEXED.map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(URLS[l])}" />`),
        `<link rel="alternate" hreflang="x-default" href="${esc(URLS.en)}" />`,
      ];

/** <head> tags that differ per language: title, description, canonical, hreflang, OG. */
export function headTags(c: Content): string {
  const url = URLS[c.locale];
  const indexed = INDEXED.includes(c.locale);
  return [
    `<title>${esc(c.meta.title)}</title>`,
    `<meta name="description" content="${esc(c.meta.description)}" />`,
    // Self-referencing canonical: each language is its own page, not a duplicate of the other.
    `<link rel="canonical" href="${esc(url)}" />`,
    // Out of search, but must stay crawlable (not blocked in robots.txt): a crawler that
    // cannot fetch the page never sees the noindex, and keeps its old copy.
    ...(indexed ? hreflangTags() : [`<meta name="robots" content="noindex" />`]),
    `<meta property="og:title" content="${esc(c.meta.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(c.meta.ogDescription)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:locale" content="${esc(c.meta.ogLocale)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    // Analytics, only once configured. data-domains keeps previews and forks from reporting.
    ...(ANALYTICS.websiteId
      ? [`<script defer src="${esc(ANALYTICS.script)}" data-website-id="${esc(ANALYTICS.websiteId)}" data-domains="${esc(ANALYTICS.domain)}"></script>`]
      : []),
  ].join("\n    ");
}

/**
 * sitemap.xml, generated so it cannot drift from the pages: one <url> per indexed language,
 * each listing the indexed languages as alternates when there is more than one.
 */
export function sitemapXml(): string {
  const alternates = hreflangTags().map((tag) =>
    "    " + tag.replace("<link ", "<xhtml:link ")
  );
  const urls = INDEXED
    .map((l) =>
      [`  <url>`, `    <loc>${URLS[l]}</loc>`, ...alternates,
       `    <changefreq>monthly</changefreq>`, `    <priority>1.0</priority>`, `  </url>`].join("\n")
    )
    .join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset`,
    `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `  xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

export function jsonLd(c: Content): string {
  const pageUrl = URLS[c.locale];

  // One human, described in two languages. The @id stays rooted at the site root on both
  // pages — deriving it from the page URL would mint a second Person for the same person,
  // which is exactly what structured data is supposed to prevent.
  const personId = URLS.en + "#ilmari";

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    alternateName: profile.fullName,
    url: URLS.en,
    email: "mailto:" + profile.email,
    jobTitle: c.role,
    description: c.intro,
    sameAs: [profile.github, profile.linkedin, profile.scholar],
    knowsLanguage: ["fi", "en"],
    knowsAbout: c.schema.knowsAbout,
    address: { "@type": "PostalAddress", addressLocality: c.schema.locality, addressCountry: "FI" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "LUT University" },
      { "@type": "CollegeOrUniversity", name: "Instituto Superior Técnico" },
    ],
    affiliation: { "@type": "CollegeOrUniversity", name: "Aalto University" },
  };

  // The per-page node: this is what carries the language. ProfilePage is the type search
  // engines expect for a page about one person.
  const webPage = {
    "@type": "ProfilePage",
    "@id": pageUrl + "#webpage",
    url: pageUrl,
    name: c.meta.title,
    description: c.meta.description,
    inLanguage: c.locale,
    about: { "@id": personId },
    mainEntity: { "@id": personId },
  };

  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [person, webPage],
  })}</script>`;
}

export type { Locale };
