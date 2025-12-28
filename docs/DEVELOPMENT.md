# DevBoard — Development

This file is a short developer reference for getting started, the common workflows, and where to find the key pieces of the codebase.

## Quick setup
- Requirements: Node.js 18+, npm, (optional) Rust for Tauri/desktop builds.
- Clone & install:
```DevBoard/docs/DEVELOPMENT.md#L201-210
git clone https://github.com/Teczak-dev/DevBoard.git
cd DevBoard
npm install
```
- Run:
  - Web dev: `npm run dev`
  - Desktop dev (requires Rust): `npm run dev:tauri`

## Useful scripts
- `npm run dev` — web dev server
- `npm run dev:tauri` — desktop dev (Tauri)
- `npm run build` — web production build
- `npm run build:tauri` — desktop production build
- `npm run lint` / `npm run lint:fix` — linting
- `npm run type-check` — TypeScript checks
- `npm run preview` — serve `dist/` locally

## Project layout (key folders)
- `src/` — React app
  - `components/` — UI components
  - `pages/` — route pages
  - `shared/` — utilities, hooks, types, constants
    - `hooks/` — custom hooks (e.g. `useDevBoardStorage`)
    - `utils/` — storage backends, helpers
- `src-tauri/` — Rust code and Tauri config
- `public/` — static assets
- `docs/` — documentation

## Development workflow
- Work in feature branches: `feature/<short-desc>`.
- Keep commits focused and atomic; run lint/type-check before pushing.
- Test UI changes in web dev first; use desktop dev when testing Tauri-specific features.

## Storage & environment notes
- Storage abstraction selects backend automatically:
  - Desktop (Tauri): file-based JSON (app data folder)
  - Web: `localStorage`
- Use the `useDevBoardStorage` hook to read/update app data (it exposes `data`, `loading`, `error`, `update`, `reset`).
- When changing persisted data shape, add migration logic and increment `meta.version`.

## Testing & manual checks
- Manual: run `npm run dev` / `npm run dev:tauri` and exercise key flows.
- Common checks:
  - Persistence: create data → reload → verify
  - Copy / paste / snippet actions
  - Permissions for desktop file writes (app data folder)
- Automated: add unit tests where useful; run type checks and linters in CI.

## Code style & patterns
- TypeScript: prefer explicit types, avoid `any`.
- React:
  - Use hooks for logic; keep components focused.
  - Clean up effect subscriptions and timers.
- Naming: PascalCase for components and types, camelCase for functions and files under `shared`.

## Debugging tips
- Enable verbose logs via `localStorage.setItem('debug','true')` (development only).
- For Tauri issues, inspect `src-tauri` build logs and check file permissions for app-data.
- Reproduce build errors locally:
```DevBoard/docs/DEVELOPMENT.md#L211-220
rm -rf node_modules dist src-tauri/target
npm install
npm run build
```

## Release checklist (short)
1. Bump version in `package.json` and `src-tauri/Cargo.toml`.
2. Run `npm run type-check` and `npm run lint`.
3. Build artifacts:
   - `npm run build` (web)
   - `npm run build:tauri` (desktop)
4. Test installables (msi/dmg/AppImage) on target OSes.
5. Publish artifacts (GitHub Releases / package managers / hosting).

## Contributing (essentials)
- Fork → branch → commit → PR.
- Provide clear PR description, reproduction steps, and testing notes.
- Add/update docs for public APIs or UX changes.

## Where to look first in the code
- App entry: `src/main.tsx`
- Storage: `src/shared/utils/storage.ts`, `src/shared/hooks/useDevBoardStorage.ts`
- Tauri config: `src-tauri/tauri.conf.json`
- Pages: `src/pages/*`

---
