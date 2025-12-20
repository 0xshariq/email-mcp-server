# Environment Configuration Guide

This guide explains how to configure environment variables for both the MCP server and CLI, ensuring consistent configuration across local development and global installations.

## 📋 Table of Contents

- [Overview](#overview)
- [Required Environment Variables](#required-environment-variables)
- [Configuration Methods](#configuration-methods)
  - [Local Development](#local-development)
  - [Global Installation](#global-installation)
- [Platform-Specific Setup](#platform-specific-setup)
- [Provider Setup](#provider-setup)
- [Troubleshooting](#troubleshooting)

## Overview

**Both the MCP server and CLI use the same environment variables**, ensuring consistent behavior regardless of how you run the tool.

The configuration priority order is:
1. **Environment variables** (highest priority)
2. **`.env` file** in the project directory (for local development)
3. **Default values** (lowest priority)

## Required Environment Variables

### Essential Variables

```bash
# Email account credentials
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password-here

# SMTP settings (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# IMAP settings (for reading emails)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false
```

### Optional Variables

```bash
# Advanced IMAP settings
IMAP_CONNECTION_TIMEOUT=15000
IMAP_AUTH_TIMEOUT=10000

# Advanced SMTP settings
SMTP_CONNECTION_TIMEOUT=10000
```

## Configuration Methods

### Local Development

**For local development and testing**, use a `.env` file in the project directory:

1. **Create `.env` file:**
   ```bash
   cd email-mcp-server
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```bash
   # Use your favorite editor
   nano .env
   # or
   vim .env
   # or
   code .env
   ```

3. **Both server and CLI will automatically load from `.env`:**
   ```bash
   # MCP Server
   npm start
   
   # CLI commands
   npm run cli -- send test@example.com "Subject" "Body"
   ```

**Important:** Never commit `.env` to version control! It's already in `.gitignore`.

### Global Installation

**For globally installed CLI** (after `npm install -g`), configure environment variables in your shell profile:

#### Linux

Add to `~/.bashrc` (or `~/.bash_profile` for login shells):

```bash
# Edit the file
nano ~/.bashrc

# Add these lines at the end:
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_SECURE="false"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
export IMAP_TLS="true"
export IMAP_MARK_SEEN="false"

# Reload configuration
source ~/.bashrc
```

#### macOS

Add to `~/.zshrc` (macOS Catalina+) or `~/.bash_profile` (older versions):

```bash
# For Zsh (default on modern macOS)
nano ~/.zshrc

# For Bash (older macOS)
nano ~/.bash_profile

# Add these lines:
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_SECURE="false"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
export IMAP_TLS="true"
export IMAP_MARK_SEEN="false"

# Reload configuration
source ~/.zshrc  # or source ~/.bash_profile
```

#### Windows

**Option 1: System Environment Variables (Recommended)**

1. Open System Properties:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"

2. Under "User variables" or "System variables", click "New" for each variable:
   - Variable name: `EMAIL_USER`
   - Variable value: `your-email@gmail.com`
   - Repeat for all variables listed above

3. Click "OK" to save and restart your terminal

**Option 2: PowerShell Profile**

```powershell
# Edit PowerShell profile
notepad $PROFILE

# Add these lines:
$env:EMAIL_USER = "your-email@gmail.com"
$env:EMAIL_PASS = "xxxx-xxxx-xxxx-xxxx"
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_SECURE = "false"
$env:IMAP_HOST = "imap.gmail.com"
$env:IMAP_PORT = "993"
$env:IMAP_TLS = "true"
$env:IMAP_MARK_SEEN = "false"

# Reload profile
. $PROFILE
```

**Option 3: Command Prompt (CMD)**

```cmd
# Set variables for current session only
set EMAIL_USER=your-email@gmail.com
set EMAIL_PASS=xxxx-xxxx-xxxx-xxxx

# Or use setx for permanent (requires restart):
setx EMAIL_USER "your-email@gmail.com"
setx EMAIL_PASS "xxxx-xxxx-xxxx-xxxx"
```

## Platform-Specific Setup

### Verify Configuration

**All Platforms:**
```bash
# Check if variables are set
echo $EMAIL_USER          # Linux/macOS
echo %EMAIL_USER%         # Windows CMD
echo $env:EMAIL_USER      # Windows PowerShell

# Test CLI with your configuration
email-cli --version
email-cli send --help
```

### MCP Server Configuration

For **Claude Desktop** integration, the MCP server uses the same environment variables:

**Linux/macOS:**
```json
{
  "mcpServers": {
    "email": {
      "command": "node",
      "args": ["/path/to/email-mcp-server/dist/server/index.js"],
      "env": {
        "EMAIL_USER": "your-email@gmail.com",
        "EMAIL_PASS": "xxxx-xxxx-xxxx-xxxx",
        "SMTP_HOST": "smtp.gmail.com",
        "SMTP_PORT": "587",
        "SMTP_SECURE": "false",
        "IMAP_HOST": "imap.gmail.com",
        "IMAP_PORT": "993",
        "IMAP_TLS": "true"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "email": {
      "command": "node",
      "args": ["C:\\path\\to\\email-mcp-server\\dist\\server\\index.js"],
      "env": {
        "EMAIL_USER": "your-email@gmail.com",
        "EMAIL_PASS": "xxxx-xxxx-xxxx-xxxx",
        "SMTP_HOST": "smtp.gmail.com",
        "SMTP_PORT": "587",
        "SMTP_SECURE": "false",
        "IMAP_HOST": "imap.gmail.com",
        "IMAP_PORT": "993",
        "IMAP_TLS": "true"
      }
    }
  }
}
```

## Provider Setup

### Gmail

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Configuration:**
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App password from step 2
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   IMAP_HOST=imap.gmail.com
   IMAP_PORT=993
   IMAP_TLS=true
   ```

### Outlook/Office 365

1. **Enable App Passwords** (if 2FA is enabled)
2. **Configuration:**
   ```bash
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASS=your-app-password
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   IMAP_HOST=outlook.office365.com
   IMAP_PORT=993
   IMAP_TLS=true
   ```

### Yahoo Mail

1. **Generate App Password:**
   - Go to [Account Security](https://login.yahoo.com/account/security)
   - Generate app password

2. **Configuration:**
   ```bash
   EMAIL_USER=your-email@yahoo.com
   EMAIL_PASS=your-app-password
   SMTP_HOST=smtp.mail.yahoo.com
   SMTP_PORT=587
   SMTP_SECURE=false
   IMAP_HOST=imap.mail.yahoo.com
   IMAP_PORT=993
   IMAP_TLS=true
   ```

### Custom IMAP/SMTP Provider

```bash
EMAIL_USER=your-email@custom-domain.com
EMAIL_PASS=your-password
SMTP_HOST=smtp.custom-domain.com
SMTP_PORT=587                      # or 465 for SSL
SMTP_SECURE=false                  # true for port 465
IMAP_HOST=imap.custom-domain.com
IMAP_PORT=993
IMAP_TLS=true
```

## Troubleshooting

### Variables Not Loading

**Check if variables are set:**
```bash
# Linux/macOS
env | grep EMAIL
env | grep SMTP
env | grep IMAP

# Windows PowerShell
Get-ChildItem Env: | Where-Object Name -like "*EMAIL*"
Get-ChildItem Env: | Where-Object Name -like "*SMTP*"

# Windows CMD
set | findstr EMAIL
set | findstr SMTP
```

### CLI Can't Find Configuration

1. **Verify environment variables are exported:**
   ```bash
   # Must use 'export' on Linux/macOS
   export EMAIL_USER="your-email@gmail.com"
   
   # NOT just:
   EMAIL_USER="your-email@gmail.com"  # This won't work!
   ```

2. **Check if `.env` file exists (for local dev):**
   ```bash
   ls -la .env
   cat .env
   ```

3. **Test with explicit environment variables:**
   ```bash
   EMAIL_USER=test@gmail.com EMAIL_PASS=xxxx email-send --help
   ```

### MCP Server Can't Authenticate

1. **Verify environment variables in Claude Desktop config**
2. **Check MCP server logs** for authentication errors
3. **Test with CLI first** to validate credentials
4. **Ensure paths are absolute** in MCP config

### Permission Denied

**Linux/macOS:**
```bash
# Make sure shell profile has correct permissions
chmod 600 ~/.bashrc
chmod 600 ~/.zshrc

# Reload profile
source ~/.bashrc  # or ~/.zshrc
```

**Windows:**
- Run PowerShell as Administrator
- Check System Environment Variables permissions

## Security Best Practices

1. **Never commit `.env` to version control**
   - Always use `.gitignore`
   - Use different credentials for development and production

2. **Use App Passwords**
   - Never use your main email password
   - Generate provider-specific app passwords

3. **Protect environment files**
   ```bash
   # Linux/macOS: Restrict .env file permissions
   chmod 600 .env
   chmod 600 ~/.bashrc
   ```

4. **For shared systems:**
   - Use environment variables in CI/CD secrets
   - Don't store credentials in shell history
   - Consider using secret management tools

5. **Rotate credentials regularly**
   - Update app passwords periodically
   - Revoke unused app passwords

## Quick Reference

| Scenario | Configuration Method |
|----------|---------------------|
| Local development (both server & CLI) | `.env` file in project directory |
| Global CLI installation (Linux) | `~/.bashrc` with `export` statements |
| Global CLI installation (macOS) | `~/.zshrc` or `~/.bash_profile` with `export` |
| Global CLI installation (Windows) | System Environment Variables or PowerShell `$PROFILE` |
| MCP Server (Claude Desktop) | Environment variables in MCP config JSON |
| CI/CD | Platform-specific secrets (GitHub Actions, etc.) |

## Additional Resources

- [Installation Guide](INSTALL.md) - Platform-specific installation
- [CLI Reference](CLI_REFERENCE.md) - Complete command documentation
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [Security Best Practices](../README.md#security--best-practices)

---

**Need help?** Open an issue on [GitHub](https://github.com/0xshariq/email-mcp-server/issues)
