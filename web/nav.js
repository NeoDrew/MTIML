// Single source of truth for the chapter list.
// Used by every page to render the sidebar and prev/next nav.
// Section numbers (1–8) match the poster sections exactly.

const CHAPTERS = [
  { href: "index.html",            num: "0",  title: "Overview",                short: "Start here" },
  { href: "definitions.html",      num: "·",  title: "Definitions",             short: "Hypothesis class, halfspace, VC, etc." },
  { href: "presenter.html",        num: "★",  title: "Drew's sections",         short: "Intro, §1 motivation, §2 Rademacher — with script", presenter: true },
  { href: "01-motivation.html",    num: "1",  title: "Motivation",              short: "The generalisation gap" },
  { href: "02-rademacher.html",    num: "2",  title: "Rademacher complexity",   short: "Symmetrisation; can the class fit noise?" },
  { href: "03-label-vectors.html", num: "3",  title: "From functions to labels", short: "Restriction & growth function" },
  { href: "04-massart.html",       num: "4",  title: "Massart's lemma",         short: "Finite vectors → Rademacher bound" },
  { href: "05-vc-dimension.html",  num: "5",  title: "VC dimension",            short: "Shattering, halfspaces, Radon" },
  { href: "06-sauer.html",         num: "6",  title: "Sauer's lemma",           short: "VC controls growth" },
  { href: "07-generalisation.html",num: "7",  title: "VC ⇒ generalisation",     short: "Composing the chain" },
  { href: "08-discussion.html",    num: "8",  title: "Discussion",              short: "Tightness, PAC, modern caveat" },
  { href: "cheatsheet.html",       num: "·",  title: "Cheat-sheet & Q&A",       short: "Recall fast" },
];

(function buildSidebar() {
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const items = CHAPTERS.map(c => {
    const cls = [];
    if (c.href.toLowerCase() === here) cls.push("active");
    if (c.presenter) cls.push("presenter-link");
    const classAttr = cls.length ? ` class="${cls.join(" ")}"` : "";
    return `<a${classAttr} href="${c.href}"><span class="num">${c.num}</span><span>${c.title}</span></a>`;
  }).join("");

  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-title">VC <span class="accent">→</span> Rademacher</div>
      <div class="brand-subtitle">Generalisation from scratch</div>
    </div>
    <nav>${items}</nav>
  `;

  const slot = document.getElementById("chapter-nav-slot");
  if (slot) {
    const idx = CHAPTERS.findIndex(c => c.href.toLowerCase() === here);
    const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
    const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
    let html = '<nav class="chapter-nav">';
    if (prev) {
      html += `<a href="${prev.href}"><span class="label">← Previous</span><span class="title">${prev.num}. ${prev.title}</span></a>`;
    } else {
      html += `<span></span>`;
    }
    if (next) {
      html += `<a class="next" href="${next.href}"><span class="label">Next →</span><span class="title">${next.num}. ${next.title}</span></a>`;
    } else {
      html += `<span></span>`;
    }
    html += '</nav>';
    slot.outerHTML = html;
  }
})();
