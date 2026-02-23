# AI Context (All Coding Agents)

This file is a **universal instruction sheet** for any coding agent (Copilot, Windsurf, Cursor, etc.).

If you are an AI assistant working in this repo, **read `AGENTS.md` first** and follow it as the source of truth.

## Non‑negotiables

- **This repo is the help center only** (VitePress). Do not change Questerix app code here.
- **Writing level**: Grade 8 reading level (short sentences, simple words, no jargon).
- **Guide format**: Every how‑to guide must follow **Problem → Solution → Verification**.
- **Screenshots**: Mandatory for multi‑step processes.
  - Store in `public/screenshots/`
  - Reference in docs as `/screenshots/filename.png`
  - Track status in `SCREENSHOT_CATALOG.md`
- **Change discipline**: Update only the pages impacted by a feature snapshot. Don’t rewrite unrelated pages.
- **Stamp changes**: Add/refresh `<!-- Last updated: YYYY-MM-DD -->` at the top of every changed doc page.

## Design tokens (don’t invent new styling)

- Use VitePress theme + tokens in `.vitepress/theme/vars.css` (brand colors, typography, dark mode).

## Guardrails (run before shipping)

- `npm run build`
- `npm run screenshots:check`

