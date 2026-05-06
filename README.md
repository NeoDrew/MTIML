# MTIML Poster

Source for the COMP34312 poster *VC Dimension Upper-Bounds Rademacher Complexity*.

## Files

- `poster.tex` — poster source (LaTeX, `tikzposter` class)
- `poster.pdf` — compiled output (A0, landscape)
- `info` — project scope notes
- `courseworkInfo.txt` — coursework brief
- `lecture10.pdf`, `lecture11.pdf` — source material

## Building the PDF

Requires TeX Live with `tikzposter`, `pgfplots`, `lmodern`, and standard math packages.

```bash
pdflatex -interaction=nonstopmode -halt-on-error poster.tex
```

Output is written to `poster.pdf`. Run twice if cross-references look wrong.

### First-time setup (TeX Live 2025 on macOS)

`tikzposter` and a few deps aren't in `texlive-basic`. If `pdflatex` complains
about missing `.cls` / `.sty` files:

```bash
# Point tlmgr at the frozen 2025 archive (only needed if your local TL is older
# than the live remote — otherwise plain `sudo tlmgr install ...` works)
sudo tlmgr option repository \
  https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2025/tlnet-final

sudo tlmgr install tikzposter pgfplots xstring etoolbox environ trimspaces
```

## Editing the source

Open `poster.tex`. The structure is:

1. **Preamble** (top of file) — colors, fonts, custom title style
   (`StylishTitle`), custom block style (`Stylish`), helper macros
   (`\miniheadline`, `\smallbox`).
2. **Title block** — `\title{...}`, `\author{...}`, `\institute{...}`.
3. **Body** — three `\column{0.333}` sections inside `\begin{columns} ... \end{columns}`,
   each containing `\block{Heading}{Body}` entries.

To add a new section, drop another `\block{N. Title}{ ... }` into the relevant
column. To move a section between columns, cut the whole `\block{...}{...}` and
paste it under a different `\column{...}`.

## Viewing on macOS

`Preview.app` caches open PDFs. After recompiling, close the window
(`Cmd+W`) and reopen, or run `qlmanage -r cache` once.
