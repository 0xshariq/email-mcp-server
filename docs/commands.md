# Email MCP Server — Commands Reference

This document lists all commands provided by the project, grouped by category. Each command includes a short purpose, a usage synopsis, options (when applicable), and examples.

---

## Setup and Configuration

### setup

Purpose: Interactive wizard to configure email credentials and SMTP/IMAP settings. Automatically detects popular email providers (Gmail, Outlook, Yahoo, iCloud) and saves configuration locally or globally across platforms.

Synopsis:

```bash
# Interactive setup wizard (recommended)
email-cli setup
```

**Features:**

- **Auto-Detection**: Automatically detects SMTP/IMAP settings for popular providers
- **Masked Password Input**: Secure password entry with masked characters
- **Multiple Save Options**:
  - Local: `.env` file in current directory (development)
  - Global: System environment variables (production)
    - Linux/macOS: `~/.bashrc`, `~/.zshrc`, or `~/.profile`
    - Windows: System Environment Variables via registry
  - Both: Save to both locations for maximum compatibility
- **Supported Providers**: Gmail, Outlook, Hotmail, Yahoo, iCloud, and custom SMTP/IMAP servers

**Required Information:**

The setup wizard will ask for:

1. **Email address** (e.g., user@gmail.com)
2. **Password or App Password** (masked input)
3. **Server settings** (auto-detected or manual):
   - SMTP Host (e.g., smtp.gmail.com)
   - SMTP Port (default: 587)
   - IMAP Host (e.g., imap.gmail.com)
   - IMAP Port (default: 993)

**Automatic Configuration:**

Additional environment variables are automatically set:

- `EMAIL_FROM`: Same as EMAIL_USER
- `IMAP_TLS`: true (secure connection)
- `SMTP_SECURE`: false (STARTTLS on port 587)

Examples:

```bash
# Run interactive setup wizard
email-cli setup

# After setup completes (Linux/macOS):
source ~/.bashrc  # Or ~/.zshrc
email-cli send test@example.com "Test" "Hello!"

# After setup completes (Windows):
# Restart PowerShell/CMD
email-cli send test@example.com "Test" "Hello!"
```

**Setup Process:**

```
Step 1/3: Email Credentials
──────────────────────────────────────────────────
📧 Email address: user@gmail.com
🔑 Password: ********

Step 2/3: Server Configuration
──────────────────────────────────────────────────
✓ Auto-detected settings for gmail.com
  SMTP Server: smtp.gmail.com:587
  IMAP Server: imap.gmail.com:993
Use these settings? [Y/n]: y

Step 3/3: Save Configuration
──────────────────────────────────────────────────
  [1] 📁 Local (.env file)
  [2] 🌍 Global (System environment)
  [3] 📁 + 🌍 Both locations
Select option [1-3]: 3

✓ Setup Completed!
```

**Notes:**

