# Advanced Email Operations

This folder contains CLI commands for advanced email operations including search, forwarding, replies, statistics, drafts, scheduling, bulk operations, and attachments.

## Available Commands

### 🔍 Email Search (`email-search.js` / `esearch`)
Search emails with advanced filters and criteria.

**Usage:**
```bash
email-search [options]
esearch [options]
```

**Examples:**
```bash
email-search --from "boss@company.com" --limit 10
esearch --subject "meeting" --unread
```

### 📎 Email Attach (`email-attach.js` / `eattach`)
Send email with file attachments.

**Usage:**
```bash
email-attach <to> <subject> <body> <attachment-path>
eattach <to> <subject> <body> <attachment-path>
```

**Examples:**
```bash
email-attach "user@example.com" "Report" "Please find attached" "/path/to/report.pdf"
eattach "team@company.com" "Invoice" "Invoice attached" "./invoice.pdf"
```

### ↪️ Email Forward (`email-forward.js` / `eforward`)
Forward an existing email to another recipient.

**Usage:**
```bash
email-forward <email-id> <to-email> <message>
eforward <email-id> <to-email> <message>
```

**Examples:**
```bash
email-forward 123 "colleague@company.com" "Please review this"
eforward 456 "team@company.com" "FYI"
```

### 💬 Email Reply (`email-reply.js` / `ereply`)
Reply to an existing email.

**Usage:**
```bash
email-reply <email-id> <message>
ereply <email-id> <message>
```

**Examples:**
```bash
email-reply 123 "Thanks for the update!"
ereply 456 "I agree with your proposal"
```

### 📊 Email Statistics (`email-stats.js` / `estats`)
Get comprehensive statistics about your email account.

**Usage:**
```bash
email-stats
estats
```

**Features:**
- Total email count
- Read vs unread emails
- Sent email statistics
- Top senders analysis
- Account activity summary

### 📝 Email Draft (`email-draft.js` / `edraft`)
Create and save email drafts.

**Usage:**
```bash
email-draft <to> <subject> <body>
edraft <to> <subject> <body>
```

**Examples:**
```bash
email-draft "client@example.com" "Proposal" "Draft content here"
edraft "team@company.com" "Meeting Notes" "Draft meeting notes"
```

### ⏰ Email Schedule (`email-schedule.js` / `eschedule`)
Schedule emails for future delivery.

**Usage:**
```bash
email-schedule <to> <subject> <body> <schedule-time>
eschedule <to> <subject> <body> <schedule-time>
```

**Time Formats:**
- ISO Format: `2024-12-25T09:00:00Z`
- Relative: `+1h` (1 hour), `+30m` (30 minutes), `+1d` (1 day)

**Examples:**
```bash
email-schedule "user@example.com" "Reminder" "Meeting tomorrow" "2024-12-25T09:00:00Z"
eschedule "team@company.com" "Report" "Weekly report" "+2h"
```

### 📤 Email Bulk (`email-bulk.js` / `ebulk`)
Send emails to multiple recipients from a file.

**Usage:**
```bash
email-bulk <recipients-file> <subject> <body>
ebulk <recipients-file> <subject> <body>
```

**Recipients File Format:**
```
user1@example.com
user2@example.com
user3@example.com
```

**Examples:**
```bash
email-bulk recipients.txt "Newsletter" "Check out our latest updates!"
ebulk team-emails.txt "Meeting Reminder" "Team meeting tomorrow at 2 PM"
```

## Quick Reference

| Command | Short Alias | Description |
|---------|-------------|-------------|
| `email-search` | `esearch` | Search emails with filters |
| `email-attach` | `eattach` | Send email with attachment |
| `email-forward` | `eforward` | Forward an email |
| `email-reply` | `ereply` | Reply to an email |
| `email-stats` | `estats` | Get email statistics |
| `email-draft` | `edraft` | Create email draft |
| `email-schedule` | `eschedule` | Schedule email delivery |
| `email-bulk` | `ebulk` | Send bulk emails |

## Advanced Features

### File Attachments
- Supports most file types up to 25MB
- Automatic MIME type detection
- File size validation

### Bulk Operations
- Batch email sending
- Error handling for failed sends
- Progress tracking
- Results summary

### Scheduling
- Flexible time formats
- Timezone support
- Scheduling validation
- Future delivery confirmation

### Search Capabilities
- Filter by sender, recipient, subject
- Date range searches
- Read/unread status filtering
- Custom search queries

## Getting Help

All commands support the `--help` flag:

```bash
email-search --help
eattach --help
```

## Environment Requirements

Ensure your `.env` file includes all required email configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

## Error Handling

Common solutions for advanced operations:
- **File not found**: Check attachment file paths
- **Schedule validation**: Verify time format and future date
- **Bulk send failures**: Check recipient file format
- **Search timeout**: Reduce search scope or add more specific filters