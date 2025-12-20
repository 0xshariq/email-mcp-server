# Email MCP Server

**Cross-platform email operations for MCP clients and CLI** 🌍

A dual-purpose tool that works as:
- **🔌 MCP Server**: Email capabilities for Claude Desktop and MCP clients
- **⚡ CLI Suite**: 40+ commands for terminal email management

**Universal compatibility**: Works on Windows, macOS, Linux, and WSL with Gmail, Outlook, Yahoo, and any IMAP/SMTP providers.

## ✨ Features Overview

**📧 Basic Operations**: Send, read, get, delete emails | Mark read/unread  
**🔍 Advanced Features**: Search, forward, reply, bulk operations | Draft & schedule  
**👥 Contact Management**: Add, update, search, organize contacts by groups  
**🌐 Cross-Platform**: Works identically on all platforms and terminals

## 🚀 Zero-Configuration Installation

**🎯 One Command - Complete Setup:**
```bash
npm install -g @0xshariq/email-mcp-server
# OR
pnpm install -g @0xshariq/email-mcp-server
```

**✨ What Happens Automatically:**
- ✅ Detects your platform (Windows/macOS/Linux/WSL)
- ✅ Creates 40+ command shortcuts globally
- ✅ Configures system PATH automatically
- ✅ Tests installation and provides setup guide
- ✅ **Ready to use immediately - no manual steps!**

**🎬 Getting Started:**
```bash
# Set up your email (one-time only):
email-setup

# Start sending emails:
email-send "user@example.com" "Hello" "Your message"

# Explore all commands:
email-cli --help
```

📖 **[Complete Installation Guide](docs/INSTALL.md)**

## ⚙️ Configuration

**🔧 The MCP server and CLI share the same environment configuration!**

### Local Development (Both Server & CLI)
```bash
# Copy and edit .env file
cp .env.example .env
nano .env  # Add your credentials
```

### Global Installation (CLI)
Configure environment variables in your shell profile:

**Linux:** Add to `~/.bashrc`
```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
```

**macOS:** Add to `~/.zshrc` (or `~/.bash_profile`)
```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
# ... (same as Linux)
```

**Windows:** Set System Environment Variables
- Press `Win + X` → System → Advanced system settings
- Environment Variables → Add each variable

### Quick Example (Gmail)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App Password (not regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

📖 **[Complete Configuration Guide](docs/CONFIGURATION.md)** - Detailed setup for all platforms and providers

**Setup Requirements:**
1. Enable 2FA on your email provider
2. Generate App Password  
3. Configure environment variables (locally or globally)

📋 **Supports**: Gmail, Outlook, Yahoo, and any IMAP/SMTP provider

## 💻 Usage

### As MCP Server
```bash
npm start  # Starts MCP server for Claude Desktop
```

### As CLI Tool (Cross-Platform)
```bash
# Works identically on Windows, macOS, Linux, WSL
email-send "user@example.com" "Subject" "Message"
email-read 10
contact-add "John Doe" "john@example.com" "work"
email-search --from "boss@company.com" --unread
```

**All 40+ commands work the same across all platforms!**

## 📚 Documentation

Complete documentation for all features and platforms:

### 📖 Core Documentation

| Document | Description |
|----------|-------------|
| **[Configuration Guide](docs/CONFIGURATION.md)** | Comprehensive environment setup for CLI and MCP server (local and global) |
| **[Installation Guide](docs/INSTALL.md)** | Cross-platform installation instructions (Windows, macOS, Linux, WSL) |
| **[CLI Reference](docs/CLI_REFERENCE.md)** | Complete reference for all 40+ CLI commands with examples |
| **[CLI Usage](docs/CLI_USAGE.md)** | Top-level CLI usage and setup commands |
| **[Commands Reference](docs/commands.md)** | Detailed command documentation with options and examples |

### 🔧 Technical Documentation

| Document | Description |
|----------|-------------|
| **[Architecture](docs/architecture.md)** | System architecture, data models, and design decisions |
| **[Troubleshooting](docs/troubleshooting.md)** | Common issues and solutions for all platforms |
| **[Windows Guide](docs/WINDOWS.md)** | Windows-specific installation and configuration |
| **[Publishing Guide](docs/PUBLISHING.md)** | Package publishing and versioning strategy |
| **[Restructure Summary](docs/RESTRUCTURE_SUMMARY.md)** | v2.0 TypeScript migration details |

### 🚀 Quick Start Guides

