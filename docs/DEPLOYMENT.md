# DevBoard - Deployment Guide

This guide covers how to build and deploy DevBoard for **desktop** and **web** platforms.

## Table of Contents

- [Desktop Distribution](#desktop-distribution)
- [Web Deployment](#web-deployment)
- [Build Commands](#build-commands)
- [File Locations](#file-locations)
- [Distribution](#distribution)

---

## Desktop Distribution

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Tauri CLI
npm install -g @tauri-apps/cli

# Verify installation
rustc --version
tauri --version
```

### Building Desktop Applications

#### Development Build
```bash
npm install
npm run dev:tauri
```

#### Production Build
```bash
npm run build:tauri
```

### Platform-Specific Builds

**Windows:**
```bash
# On Windows machine
npm run build:tauri
# Creates: .msi installer
```

**macOS:**
```bash
# On macOS machine
npm run build:tauri
# Creates: .dmg installer and .app bundle
```

**Linux:**
```bash
# On Linux machine
npm run build:tauri
# Creates: .AppImage, .deb, and .rpm packages
```

### Desktop Build Output Locations

After running `npm run build:tauri`, files are located in:

```
src-tauri/target/release/bundle/
├── msi/                    # Windows installer
│   └── DevBoard_1.0.0_x64_en-US.msi
├── dmg/                    # macOS installer
│   └── DevBoard_1.0.0_x64.dmg
├── macos/                  # macOS app bundle
│   └── DevBoard.app
├── deb/                    # Linux Debian package
│   └── devboard_1.0.0_amd64.deb
├── rpm/                    # Linux RPM package
│   └── devboard-1.0.0-1.x86_64.rpm
└── appimage/               # Linux AppImage
    └── devboard_1.0.0_amd64.AppImage
```

---

## Web Deployment

### Building Static Site

DevBoard web version is a static single-page application (SPA).

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### Web Build Output Locations

After running `npm run build`, files are located in:

```
dist/
├── index.html              # Main HTML file
├── assets/                 # Built assets
│   ├── index-[hash].js     # Main JavaScript bundle
│   ├── index-[hash].css    # Main CSS bundle
│   └── [other-assets]      # Fonts, images, etc.
└── [static-files]          # Any files from public/
```

### Simple Deployment Options

#### 1. Static File Hosting

Copy the `dist/` folder to any web server:

```bash
# After building
cp -r dist/ /var/www/html/devboard/
```

#### 2. Quick Hosting Services

**Netlify:**
```bash
# Drag and drop the 'dist' folder to netlify.com
# Or use CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# Install CLI and deploy
npm install -g vercel
vercel --prod
```

**GitHub Pages:**
```bash
# Build and push to gh-pages branch
npm run build
npx gh-pages -d dist
```

#### 3. Local Preview

Test the built site locally:
```bash
npm run build
npm run preview
# Opens http://localhost:4173
```

### Web Server Configuration

For proper SPA routing, configure your web server:

**Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Build Commands

### All Available Commands

```bash
# Desktop
npm run dev:tauri           # Desktop development
npm run build:tauri         # Desktop production build

# Web
npm run dev                 # Web development (http://localhost:5174)
npm run build               # Web production build
npm run preview             # Preview web build locally

# Development
npm run lint                # Code linting
npm run type-check          # TypeScript validation
```

### Build Optimization

For smaller web builds, you can:

1. **Analyze bundle size:**
```bash
npm run build
ls -la dist/assets/
```

2. **Check for large files:**
```bash
find dist -name "*.js" -o -name "*.css" | xargs ls -lh
```

---

## File Locations

### Development Files
```
DevBoard/
├── src/                    # React application source
├── src-tauri/              # Rust desktop application
├── dist/                   # Web build output (after npm run build)
├── public/                 # Static web assets
└── package.json            # Dependencies and scripts
```

### Production Files

**Desktop Applications:**
- Windows: `src-tauri/target/release/bundle/msi/*.msi`
- macOS: `src-tauri/target/release/bundle/dmg/*.dmg`
- Linux: `src-tauri/target/release/bundle/appimage/*.AppImage`

**Web Application:**
- All files: `dist/` directory
- Main files: `dist/index.html` and `dist/assets/`

### Data Storage Locations

**Desktop Application:**
- Windows: `%APPDATA%\DevBoard\devboard.json`
- macOS: `~/Library/Application Support/DevBoard/devboard.json`
- Linux: `~/.config/DevBoard/devboard.json`

**Web Application:**
- Browser localStorage (not synced with desktop)

---

## Distribution

### Desktop Distribution

1. **Build for target platform**
2. **Test installer locally**
3. **Distribute installer file:**
   - Direct download links
   - GitHub Releases
   - Package managers (winget, homebrew, etc.)

### Web Distribution

1. **Build static files**
2. **Upload `dist/` contents to web server**
3. **Configure routing for SPA**
4. **Test in browser**

### Simple Release Process

1. **Update version numbers:**
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. **Build for all platforms:**
   ```bash
   # Desktop (run on each OS)
   npm run build:tauri
   
   # Web (run on any OS)
   npm run build
   ```

3. **Test built applications**

4. **Distribute files from build output locations**

---

## Troubleshooting Builds

### Desktop Build Issues

**Linux missing dependencies:**
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
```

**macOS missing Xcode:**
```bash
xcode-select --install
```

**Windows missing build tools:**
- Install Visual Studio Build Tools
- Or use: `choco install visualstudio2019buildtools`

### Web Build Issues

**Out of memory during build:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Build succeeds but blank page:**
- Check browser console for errors
- Verify `index.html` is being served for all routes

### Clean Build

If builds fail, try cleaning:
```bash
# Clean everything
rm -rf node_modules dist src-tauri/target
npm install

# Try builds again
npm run build:tauri  # Desktop
npm run build        # Web
```

---

**Ready to build and deploy DevBoard! 🚀**

> **Note**: Web version uses browser storage and doesn't sync with desktop app data.