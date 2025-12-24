# DevBoard - API Reference

This document provides a comprehensive reference for all APIs, hooks, and interfaces available in DevBoard.

## Table of Contents

- [Storage API](#storage-api)
- [React Hooks](#react-hooks)
- [Type Definitions](#type-definitions)
- [Utility Functions](#utility-functions)
- [Component APIs](#component-apis)
- [Environment Detection](#environment-detection)

## Storage API

### `storage`

Main storage interface that automatically adapts to the runtime environment.

```typescript
import { storage } from '../shared/utils/storage';
```

#### Methods

##### `storage.get<T>()`
Retrieves data from storage.

```typescript
async get<T>(): Promise<T | null>
```

**Returns:** Promise resolving to stored data or `null` if not found.

**Example:**
```typescript
const data = await storage.get<DevBoardStore>();
if (data) {
  console.log('Projects:', data.projects);
}
```

##### `storage.set<T>(data)`
Saves data to storage.

```typescript
async set<T>(data: T): Promise<void>
```

**Parameters:**
- `data: T` - Data to save (must be JSON serializable)

**Throws:** Error if storage operation fails

**Example:**
```typescript
await storage.set(newDevBoardState);
```

##### `storage.init<T>(defaultData)`
Initializes storage with default data if empty.

```typescript
async init<T>(initialData: T): Promise<void>
```

**Parameters:**
- `initialData: T` - Default data to use if storage is empty

**Example:**
```typescript
await storage.init<DevBoardStore>(DEVBOARD_INITIAL_STATE);
```

##### `storage.clear()`
Clears all stored data.

```typescript
async clear(): Promise<void>
```

**⚠️ Warning:** This operation is irreversible.

**Example:**
```typescript
await storage.clear();
```

## React Hooks

### `useDevBoardStorage`

Main hook for managing DevBoard storage with React state integration.

```typescript
import { useDevBoardStorage } from '../shared/hooks/useDevBoardStorage';
```

#### Returns

```typescript
interface UseDevBoardStorageReturn {
  data: DevBoardStore | null;
  loading: boolean;
  error: string | null;
  update: (updater: (prev: DevBoardStore) => DevBoardStore) => Promise<void>;
  reset: () => Promise<void>;
}
```

#### Properties

##### `data`
Current storage data or `null` during loading.

```typescript
data: DevBoardStore | null
```

##### `loading`
Loading state indicator.

```typescript
loading: boolean
```

- `true` during initialization and critical operations
- `false` when data is ready

##### `error`
Error message if storage operations fail.

```typescript
error: string | null
```

#### Methods

##### `update(updater)`
Updates storage data with optimistic UI updates.

```typescript
update: (updater: (prev: DevBoardStore) => DevBoardStore) => Promise<void>
```

**Parameters:**
- `updater: Function` - Function that receives current state and returns new state

**Features:**
- Optimistic updates (immediate UI feedback)
- Automatic error recovery
- State consistency guarantees

**Example:**
```typescript
const { update } = useDevBoardStorage();

// Add a new project
await update(prev => ({
  ...prev,
  projects: [...prev.projects, newProject]
}));
```

##### `reset()`
Resets storage to initial state.

```typescript
reset: () => Promise<void>
```

**Example:**
```typescript
const { reset } = useDevBoardStorage();
await reset();
```

#### Usage Example

```typescript
function ProjectDashboard() {
  const { data, loading, error, update } = useDevBoardStorage();

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;

  const addProject = async (project: Project) => {
    await update(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  return (
    <div>
      <h1>Projects ({data?.projects.length})</h1>
      <ProjectList projects={data?.projects ?? []} />
      <AddProjectButton onAdd={addProject} />
    </div>
  );
}
```

## Type Definitions

### `DevBoardStore`

Main application data structure.

```typescript
interface DevBoardStore {
  projects: Project[];
  snippets: Snippet[];
  todos: Todo[];
  settings: {
    theme: "light" | "dark" | "system";
  };
  meta: {
    version: number;
  };
}
```

#### Properties

- `projects: Project[]` - List of user projects
- `snippets: Snippet[]` - Code snippets collection
- `todos: Todo[]` - Task list
- `settings.theme` - Application theme preference
- `meta.version` - Data format version for migrations

### `Project`

Project data structure.

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  githubUrl?: string;
}
```

### `Snippet`

Code snippet structure.

```typescript
interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  projectId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### `Todo`

Task item structure.

```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  projectId?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### `StorageAdapter`

Interface for storage implementations.

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

## Utility Functions

### Environment Detection

#### `isTauri()`
Checks if application is running in Tauri environment.

```typescript
function isTauri(): boolean
```

**Returns:** `true` if Tauri environment, `false` if browser

**Example:**
```typescript
import { isTauri } from '../shared/utils/isTauri';

if (isTauri()) {
  console.log('Running as desktop app');
} else {
  console.log('Running in browser');
}
```

#### `isTauriReady()`
Checks if Tauri APIs are fully loaded and ready.

```typescript
async function isTauriReady(): Promise<boolean>
```

**Returns:** Promise resolving to `true` if APIs are available

**Example:**
```typescript
import { isTauriReady } from '../shared/utils/isTauri';

if (await isTauriReady()) {
  // Safe to use Tauri APIs
  const appDir = await window.__TAURI__.path.appDataDir();
}
```

### ID Generation

#### `generateId()`
Generates unique identifier.

```typescript
function generateId(): string
```

**Returns:** Unique string identifier

**Example:**
```typescript
const newProject: Project = {
  id: generateId(),
  name: 'My Project',
  // ... other properties
};
```

## Component APIs

### Common Props

#### `Project` Component Props

```typescript
interface ProjectProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  className?: string;
}
```

#### `Snippet` Component Props

```typescript
interface SnippetProps {
  snippet: Snippet;
  onEdit?: (snippet: Snippet) => void;
  onDelete?: (id: string) => void;
  onCopy?: (code: string) => void;
  showProject?: boolean;
}
```

#### `Todo` Component Props

```typescript
interface TodoProps {
  todo: Todo;
  onToggleComplete?: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  showProject?: boolean;
}
```

### Form Components

#### `ProjectForm`

```typescript
interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  loading?: boolean;
}
```

#### `SnippetForm`

```typescript
interface SnippetFormProps {
  initialData?: Partial<Snippet>;
  onSubmit: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  projects?: Project[];
}
```

## Error Handling

### Error Types

```typescript
type StorageError = 'STORAGE_UNAVAILABLE' | 'WRITE_FAILED' | 'READ_FAILED' | 'CORRUPTION_DETECTED';

interface DevBoardError {
  type: StorageError;
  message: string;
  context?: any;
}
```

### Error Recovery

The storage system implements automatic error recovery:

1. **Write Errors**: Revert to previous state
2. **Read Errors**: Fall back to initial state
3. **Corruption**: Clear storage and reinitialize
4. **API Unavailable**: Switch to alternative storage method

## Constants

### Initial State

```typescript
const DEVBOARD_INITIAL_STATE: DevBoardStore = {
  projects: [],
  snippets: [],
  todos: [],
  settings: { theme: "dark" },
  meta: { version: 1 }
};
```

### Storage Key

```typescript
const STORAGE_KEY = "devboard";
```

### Theme Options

```typescript
type Theme = "light" | "dark" | "system";
```

## Browser APIs Used

### Web Environment
- `localStorage` for data persistence
- `JSON.parse()` / `JSON.stringify()` for serialization

### Tauri Environment
- `window.__TAURI__.fs.readTextFile()` for reading files
- `window.__TAURI__.fs.writeTextFile()` for writing files
- `window.__TAURI__.path.appDataDir()` for directory resolution

## Best Practices

### 1. Always Handle Loading States
```typescript
const { data, loading, error } = useDevBoardStorage();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### 2. Use Optimistic Updates
```typescript
// ✅ Good - Optimistic update
const addProject = async (project) => {
  await update(prev => ({
    ...prev,
    projects: [...prev.projects, project]
  }));
};

// ❌ Avoid - Manual state management
const addProject = async (project) => {
  setLoading(true);
  await storage.set(newData);
  const updatedData = await storage.get();
  setData(updatedData);
  setLoading(false);
};
```

### 3. Type Safety
```typescript
// ✅ Good - Proper typing
const { data } = useDevBoardStorage();
const projects: Project[] = data?.projects ?? [];

// ❌ Avoid - Unsafe access
const projects = data.projects; // Could throw if data is null
```

### 4. Error Boundaries
Wrap components with error boundaries to handle storage errors gracefully:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProjectDashboard />
</ErrorBoundary>
```

## Migration Guide

When updating the storage schema, follow these steps:

1. **Update `meta.version`** in initial state
2. **Create migration function**
3. **Handle version checks** in storage initialization

```typescript
const migrateToV2 = (data: any): DevBoardStore => {
  if (data.meta?.version === 1) {
    // Perform migration from v1 to v2
    return {
      ...data,
      newField: 'defaultValue',
      meta: { version: 2 }
    };
  }
  return data;
};
```

## Performance Considerations

### Storage Operations
- Storage operations are asynchronous - always handle with `await`
- Use optimistic updates for responsive UI
- Batch multiple updates when possible

### Memory Usage
- Data is cached in React state
- Storage operations copy data (immutable updates)
- Consider data size for large projects

### File System (Tauri)
- JSON files are human-readable but can be large
- Consider compression for very large datasets
- File operations are atomic (safe from corruption)