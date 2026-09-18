// The real page, rendered to HTML at build time from content.ts and injected into index.html.
//
// This is the page: plain text a person reads and a crawler indexes, present whether or not
// JavaScript runs. The terminal is the hero above it, an interactive layer on top of this
// content rather than a replacement for it.

import {
  profile, intro, consult, work, alsoShipped, projects, capabilities, why, posts,
} from "./content";

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

const section = (id: string, heading: string, body: string) =>
  `<section id="${id}"><h2>${esc(heading)}</h2>${body}</section>`;

export function siteHtml(): string {
  const mailto = "mailto:" + profile.email;

  const workHtml =
    work
      .map(
        (w) =>
          `<article class="work">` +
          `<h3>${esc(w.title)}${w.tag ? `<span class="tag">${esc(w.tag)}</span>` : ""}</h3>` +
          `<p>${esc(w.body)}${w.url && w.label ? ` ${a(w.url, w.label)}` : ""}</p>` +
          `</article>`
      )
      .join("") +
    `<p class="also"><strong>Also in production:</strong> ` +
    alsoShipped.map(esc).join(" ") +
    `</p>` +
    `<h3>Side projects</h3><ul>` +
    projects.map((p) => `<li>${esc(p.line)} ${a(p.url, p.label)}</li>`).join("") +
    `</ul>`;

  const capsHtml =
    `<dl class="caps">` +
    capabilities
      .map((c) => `<dt>${esc(c.label)}</dt><dd>${esc(c.items)}</dd>`)
      .join("") +
    `</dl>`;

  const postsHtml = posts
    .map(
      (p) =>
        `<article><h3>${esc(p.title)}</h3>` +
        `<p class="meta"><time datetime="${esc(p.date)}">${esc(p.date)}</time></p>` +
        paras(p.body) +
        `</article>`
    )
    .join("");

  return [
    `<main id="site">`,
    `<header class="hero">`,
    `<h1>${esc(profile.name)} — ${esc(profile.headline)}</h1>`,
    para(intro),
    // Jumps to the offer below — the real contact details live there, shown as text so they
    // work even where a mailto: link opens nothing.
    `<p class="cta"><a href="#consultation">${esc(consult.heroCta)} ↓</a></p>`,
    `</header>`,

    section("consultation", consult.heading, paras(consult.body) +
      `<p class="cta">${a(mailto, profile.email)}` +
      `<a href="${esc(profile.linkedin)}">message me on LinkedIn</a></p>`),

    section("work", "Work", workHtml),
    section("capabilities", "Sensors and methods", capsHtml),
    section("why", "Why", para(why)),
    section("writing", "Ground Truth — notes", postsHtml),

    section(
      "contact",
      "Contact",
      `<ul class="contact">` +
        `<li>${a(mailto, profile.email)}</li>` +
        `<li>${a(profile.linkedin, "linkedin.com/in/ilmariv")}</li>` +
        `<li>${a(profile.github, "github.com/ilmari99")}</li>` +
        `<li>${esc(profile.location)}</li>` +
      `</ul>`
    ),
    `</main>`,
  ].join("");
}

export function jsonLd(siteUrl: string): string {
  const person = {
    "@type": "Person",
    "@id": siteUrl + "#ilmari",
    name: profile.name,
    url: siteUrl,
    email: "mailto:" + profile.email,
    jobTitle: profile.role,
    description: intro.join(" "),
    sameAs: [profile.github, profile.linkedin],
    knowsLanguage: ["fi", "en"],
    knowsAbout: [
      "Computer vision", "Machine learning", "LiDAR", "Radar", "Laser triangulation",
      "Sensor fusion", "Edge computing", "Industrial automation", "Python", "C",
    ],
    address: { "@type": "PostalAddress", addressLocality: "Helsinki", addressCountry: "FI" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "LUT University" },
      { "@type": "CollegeOrUniversity", name: "Aalto University" },
    ],
  };

  const service = {
    "@type": "ProfessionalService",
    "@id": siteUrl + "#service",
    name: profile.name + " — " + profile.role,
    description: intro.join(" "),
    url: siteUrl,
    email: "mailto:" + profile.email,
    provider: { "@id": siteUrl + "#ilmari" },
    areaServed: { "@type": "AdministrativeArea", name: "Uusimaa, Finland" },
    availableLanguage: ["fi", "en"],
    makesOffer: {
      "@type": "Offer",
      name: consult.heading,
      description: consult.body.filter(Boolean).join(" "),
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [person, service],
  })}</script>`;
}
