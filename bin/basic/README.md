# Basic Email Operations

This folder contains CLI commands for basic email operations. These are the most commonly used email functions.

## Available Commands

### 📤 Email Send (`email-send.js` / `esend`)
Send a simple email to up to 3 recipients (for more recipients, use `email-bulk`).

**Usage:**
```bash
email-send <to> <subject> <body> [html]
esend <to> <subject> <body> [html]
```

**Recipients:** Maximum 3 recipients (comma-separated)

**Examples:**
```bash
# Single recipient
email-send "user@example.com" "Hello" "This is a test message"

# Multiple recipients (up to 3)
email-send "user1@example.com,user2@example.com,user3@example.com" "Team Update" "Meeting at 2 PM today"

# With HTML content
email-send "user@example.com" "HTML Email" "Plain text" "<h1>HTML Content</h1>"

# Short alias
esend "team@company.com" "Meeting" "Team meeting reminder"
```

**Note:** For more than 3 recipients, use the `email-bulk` command instead.

### 📬 Email Read (`email-read.js` / `eread`)
Read recent emails from your inbox.

**Usage:**
```bash
email-read [limit]
eread [limit]
```

**Examples:**
```bash
email-read 10    # Read last 10 emails
eread           # Read default number of emails
```

### 📧 Email Get (`email-get.js` / `eget`)
Get a specific email by its ID.

**Usage:**
```bash
email-get <email-id>
eget <email-id>
```

**Examples:**
```bash
email-get 12345
eget 67890
```

### 🗑️ Email Delete (`email-delete.js` / `edelete`)
Delete an email permanently.

**Usage:**
```bash
email-delete <email-id>
edelete <email-id>
```

**Examples:**
```bash
email-delete 12345
edelete 67890
```

### ✅ Email Mark Read (`email-mark-read.js` / `emarkread`)
Mark an email as read or unread.

**Usage:**
```bash
email-mark-read <email-id> <read-status>
emarkread <email-id> <read-status>
```

**Examples:**
```bash
email-mark-read 12345 true     # Mark as read
emarkread 67890 false         # Mark as unread
```

### 📋 List Commands (`list.js`)
Display all available CLI commands with their aliases and descriptions.

**Usage:**
```bash
list
```

**Examples:**
```bash
list                          # Show all available commands
```

**Features:**
- Shows all email operations (basic and advanced)
- Shows all contact management commands  
- Displays both full names and short aliases
- Organized by category for easy reference

## Quick Reference

| Command | Short Alias | Description |
|---------|-------------|-------------|
| `email-send` | `esend` | Send an email (max 3 recipients) |
| `email-read` | `eread` | Read recent emails |
| `email-get` | `eget` | Get specific email |
| `email-delete` | `edelete` | Delete an email |
| `email-mark-read` | `emarkread` | Mark email read/unread |
| `list` | - | Show all available commands |

## Getting Help

All commands support the `--help` flag for detailed usage information:

```bash
email-send --help
esend --help
```

## Environment Setup

Make sure your `.env` file is properly configured with your email settings before using these commands.

```bash
cp .env.example .env
# Edit .env with your email configuration
```

## Error Handling

Common error solutions:
- **Authentication failed**: Check your email credentials in `.env`
- **Connection failed**: Verify SMTP/IMAP server settings
- **Email not found**: Check if the email ID exists and is accessible