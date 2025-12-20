# Email CLI - Complete Command Reference

**Version 2.0** - Commander.js powered CLI with TypeScript

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Commands](#basic-commands)
- [Advanced Commands](#advanced-commands)
- [Contact Management](#contact-management)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Installation

```bash
# Install globally
npm install -g @0xshariq/email-mcp-server

# Or with pnpm
pnpm install -g @0xshariq/email-mcp-server
```

---

## Quick Start

```bash
# 1. Configure your email (first time only)
email-cli setup

# 2. Send your first email
email-cli send user@example.com "Hello" "This is a test"

# 3. Check your inbox
email-cli read 5

# 4. Get help anytime
email-cli --help
email-cli send --help
```

---

## Basic Commands

### Send Email
```bash
# Syntax
email-cli send <to> <subject> <body> [html]

# Examples
email-cli send user@example.com "Hello" "Simple text email"
email-cli send user@example.com "Hello" "Text" "<h1>HTML email</h1>"

# Multiple recipients (comma-separated, max 3)
email-cli send user1@example.com,user2@example.com "Meeting" "See you at 3pm"

# Short alias
esend user@example.com "Quick Email" "Message body"
```

**Parameters:**
- `to`: Recipient email(s), comma-separated for multiple (max 3 recipients)
- `subject`: Email subject line
- `body`: Plain text content
- `html` (optional): HTML formatted content

---

### Read Emails
```bash
# Syntax
email-cli read [count]

# Examples
email-cli read           # Read 10 most recent emails (default)
email-cli read 5         # Read 5 most recent emails
email-cli read 20        # Read 20 most recent emails

# Short alias
eread 5
```

**Output:** Lists emails with ID, subject, sender, and date

---

### Get Specific Email
```bash
# Syntax
email-cli get <emailId>

# Examples
email-cli get 12345
eget 12345
```

**Output:** Full email details including body content

---

### Delete Email
```bash
# Syntax
email-cli delete <emailIds...> [options]

# Examples
email-cli delete 12345                    # Delete single email
email-cli delete 12345 12346 12347        # Delete multiple
email-cli delete 12345 --force            # Skip confirmation
email-cli delete 12345 -f                 # Short flag

# Short alias
edelete 12345 12346 -f
```

**Options:**
- `-f, --force`: Skip confirmation prompt

---

### Mark as Read/Unread
```bash
# Syntax
email-cli mark-read <emailId> [status]

# Examples
email-cli mark-read 12345           # Mark as read (default)
email-cli mark-read 12345 true      # Mark as read
email-cli mark-read 12345 false     # Mark as unread

# Short alias
emarkread 12345
```

---

### List All Commands
```bash
email-cli list
list
```

Shows all available commands organized by category.

---

## Advanced Commands

### Search Emails
```bash
# Syntax
email-cli search [options]

# Examples
email-cli search --from boss@company.com
email-cli search --subject "meeting" --seen false
email-cli search --since 2024-01-01 --limit 20
email-cli search --to me@company.com --before 2024-12-31

# Short alias
esearch --from sender@example.com
```

**Options:**
- `--from <email>`: Filter by sender
- `--to <email>`: Filter by recipient
- `--subject <text>`: Filter by subject keywords
- `--since <date>`: Emails since date (ISO format: YYYY-MM-DD)
- `--before <date>`: Emails before date
- `--seen <true|false>`: Filter by read status
- `--flagged <true|false>`: Filter by flagged status
- `--page <number>`: Page number (default: 1)
- `--limit <number>`: Results per page (default: 10)

---

### Send with Attachment
```bash
# Syntax
email-cli attach <to> <subject> <body> <filePath> [attachmentName]

# Examples
email-cli attach user@example.com "Report" "See attached" ./report.pdf
email-cli attach user@example.com "Invoice" "Payment" ./invoice.pdf "December_Invoice.pdf"
email-cli attach client@company.com "Files" "Documents" ~/Documents/file.zip

# Short alias
eattach user@example.com "Photos" "Here are the photos" ./photo.jpg
```

**Parameters:**
- `filePath`: Path to file (relative, absolute, or ~/home paths)
- `attachmentName` (optional): Custom name for attachment

---

### Forward Email
```bash
# Syntax
email-cli forward <emailId> <to> [message]

# Examples
email-cli forward 12345 colleague@company.com
email-cli forward 12345 team@company.com "Please review this"

# Short alias
eforward 12345 user@example.com "FYI"
```

---

### Reply to Email
```bash
# Syntax
email-cli reply <emailId> <message>

# Examples
email-cli reply 12345 "Thank you for your email"
email-cli reply 12345 "I'll get back to you tomorrow"

# Short alias
ereply 12345 "Thanks!"
```

---

### Email Statistics
```bash
# Syntax
email-cli stats

# Examples
email-cli stats
estats
```

**Output:** Total emails, unread count, read count, flagged count

---

### Create Draft
```bash
# Syntax
email-cli draft <to> <subject> <body>

# Examples
email-cli draft client@company.com "Proposal" "Draft content here"
edraft team@company.com "Meeting Notes" "Notes from today's meeting"
```

---

### Schedule Email
```bash
# Syntax
email-cli schedule <to> <subject> <body> <scheduledTime>

# Examples
email-cli schedule user@example.com "Reminder" "Meeting tomorrow" "2024-12-31T09:00:00Z"
eschedule team@company.com "Weekly Update" "Status report" "2024-12-25T10:00:00Z"
```

**Time Format:** ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)

---

### Bulk Send
```bash
# Syntax
email-cli bulk <recipientsFile> <subject> <body>

# Examples
email-cli bulk recipients.txt "Newsletter" "Monthly update content"
ebulk mailing-list.txt "Announcement" "Important news"
```

**Recipients File Format:**
```
user1@example.com
user2@example.com
user3@example.com
```
(One email per line)

---

## Contact Management

### Add Contact
```bash
# Syntax
email-cli contact-add <name> <email> [options]

# Examples
email-cli contact-add "John Doe" john@company.com
email-cli contact-add "Jane Smith" jane@example.com --group Work
email-cli contact-add "Bob Wilson" bob@example.com -g Friends -p "+1234567890"

# Short alias
cadd "Alice Brown" alice@example.com --group Family
```

**Options:**
- `-g, --group <group>`: Contact group/category
- `-p, --phone <phone>`: Phone number

---

### List Contacts
```bash
# Syntax
email-cli contact-list [limit]

# Examples
email-cli contact-list          # List 20 contacts (default)
email-cli contact-list 50       # List 50 contacts
clist 10                        # List 10 contacts
```

---

### Search Contacts
```bash
# Syntax
email-cli contact-search <query>

# Examples
email-cli contact-search john
email-cli contact-search "@company.com"
csearch smith
```

---

### Update Contact
```bash
# Syntax
email-cli contact-update <contactId> [options]

# Examples
email-cli contact-update contact_123 --name "John Smith"
email-cli contact-update contact_123 --email newemail@example.com
email-cli contact-update contact_123 -g "Work" -p "+1234567890"

# Short alias
cupdate contact_123 --group Family
```

**Options:**
- `-n, --name <name>`: New name
- `-e, --email <email>`: New email
- `-g, --group <group>`: New group
- `-p, --phone <phone>`: New phone

---

### Delete Contact
```bash
# Syntax
email-cli contact-delete <contactId>

# Examples
email-cli contact-delete contact_123
cdelete contact_123
```

---

### Get Contacts by Group
```bash
# Syntax
email-cli contact-group <group>

# Examples
email-cli contact-group Work
email-cli contact-group Friends
cgroup Family
```

---

## Configuration

**⚠️ Important:** The MCP server and CLI use the **same environment configuration**!

📖 **[Complete Configuration Guide](CONFIGURATION.md)** - Comprehensive setup for all platforms

### Quick Configuration

#### Local Development (Both Server & CLI)
```bash
# Copy and edit .env file in project directory
cp .env.example .env
nano .env  # Add your credentials

# Both server and CLI will automatically load .env
npm start              # MCP Server uses .env
email-cli send ...     # CLI also uses .env
```

#### Global Installation (CLI Only)

**Linux** - Add to `~/.bashrc`:
```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_SECURE="false"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
export IMAP_TLS="true"

# Reload configuration
source ~/.bashrc
```

**macOS** - Add to `~/.zshrc` (or `~/.bash_profile`):
```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"
# ... (same as Linux)

# Reload configuration
source ~/.zshrc
```

**Windows** - Set System Environment Variables:
1. Press `Win + X` → System → Advanced system settings
2. Click "Environment Variables"
3. Add each variable under "User variables" or "System variables"
4. Restart terminal

Or use PowerShell Profile:
```powershell
# Edit PowerShell profile
notepad $PROFILE

# Add these lines:
$env:EMAIL_USER = "your-email@gmail.com"
$env:EMAIL_PASS = "xxxx-xxxx-xxxx-xxxx"
# ... (add all variables)

# Reload profile
. $PROFILE
```

### Setup Command (Interactive)
```bash
# Interactive setup
email-cli setup

# Setup with options
email-cli setup --force                    # Force reconfiguration
email-cli setup --use-keychain             # Store password in OS keychain
email-cli setup --test-send                # Send test email after setup
email-cli setup --mask                     # Mask password input

# Non-interactive (CI/CD)
email-cli setup --ci --email-user user@example.com --email-pass "password"
```

**Options:**
- `--force`: Reconfigure even if already set up
- `--use-keychain`: Use OS keychain for password storage
- `--test-send`: Send test email to verify setup
- `--mask`: Mask password during input
- `--ci, --non-interactive`: Non-interactive mode
- `--profile <name>`: Use named profile
- `--email-user <user>`: Email address (for CI mode)
- `--email-pass <pass>`: Email password (for CI mode)

### Required Environment Variables

```env
# Email credentials
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

# SMTP settings (sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# IMAP settings (receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false
```

### Verify Configuration
```bash
# Check environment variables
echo $EMAIL_USER          # Linux/macOS
echo %EMAIL_USER%         # Windows CMD
echo $env:EMAIL_USER      # Windows PowerShell

# Test CLI
email-cli --version
email-cli send --help
```

---

### Update CLI
```bash
email-cli update
```

Updates to the latest version from npm.

---

## Examples

### Daily Workflow
```bash
# Morning - Check inbox
email-cli read 10

# Read specific email
email-cli get 12345

# Reply to email
email-cli reply 12345 "Thanks for the update!"

# Send new email with attachment
email-cli attach boss@company.com "Report" "Daily report attached" ./report.pdf

# Search for important emails
email-cli search --from boss@company.com --seen false
```

### Contact Management
```bash
# Add new contacts
email-cli contact-add "Team Lead" lead@company.com -g Work
email-cli contact-add "Designer" designer@agency.com -g Work

# View work contacts
email-cli contact-group Work

# Search contacts
email-cli contact-search designer
```

### Bulk Operations
```bash
# Create recipients file
echo "user1@example.com\nuser2@example.com\nuser3@example.com" > team.txt

# Send to all
email-cli bulk team.txt "Team Update" "Weekly status report"

# Search and clean old emails
email-cli search --before 2024-01-01 --limit 100
# Delete old emails
email-cli delete 123 124 125 126 --force
```

---

## Troubleshooting

### Common Issues

**Authentication Errors:**
```bash
# Reconfigure email settings
email-cli setup --force

# For Gmail, use App Password (not regular password)
# Enable 2FA → Generate App Password → Use in setup
```

**Command Not Found:**
```bash
# Verify installation
which email-cli

# Reinstall globally
npm install -g @0xshariq/email-mcp-server

# Check PATH
echo $PATH
```

**Connection Errors:**
```bash
# Check .env file exists in package directory
# Verify SMTP/IMAP settings
# Test with simple send command
```

### Getting Help
```bash
# General help
email-cli --help

# Command-specific help
email-cli send --help
email-cli search --help

# Version info
email-cli --version
```

### Debug Mode
```bash
# Run with verbose output
DEBUG=* email-cli send user@example.com "Test" "Debug mode"
```

---

## Command Aliases Quick Reference

| Full Command | Short Alias |
|-------------|-------------|
| `email-cli send` | `esend` |
| `email-cli read` | `eread` |
| `email-cli get` | `eget` |
| `email-cli delete` | `edelete` |
| `email-cli mark-read` | `emarkread` |
| `email-cli search` | `esearch` |
| `email-cli attach` | `eattach` |
| `email-cli forward` | `eforward` |
| `email-cli reply` | `ereply` |
| `email-cli stats` | `estats` |
| `email-cli draft` | `edraft` |
| `email-cli schedule` | `eschedule` |
| `email-cli bulk` | `ebulk` |
| `email-cli contact-add` | `cadd` |
| `email-cli contact-list` | `clist` |
| `email-cli contact-search` | `csearch` |
| `email-cli contact-group` | `cgroup` |
| `email-cli contact-update` | `cupdate` |
| `email-cli contact-delete` | `cdelete` |
| `email-cli list` | `list` |

---

## Environment Variables

```env
# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REJECT_UNAUTHORIZED=false

# IMAP Settings
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_REJECT_UNAUTHORIZED=false

# Authentication
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-app-password

# Optional
IMAP_MARK_SEEN=true
IMAP_CONN_TIMEOUT=60000
IMAP_AUTH_TIMEOUT=30000
```

---

## Support

- **Documentation:** [Full Docs](../README.md)
- **Issues:** [GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)
- **Examples:** [CLI Usage Guide](./CLI_USAGE.md)

---

**Built with TypeScript + Commander.js + Node.js**  
*Cross-platform email management made simple*
