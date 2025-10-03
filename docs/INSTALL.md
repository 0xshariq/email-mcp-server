# Cross-Platform Installation Guide

## 🌍 Universal Installation (Recommended)

The Email MCP Server CLI works on **all platforms** - Windows, macOS, and Linux!

### Method 1: NPM Global Install (Works Everywhere)

```bash
# Clone or download the project
cd email-mcp-server

# Install globally (this will work on any platform)
npm install -g .
```

After installation, all commands work in any terminal:
- ✅ Windows PowerShell
- ✅ Windows CMD
- ✅ macOS Terminal
- ✅ Linux Terminal
- ✅ WSL/Ubuntu

### Method 2: Platform-Specific Installers

#### Windows
```batch
# Double-click install.bat or run in CMD/PowerShell as Administrator:
install.bat
```

📖 **[Windows Setup Guide](WINDOWS.md)** - Complete Windows installation and setup

#### Linux/macOS/WSL
```bash
# Make executable and run:
chmod +x install.js
node install.js

# Or use the shell script:
chmod +x setup-symlinks.sh
./setup-symlinks.sh
```

## 🚀 Usage (Same on All Platforms)

```bash
# Send email
email-send recipient@example.com "Subject" "Message body"

# Read recent emails
email-read 10

# Get specific email
email-get 12345

# Search emails
email-search --from "sender@example.com"

# All other commands work the same way!
```

## 🔧 Troubleshooting

### Windows Issues
- Run PowerShell as Administrator
- Make sure Node.js is in PATH
- Try: `npm config set prefix %APPDATA%/npm`

### Linux/macOS Issues
- Use `sudo npm install -g .` if permission denied
- Make sure `/usr/local/bin` is in PATH

### WSL Issues
- Install Node.js in WSL: `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -`
- Then: `sudo apt-get install -y nodejs`

## ✅ Verification

Test installation on any platform:
```bash
email-send --help
email-list --help
contact-add --help
```

All commands should work identically across platforms!