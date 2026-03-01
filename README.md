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

## Screenshots (Automated)

This repo includes a Playwright-based pipeline to **capture high-resolution, full-page screenshots** from `app.questerix.com`
and save them into `public/screenshots/`.

```bash
# Capture all screenshots listed in SCREENSHOT_CATALOG.md (role-by-role)
npm run screenshots:capture

# Verify docs don't reference missing screenshot files
npm run screenshots:check
```

Notes:
- The capture script is designed for the Questerix **Flutter** UI and enables accessibility semantics automatically.
- You can override the default test credentials using env vars (or by filling in `.env.screenshots.local`):
  - `QUESTERIX_STUDENT_EMAIL` / `QUESTERIX_STUDENT_PASSWORD`
  - `QUESTERIX_TEACHER_EMAIL` / `QUESTERIX_TEACHER_PASSWORD`
  - `QUESTERIX_ADMIN_EMAIL` / `QUESTERIX_ADMIN_PASSWORD`

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

## Agent Context Pack (for Copilot/Windsurf/etc.)

- **Universal**: `AI_CONTEXT.md`
- **Contributor rules**: `CONTRIBUTING.md`
- **Copilot-specific**: `.github/copilot-instructions.md`

## Security (Gitleaks)

This repo runs **Gitleaks** in GitHub Actions on PRs and pushes to `main` to help prevent
accidentally committing secrets.

- **Workflow**: `.github/workflows/gitleaks.yml`
- **Config**: `.gitleaks.toml`

Note: Gitleaks Action v2 requires a `GITLEAKS_LICENSE` secret for **GitHub organizations**
(personal accounts don’t need it).

## Cursor MCPs (no Figma)

We don’t use the Figma MCP in this repo.

- **MCP setup guide**: `.cursor/README.md`
- **Team-shared MCP config**: `.cursor/mcp.json`

## Environment Setup

1. Create a `.env` file in the root directory based on `.env.screenshots.local.example`.
2. Fill in the required values:
   - `APP_ORIGIN`: The base URL of the application.
   - `QUESTERIX_STUDENT_EMAIL` and `QUESTERIX_STUDENT_PASSWORD`: Credentials for the student role.
   - `QUESTERIX_TEACHER_EMAIL` and `QUESTERIX_TEACHER_PASSWORD`: Credentials for the teacher role.
   - `QUESTERIX_ADMIN_EMAIL` and `QUESTERIX_ADMIN_PASSWORD`: Credentials for the admin role.

## Running Scripts

### Capture Screenshots

```bash
node scripts/capture-screenshots.mjs
```

- Ensure the `.env` file is properly configured.
- Screenshots are saved in `public/screenshots/`.

### Debug Authentication

```bash
node scripts/debug-auth.mjs
```

- Use this script to test login credentials and app accessibility.
- Requires the `APP_ORIGIN` and role credentials to be set in `.env`.
