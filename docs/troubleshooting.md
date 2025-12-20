# Troubleshooting Guide

Quick solutions to common issues with Email MCP Server CLI and MCP server.

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Configuration Issues](#configuration-issues)
- [Authentication Issues](#authentication-issues)
- [Connection Issues](#connection-issues)
- [Command Issues](#command-issues)
- [Performance Issues](#performance-issues)
- [Platform-Specific Issues](#platform-specific-issues)

---

## 🚨 Installation Issues

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
email-cli send --help
email-cli list --help
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
email-cli send --help
email-cli read --help
email-cli contact-add --help
email-cli esend --help
```

**Expected Result:** All commands should work identically to WSL/Linux.

### ❌ CLI Commands Not Found

**Problem:** `email-cli: command not found` after installation

**Quick Fix:**
```bash
# Simple global install
npm install -g .

# Test it works  
email-cli send --help
```

**Alternative (Manual):**
```bash
# Use the CLI wrapper
node email-cli.js send user@example.com "subject" "message"
```

### ❌ Commands Run But No Output

**Problem:** Commands execute silently without response

**Quick Fix:**
```bash
# Rebuild project
npm run build

# Test with verbose help
email-cli send --help
```

---

## ⚙️ Configuration Issues

### ❌ Environment Variables Not Loading

**Problem:** CLI or server can't find environment variables

**Diagnosis:**
```bash
# Check if variables are set
echo $EMAIL_USER          # Linux/macOS
echo %EMAIL_USER%         # Windows CMD
echo $env:EMAIL_USER      # Windows PowerShell

# Check all email-related variables
env | grep EMAIL          # Linux/macOS
Get-ChildItem Env: | Where-Object Name -like "*EMAIL*"  # PowerShell
```

**Solutions:**

**Local Development:**
```bash
# 1. Check .env file exists
ls -la .env

# 2. Verify .env content
cat .env

# 3. Copy from example if missing
cp .env.example .env
nano .env
```

**Global Installation:**

**Linux/macOS:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

**Windows:**
```powershell
# Option 1: System Environment Variables (GUI)
# Win + X → System → Advanced → Environment Variables

# Option 2: PowerShell Profile
notepad $PROFILE
# Add: $env:EMAIL_USER = "your-email@gmail.com"

# Option 3: setx (requires terminal restart)
setx EMAIL_USER "your-email@gmail.com"
```

📖 **[Complete Configuration Guide](CONFIGURATION.md)**

### ❌ Configuration Works for CLI but not MCP Server

**Problem:** CLI works but MCP server can't authenticate

**Solution:**
The MCP server needs environment variables in its config:

```json
{
  "mcpServers": {
    "email": {
      "command": "node",
      "args": ["/path/to/email-mcp-server/dist/server/index.js"],
      "env": {
        "EMAIL_USER": "your-email@gmail.com",
        "EMAIL_PASS": "your-app-password",
        "SMTP_HOST": "smtp.gmail.com",
        "SMTP_PORT": "587",
        "IMAP_HOST": "imap.gmail.com",
        "IMAP_PORT": "993"
      }
    }
  }
}
```

**Windows Path Note:** Use double backslashes or forward slashes:
```json
"args": ["C:\\path\\to\\server\\index.js"]
// or
"args": ["C:/path/to/server/index.js"]
```

---

## 🔐 Authentication Issues

## 🔐 Authentication Issues

### ❌ Gmail Authentication Failed

**Problem:** `EAUTH` error when sending emails

**Quick Fix:**
```bash
# 1. Enable 2FA on Gmail
# Go to: https://myaccount.google.com/security

# 2. Generate App Password
# Go to: https://myaccount.google.com/apppasswords
# Select: Mail → Your device → Generate

# 3. Update configuration
# Local: Edit .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # 16-character app password

# Global: Update environment variables (see Configuration section)
```

**Common Mistakes:**
- ❌ Using regular Gmail password instead of App Password
- ❌ Not enabling 2-Factor Authentication first
- ❌ Copying App Password with spaces (should be: xxxx-xxxx-xxxx-xxxx)

### ❌ Outlook/Office 365 Authentication Failed

**Solution:**
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password  # Generate from account security
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
```

### ❌ Yahoo Mail Authentication Failed

**Solution:**
```bash
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password  # From account security settings
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
IMAP_HOST=imap.mail.yahoo.com
IMAP_PORT=993
```

---

## 🌐 Connection Issues

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
email-cli read 5    # Instead of 50
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
email-cli send "user1@example.com,user2@example.com" "subject" "body"
```

## 📞 Additional Resources

**Documentation:**
- 📖 [Configuration Guide](CONFIGURATION.md) - Comprehensive environment setup
- 🔧 [Installation Guide](INSTALL.md) - Platform-specific installation
- 📚 [CLI Reference](CLI_REFERENCE.md) - Complete command documentation
- 🏗️ [Architecture](architecture.md) - Technical details

**Quick Diagnostics:**
```bash
# Check system status  
node --version          # Should be 18+
npm --version           # Check npm
ping smtp.gmail.com     # Test SMTP connectivity
ping imap.gmail.com     # Test IMAP connectivity

# Test CLI
email-cli --version
email-cli send --help

# Verify environment variables
env | grep EMAIL        # Linux/macOS
set | findstr EMAIL     # Windows CMD
Get-ChildItem Env: | Where-Object Name -like "*EMAIL*"  # PowerShell
```

**Get Support:**
- 🐛 Report issues: [GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)  
- 💬 Discussions: [GitHub Discussions](https://github.com/0xshariq/email-mcp-server/discussions)
- 📖 Complete docs: All guides in `docs/` folder

**Remember:** 
- Never share passwords or App Passwords in issue reports!
- Use environment variable names (e.g., `EMAIL_PASS`) instead of actual values
- Check [CONFIGURATION.md](CONFIGURATION.md) first for setup issues

---

**Last Updated:** December 20, 2025  
**Version:** 2.0.0