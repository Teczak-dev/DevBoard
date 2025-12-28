# DevBoard — Quick Start (short)

This quick guide helps you run DevBoard locally (desktop or web) and covers the most common commands and troubleshooting steps.

## Options

### 1) Download release (recommended)
- Visit the repository Releases and download the package for your OS.
- Install and run the native app.

### 2) Build from source (developer)
Requirements:
- Node.js 18+
- (For desktop) Rust & Tauri toolchain

Quick commands:
```bash
git clone https://github.com/Teczak-dev/DevBoard.git
cd DevBoard
npm install

# Web (development)
npm run dev

# Desktop (development — requires Rust/Tauri)
npm run dev:tauri
```

## First steps in the app
- Click "New Project" → enter name and description → Create.
- Add Snippets, Notes, and TODOs from the project UI.
- Use "Copy" on a snippet to copy code — a small popup confirms the copy.

Note: Popups perform a short closing animation (fade-out) before they are removed from the DOM to keep the UX smooth.

## Data storage locations
- Desktop (Tauri): saved as JSON in the platform app data folder:
  - Windows: `%APPDATA%\DevBoard\devboard.json`
  - macOS: `~/Library/Application Support/DevBoard/devboard.json`
  - Linux: `~/.config/DevBoard/devboard.json`
- Web: browser localStorage (per-origin; not synced with desktop).

## Common developer commands
- `npm install` — install dependencies
- `npm run dev` — start web development server
- `npm run dev:tauri` — start desktop app in dev mode (requires Rust)
- `npm run build` — build web production bundle
- `npm run build:tauri` — build desktop production app
- `npm run lint` — run linters
- `npm run type-check` — run TypeScript type checks

## Quick troubleshooting
- If the dev server shows no changes: restart `npm run dev`, clear browser cache, perform a hard refresh.
- Port in use (default 5174): `lsof -ti:5174 | xargs kill -9` or run with a different port.
- Install / dependency errors: remove `node_modules` and `package-lock.json`, then `npm install`.
- Tauri build failures: `cd src-tauri && cargo clean`, update Rust toolchain with `rustup update` and try again.
- Storage issues: check the platform-specific file above or localStorage in browser DevTools.

## Need help?
- Include OS, Node and Rust versions, a short reproduction, and relevant logs when opening an Issue.
- Check repository Issues and Discussions for existing reports and guidance.
