# Troubleshooting Guide

Quick solutions to common issues with Email MCP Server CLI.

## 🚨 Common Issues

### ❌ Cross-Platform Installation Problems

**Problem:** CLI commands don't work across different platforms (Windows PowerShell, Linux, macOS, WSL)

**Issue Examples:**
```bash
# Windows PowerShell
PS C:\> email-send user@example.com "test" "message"
# Error: 'email-send' is not recognized as the name of a cmdlet...

# WSL/Ubuntu  
$ wsl email-send user@example.com "test" "message"
# Error: /usr/bin/env: 'node': No such file or directory
```

**✅ Solution: Universal Installation**

**Method 1: NPM Global Install (Recommended)**
```bash
# Works on ALL platforms
npm install -g .

# Test on any platform
email-send --help
email-list --help
```

**Method 2: Platform-Specific Scripts**

**Windows:**
```batch
# Run install.bat (double-click or in CMD/PowerShell)
install.bat
```

**Linux/macOS/WSL:**
```bash
# Use cross-platform installer
chmod +x install.js
node install.js

# OR use shell script
chmod +x setup-symlinks.sh
./setup-symlinks.sh
```

**Why This Happens:**
- Windows PowerShell doesn't recognize Unix symlinks
- WSL might not have Node.js installed  
- Platform-specific PATH differences

**✅ Result:** All 40+ commands work identically on Windows, Linux, macOS, and WSL!

### 🧪 Testing Windows Compatibility

**Simple Test:**
```powershell
# After installation, test in PowerShell:
email-send --help
email-read --help 
contact-add --help
esend --help
```

**Expected Result:** All commands should work identically to WSL/Linux.

### ❌ CLI Commands Not Found

**Problem:** `email-send: command not found` after installation

**Quick Fix:**
```bash
# Simple global install
npm install -g .

# Test it works  
email-send --help
```

**Alternative (Manual):**
```bash
# Use the CLI wrapper
node email-cli.js email-send user@example.com "subject" "message"
```

### ❌ Commands Run But No Output

**Problem:** Commands execute silently without response

**Quick Fix:**
```bash
# Rebuild project
npm run build

# Test with verbose help
email-send --help
```

### ❌ Gmail Authentication Failed

**Problem:** `EAUTH` error when sending emails

**Quick Fix:**
```bash
# 1. Enable 2FA on Gmail
# 2. Generate App Password: https://myaccount.google.com/apppasswords  
# 3. Update .env file:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # Use app password, not regular password
```

### ❌ Environment Variables Missing

**Problem:** `.env file not found` error

**Quick Fix:**
```bash
# Copy example file
cp .env.example .env

# Edit with your credentials
nano .env
```

### ❌ Connection Timeout

**Problem:** `ETIMEDOUT` when connecting to email servers

**Quick Fix:**
```bash
# Check internet connection
ping smtp.gmail.com

# Try alternative ports in .env:
SMTP_PORT=465
IMAP_PORT=993
```

### ❌ Permission Denied

**Problem:** Cannot create symlinks or execute files  

**Quick Fix:**
```bash
# On Unix systems
sudo chmod +x setup-symlinks.sh
./setup-symlinks.sh

# On Windows: Run as Administrator
# Right-click PowerShell → "Run as Administrator"
```

## 🔧 Quick Fixes

### ❌ Node Module Errors
```bash
# Reinstall and rebuild
npm install
npm run build
```

### ❌ Email Operations Slow
```bash
# Reduce batch size for faster response
email-read 5    # Instead of 50
```

### ❌ Large Attachments Fail  
```bash
# Check file size (Gmail limit: 25MB)
ls -lh /path/to/file

# Use cloud links for large files instead
```

### ❌ Invalid Email Format
```bash
# Multiple recipients format:
email-send "user1@example.com,user2@example.com" "subject" "body"
```

## 📞 Need More Help?

**Quick Diagnostics:**
```bash
# Check system status  
node --version          # Should be 18+
ping smtp.gmail.com     # Test connectivity
email-send --help       # Test CLI works
```

**Get Support:**
- 📖 Detailed docs: `docs/CLI_USAGE.md`
- 🐛 Report issues: [GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)  
- 💡 For complex setups: `docs/INSTALL.md`

**Remember:** Never share passwords or sensitive info in issue reports!