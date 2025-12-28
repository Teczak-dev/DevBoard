| Platform | File | Architecture |
|----------|------|--------------|
| **Windows** | `.msi` | x64 |
| **macOS** | `.dmg` | Intel (x64) & Apple Silicon (ARM) |
| **Linux** | `.AppImage` / `.deb` | x64 |

> 💡 **macOS users**: Choose `aarch64` for M1/M2/M3 Macs, `x86_64` for Intel Macs

---

## Windows Installation

1. Download the `.msi` file
2. Run the installer
3. If **Windows SmartScreen** warning appears:
   - Click **More info**
   - Click **Run anyway**
4. Follow the installation wizard
5. Launch DevBoard from the Start Menu

>  The warning appears because the app doesn't have a paid Microsoft certificate. It's completely safe to use.

---

## macOS Installation

>  **Important**: macOS may show an "unidentified developer" warning.

### Method 1: Terminal (Recommended)
1. Download and open the `.dmg` file
2. Drag DevBoard to the **Applications** folder
3. Open **Terminal** and run:
   ```bash
   xattr -cr /Applications/DevBoard.app
4. Launch DevBoard normally

### Method 2: Control + Click
1. Find DevBoard in Applications folder
2. Hold Control and click on the app
3. Select Open
4. Click Open in the dialog box

### Method 3: System Settings
1. Try to open the app (an error will appear)
2. Go to System Settings → Privacy & Security
3. Scroll down - you'll see "DevBoard was blocked"
4. Click Open Anyway
>💡 This is a one-time setup. The app is safe - we just don't have a paid Apple Developer certificate ($99/year).

## Linux Installation

### AppImage (Universal)
1. Download the .AppImage file
2. Make it executable
```bash 
   chmod +x DevBoard_*.AppImage
```
3. Run
```bash
	./DevBoard_*.AppImage
```
### Debian / Ubuntu (.deb)

1. Download the .deb file
2. Install
```bash
	sudo dpkg -i devboard_*.deb
```

3. If there are missing dependencies
```bash
	sudo apt-get install -f
```

4. Launch from application menu or run:
```bash
	devboard
```
## Data Storage
Your projects are saved locally:
| System | Path |
|----------|------|
| **Windows** |`%APPDATA%\DevBoard\devboard.json`|
| **macOS** |`~/Library/Application Support/DevBoard/devboard.json`|
| **Linux** |`~/.config/DevBoard/devboard.json`|
