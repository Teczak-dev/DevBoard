# DevBoard - Development Guide

Welcome to DevBoard development! This guide will help you understand the codebase structure, development workflow, and contribution guidelines.

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Storage System](#storage-system)
- [Testing](#testing)
- [Code Style](#code-style)
- [Contributing](#contributing)
- [Debugging](#debugging)

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Rust (for Tauri builds)
- Git

### First Time Setup
```bash
git clone https://github.com/Teczak-dev/DevBoard.git
cd DevBoard
npm install
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev              # Start web dev server (port 5174)
npm run dev:web          # Same as above (explicit)
npm run dev:tauri        # Start Tauri desktop dev

# Building
npm run build            # Build web version
npm run build:web        # Same as above (explicit)
npm run build:tauri      # Build desktop application

# Quality & Tools
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript compiler check
npm run preview          # Preview production build

# Utilities
npm run clean            # Clean build artifacts
npm start                # Alias for npm run dev
```

## 📁 Project Structure

```
DevBoard/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components (routes)
│   ├── layout/             # Layout components
│   ├── context/            # React context providers
│   ├── shared/             # Shared utilities and types
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── constants/      # Application constants
│   ├── styles/             # CSS and styling
│   ├── assets/             # Static assets
│   ├── main.tsx           # Application entry point
│   ├── routes.tsx         # Route definitions
│   └── tauri.d.ts         # Tauri TypeScript declarations
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   ├── capabilities/      # Tauri permissions
│   └── Cargo.toml         # Rust dependencies
├── public/                # Static public assets
└── docs/                  # Documentation
```

## 🔧 Development Workflow

### 1. Environment Setup

**Web Development** (Recommended for UI work):
```bash
npm run dev
# Opens http://localhost:5174
```

**Desktop Development** (For Tauri-specific features):
```bash
npm run dev:tauri
# Builds and opens desktop app
```

### 2. Hot Reloading

- **Web**: Automatic reload on file changes
- **Tauri**: Frontend hot reload + Rust compilation on changes

### 3. Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **Build time** | Fast incremental | Optimized full build |
| **Bundle size** | Large (includes dev tools) | Minimized |
| **Source maps** | Enabled | Disabled |
| **Error overlay** | Enabled | Disabled |
| **Hot reload** | Enabled | N/A |

## 🏗 Architecture Overview

### Core Concepts

1. **Local-First Design**: All data stored locally
2. **Hybrid Application**: Runs as web app and desktop app
3. **React Architecture**: Component-based UI
4. **Storage Abstraction**: Unified API for web/desktop storage

### Key Layers

```
┌─────────────────────┐
│    React UI Layer   │ ← Components, Pages, Routes
├─────────────────────┤
│   Business Logic    │ ← Hooks, Context Providers
├─────────────────────┤
│   Storage Layer     │ ← Unified Storage Interface
├─────────────────────┤
│   Platform Layer    │ ← localStorage / Tauri FS
└─────────────────────┘
```

### Component Architecture

- **Pages**: Top-level route components
- **Layout**: Shared layout components (headers, sidebars)
- **Components**: Reusable UI components
- **Context**: Global state management (theme, projects)
- **Hooks**: Business logic and state management

## 💾 Storage System

DevBoard uses a sophisticated storage system that works across platforms:

### Architecture
```typescript
// Unified API
storage.get<T>() → Data | null
storage.set<T>(data) → void
storage.init<T>(defaultData) → void
storage.clear() → void
```

### Implementation
- **Web**: localStorage with JSON serialization
- **Desktop**: File system with JSON files
- **Detection**: Automatic environment detection
- **Fallback**: Graceful degradation

### Storage Locations
- **Web**: Browser localStorage
- **Desktop Windows**: `%APPDATA%\DevBoard\devboard.json`
- **Desktop macOS**: `~/Library/Application Support/DevBoard/devboard.json`
- **Desktop Linux**: `~/.config/DevBoard/devboard.json`

### Key Files
- [`src/shared/utils/storage.ts`](../src/shared/utils/storage.ts) - Main interface
- [`src/shared/utils/tauriStorage.ts`](../src/shared/utils/tauriStorage.ts) - Tauri implementation
- [`src/shared/hooks/useDevBoardStorage.ts`](../src/shared/hooks/useDevBoardStorage.ts) - React hook

## 🧪 Testing

### Manual Testing

**Web Environment:**
```bash
npm run dev
# Test in browser at localhost:5174
```

**Desktop Environment:**
```bash
npm run dev:tauri
# Test in native app window
```

### Test Scenarios

1. **Storage Persistence**
   - Add project → refresh → verify data persists
   - Switch between web/desktop → verify data sync

2. **Error Handling**
   - Disable network → verify offline functionality
   - Corrupt localStorage → verify graceful fallback

3. **Cross-Platform**
   - Test responsive design
   - Verify feature parity between web/desktop

### Debug Tools

**Browser DevTools:**
- Application → Local Storage (web data)
- Console → Storage operation logs
- Network → API call monitoring

**Desktop Debugging:**
```bash
# Enable debug mode
localStorage.setItem('debug', 'true');

# View log files (varies by OS)
# macOS: ~/Library/Logs/DevBoard/
# Windows: %APPDATA%\DevBoard\logs\
# Linux: ~/.local/share/DevBoard/logs/
```

## 🎨 Code Style

### TypeScript Guidelines

```typescript
// ✅ Good - Explicit types
interface ProjectData {
  id: string;
  name: string;
  isActive: boolean;
}

// ✅ Good - Generic functions
async function updateProject<T extends ProjectData>(data: T): Promise<void>

// ❌ Avoid - Any types
function updateProject(data: any): void
```

### React Patterns

```typescript
// ✅ Good - Custom hooks for logic
function useProjects() {
  const { data, update } = useDevBoardStorage();
  return {
    projects: data?.projects ?? [],
    addProject: (project) => update(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }))
  };
}

// ✅ Good - Proper error handling
function ProjectList() {
  const { projects, loading, error } = useProjects();
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!projects.length) return <EmptyState />;
  
  return <ProjectGrid projects={projects} />;
}
```

### File Organization

```typescript
// Component file structure
import { useState, useEffect } from 'react';           // External imports
import { Button, TextField } from '@mui/material';    // UI library imports

import { useDevBoardStorage } from '../shared/hooks';  // Internal imports
import { Project } from '../shared/types';            // Type imports

import './ComponentName.css';                          // Styles (last)

// Component implementation
export function ComponentName() {
  // Component logic
}

export default ComponentName;
```

### Naming Conventions

- **Files**: PascalCase for components (`ProjectCard.tsx`)
- **Directories**: camelCase (`src/shared/hooks/`)
- **Functions**: camelCase (`getUserProjects`)
- **Constants**: UPPER_SNAKE_CASE (`DEVBOARD_INITIAL_STATE`)
- **Types/Interfaces**: PascalCase (`DevBoardStore`)

## 🤝 Contributing

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   - Test in both web and desktop modes
   - Verify storage persistence
   - Check responsive design
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add project export functionality"
   ```
6. **Push and create PR**

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(storage): add backup/restore functionality
fix(ui): resolve project card overflow on mobile
docs: update installation instructions
refactor(hooks): simplify useProjects implementation
```

### Code Review Guidelines

1. **Test your changes** in both environments
2. **Update documentation** if needed
3. **Add TypeScript types** for new features
4. **Follow existing patterns** and conventions
5. **Write clear commit messages**

## 🐛 Debugging

### Common Issues

**Storage Not Working:**
```typescript
// Debug storage state
const { data, error } = useDevBoardStorage();
console.log('Storage data:', data);
console.log('Storage error:', error);

// Check environment
console.log('Is Tauri:', isTauri());
console.log('Tauri ready:', await isTauriReady());
```

**Tauri Permissions:**
```json
// Check src-tauri/capabilities/default.json
{
  "permissions": [
    "core:path:allow-resolve-directory",
    "fs:allow-read-text-file",
    "fs:allow-write-text-file"
  ]
}
```

**Build Issues:**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build
```

### Debug Logging

Enable comprehensive logging:
```typescript
// In browser console or main.tsx
if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('debug', 'true');
}
```

### Performance Monitoring

```typescript
// Monitor storage operations
console.time('storage-operation');
await storage.set(data);
console.timeEnd('storage-operation');

// Monitor component renders
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Render:', { id, phase, actualDuration });
}

<Profiler id="ProjectList" onRender={onRenderCallback}>
  <ProjectList />
</Profiler>
```

## 🎯 Best Practices

1. **Always handle loading states** - Users should see feedback during async operations
2. **Implement error boundaries** - Gracefully handle component failures
3. **Use TypeScript strictly** - Avoid `any` types
4. **Test cross-platform** - Verify features work in both web and desktop
5. **Document complex logic** - Help future contributors understand your code
6. **Keep components focused** - Single responsibility principle
7. **Use semantic versioning** - Follow semver for releases

## 🚢 Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Test thoroughly** in both environments
4. **Create release tag**
5. **Build production assets**
6. **Deploy/distribute** as needed

---

Happy coding! 🚀

For questions or clarifications, feel free to open an issue or reach out to the maintainers.

## 📚 Related Documentation

- [Quick Start Guide](QUICK_START.md) - Get up and running quickly
- [Storage System](STORAGE_SYSTEM.md) - Understanding data persistence
- [API Reference](API_REFERENCE.md) - Complete API documentation
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Deployment Guide](DEPLOYMENT.md) - Production deployment