# VC → Rademacher learning site

Self-contained 12-chapter walkthrough of how VC dimension upper-bounds Rademacher complexity, and what that implies for generalisation. Built to be readable in one sitting.

## How to view

Just open `index.html` in any modern browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
```

Math is rendered by KaTeX from a CDN, so you need an internet connection the first time you load each page (after that, your browser cache will hold the assets).

If you want to run a local web server (some browsers cache more aggressively when files are loaded via `file://`):

```bash
cd web
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html` — landing page with the chain and table of contents
- `01-risk.html` … `11-cheatsheet.html` — the 12 chapters
- `styles.css` — shared styling (navy/magenta theme matching the poster)
- `nav.js` — single source of truth for the chapter list; builds the sidebar and prev/next nav at the bottom of each page

## Editing

To add a chapter, append an entry to `CHAPTERS` in `nav.js` and create a new HTML file using any existing chapter as a template.

To change the theme, edit the CSS variables at the top of `styles.css`.
