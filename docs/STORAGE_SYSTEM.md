# DevBoard - Data Storage System

## Overview

The DevBoard storage system provides a unified interface for application data persistence that automatically adapts to the runtime environment:

- **Tauri (Desktop)**: File system with JSON files in the application data directory
- **Browser (Web)**: localStorage with JSON serialization

## Architecture

```
┌─────────────────────┐
│   useDevBoardStorage│ ← React Hook (UI Layer)
│   (Hook)            │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│    storage.ts       │ ← Main interface
│   (Unified API)     │
└─────────┬───────────┘
          │
    ┌─────▼──────┐         ┌────────────┐
    │ isTauri()  │────────▶│ Environment│
    │ Detection  │         │ Check      │
    └─────┬──────┘         └────────────┘
          │
    ┌─────▼──────┐         ┌─────────────┐
    │ Tauri      │         │ Web         │
    │tauriStorage│         │ localStorage│
    │ (File API) │         │ (Browser)   │
    └────────────┘         └─────────────┘
```

## Key Components

### 1. `useDevBoardStorage` Hook
**Location**: `src/shared/hooks/useDevBoardStorage.ts`

Main React hook for managing storage state and operations.

**Features**:
- Automatic initialization with default data
- Loading state for async operations
- Optimistic updates for responsive UI
- Error handling with automatic fallback
- Waiting for Tauri API readiness (desktop)

**Usage Example**:
```typescript
function MyComponent() {
  const { data, loading, error, update, reset } = useDevBoardStorage();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const addProject = (newProject) => {
    update(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  return <div>{data?.projects.length} projects</div>;
}
```

### 2. `storage` - Unified API
**Location**: `src/shared/utils/storage.ts`

Main storage interface that automatically selects the appropriate backend.

**Methods**:
- `get<T>()`: Retrieves data from storage
- `set<T>(data)`: Saves data to storage
- `init<T>(defaultData)`: Initializes storage with default data
- `clear()`: Clears all data

**Backend Selection Logic**:
```typescript
if (await isTauriReady()) {
  // Use tauriStorage (file system)
} else {
  // Use localStorage (browser)
}
```

### 3. `tauriStorage` - File System Backend
**Location**: `src/shared/utils/tauriStorage.ts`

Storage implementation for Tauri environment using the file system.

**Features**:
- Saves to application data directory (`appDataDir()`)
- Automatic directory creation
- JSON formatting with indentation (readability)
- Safe error handling
- Fallback to simple paths if `appDataDir()` fails

**File Locations**:
- **Windows**: `C:\Users\[User]\AppData\Roaming\DevBoard\devboard.json`
- **macOS**: `/Users/[User]/Library/Application Support/DevBoard/devboard.json`
- **Linux**: `/home/[user]/.config/DevBoard/devboard.json`

### 4. `isTauri` & `isTauriReady` - Environment Detection
**Location**: `src/shared/utils/isTauri.ts`

Helper functions for detecting the runtime environment.

**`isTauri()`**: Quick Tauri environment detection
```typescript
return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
```

**`isTauriReady()`**: Checks if Tauri APIs are fully loaded
```typescript
if (await isTauriReady()) {
  // Safely use Tauri APIs
}
```

## Data Structure

### `DevBoardStore`
**Location**: `src/shared/types/DevBoardStorage.ts`

Main application data structure:

```typescript
type DevBoardStore = {
  projects: Project[];    // List of user projects
  snippets: Snippet[];   // Code fragments
  todos: Todo[];         // Task list
  settings: {
    theme: "light" | "dark" | "system";
  };
  meta: {
    version: number;      // Version for future migrations
  };
};
```

### Initial State
**Location**: `src/shared/constants/devboardInitial.ts`

```typescript
export const DEVBOARD_INITIAL_STATE: DevBoardStore = {
  projects: [],
  snippets: [],
  todos: [],
  settings: { theme: "dark" },
  meta: { version: 1 }
};
```

## Tauri Configuration

### Permissions (Capabilities)
**Location**: `src-tauri/capabilities/default.json`

Required permissions for file operations:

```json
{
  "permissions": [
    "fs:default",
    "core:path:default",
    "core:path:allow-resolve-directory",
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$APPDATA/*" }]
    },
    {
      "identifier": "fs:allow-write-text-file", 
      "allow": [{ "path": "$APPDATA/*" }]
    },
    {
      "identifier": "fs:allow-exists",
      "allow": [{ "path": "$APPDATA/*" }]
    },
    {
      "identifier": "fs:allow-remove",
      "allow": [{ "path": "$APPDATA/*" }]
    },
    {
      "identifier": "fs:allow-mkdir",
      "allow": [{ "path": "$APPDATA/*" }]
    }
  ]
}
```

