# DevBoard — Storage System 

This document describes the storage approach used by DevBoard and provides quick guidance for developers. It covers the supported backends, key APIs, file locations, fallback behavior, and recommended best practices.

## Summary
- Desktop (Tauri): JSON file saved to the platform application data directory.
- Web: Browser `localStorage`.
- The app exposes a unified async storage API that picks the most appropriate backend (Tauri when available, otherwise localStorage).

## Key Components
- `useDevBoardStorage` (hook) — main React hook to read/update storage with loading/error state and convenient helper methods.
- `storage` (unified API) — async methods: `get`, `set`, `init`, `clear`.
- `tauriStorage` — file-based backend used when running under Tauri (desktop).
- `isTauri` / `isTauriReady` — environment detection helpers.

## Typical Usage
Use the hook inside React components to access the store and perform updates:
```DevBoard/docs/STORAGE_SYSTEM.md#L1-20
// Example (conceptual)
const { data, loading, error, update, reset } = useDevBoardStorage();

if (loading) return <Loading />;
if (error) return <ErrorMessage error={error} />;

update(prev => ({ ...prev, snippets: [...prev.snippets, newSnippet] }));
```

Call the low-level API for non-React utilities:
```DevBoard/docs/STORAGE_SYSTEM.md#L21-40
// Example (conceptual)
await storage.init(DEFAULT_STATE);
const state = await storage.get();
await storage.set({ ...state, settings: { theme: 'dark' } });
```

## Data structure
The global store is typed (e.g. `DevBoardStore`) and typically contains:
- `projects: Project[]`
- `snippets: Snippet[]`
- `todos: Todo[]`
- `settings`
- `meta: { version: number }`

Keep stored values serializable (no functions, DOM nodes, circular refs).

## File locations (desktop)
- Windows: `%APPDATA%\DevBoard\devboard.json`
- macOS: `~/Library/Application Support/DevBoard/devboard.json`
- Linux: `~/.config/DevBoard/devboard.json`

Web: stored in `localStorage` (per-origin, no cross-device sync).

## Fallbacks and error handling
- If Tauri APIs are unavailable or not ready at startup, the system falls back to `localStorage`.
- Storage operations are asynchronous; the hook exposes `loading` and `error` states.
- Implement optimistic updates with rollback on write errors (the hook typically provides helpers to simplify this).
- On corrupted JSON files, prefer restoring from backup, otherwise reset to the initial state and log the incident.

## Migrations
- Use `meta.version` in the persisted state to detect schema changes.
- On load: if `meta.version` < current, run migration code to transform old data, then persist the updated state and bump `meta.version`.

Example migration flow (conceptual):
```DevBoard/docs/STORAGE_SYSTEM.md#L41-60
if (data.meta.version < 2) {
  data = migrateToV2(data);
  data.meta.version = 2;
  await storage.set(data);
}
```

## Debugging tips
- Enable detailed logs (dev-only): e.g. `localStorage.setItem('debug', 'true')` or use the project's logger.
- Check browser DevTools → Application → Local Storage for the web variant.
- For desktop, inspect the JSON file under the system app data path and review Rust/tauri logs (cargo output).
- If writes fail, check file permissions and ownership for the app data folder.

## Best practices
- Always check `loading` before using `data` in components.
- Prefer the hook (`useDevBoardStorage`) over direct `storage` calls within React components.
- Add migration handlers when changing persisted shape.
- Make regular backups of the JSON file for desktop users and provide an export/import mechanism.
- Avoid storing large binary data in JSON — prefer external files if necessary.

## When to extend
- If you need encryption for sensitive fields, implement it in the `tauriStorage` and web backend consistently.
- If syncing across devices is required in the future, add an optional sync layer that operates on top of the unified storage API.

---
