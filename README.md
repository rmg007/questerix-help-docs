# questerix-help-docs

User help center for [Questerix](https://questerix.com) — guides for parents, teachers, and school admins.

## What This Is

- Static documentation site built with **VitePress**
- Deployed to **Cloudflare Pages** (`questerix-help-docs`)
- Serves `help.questerix.com`
- Persona-based guides: Parents, Teachers, School Admins

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # Output: .vitepress/dist/
npm run preview    # Preview the production build
```

## Structure

```
parents/           # Guides for parents
teachers/          # Guides for teachers
admins/            # Guides for school admins
_incoming/         # Feature Snapshot drop zone (AI processes these into docs)
public/
└── screenshots/   # Manual app screenshots referenced in guides
SCREENSHOT_CATALOG.md  # Track which screenshots are needed / stale
.vitepress/
├── config.ts      # Navigation, sidebar, local search
└── theme/
    ├── index.ts   # Theme entry point
    └── vars.css   # Brand token overrides
```

## Adding Documentation

1. Drop a **Feature Snapshot** into `_incoming/` (see `_incoming/README.md`)
2. The Technical Writer Agent reads it and updates the relevant persona pages
3. Add new screenshots to `public/screenshots/` and log them in `SCREENSHOT_CATALOG.md`

## Deployment

Deployed automatically via Cloudflare Pages on push to `main`.

- **Cloudflare Project**: `questerix-help-docs`
- **Build command**: `npm run build`
- **Output directory**: `.vitepress/dist`
- **Domain**: `help.questerix.com` (**DO NOT connect until instructed**)

## Related Repos

| Repo                                                                         | Purpose                                    |
| ---------------------------------------------------------------------------- | ------------------------------------------ |
| [questerix-core](https://github.com/rmg007/Questerix)                        | Admin Panel, Student App, Supabase Backend |
| [questerix-landing-pages](https://github.com/rmg007/questerix-landing-pages) | Public marketing site                      |

## Agent Instructions

See `AGENTS.md` for the Technical Writer persona instructions.