### Cargo Plugins
**Location**: `src-tauri/Cargo.toml`

```toml
[dependencies]
tauri-plugin-fs = "2"
```

### Rust Initialization
**Location**: `src-tauri/src/lib.rs`

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        // ...
}
```

## Application Initialization

### Main File
**Location**: `src/main.tsx`

```typescript
// 1. Detect environment
const isTauriEnvironment = 
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

if (isTauriEnvironment) {
  // 2. Load Tauri APIs before rendering
  await initializeTauriAPIs();
  renderApp();
} else {
  // 3. Web - render immediately
  renderApp();
}
```

### TypeScript Declarations
**Location**: `src/tauri.d.ts`

Type declarations for Tauri APIs injected into `window`:

```typescript
declare global {
  interface Window {
    __TAURI_INTERNALS__?: any;
    __TAURI__?: {
      fs?: {
        exists?: (path: string) => Promise<boolean>;
        readTextFile?: (path: string) => Promise<string>;
        writeTextFile?: (path: string, content: string) => Promise<void>;
        // ...
      };
      path?: {
        appDataDir?: () => Promise<string>;
      };
    };
  }
}
```

## Error Handling

### Fallback Strategy
1. **Tauri APIs unavailable** → Switch to localStorage
2. **Write error** → Restore previous state (optimistic updates)
3. **Corrupted data** → Use initial state
4. **Initialization timeout** → Continue with localStorage

### Logging
Consistent emoji usage throughout for easy debugging:
- ✅ Successful operations
- ⚠️ Warnings
- ❌ Errors
- 📦 Initialization
- 🗑️ Data deletion
- ℹ️ Information

## Troubleshooting

### Common Issues

1. **"Tauri FS not available"**
   - Check permissions in `capabilities/default.json`
   - Ensure `tauri-plugin-fs` is initialized

2. **"path.resolve_directory not allowed"**
   - Add `core:path:allow-resolve-directory` to permissions

3. **"forbidden path"**
   - Check if path is allowed in permissions configuration
   - Ensure you're using `$APPDATA` prefix

4. **Data not saving**
   - Check browser dev console for detailed errors
   - Ensure `appDataDir()` returns valid path

### Debug Mode

Enable detailed logging by setting in localStorage:
```javascript
localStorage.setItem('debug', 'true');
```

### Storage Reset

To clear storage in case of issues:
```typescript
const { reset } = useDevBoardStorage();
await reset(); // Restores initial state
```

## Data Migrations

The system is prepared for future migrations through the `meta.version` field:

```typescript
// Example future migration
if (data.meta.version < 2) {
  // Migrate from version 1 to 2
  data = migrateToV2(data);
  data.meta.version = 2;
  await storage.set(data);
}
```

## Performance

### Optimizations
- Optimistic updates (instant UI feedback)
- Lazy loading of Tauri APIs (only when needed)
- Async operations don't block UI
- Local cache in React state

### Limits
- localStorage: ~5-10MB (browser dependent)
- Tauri files: Limited by disk space
- JSON parsing: Can be slow for large data

## Security

### Tauri
- Sandboxed APIs with explicit permissions
- Only allowed paths (`$APPDATA/*`)
- No system access outside app directory

### Web
- localStorage is isolated per-origin
- Data is not encrypted (local storage)
- Only accessible from same domain

## API Reference

### Storage Interface
```typescript
interface Storage {
  get<T>(): Promise<T | null>;
  set<T>(data: T): Promise<void>;
  init<T>(initialData: T): Promise<void>;
  clear(): Promise<void>;
}
```

### Hook Interface
```typescript
interface UseDevBoardStorageReturn {
  data: DevBoardStore | null;
  loading: boolean;
  error: string | null;
  update: (updater: (prev: DevBoardStore) => DevBoardStore) => Promise<void>;
  reset: () => Promise<void>;
}
```

### Environment Detection
```typescript
function isTauri(): boolean;
function isTauriReady(): Promise<boolean>;
```

## Best Practices

1. **Always check loading state** before using data
2. **Handle errors gracefully** with user-friendly messages
3. **Use optimistic updates** for better UX
4. **Prefer the hook** over direct storage access
5. **Test in both environments** (web and desktop)
6. **Keep data serializable** (no functions, undefined, etc.)
7. **Use TypeScript** for type safety
8. **Log operations** for easier debugging

## Migration Guide

### From localStorage-only to Unified Storage

1. Replace direct localStorage calls with storage hook
2. Add async/await to storage operations
3. Handle loading states in components
4. Add error boundaries for storage errors
5. Test in both web and Tauri environments

### Adding New Data Types

1. Update `DevBoardStore` type
2. Modify initial state constant
3. Add migration logic if needed
4. Update component interfaces
5. Test data persistence
