# DevBoard - Troubleshooting Guide

This guide helps you diagnose and fix common issues when developing or using DevBoard.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Problems](#development-server-problems)
- [Tauri-Specific Issues](#tauri-specific-issues)
- [Storage Problems](#storage-problems)
- [Build Failures](#build-failures)
- [Performance Issues](#performance-issues)
- [Data Recovery](#data-recovery)
- [Environment Detection](#environment-detection)
- [Getting Help](#getting-help)

## Installation Issues

### Node.js Version Conflicts

**Problem:** DevBoard doesn't start or shows dependency errors.

**Solution:**
```bash
# Check Node.js version
node --version
# Should be v18.0.0 or higher

# If version is too old, update Node.js
# Visit https://nodejs.org/ or use version manager
nvm install 18
nvm use 18
```

### npm Permission Errors (Linux/macOS)

**Problem:** Permission denied when installing packages.

**Solution:**
```bash
# Fix npm permissions (recommended method)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
```

### Package Installation Fails

**Problem:** `npm install` fails with network or dependency errors.

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use different registry if behind firewall
npm install --registry https://registry.npmjs.org/
```

## Development Server Problems

### Port Already in Use

**Problem:** Error "Port 5174 is already in use"

**Solutions:**
```bash
# Find and kill process using the port
lsof -ti:5174 | xargs kill -9

# Or use different port
npm run dev -- --port 5175

# Or set environment variable
export PORT=5175
npm run dev
```

### Hot Reload Not Working

**Problem:** Changes not reflected in browser.

**Solutions:**
1. **Check file watchers limit (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Chrome/Firefox)
   - Clear cache in DevTools: Application → Storage → Clear

3. **Restart development server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

### CORS Errors in Development

**Problem:** CORS policy blocks requests in browser.

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

## Tauri-Specific Issues

### Rust Not Installed

**Problem:** "rustc not found" or Tauri build fails.

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### Tauri CLI Not Found

**Problem:** "tauri command not found"

**Solutions:**
```bash
# Install globally
npm install -g @tauri-apps/cli

# Or use local version
npx tauri --version

# Update package.json scripts to use npx
"scripts": {
  "tauri": "npx tauri"
}
```

### Permission Denied Errors

**Problem:** "path not allowed" or "permission denied" in Tauri app.

**Check capabilities file:**
```json
// src-tauri/capabilities/default.json
{
  "permissions": [
    "core:path:allow-resolve-directory",
    "fs:allow-read-text-file",
    "fs:allow-write-text-file",
    "fs:allow-exists",
    "fs:allow-remove",
    "fs:allow-mkdir",
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$APPDATA/*" }]
    },
    {
      "identifier": "fs:allow-write-text-file",
      "allow": [{ "path": "$APPDATA/*" }]
    }
  ]
}
```

### Tauri Build Failures

**Problem:** Compilation errors during `npm run tauri build`.

**Common Solutions:**

1. **Clear build cache:**
   ```bash
   cd src-tauri
   cargo clean
   cd ..
   npm run tauri build
   ```

2. **Update Rust:**
   ```bash
   rustup update
   ```

3. **Check Cargo.toml dependencies:**
   ```toml
   [dependencies]
   tauri = { version = "2.9.5", features = [] }
   tauri-plugin-fs = "2"
   ```

## Storage Problems

### Data Not Persisting

**Problem:** Data disappears after refresh or restart.

**Diagnosis:**
```typescript
// Add to your component for debugging
const { data, loading, error } = useDevBoardStorage();

console.log('Storage state:', { data, loading, error });
console.log('Is Tauri:', isTauri());
console.log('Tauri ready:', await isTauriReady());
```

**Solutions:**

1. **Browser environment:**
   - Check if localStorage is disabled
   - Verify no extensions are blocking storage
   - Check private/incognito mode restrictions

2. **Desktop environment:**
   - Verify file permissions in app data directory
   - Check if antivirus is blocking file writes
   - Look for the actual data file location:
     - Windows: `%APPDATA%\DevBoard\devboard.json`
     - macOS: `~/Library/Application Support/DevBoard/devboard.json`
     - Linux: `~/.config/DevBoard/devboard.json`

### Storage Corruption

**Problem:** Invalid JSON or corrupted data file.

**Recovery steps:**
```bash
# 1. Backup existing data (if possible)
cp ~/.config/DevBoard/devboard.json ~/.config/DevBoard/devboard.json.backup

# 2. Check if file is valid JSON
cat ~/.config/DevBoard/devboard.json | jq .

# 3. If corrupted, delete and restart app
rm ~/.config/DevBoard/devboard.json
```

### Storage Access Denied

**Problem:** Cannot read/write storage file.

**Solutions:**

1. **Fix file permissions:**
   ```bash
   # Linux/macOS
   chmod 644 ~/.config/DevBoard/devboard.json
   chmod 755 ~/.config/DevBoard/
   ```

2. **Check directory ownership:**
   ```bash
   # Make sure you own the directory
   sudo chown -R $USER ~/.config/DevBoard/
   ```

## Build Failures

### TypeScript Compilation Errors

**Problem:** Build fails with TypeScript errors.

**Solutions:**
```bash
# Check types without building
npm run type-check

# Common fixes
# 1. Update TypeScript
npm install typescript@latest --save-dev

# 2. Clear TypeScript cache
rm -rf node_modules/.cache/
```

### Out of Memory Errors

**Problem:** Build process runs out of memory.

**Solutions:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Or set in package.json
"scripts": {
  "build": "NODE_OPTIONS=--max_old_space_size=4096 tsc -b && vite build"
}
```

### Vite Build Issues

**Problem:** Vite build fails or produces incorrect output.

**Solutions:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite/

# Check vite.config.ts for issues
# Ensure proper base path configuration
```

## Performance Issues

### Slow Development Server

**Problem:** DevBoard loads slowly in development.

**Solutions:**

1. **Optimize Vite config:**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     optimizeDeps: {
       include: ['react', 'react-dom', '@mui/material']
     },
     server: {
       fs: {
         strict: false
       }
     }
   });
   ```

2. **Reduce bundle size:**
   - Check for large dependencies
   - Use dynamic imports for heavy components

### Memory Leaks

**Problem:** Application memory usage grows over time.

**Debugging:**
```typescript
// Monitor component renders
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn('Slow render:', { id, phase, actualDuration });
  }
}

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

## Data Recovery

### Restore from Backup

**Web version (localStorage):**
```javascript
// In browser console
const backup = localStorage.getItem('devboard-backup');
if (backup) {
  localStorage.setItem('devboard', backup);
  location.reload();
}
```

**Desktop version:**
```bash
# Restore from backup file
cp ~/.config/DevBoard/devboard.json.backup ~/.config/DevBoard/devboard.json
```

### Export Data for Backup

```typescript
// Add this to your app for manual backup
const exportData = async () => {
  const data = await storage.get();
  const blob = new Blob([JSON.stringify(data, null, 2)], 
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devboard-backup.json';
  a.click();
};
```

### Reset to Factory Settings

**Complete reset:**
```typescript
// In browser console or app
const { reset } = useDevBoardStorage();
await reset();

// Or manually
await storage.clear();
location.reload(); // Web
// Or restart app (Desktop)
```

## Environment Detection

### Mixed Environment Issues

**Problem:** App behaves inconsistently between web and desktop.

**Debug environment:**
```typescript
// Add to your app
console.log('Environment info:', {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  isTauri: isTauri(),
  tauriReady: await isTauriReady(),
  hasWindow: typeof window !== 'undefined',
  hasTauriInternals: '__TAURI_INTERNALS__' in window,
  storage: await isTauriReady() ? 'Tauri FS' : 'localStorage'
});
```

### API Availability Issues

**Problem:** Tauri APIs not available when expected.

**Solutions:**
```typescript
// Wait for APIs to load
const waitForTauri = async () => {
  for (let i = 0; i < 50; i++) {
    if (await isTauriReady()) return true;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
};

// Use in initialization
if (isTauri()) {
  const ready = await waitForTauri();
  if (!ready) {
    console.warn('Tauri APIs not ready, falling back to localStorage');
  }
}
```

## Browser-Specific Issues

### Safari localStorage Issues

**Problem:** Storage not working in Safari.

**Solution:**
```typescript
// Check localStorage availability
const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};

if (!isStorageAvailable()) {
  // Fall back to in-memory storage
  console.warn('localStorage not available, using memory storage');
}
```

### Firefox Developer Edition

**Problem:** CORS or storage restrictions.

**Solution:**
- Disable enhanced tracking protection for localhost
- Check `about:config` for storage restrictions

## Getting Help

### Enable Debug Mode

```typescript
// Add to localStorage for detailed logging
localStorage.setItem('debug', 'true');

// Or add to main.tsx
if (process.env.NODE_ENV === 'development') {
  console.log = console.log; // Ensure console.log works
  window.addEventListener('error', (e) => {
    console.error('Global error:', e);
  });
}
```

### Collect System Information

```bash
# System info script
echo "DevBoard Debug Info"
echo "=================="
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "Rust: $(rustc --version 2>/dev/null || echo 'Not installed')"
echo "Browser: $USER_AGENT"
echo "Storage: $(ls -la ~/.config/DevBoard/ 2>/dev/null || echo 'No desktop data found')"
```

### Common Log Messages

**Normal operation:**
```
✅ Tauri APIs loaded successfully
✅ Storage initialized successfully
✅ Data read from [path]
✅ Data saved to [path]
```

**Warning signs:**
```
⚠️ Tauri APIs not ready after timeout, falling back to localStorage
⚠️ Failed to get app data directory
⚠️ Error reading from file
```

**Critical errors:**
```
❌ Storage initialization error
❌ Error writing to file
❌ Failed to load Tauri APIs
```

### Filing Bug Reports

When reporting issues, include:

1. **Environment details:**
   - OS and version
   - Node.js version
   - Browser version (if web)
   - DevBoard version

2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Console logs** (with debug mode enabled)
5. **Storage data** (if relevant and not sensitive)

### Community Resources

- **GitHub Issues:** Report bugs and feature requests
- **Discussions:** Ask questions and share tips
- **Documentation:** Check `/docs` folder for detailed guides

---

**Still having issues?** Open an issue on GitHub with the debug information above. The maintainers are happy to help! 🚀