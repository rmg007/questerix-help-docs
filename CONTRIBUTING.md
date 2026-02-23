# Contributing

This repo is the **Questerix Help Center** (VitePress). It is written for parents, teachers, and school admins.

## Non‑negotiable rules

These rules keep the help center consistent and easy to use:

- **Read `AGENTS.md` first** (source of truth for writing and process rules).
- **Grade 8 reading level** (short sentences, simple words, no jargon).
- **Every guide uses**: **Problem → Solution → Verification**.
- **Screenshots required** for multi-step flows:
  - Save to `public/screenshots/`
  - Reference as `/screenshots/filename.png`
  - Track in `SCREENSHOT_CATALOG.md`
- **Update scope**: only edit pages impacted by the change.
- **Last updated stamp**: add `<!-- Last updated: YYYY-MM-DD -->` to every changed doc page.
- **Design tokens**: do not invent styles; use `.vitepress/theme/vars.css`.

## Quality checks

Run these before you ship changes:

```bash
npm run build
npm run screenshots:check
```

## Screenshot automation

```bash
npm run screenshots:capture
```

Credentials can be provided via env vars or `.env.screenshots.local` (git-ignored).

