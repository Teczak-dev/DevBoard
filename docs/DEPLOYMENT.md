# DevBoard — Deployment

This document explains the minimal steps to build and deploy DevBoard for desktop (Tauri) and web (static SPA). This is a concise checklist — use the project scripts and CI to automate releases.

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- For desktop builds: Rust toolchain (rustup) and Tauri CLI (or use `npx tauri`)
- Platform-specific build tools when required (e.g. Xcode on macOS, Visual Studio Build Tools on Windows)

Quick installs:
```bash
# Rust (if needed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Tauri CLI (optional)
npm install -g @tauri-apps/cli
```

## Common build commands

From repository root:

- Install dependencies:
```bash
npm install
```

- Web (development):
```bash
npm run dev          # open dev server
```

- Web (production build):
```bash
npm run build
npm run preview      # serve dist locally for testing
```

- Desktop (development):
```bash
npm run dev:tauri
```

- Desktop (production build):
```bash
npm run build:tauri
```

## Build outputs

- Web production output: `dist/` — upload this to any static host.
  - `dist/index.html`
  - `dist/assets/*`

- Desktop Tauri bundles (after `npm run build:tauri`):
  - `src-tauri/target/release/bundle/msi/` → Windows installer
  - `src-tauri/target/release/bundle/dmg/` → macOS installer
  - `src-tauri/target/release/bundle/appimage/`, `deb/`, `rpm/` → Linux packages

## Deployment options (web)

- Static hosting: upload `dist/` to a web server (nginx, Apache).
- Hosting services: Vercel, Netlify, GitHub Pages (use `npx gh-pages`), or any S3-like static host.
- Configure server to route unknown paths to `index.html` for SPA routing:
  - Nginx: `try_files $uri $uri/ /index.html;`
  - Apache: fallback to `index.html` via rewrite rules.

## Deployment options (desktop)

- Distribute installers via GitHub Releases or company distribution channels.
- Optionally publish packages to package managers (winget, Homebrew, apt repositories) — set up appropriate packaging pipelines per OS.

## Release checklist

1. Bump version in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json` (if needed)
2. Update changelog.
3. Run tests / type checks:
```bash
npm run type-check
npm run lint
```
4. Clean and build:
```bash
rm -rf node_modules dist src-tauri/target
npm install
npm run build       # web
npm run build:tauri # desktop
```
5. Test built artifacts locally (`npm run preview` for web; install desktop bundle and run).
6. Publish release artifacts.

## Troubleshooting (quick)

- Out of memory during web build:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```
- Desktop build fails on Linux: install native libs (GTK, WebKit) required by Tauri.
- macOS: install Xcode command line tools (`xcode-select --install`).
- Windows: ensure Visual Studio Build Tools are installed.
- If builds fail, try a clean rebuild:
```bash
rm -rf node_modules dist src-tauri/target
npm install
```

## Tips

- Automate releases with CI (build for each platform on appropriate runners).
- Sign installers (platform-specific signing) before publishing.
- Keep production configuration (base paths, environment variables) managed via CI or build scripts.
- Web builds are static — data is client-side (localStorage) unless you add a server sync layer.

---
