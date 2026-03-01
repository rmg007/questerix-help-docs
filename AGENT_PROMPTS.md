# Agent Prompts & Workflows

This document contains reusable prompts and workflows for coding agents (like GitHub Copilot, Cursor, Windsurf) working in the Questerix Help Docs repository. 

Copy and paste these prompts to ensure the agent follows the correct procedures, maintains the required tone, and updates all necessary files.

---

## 1. Documenting a New Feature (End-to-End)
Use this prompt when a completely new feature has been added to the Questerix app, and you need the agent to capture screenshots and write the documentation from scratch.

**Prompt:**
> "Act as the Questerix Technical Writer Agent. We need to document the new '[Feature Name]' feature for the [Admin/Teacher/Parent] persona.
> 1. Update `scripts/capture-screenshots.mjs` to add a new Playwright test. Log in using the [Role] credentials from `.env.screenshots.local`, navigate to the [Feature Name] page, and capture a screenshot named `[role]-[feature-name].png`.
> 2. Run the capture script to generate the image in `public/screenshots/`.
> 3. Create a new documentation page at `[persona-folder]/[feature-name].md`. 
> 4. Write the guide using the 'Problem → Solution → Verification' format. Maintain an 8th-grade reading level and an empathetic tone. Include the new screenshot with descriptive alt text.
> 5. Update `SCREENSHOT_CATALOG.md` to track the new image.
> 6. Run `npm run docs:check` and `npm run screenshots:check` to verify your work."

---

## 2. Updating Existing Documentation (UI Change)
Use this prompt when the UI has changed, but the core functionality remains the same. The agent needs to recapture the screenshot and tweak the existing text.

**Prompt:**
> "Act as the Questerix Technical Writer Agent. The UI for the '[Feature Name]' feature has been updated.
> 1. Run the existing Playwright script in `scripts/capture-screenshots.mjs` to capture the latest `[role]-[feature-name].png` screenshot.
> 2. Review the new screenshot in `public/screenshots/` and compare it to the existing documentation in `[persona-folder]/[feature-name].md`.
> 3. Update the Markdown file to reflect any changes in button names, layouts, or workflows. Ensure the 'Problem → Solution → Verification' format is maintained.
> 4. Update the `<!-- Last updated: YYYY-MM-DD -->` tag at the top of the Markdown file.
> 5. Run `npm run docs:check` and `npm run screenshots:check` to verify your work."

---

## 3. Processing a Feature Snapshot (From Core Repo)
Use this prompt when a new `Feature Snapshot` markdown file is dropped into the `_incoming/` folder from the core engineering team.

**Prompt:**
> "Act as the Questerix Technical Writer Agent. A new Feature Snapshot has been added to the `_incoming/` folder.
> 1. Read the Snapshot carefully to understand the new functionality.
> 2. Identify which persona pages it affects (Parents, Teachers, or Admins).
> 3. Write the necessary Playwright scripts in `scripts/capture-screenshots.mjs` to capture the required screenshots for this feature. Run the script.
> 4. Update or create the affected `.md` files in the respective persona folders. Translate the engineering jargon from the Snapshot into an 8th-grade reading level, empathetic tone, using the 'Problem → Solution → Verification' format.
> 5. Embed the new screenshots with alt text and update `SCREENSHOT_CATALOG.md`.
> 6. Delete the processed Snapshot from the `_incoming/` folder.
> 7. Run `npm run docs:check` and `npm run screenshots:check`."

---

## 4. Routine Maintenance & Link Checking
Use this prompt to have the agent perform a general health check on the documentation site.

**Prompt:**
> "Act as the Questerix Technical Writer Agent. Please perform a routine maintenance check on the documentation repository.
> 1. Run `npm run docs:check` and `npm run screenshots:check`. Fix any errors reported by these scripts.
> 2. Scan all Markdown files in the `parents/`, `teachers/`, and `admins/` folders for broken internal links or missing screenshots.
> 3. Ensure all files have a `<!-- Last updated: YYYY-MM-DD -->` tag at the top.
> 4. Run `npm run build` to ensure the VitePress site compiles successfully. Report any warnings or errors."
