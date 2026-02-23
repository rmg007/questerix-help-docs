# GitHub Copilot Instructions (Questerix Help Docs)

You are working in the **Questerix Help Center** repository (VitePress).

## Required reading

- `AGENTS.md` is the **source of truth** for rules and constraints.
- `AI_CONTEXT.md` is a short checklist for any agent.

## Non‑negotiables

- Write for non-technical humans. Target **Grade 8 reading level**.
- Format every how-to guide as **Problem → Solution → Verification**.
- Use **active voice** and an empathetic tone.
- **Screenshots are mandatory** for multi-step flows:
  - Store files in `public/screenshots/`
  - Reference as `/screenshots/filename.png`
  - Update `SCREENSHOT_CATALOG.md`
- When you change a doc page, add/update `<!-- Last updated: YYYY-MM-DD -->` at the top.
- Don’t modify Questerix application code here; this is docs only.

## Guardrails

Run:
- `npm run build`
- `npm run screenshots:check`