**First Time Setup:**
1. **Installation**: [INSTALL.md](docs/INSTALL.md)
2. **Configuration**: [CONFIGURATION.md](docs/CONFIGURATION.md)
3. **First Commands**: [CLI_REFERENCE.md](docs/CLI_REFERENCE.md#quick-start)

**Having Issues?**
- Start with [troubleshooting.md](docs/troubleshooting.md)
- Check [CONFIGURATION.md](docs/CONFIGURATION.md) for setup issues
- See [WINDOWS.md](docs/WINDOWS.md) for Windows-specific problems

**Development & Contributing:**
- [architecture.md](docs/architecture.md) - Understand the codebase
- [PUBLISHING.md](docs/PUBLISHING.md) - Release process
- [RESTRUCTURE_SUMMARY.md](docs/RESTRUCTURE_SUMMARY.md) - Recent changes

### 🎯 By Use Case

**As CLI User:**
- [CLI_REFERENCE.md](docs/CLI_REFERENCE.md) - All commands
- [CONFIGURATION.md](docs/CONFIGURATION.md) - Setup for global CLI
- [troubleshooting.md](docs/troubleshooting.md) - Fix issues

**As MCP Server User:**
- [CONFIGURATION.md](docs/CONFIGURATION.md) - Environment setup
- [architecture.md](docs/architecture.md) - MCP server details
- [troubleshooting.md](docs/troubleshooting.md#configuration-issues) - Server configuration

**As Developer:**
- [architecture.md](docs/architecture.md) - System design
- [RESTRUCTURE_SUMMARY.md](docs/RESTRUCTURE_SUMMARY.md) - Code organization
- [PUBLISHING.md](docs/PUBLISHING.md) - Release workflow

### MCP Server Integration

When running as an MCP server, all email operations are available as structured tools for Claude Desktop and other MCP clients.

**Available Tools:**
- Email operations: send, read, search, forward, reply, delete
- Contact management: add, update, search, organize  
- Bulk operations: batch sending, scheduling, drafts

**Usage in Claude Desktop:**
```json
{
  "to": "user@example.com", 
  "subject": "Hello",
  "body": "Message from Claude!"
}
```

📖 **Configuration**: See [CONFIGURATION.md](docs/CONFIGURATION.md#mcp-server-configuration)

## 🔐 Security & Best Practices

- **Use App Passwords** (not regular passwords)
- **Keep `.env` secure** (never commit to git)  
- **Respect rate limits** for bulk operations
- **Use HTTPS/TLS** for all connections

## 🛠️ Development & Contributing

**Quick Development Setup:**
```bash
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm link             # Test locally
```

**Project Structure:**
```
email-mcp-server/
├── cli/            # CLI implementation (Commander.js)
├── server/         # MCP server implementation
├── src/lib/        # Shared email & contact services
├── dist/           # Compiled JavaScript
└── docs/           # Complete documentation
```

**Key Technologies:**
- TypeScript 5.8+ with strict mode
- Commander.js 14+ for CLI
- Nodemailer 7+ for SMTP
- IMAP-Simple 5+ for IMAP
- MCP SDK 1.15+ for server

**Documentation for Developers:**
- [Architecture Guide](docs/architecture.md) - System design and decisions
- [Restructure Summary](docs/RESTRUCTURE_SUMMARY.md) - v2.0 TypeScript migration
- [Publishing Guide](docs/PUBLISHING.md) - Release process

**Contributing:** Fork → Branch → PR. See [Contributing Guidelines](CONTRIBUTING.md)

## 📞 Support & Resources

**Issues & Questions:**
- 🚨 **[Troubleshooting Guide](docs/troubleshooting.md)** - Quick fixes for common issues
- 🐛 **[GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)** - Report bugs or request features
- 💬 **[GitHub Discussions](https://github.com/0xshariq/email-mcp-server/discussions)** - Ask questions and share ideas

**Documentation by Topic:**
- [Installation Problems](docs/INSTALL.md) - Platform-specific setup
- [Configuration Issues](docs/CONFIGURATION.md) - Environment variables setup
- [Authentication Errors](docs/troubleshooting.md#authentication-issues) - Email provider setup
- [Command Reference](docs/CLI_REFERENCE.md) - All CLI commands
- [Performance Tips](docs/troubleshooting.md#performance-issues) - Speed improvements

**All Documentation:** See [docs/](docs/) folder for complete guides

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🌟 Star this repo if it helps you manage emails efficiently across platforms!**

**Version:** 2.0.0  
**Last Updated:** December 20, 2025