- For Gmail/Google Workspace: Use [App Passwords](https://support.google.com/accounts/answer/185833) instead of your regular password
- For Outlook/Hotmail: You may need to enable [App Passwords](https://support.microsoft.com/account-billing/manage-app-passwords-for-two-step-verification-d6dc8c6d-4bf7-4851-ad95-6d07799387e9)
- Custom SMTP/IMAP servers: Choose manual configuration when provider is not auto-detected

---

## Basic Email Commands

## Basic commands

### send (alias: esend)

Purpose: Send a single email. Use `bulk` for larger lists.

Synopsis:

```bash
email-cli send <to> <subject> <body> [html]
email-cli esend <to> <subject> <body> [html]  # Using alias
```

Options:

- `<to>` — Recipient email address (comma-separated for multiple)
- `<subject>` — Email subject
- `<body>` — Email body text
- `[html]` — Optional HTML content

Examples:

```bash
email-cli send "user@example.com" "Meeting" "Here is the agenda"
email-cli esend "user1@example.com,user2@example.com" "Update" "Important update"
```

---

### read (alias: eread)

Purpose: Read recent emails from the inbox.

Synopsis:

```bash
email-cli read [count]
email-cli eread [count]  # Using alias
```

Options:

- `[count]` — Number of emails to retrieve (default: 10)

Examples:

```bash
email-cli read
email-cli read 5
email-cli eread 10
```

---

### get (alias: eget)

Purpose: Get full details of a single email by ID.

Synopsis:

```bash
email-cli get <emailId>
email-cli eget <emailId>  # Using alias
```

Example:

```bash
email-cli get 12345
email-cli eget 12345
```

---

### delete (alias: edelete)

Purpose: Permanently delete email(s) by ID.

Synopsis:

```bash
email-cli delete <emailIds...> [--force|-f]
email-cli edelete <emailIds...> [--force|-f]  # Using alias
```

Options:

- `<emailIds...>` — One or more email IDs to delete
- `--force`, `-f` — Skip confirmation prompt

Examples:

```bash
email-cli delete 12345
email-cli delete 12345 67890 --force
email-cli edelete 12345
```

---

### mark-read (alias: emarkread)

Purpose: Mark an email as read or unread.

Synopsis:

```bash
email-cli mark-read <emailId> [status]
email-cli emarkread <emailId> [status]  # Using alias
```

Options:

- `<emailId>` — Email ID
- `[status]` — Read status (true/false, default: true)

Examples:

```bash
email-cli mark-read 12345 true
email-cli mark-read 12345 false
email-cli emarkread 12345
```

---

### list

Purpose: List all available commands.

Synopsis:

```bash
email-cli list
```

Example:

```bash
email-cli list
```

---
 
## Advanced commands

### search (alias: esearch)

Purpose: Search emails with advanced filters and pagination.

Synopsis:

```bash
email-cli search [options]
email-cli esearch [options]  # Using alias
```

Options:

- `--from <email>` — Filter by sender email
- `--to <email>` — Filter by recipient email
- `--subject <text>` — Filter by subject keywords
- `--since <date>` — Filter emails since date (ISO format)
- `--before <date>` — Filter emails before date (ISO format)
- `--seen <boolean>` — Filter by read status (true/false)
- `--flagged <boolean>` — Filter by flagged status (true/false)
- `--page <number>` — Page number (default: 1)
- `--limit <number>` — Results per page (default: 10)

Examples:

```bash
email-cli search --from "boss@company.com" --since "2024-01-01"
email-cli search --subject "report" --seen false
email-cli esearch --from "team@company.com" --limit 20
```

---

### attach (alias: eattach)

Purpose: Send an email with a file attachment.

Synopsis:

```bash
email-cli attach <to> <subject> <body> <filePath> [attachmentName]
email-cli eattach <to> <subject> <body> <filePath> [attachmentName]  # Using alias
```

Options:

- `<to>` — Recipient email address
- `<subject>` — Email subject
- `<body>` — Email body
- `<filePath>` — Path to attachment file
- `[attachmentName]` — Optional custom attachment name

Examples:

```bash
email-cli attach "team@company.com" "Report" "See attached" "./report.pdf"
email-cli attach "client@example.com" "Invoice" "Your invoice" "./invoice.pdf" "Invoice_Dec2025.pdf"
email-cli eattach "user@example.com" "Files" "Documents" "./doc.pdf"
```

---

### forward (alias: eforward)

Purpose: Forward an existing email to another recipient.

Synopsis:

```bash
email-cli forward <emailId> <to> [message]
email-cli eforward <emailId> <to> [message]  # Using alias
```

Options:

- `<emailId>` — Email ID to forward
- `<to>` — Forward to email address
- `[message]` — Optional message to add

Examples:

```bash
email-cli forward 12345 "colleague@company.com" "Please review"
email-cli forward 12345 "team@company.com"
email-cli eforward 12345 "boss@company.com" "FYI"
```

---

### reply (alias: ereply)

Purpose: Reply to an existing email.

Synopsis:

```bash
email-cli reply <emailId> <message>
email-cli ereply <emailId> <message>  # Using alias
```

Options:

- `<emailId>` — Email ID to reply to
- `<message>` — Reply message

Examples:

```bash
email-cli reply 12345 "Thanks, I'll review"
email-cli reply 12345 "Got it, will do"
email-cli ereply 12345 "Thank you"
```

---

### stats (alias: estats)

Purpose: Get email account statistics (total, unread, flagged, recent).

Synopsis:

```bash
email-cli stats
email-cli estats  # Using alias
```

Example:

```bash
email-cli stats
email-cli estats
```

---

### draft (alias: edraft)

Purpose: Create an email draft.

Synopsis:

```bash
email-cli draft <to> <subject> <body>
email-cli edraft <to> <subject> <body>  # Using alias
```

Options:

- `<to>` — Recipient email address
- `<subject>` — Email subject
- `<body>` — Email body

Examples:

```bash
email-cli draft "client@example.com" "Draft" "Work in progress"
email-cli edraft "team@company.com" "Meeting" "Agenda TBD"
```

---

### schedule (alias: eschedule)

Purpose: Schedule an email for later delivery.

Synopsis:

```bash
email-cli schedule <to> <subject> <body> <scheduledTime>
email-cli eschedule <to> <subject> <body> <scheduledTime>  # Using alias
```

Options:

- `<to>` — Recipient email address
- `<subject>` — Email subject
- `<body>` — Email body
- `<scheduledTime>` — Scheduled time in ISO format (e.g., 2025-12-25T10:00:00Z)

Examples:

```bash
email-cli schedule "client@example.com" "Follow-up" "Checking in" "2025-12-25T10:00:00Z"
email-cli eschedule "team@company.com" "Reminder" "Meeting tomorrow" "2025-12-24T09:00:00Z"
```

---

### bulk (alias: ebulk)

Purpose: Send bulk emails to multiple recipients.

Synopsis:

```bash
email-cli bulk <recipients> <subject> <body>
email-cli ebulk <recipients> <subject> <body>  # Using alias
```

Options:

- `<recipients>` — Comma-separated list of email addresses or path to a file with one email per line
- `<subject>` — Email subject
- `<body>` — Email body

Examples:

```bash
email-cli bulk "user1@example.com,user2@example.com" "Newsletter" "Monthly update"
email-cli bulk recipients.txt "Announcement" "Important news"
email-cli ebulk "team@company.com,client@example.com" "Update" "Project status"
```

## Contacts

### contact-add (alias: cadd)

Purpose: Add a new contact to your address book.

Synopsis:

```bash
email-cli contact-add <name> <email> [group]
email-cli cadd <name> <email> [group]  # Using alias
```

Options:

- `<name>` — Contact name
- `<email>` — Contact email address
- `[group]` — Optional group name to assign contact to

Examples:

```bash
email-cli contact-add "Jane Smith" "jane@example.com" "clients"
email-cli cadd "John Doe" "john@example.com" "Work"
email-cli contact-add "Bob Johnson" "bob@company.com"
```

---

### contact-list (alias: clist)

Purpose: List all contacts in your address book.

Synopsis:

```bash
email-cli contact-list [limit]
email-cli clist [limit]  # Using alias
```

Options:

- `[limit]` — Optional maximum number of contacts to display (default: 20)

Examples:

```bash
email-cli contact-list
email-cli clist 50
email-cli contact-list 100
```

---

### contact-search (alias: csearch)

Purpose: Search for contacts by name or email.

Synopsis:

```bash
email-cli contact-search <query>
email-cli csearch <query>  # Using alias
```

Options:

- `<query>` — Search query (searches in contact names and email addresses)

Examples:

```bash
email-cli contact-search "john"
email-cli csearch "@company.com"
email-cli contact-search "smith"
```

---

### contact-group (alias: cgroup)

Purpose: List all contacts in a specific group.

Synopsis:

```bash
email-cli contact-group <group>
email-cli cgroup <group>  # Using alias
```

Options:

- `<group>` — Group name to filter contacts by

Examples:

```bash
email-cli contact-group "vip"
email-cli cgroup "clients"
email-cli contact-group "Work"
```

---

### contact-update (alias: cupdate)

Purpose: Update an existing contact's information.

Synopsis:

```bash
email-cli contact-update <contactId> <field> <value>
email-cli cupdate <contactId> <field> <value>  # Using alias
```

Options:

- `<contactId>` — Contact identifier
- `<field>` — Field to update (e.g., "email", "name", "group")
- `<value>` — New value for the field

Examples:

```bash
email-cli contact-update contact_123 email "newemail@example.com"
email-cli cupdate contact_456 name "Jane Doe"
email-cli contact-update contact_789 group "VIP"
```

---

### contact-delete (alias: cdelete)

Purpose: Delete a contact from your address book.

Synopsis:

```bash
email-cli contact-delete <contactId>
email-cli cdelete <contactId>  # Using alias
```

Options:

- `<contactId>` — Contact identifier to delete

Examples:

```bash
email-cli contact-delete contact_123
email-cli cdelete contact_456
```

## Utility and helper commands

Purpose: Utility commands for inspecting available commands and getting help.

### list

Synopsis:

```bash
email-cli list
```

Use `email-cli list` to show an organized list of all commands with brief descriptions.

### README & help

- Use `--help` with any command for in-command usage: `email-cli <command> --help`
- Many commands accept `--limit`, `--verbose`, and `--dry-run` flags where applicable.

---

## Examples and common workflows

- Send a quick email:

```bash
email-cli send "user@example.com" "Hello" "Quick note"
# or using alias
email-cli esend "user@example.com" "Hello" "Quick note"
```

- Bulk send from file:

```bash
email-cli bulk ./contacts/team.txt "Update" "Important message"
# or using alias
email-cli ebulk recipients.txt "Newsletter" "Content"
```

- Add a contact:

```bash
email-cli contact-add "John Doe" "john@example.com" "work"
# or using alias
email-cli cadd "John Doe" "john@example.com" "work"
```

---

For troubleshooting, installation, and environment setup, see `docs/CLI_USAGE.md` and `troubleshooting.md`.
