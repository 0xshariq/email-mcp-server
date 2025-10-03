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

**Quick Setup:**
```bash
cp .env.example .env
# Edit .env with your email credentials
```

**Gmail Example:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App Password (not regular password)
```

**Setup Requirements:**
1. Enable 2FA on your email provider
2. Generate App Password  
3. Configure SMTP/IMAP settings

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

- 📖 **[Complete CLI Reference](docs/CLI_USAGE.md)** - All commands with examples
- 🔧 **[Installation Guide](docs/INSTALL.md)** - Cross-platform setup instructions  
- 🚨 **[Troubleshooting](docs/troubleshooting.md)** - Common issues and quick fixes
- 🏗️ **[Architecture](docs/architecture.md)** - Technical details and MCP integration

**Quick Links:**
- [Basic Operations](bin/basic/README.md) - Send, read, delete emails
- [Advanced Features](bin/advanced/README.md) - Search, forward, bulk operations  
- [Contact Management](bin/contacts/README.md) - Address book management

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

🔧 **[Complete MCP Documentation](docs/CLI_USAGE.md#mcp-integration)**

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
npm install && npm run build
npm link  # Test locally
```

**Contributing:** Fork → Branch → PR. See [Contributing Guidelines](docs/CONTRIBUTING.md)

## 📞 Support & Resources

**Issues & Questions:**
- 🚨 **[Troubleshooting Guide](docs/troubleshooting.md)** - Quick fixes for common issues
- 🐛 **[GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)** - Report bugs or request features
- 📖 **[Complete Documentation](docs/)** - Detailed guides and references

**Key Resources:**
- [Installation Problems](docs/troubleshooting.md#cross-platform-installation-problems) - Platform compatibility fixes
- [Authentication Issues](docs/troubleshooting.md#gmail-authentication-failed) - Email provider setup  
- [Performance Optimization](docs/troubleshooting.md#email-operations-slow) - Speed improvements

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🌟 Star this repo if it helps you manage emails efficiently across platforms!**