# Configuration Documentation Update

## Summary

Updated all configuration documentation to ensure **MCP server and CLI use the same environment variables** with clear setup instructions for both local development and global installations across all platforms.

## Changes Made

### 1. Created New Documentation
- **`docs/CONFIGURATION.md`** (New, 500+ lines)
  - Comprehensive configuration guide
  - Covers both local development and global installation
  - Platform-specific instructions (Linux, macOS, Windows)
  - Provider setup guides (Gmail, Outlook, Yahoo, Custom)
  - Security best practices
  - Troubleshooting section

### 2. Updated Existing Documentation

#### `README.md`
- ✅ Replaced simple configuration section with comprehensive guide
- ✅ Added sections for local development and global installation
- ✅ Platform-specific quick reference
- ✅ Clear statement that server and CLI share configuration
- ✅ Link to complete configuration guide

#### `docs/INSTALL.md`
- ✅ Added configuration reference in usage section
- ✅ Links to complete configuration guide
- ✅ Quick setup instructions for both scenarios

#### `docs/CLI_REFERENCE.md`
- ✅ Expanded configuration section significantly
- ✅ Added local development setup instructions
- ✅ Platform-specific global installation guides
- ✅ Environment variable verification commands
- ✅ Emphasized shared configuration between server and CLI

#### `docs/CLI_USAGE.md`
- ✅ Added important note about shared configuration at the top
- ✅ Quick reference for configuration methods
- ✅ Links to comprehensive guide

## Key Features of New Documentation

### 1. Clear Separation of Scenarios
- **Local Development**: Use `.env` file (works for both server and CLI)
- **Global Installation**: Use shell profiles or system environment variables (CLI only)
- **MCP Server**: Uses same variables, configured in Claude Desktop JSON

### 2. Platform-Specific Instructions
- **Linux**: `~/.bashrc` with export statements
- **macOS**: `~/.zshrc` (or `~/.bash_profile`)
- **Windows**: Three options provided:
  - System Environment Variables (GUI)
  - PowerShell Profile
  - Command Prompt (setx)

### 3. Provider Setup Guides
- Gmail (with 2FA and App Password instructions)
- Outlook/Office 365
- Yahoo Mail
- Custom IMAP/SMTP providers

### 4. Security Best Practices
- Never commit `.env` to version control
- Use App Passwords instead of regular passwords
- File permission recommendations
- Credential rotation guidelines

### 5. Troubleshooting
- Verification commands for each platform
- Common issues and solutions
- Environment variable debugging

## Configuration Priority

The system now clearly documents configuration priority:
1. **Environment variables** (highest priority)
2. **`.env` file** in project directory
3. **Default values** (lowest priority)

## Required Environment Variables

All documentation now consistently references these variables:

```bash
# Essential
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false

# Optional (with defaults)
IMAP_CONNECTION_TIMEOUT=15000
IMAP_AUTH_TIMEOUT=10000
SMTP_CONNECTION_TIMEOUT=10000
```

## Benefits

1. **Consistency**: Server and CLI use identical configuration
2. **Flexibility**: Support both local `.env` and global environment variables
3. **Cross-Platform**: Clear instructions for Windows, macOS, and Linux
4. **Comprehensive**: All scenarios covered with examples
5. **Secure**: Best practices and security guidelines included

## Quick Links

- [Complete Configuration Guide](docs/CONFIGURATION.md)
- [Installation Guide](docs/INSTALL.md)
- [CLI Reference](docs/CLI_REFERENCE.md)
- [CLI Usage](docs/CLI_USAGE.md)
- [Main README](README.md)

## Next Steps

Users should now:
1. Read [docs/CONFIGURATION.md](docs/CONFIGURATION.md) for their scenario
2. Follow platform-specific setup instructions
3. Verify configuration with provided commands
4. Start using the CLI and MCP server with consistent settings

---

**Created**: December 20, 2025
**Files Modified**: 5 (README.md, INSTALL.md, CLI_REFERENCE.md, CLI_USAGE.md)
**Files Created**: 2 (CONFIGURATION.md, CONFIGURATION_UPDATE.md)
