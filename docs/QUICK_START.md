# DevBoard - Quick Start Guide

Get DevBoard running in **5 minutes** with this streamlined setup guide.

> 🖥️ **Desktop-First**: This guide prioritizes the native desktop application with optional web access.

## 📥 Installation (Recommended)

### Option 1: Download Release (Fastest)

1. **Go to [Releases](../../../releases)**
2. **Download for your platform:**
   - **Windows**: `DevBoard_x.x.x_x64_en-US.msi`
   - **macOS**: `DevBoard_x.x.x_x64.dmg`
   - **Linux**: `devboard_x.x.x_amd64.AppImage`
3. **Install and launch DevBoard**

✅ **Done!** Your projects will be saved locally and persist between sessions.

### Option 2: Build from Source

**Prerequisites:**
- Node.js 18+ ([Download](https://nodejs.org/))
- Rust ([Install](https://rustup.rs/))

**Setup:**
```bash
# Clone repository
git clone https://github.com/your-username/DevBoard.git
cd DevBoard

# Install dependencies
npm install

# Launch desktop app
npm run dev:tauri
```

---

## 🚀 First Launch

### 1. Create Your First Project

1. **Click "New Project"**
2. **Fill in details:**
   - **Name**: `My First Project`
   - **Description**: `Learning DevBoard`
   - **Status**: `Active`
3. **Click "Create Project"**

### 2. Add Some Content

**Snippets:**
- Click "Add Snippet"
- Paste some code and add tags
- Save for later reference

**Notes:**
- Use the Markdown editor
- Preview changes in real-time
- Export as PDF when needed

**TODOs:**
- Add tasks to track project progress
- Mark items as complete
- Stay organized

### 3. Data Storage

Your projects are automatically saved to:
- **Windows**: `%APPDATA%\DevBoard\devboard.json`
- **macOS**: `~/Library/Application Support/DevBoard/devboard.json`
- **Linux**: `~/.config/DevBoard/devboard.json`

---

## 💻 Web Version (Optional)

For quick access without installation:

```bash
# Clone and setup (if not done already)
git clone https://github.com/your-username/DevBoard.git
cd DevBoard
npm install

# Start web server
npm run dev
# Open http://localhost:5174
```

> ⚠️ **Note**: Web version uses browser localStorage - data won't sync with desktop app

---

## 🔧 Development Setup

### Desktop Development
```bash
# Install dependencies
npm install

# Start desktop development
npm run dev:tauri

# Build for production
npm run build:tauri
```

### Available Commands
```bash
npm run dev:tauri     # Desktop development
npm run dev           # Web development  
npm run build:tauri   # Desktop production build
npm run build         # Web production build
npm run lint          # Code linting
npm run type-check    # TypeScript validation
```

---

## 🛠️ Troubleshooting

### Desktop App Won't Start

**Check Prerequisites:**
```bash
# Verify installations
node --version    # Should be 18+
rustc --version   # Should show Rust version
npm --version     # Should show npm version
```

**Common Fixes:**
```bash
# Clear cache and reinstall
rm -rf node_modules src-tauri/target
npm install
npm run dev:tauri
```

### Build Errors

**Linux:**
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
```

**macOS:**
```bash
xcode-select --install
source ~/.cargo/env
```

**Windows:**
- Install Visual Studio Build Tools
- Or use [Chocolatey](https://chocolatey.org/): `choco install visualstudio2019buildtools`

### Port Issues
```bash
# If port 5174 is busy
lsof -ti:5174 | xargs kill -9

# Or use different port
npm run dev -- --port 5175
```

### Data Recovery
- **Desktop**: Check the data file locations above
- **Web**: Browser DevTools → Application → Local Storage
- **Reset**: Delete data file or clear localStorage

---

## 🌟 Next Steps

1. **📖 [Read the Main README](../README.md)** - Complete project overview
2. **🔧 [Development Guide](DEVELOPMENT.md)** - Architecture and contributing
3. **💾 [Storage System](STORAGE_SYSTEM.md)** - Understanding data management
4. **📦 [Deployment Guide](DEPLOYMENT.md)** - Building and distribution
5. **🩺 [Troubleshooting](TROUBLESHOOTING.md)** - Solutions for common issues

---

## 🤔 Need Help?

- **💬 [GitHub Discussions](../../../discussions)** - Ask questions and share ideas
- **🐛 [Report Issues](../../../issues)** - Found a bug? Let us know
- **📚 [Complete Documentation](README.md)** - In-depth guides

---

**Ready to organize your development workflow? Welcome to DevBoard! 🎉**