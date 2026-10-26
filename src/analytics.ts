// Visitor analytics, through Umami: cookieless and without personal data, so no consent banner.
//
// The Umami script is added to <head> at build time by headTags() in seo.ts, only when
// profile.analytics.websiteId is set, and it only reports from the real domain
// (data-domains) — local previews send nothing. Until it loads, track() is a no-op.
//
// Visits, referrers, countries and devices Umami records on its own. On top of that:
//
//   terminal-command  {cmd, via}           a command a visitor ran: via "chip" or "link" (a
//                                          command link printed in the terminal). The boot
//                                          `whoami` is not counted.
//   terminal-drag     —                    first time a visitor drags letters in the terminal
//   banner-play       —                    first time they touch or click the name banner
//   section-view      {section}            a section of the page scrolled into view
//   link-click        {kind, target, from} email, CV, or outbound link, on the page or in the
//                                          terminal; `from` is the section or "terminal"
//
// The `—` and section-view events fire once per page load, so their counts read as visitors.

type Data = Record<string, string | number>;
type Umami = { track: (event: string, data?: Data) => void };

export function track(event: string, data?: Data) {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch {
    // analytics must never break the page
  }
}

const sent = new Set<string>();
/** track(), at most once per page load for the same event and data. */
export function once(event: string, data?: Data) {
  const key = event + JSON.stringify(data ?? {});
  if (sent.has(key)) return;
  sent.add(key);
  track(event, data);
}

/** What kind of link this is, and a short name for where it goes. */
export function describeLink(href: string): { kind: string; target: string } | null {
  if (href.startsWith("mailto:")) return { kind: "email", target: "email" };
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return null;
  }
  if (url.origin === location.origin) {
    if (url.pathname.endsWith(".pdf")) return { kind: "cv", target: url.pathname };
    return null; // in-page anchors and the language switch are not interesting
  }
  return { kind: "outbound", target: (url.hostname + url.pathname).replace(/\/$/, "") };
}

/** Count clicks on real <a> links in the written page and the terminal's top bar. */
export function trackPageLinks(root: Document) {
  root.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const d = describeLink(a.getAttribute("href")!);
    if (!d) return;
    const from = a.closest("section")?.id ?? (a.closest(".hero") ? "hero" : "terminal");
    track("link-click", { ...d, from });
  });
}

/**
 * Count each section of the written page once it has really been on screen: half of it
 * visible, or its top in the upper 60 % of the screen. The first alone never fires for a
 * section taller than the screen (a phone); the second alone never fires for the last
 * section, which the page cannot scroll that far up.
 */
export function trackSectionViews(sections: Iterable<Element>) {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        if (en.intersectionRatio < 0.5 && en.boundingClientRect.top > innerHeight * 0.6) continue;
        once("section-view", { section: en.target.id });
        io.unobserve(en.target);
      }
    },
    // fine steps, so a tall section is re-checked as it scrolls rather than only on entry
    { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
  );
  for (const s of sections) if (s.id) io.observe(s);
}
