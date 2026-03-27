# 🚀 Questerix Help Docs Quickstart

This is the **User Help Center** for Questerix users (Parents, Teachers, Admins). It is written in simple, active voice specifically for a non-technical audience.

## 📦 Stack
- **Framework:** VitePress
- **Global Theme:** `.vitepress/theme/vars.css`
- **Search System:** Minisearch (VitePress default).

## 🛠️ Setup & Run

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Dev Server (Local Preview):**
   ```bash
   npm run dev
   ```

3. **Production Build:**
   ```bash
   npm run build
   ```

## ✍️ Writing Standards
- Check the `AGENTS.md` file for full writing rules.
- Only modify relevant files under `parents/`, `teachers/` or `admins/`.
- Add a `<!-- Last updated: YYYY-MM-DD -->` comment at the top of every changed markdown file.
- ALWAYS use active voice: "Click the button" rather than "The button should be clicked."

## ⛔ Separation of Concerns
This project operates purely off static Markdown rendering. Never add authentication, APIs, or interactive React/Vue components without architecture sign-off!
