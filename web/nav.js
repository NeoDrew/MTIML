// Single source of truth for the chapter list.
// Used by every page to render the sidebar and prev/next nav.

const CHAPTERS = [
  { href: "index.html",                num: "0",  title: "Overview",            short: "Start here" },
  { href: "01-risk.html",              num: "1",  title: "Risk & generalisation", short: "Why training error isn't enough" },
  { href: "02-rademacher.html",        num: "2",  title: "Rademacher complexity", short: "Can the class fit noise?" },
  { href: "03-symmetrisation.html",    num: "3",  title: "Symmetrisation",       short: "Master theorem & ghost samples" },
  { href: "04-growth-function.html",   num: "4",  title: "Growth function",      short: "From functions to label vectors" },
  { href: "05-massart.html",           num: "5",  title: "Massart's lemma",      short: "Finite vectors → Rademacher bound" },
  { href: "06-rademacher-bound.html",  num: "6",  title: "Rademacher ≤ growth",  short: "Theorem 1.1" },
  { href: "07-vc-dimension.html",      num: "7",  title: "VC dimension",         short: "Shattering and examples" },
  { href: "08-halfspaces-radon.html",  num: "8",  title: "Halfspaces & Radon",   short: "VCdim of halfspaces is d+1" },
  { href: "09-sauer.html",             num: "9",  title: "Sauer's lemma",        short: "VC controls growth" },
  { href: "10-final.html",             num: "10", title: "The final chain",      short: "VC ⇒ uniform convergence" },
  { href: "11-cheatsheet.html",        num: "11", title: "Cheat-sheet & Q&A",    short: "Recall fast" },
];

(function buildSidebar() {
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const items = CHAPTERS.map(c => {
    const active = c.href.toLowerCase() === here ? " active" : "";
    return `<a class="${active.trim()}" href="${c.href}"><span class="num">${c.num}</span><span>${c.title}</span></a>`;
  }).join("");

  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-title">VC <span class="accent">→</span> Rademacher</div>
      <div class="brand-subtitle">Generalisation from scratch</div>
    </div>
    <nav>${items}</nav>
  `;

  // Build prev/next at bottom of page if .chapter-nav-slot exists
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
