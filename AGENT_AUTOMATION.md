<!-- Last updated: 2026-02-26 -->
# Agent Automation: Secure workflow for coding agents

This document defines a safe, repeatable workflow for any coding agent (Cursor, Windsurf, Antigravity IDE, Kiro, etc.) that will capture screenshots, improve documentation, and push/deploy changes.

Summary of agent responsibilities:

- Capture screenshots from the Questerix web app (using Playwright).
- Update documentation pages using the captured screenshots.
- Improve copy and check SEO where possible.
- Run repository checks (`npm run docs:check`, `npm run screenshots:check`).
- Create a pull request with proposed changes. Human approval required for pushes and deploys.
- Optionally deploy to Cloudflare Pages after explicit human approval.

Security and credentials (must-read):

- Do NOT store secrets in the repository. The repo includes `.env.screenshots.local` (git-ignored) as the local place for test credentials. Keep real production credentials out of this file.
- Prefer OS-level secret storage (Windows Credential Manager, macOS Keychain, Linux secret store) and map them into the agent runtime as environment variables.
- If `.env.screenshots.local` is used, it must remain in `.gitignore`. Do not commit it. Rotate any credentials pasted into chat.
- Agents must avoid printing secrets to logs or including them in commit metadata.

Agent runtime checklist (recommended order):

1. Confirm human owner and obtain explicit approval to run screenshot capture.
2. Load credentials from the OS secret store or an existing local `.env.screenshots.local` file.
3. Run `npm ci` if dependencies changed.
4. Run `npm run screenshots:capture` to produce screenshots in `public/screenshots/`.
5. Run `npm run screenshots:check` and `npm run docs:check` to validate the results.
6. Open/inspect the screenshots and the diff of doc changes locally.
7. Improve documentation copy and SEO (headings, meta, internal links) as needed.
8. Run `npm run build` and preview locally with `npm run dev` if necessary.
9. Create a branch, commit, and push. Create a pull request for human review.
10. Wait for human approval; do not auto-merge or auto-deploy without explicit instruction.

Commands (copyable):

```bash
# Install deps (first run or after changes)
npm ci

# Capture screenshots (local, requires credentials)
npm run screenshots:capture

# Verify docs and screenshots
npm run screenshots:check
npm run docs:check

# Build to preview artifact
npm run build

# Run dev server for live preview
npm run dev
```

Extending the workflow

- If you add more automated tasks (linting, SEO audits, accessibility checks), append them to this file and the checklist.
- If you want full automation (push + deploy), add a human approval step using GitHub PR reviews and do not store deployment tokens in the repo.

If you have any changes to this workflow, propose them in a PR and document the rationale here.
