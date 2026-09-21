// The real page, rendered to HTML at build time from a Content and injected into the matching
// index.html by the plugin in vite.config.ts.
//
// This is the page: plain text a person reads and a crawler indexes, present whether or not
// JavaScript runs. The terminal is the hero above it, an interactive layer on top of this
// content rather than a replacement for it.

import { profile, URLS, PATHS, other, type Content, type Locale } from "./content";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const para = (ls: string[]) => `<p>${esc(ls.join(" "))}</p>`;
const a = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

// a string[] where "" separates paragraphs
const paras = (ls: string[]) => {
  const out: string[] = [];
  let buf: string[] = [];
  for (const l of ls) {
    if (l === "") { if (buf.length) { out.push(buf.join(" ")); buf = []; } }
    else buf.push(l);
  }
  if (buf.length) out.push(buf.join(" "));
  return out.map((x) => `<p>${esc(x)}</p>`).join("");
};

// Section ids stay English in every language: they are not indexed content, and keeping them
// identical means the hero -> offer anchor works the same on both pages.
const section = (id: string, heading: string, body: string) =>
  `<section id="${id}"><h2>${esc(heading)}</h2>${body}</section>`;

/**
 * The language switcher, shown one way only: Finnish -> English, never the reverse.
 *
 * The Finnish copy is a machine draft awaiting proofreading, so the English page does not
 * advertise it. Discovery is left to the hreflang tags in headTags() and the sitemap, which
 * is how Google is meant to learn about an alternate language anyway — no link required.
 *
 * Deliberately NOT a CSS-hidden link: markup served to crawlers but invisible to people is
 * a hidden link, and risks the whole domain to save one <a>. Remove it or keep it honest.
 *
 * To restore the pair once the Finnish reads right, drop the `locale` check.
 */
export function langSwitch(c: Content): string {
  if (c.locale === "en") return "";
  const alt = other(c.locale);
  return `<nav class="langswitch">${a(PATHS[alt], c.ui.switchLabel)}</nav>`;
}

export function siteHtml(c: Content): string {
  const mailto = "mailto:" + profile.email;

  const workHtml =
    c.work
      .map(
        (w) =>
          `<article class="work">` +
          // The tag sits outside the <h3>: inside it, the heading a crawler reads becomes
          // "Multi-camera tracking through occlusionsindustry". Flexbox keeps them on a row.
          `<div class="work-head"><h3>${esc(w.title)}</h3>` +
          `${w.tag ? `<span class="tag">${esc(w.tag)}</span>` : ""}</div>` +
          `<p>${esc(w.body)}${w.url && w.label ? ` ${a(w.url, w.label)}` : ""}</p>` +
          `</article>`
      )
      .join("") +
    `<p class="also"><strong>${esc(c.ui.alsoInProduction)}</strong> ` +
    c.alsoShipped.map(esc).join(" ") +
    `</p>` +
    `<h3>${esc(c.ui.sideProjects)}</h3><ul>` +
    c.projects.map((p) => `<li>${esc(p.line)} ${a(p.url, p.label)}</li>`).join("") +
    `</ul>`;

  const capsHtml =
    `<dl class="caps">` +
    c.capabilities.map((x) => `<dt>${esc(x.label)}</dt><dd>${esc(x.items)}</dd>`).join("") +
    `</dl>`;

  // Only languages that have their own notes get the section; the rest point at the ones
  // that do, from the terminal's `blog` command.
  const writing = c.posts.length
    ? section(
        "writing",
        c.ui.sections.writing,
        c.posts
          .map(
            (p) =>
              `<article><h3>${esc(p.title)}</h3>` +
              `<p class="meta"><time datetime="${esc(p.date)}">${esc(p.date)}</time></p>` +
              paras(p.body) +
              `</article>`
          )
          .join("")
      )
    : "";

  return [
    `<main id="site">`,
    `<header class="hero">`,
    `<h1>${esc(profile.name)} — ${esc(c.headline)}</h1>`,
    para(c.intro),
    // Jumps to the offer below — the real contact details live there, shown as text so they
    // work even where a mailto: link opens nothing.
    `<p class="cta"><a href="#consultation">${esc(c.consult.heroCta)} ↓</a></p>`,
    `</header>`,

    section("consultation", c.consult.heading, paras(c.consult.body) +
      `<p class="cta">${a(mailto, profile.email)}` +
      `<a href="${esc(profile.linkedin)}">${esc(c.ui.messageOnLinkedIn)}</a></p>`),

    section("work", c.ui.sections.work, workHtml),
    section("capabilities", c.ui.sections.capabilities, capsHtml),
    section("why", c.ui.sections.why, para(c.why)),
    writing,

    section(
      "contact",
      c.ui.sections.contact,
      `<ul class="contact">` +
        `<li>${a(mailto, profile.email)}</li>` +
        `<li>${a(profile.linkedin, profile.linkedinLabel)}</li>` +
        `<li>${a(profile.github, profile.githubLabel)}</li>` +
        `<li>${esc(c.schema.locality)}</li>` +
      `</ul>`
    ),
    `</main>`,
  ].join("");
}

/** <head> tags that differ per language: title, description, canonical, hreflang, OG. */
export function headTags(c: Content): string {
  const url = URLS[c.locale];
  return [
    `<title>${esc(c.meta.title)}</title>`,
    `<meta name="description" content="${esc(c.meta.description)}" />`,
    // Self-referencing canonical: each language is its own page, not a duplicate of the other.
    `<link rel="canonical" href="${esc(url)}" />`,
    `<link rel="alternate" hreflang="en" href="${esc(URLS.en)}" />`,
    `<link rel="alternate" hreflang="fi" href="${esc(URLS.fi)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${esc(URLS.en)}" />`,
    `<meta property="og:title" content="${esc(c.meta.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(c.meta.ogDescription)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:locale" content="${esc(c.meta.ogLocale)}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join("\n    ");
}

export function jsonLd(c: Content): string {
  const pageUrl = URLS[c.locale];

  // One human, one practice, described in two languages. The @ids stay rooted at the site
  // root on both pages — deriving them from the page URL would mint a second Person for the
  // same person, which is exactly what structured data is supposed to prevent.
  const personId = URLS.en + "#ilmari";
  const serviceId = URLS.en + "#service";

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    url: URLS.en,
    email: "mailto:" + profile.email,
    jobTitle: c.role,
    description: c.intro.join(" "),
    sameAs: [profile.github, profile.linkedin],
    knowsLanguage: ["fi", "en"],
    knowsAbout: c.schema.knowsAbout,
    address: { "@type": "PostalAddress", addressLocality: c.schema.locality, addressCountry: "FI" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "LUT University" },
      { "@type": "CollegeOrUniversity", name: "Aalto University" },
    ],
  };

  const service = {
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: profile.name + " — " + c.role,
    description: c.intro.join(" "),
    url: URLS.en,
    email: "mailto:" + profile.email,
    provider: { "@id": personId },
    areaServed: { "@type": "AdministrativeArea", name: c.schema.areaServed },
    availableLanguage: ["fi", "en"],
    makesOffer: {
      "@type": "Offer",
      name: c.consult.heading,
      description: c.consult.body.filter(Boolean).join(" "),
      price: "0",
      priceCurrency: "EUR",
    },
  };

  // The per-page node: this is what carries the language.
  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl + "#webpage",
    url: pageUrl,
    name: c.meta.title,
    description: c.meta.description,
    inLanguage: c.locale,
    about: { "@id": personId },
    mainEntity: { "@id": serviceId },
  };

  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [person, service, webPage],
  })}</script>`;
}

export type { Locale };
