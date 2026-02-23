## Cursor MCPs for this repo

This repo is documentation-only (VitePress). MCPs are mainly helpful for:

- Clicking through the local Help Center to confirm nav/search
- Capturing UI issues and verifying copy changes in context
- Planning larger doc work (IA changes, migrations, multi-page updates)

### MCPs we use (no Figma)

- **`cursor-ide-browser`**: Best for real browser testing of `npm run dev`.
- **`user-browser`**: Helpful for scripted browser actions (snapshots, screenshots, etc.).
- **`user-sequential-thinking`**: Helpful for breaking down large doc tasks.
- **`user-codescene`**: Optional; useful for code health insights, not required for docs work.

We do **not** use **`plugin-figma-figma`** in this project.

### How to enable in Cursor

1. Open **Cursor Settings**
2. Go to **Tools & MCP**
3. Enable the servers listed above for this workspace

### Team-shared MCP config

This repo includes a minimal `.cursor/mcp.json` that defines **Sequential Thinking** via `npx`
so teammates can install it easily if they don’t already have it.

