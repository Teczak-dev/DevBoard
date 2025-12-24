# DevBoard

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?logo=tauri&logoColor=white)](https://tauri.app/)

**DevBoard** is a **local-first desktop application** for developers to manage projects, snippets, and notes in one place.

> 🖥️ **Desktop-First**: Native application for Windows, macOS, and Linux with optional web access

---

## ✨ Features

- 📊 **Local project dashboard** - organize your development work
- 📝 **Markdown editor** with live preview and PDF export  
- ✂️ **Code snippet manager** - save and organize code per project
- ✅ **TODO tracking** - keep project tasks in sync
- 🗒️ **Development notes** - document ideas and code reviews
- 🌙 **Dark/Light themes** - comfortable coding environment
- 💾 **Local-first** - your data stays on your machine
- 🔄 **Cross-platform sync** - same data structure across all platforms

---

## 🚀 Quick Start

### Desktop Application (Recommended)

#### Prerequisites
- **Node.js** 18+ - [Download](https://nodejs.org/)
- **Rust** - [Install](https://rustup.rs/) (for building from source)

#### Install & Run

**Option 1: Download Release**
1. Go to [Releases](../../releases)
2. Download installer for your platform:
   - **Windows**: `.msi` installer
   - **macOS**: `.dmg` installer  
   - **Linux**: `.AppImage` or `.deb`
3. Install and launch DevBoard

**Option 2: Build From Source**
```bash
git clone https://github.com/your-username/DevBoard.git
cd DevBoard
npm install
npm run dev:tauri
```

#### Data Storage
Your projects are saved locally:
- **Windows**: `%APPDATA%\DevBoard\devboard.json`
- **macOS**: `~/Library/Application Support/DevBoard/devboard.json`
- **Linux**: `~/.config/DevBoard/devboard.json`

### Web Version (Optional)

For quick access without installation:

```bash
npm install
npm run dev
# Open http://localhost:5174
```

> ⚠️ **Note**: Web version uses browser storage - data won't sync with desktop app

---

## 🔧 Development

### Desktop Development
```bash
# Setup
npm install

# Development (launches desktop
 app)
npm run dev:tauri

# Production build
npm run build:tauri
```

### Web Development (Optional)
```bash
# Development server
npm run dev

# Production build  
npm run build
```

### Available Scripts
```bash
npm run dev:tauri     # Desktop development
npm run dev
           # Web development
npm run build:tauri   # Desktop production build
npm run build         # Web production build
npm run lint          # Code linting
npm run type-check    # TypeScript validation
```

---

## 🏗️ Architecture

**Desktop-First Design**
- **Frontend**: React + TypeScript
- **Desktop Runtime**: Tauri (Rust)
- **Storage**: Local JSON files (desktop) / localStorage (web)
- **Build System**: Vite

**Cross-Platform Storage**
- Automatic environment detection
- Same data format across platforms
- Offline-first architecture

---

## 📦 Building & Deployment

### Desktop Builds

Build native applications for your platform:

```bash
# Build desktop application
npm run build:tauri
```

**Output locations:**
```
src-tauri/target/release/bundle/
├── msi/                    # Windows installer
├── dmg/                    # macOS installer  
├── deb/                    # Linux Debian package
├── rpm/                    # Linux RPM package
└── appimage/               # Linux AppImage
```

### Web Build

Build static website for hosting:

```bash
# Build web version
npm run build
```

**Output location:**
```
dist/                       # Static website files
├── index.html             # Main HTML file
├── assets/                # JavaScript, CSS, images
│   ├── index-[hash].js    # Main JS bundle
│   └── index-[hash].css   # Main CSS bundle
└── [other-files]          # Static assets
```

**Deploy web version:**
- Copy `dist/` folder to any web server
- Use services like Netlify (drag & drop `dist/` folder)
- Or upload to GitHub Pages, Vercel, etc.

---

## 💾 Local-First Philosophy

DevBoard prioritizes **privacy and performance**:

- ✅ **No accounts required** - start using immediately
- ✅ **Offline-first** - works without internet
- ✅ **Local data** - your information stays on your device
- ✅ **No tracking** - no analytics or data collection
- ✅ **Fast startup** - native performance

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Desktop Runtime** | Tauri (Rust) |
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | CSS Modules |
| **Storage** | File System (desktop) / localStorage (web) |
| **CI/CD** | GitHub Actions |

---

## 📚 Documentation

### 🚀 [Quick Start](/docs/QUICK_START.md)
Get DevBoard running in 5 minutes

### 🔧 [Development Guide](/docs/DEVELOPMENT.md)  
Complete developer reference and architecture overview

### 💾 [Storage System](/docs/STORAGE_SYSTEM.md)
How data is stored and managed across platforms

### 🚢 [Deployment Guide](/docs/DEPLOYMENT.md)
Build instructions and distribution guide

### 🩺 [Troubleshooting](/docs/TROUBLESHOOTING.md)
Solutions for common issues

### 🔌 [API Reference](/docs/API_REFERENCE.md)
Complete technical documentation for developers

---

## 🔧 Troubleshooting

### Common Issues

**Desktop app won't start**
```bash
# Check Tauri dependencies
rustc --version
# Reinstall if needed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Build fails**
```bash
# Clear cache and rebuild
rm -rf src-tauri/target node_modules
npm install
npm run build:tauri
```

**Data not saving**
- Check file permissions in data directory
- Run app as administrator if needed (Windows)
- Check disk space availability

### Debug Mode
Enable detailed logging:
```bash
# Set environment variable
export RUST_LOG=debug
npm run dev:tauri
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Cross-platform desktop application
- [x] Local-first storage system
- [x] Project management core
- [x] CI/CD pipeline for releases

### 🚧 Current (v0.1.0)
- [ ] Complete snippet manager
- [ ] Enhanced markdown editor
- [ ] TODO system improvements
- [ ] PDF export functionality

### 📋 Planned (v0.2.0+)
- [ ] Backup/restore features
- [ ] Theme customization
- [ ] Plugin system
- [ ] GitHub integration (read-only)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev:tauri`
5. **Make changes and test**
6. **Submit pull request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Mikołaj Sobczak**  
- GitHub: [@Teczak-dev](https://github.com/Teczak-dev)
- Project: [DevBoard](https://github.com/Teczak-dev/DevBoard)

---

## 🌟 Support

- ⭐ **Star this repository** if it helps you
- 🐛 **Report issues** via GitHub Issues
- 💬 **Join discussions** in GitHub Discussions
- 📖 **Read the docs** at [/docs](/docs)

---

**Ready to organize your development workflow? Download DevBoard today! 🚀**