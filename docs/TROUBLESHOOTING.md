# DevBoard — Troubleshooting

Quick, actionable fixes for common issues when running or developing DevBoard. Start with the "Quick checks" section.

## Quick checks
- Verify versions: `node --version` (>= 18), `npm --version`. If using desktop/Tauri also check `rustc --version`.
- Inspect terminal and browser console logs — they usually show the root cause.
- Try a clean install: `rm -rf node_modules package-lock.json && npm install`.
- For desktop/Tauri issues, verify file/directory permissions and ownership for the app data folder.

## Dev server / hot-reload
- No UI updates? Restart the dev server: `npm run dev` and hard-refresh the browser (Ctrl/Cmd+Shift+R).
- Port already in use: find and kill the process (example): `lsof -ti:5174 | xargs kill -9` or run on another port.
- On Linux, increase file watcher limit if hot-reload stops working:
  - Add `fs.inotify.max_user_watches=524288` to `/etc/sysctl.conf` and run `sudo sysctl -p`.

## Installation / dependency errors
- Delete `node_modules` and `package-lock.json`, then reinstall:  
  `rm -rf node_modules package-lock.json && npm install`.
- Network/registry issues: try an alternate registry:  
  `npm install --registry https://registry.npmjs.org/`.
- Permission errors: prefer using a node version manager (nvm) or configure a user-level npm prefix.

## Tauri / desktop
- Rust missing? Install via rustup: https://rustup.rs
- Build failures: in `src-tauri` run `cargo clean`, update toolchain `rustup update`, then rebuild.
- Permission errors when reading/writing app data: check directory ownership and file modes; ensure the app can write to the platform app-data path.

## Storage (data missing / write errors)
- Typical desktop data file locations:
  - Windows: `%APPDATA%\DevBoard\devboard.json`
  - macOS: `~/Library/Application Support/DevBoard/devboard.json`
  - Linux: `~/.config/DevBoard/devboard.json`
- Web: inspect `localStorage` via browser DevTools → Application.
- Corrupted JSON file: make a backup copy, attempt to fix the JSON (or restore from a backup). If needed, reset storage to the initial state after backing up.

## Build / compilation issues
- TypeScript errors: run `npm run type-check` and fix reported issues.
- Out of memory during build: increase Node memory limit, e.g.:  
  `NODE_OPTIONS="--max_old_space_size=4096" npm run build`
- Vite build oddities: clear cache `rm -rf node_modules/.vite/` and rebuild.

## Performance / memory leaks
- Use React Profiler and browser performance tools to find slow components or long renders.
- Look for undisposed timers, event listeners, or subscriptions in `useEffect` and add proper cleanup.
- Use `React.memo`, `useMemo`, and `useCallback` where appropriate to reduce unnecessary re-renders.

## Data recovery / backups
- If you have a backup JSON file: copy it to the app's data location and restart the app.
- Web backups: restore the relevant `localStorage` key via DevTools or a small console script.
- Consider adding an export/import backup feature for users to safely save/restore data.

## Where to get help
- Check repository Issues and Discussions for similar reports before opening a new one.
- When reporting problems include: OS, Node and Rust versions, DevBoard version, steps to reproduce, and relevant logs/stack traces — this makes diagnosis much faster.

---
