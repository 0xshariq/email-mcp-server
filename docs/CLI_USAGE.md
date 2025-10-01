# Email MCP Server CLI Commands

This document lists all available CLI commands for the Email MCP Server. Each command has both a short alias and a long descriptive name.

## 🔧 Environment Setup

### 1. Create .env file from template:
```bash
cp .env.example .env
```

### 2. Configure your email settings in `.env`:
```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Gmail IMAP Configuration  
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false
```

### 3. Build the project:
```bash
pnpm run build
```

## 📧 Basic Email Operations

### Send Email
```bash
# Short alias
./bin/basic/esend.js "user@example.com" "Subject" "Email body"
./bin/basic/esend.js "user@example.com" "HTML Email" "Plain text" "<h1>HTML</h1>"

# Long alias
./bin/basic/email-send.js "user@example.com" "Subject" "Email body"
```

### Send Email with Attachment
```bash
# Short alias
./bin/basic/eattach.js "user@example.com" "Report" "Please find attached" "/path/to/file.pdf"
./bin/basic/eattach.js "user@example.com" "Document" "See attachment" "/home/file.doc" "custom-name.doc"

# Long alias
./bin/basic/email-attach.js "user@example.com" "Report" "Please find attached" "/path/to/file.pdf"
```

### Read Recent Emails
```bash
# Short alias
./bin/basic/eread.js           # Read 10 recent emails
./bin/basic/eread.js 5         # Read 5 recent emails

# Long alias
./bin/basic/email-read.js 20   # Read 20 recent emails
```

### Get Specific Email
```bash
# Short alias
./bin/basic/eget.js 12345      # Get email with ID 12345

# Long alias
./bin/basic/email-get.js 12345
```

### Delete Email
```bash
# Short alias
./bin/basic/edelete.js 12345           # Interactive delete
./bin/basic/edelete.js 12345 --force   # Force delete without confirmation

# Long alias
./bin/basic/email-delete.js 12345
./bin/basic/email-delete.js 12345 -f   # Force delete
```

### Mark Email as Read/Unread
```bash
# Short alias
./bin/basic/emarkread.js 12345        # Mark as read
./bin/basic/emarkread.js 12345 false  # Mark as unread

# Long alias
./bin/basic/email-mark-read.js 12345 true
```

## 🚀 Advanced Email Operations

### Search Emails
```bash
# Short alias
./bin/advanced/esearch.js --from "boss@company.com" --seen false
./bin/advanced/esearch.js --subject "meeting" --since "2024-01-01"
./bin/advanced/esearch.js --to "me@company.com" --limit 5

# Long alias
./bin/advanced/email-search.js --from "important@company.com" --flagged true
```

### Forward Email
```bash
# Short alias
./bin/advanced/eforward.js 12345 "colleague@company.com" "Please review"

# Long alias
./bin/advanced/email-forward.js 12345 "team@company.com"
```

### Reply to Email
```bash
# Short alias
./bin/advanced/ereply.js 12345 "Thank you for the update"
./bin/advanced/ereply.js 12345 "Thanks" --reply-all

# Long alias
./bin/advanced/email-reply.js 12345 "Thank you for the information"
```

### Email Statistics
```bash
# Short alias
./bin/advanced/estats.js

# Long alias
./bin/advanced/email-stats.js
```

### Create Draft
```bash
# Short alias
./bin/advanced/edraft.js "client@example.com" "Proposal" "Draft content here"

# Long alias
./bin/advanced/email-draft.js "client@example.com" "Meeting Notes" "Draft content"
```

### Schedule Email
```bash
# Short alias  
./bin/advanced/eschedule.js "team@company.com" "Reminder" "Meeting tomorrow" "2024-12-31T09:00:00Z"

# Long alias
./bin/advanced/email-schedule.js "all@company.com" "Newsletter" "Monthly update" "2024-12-31T08:00:00Z"
```

### Bulk Send Emails
```bash
# Short alias
./bin/advanced/ebulk.js subscribers.json

# Long alias
./bin/advanced/email-bulk.js newsletter-list.json
```

## 👥 Contact Management

### Add Contact
```bash
# Short alias
./bin/contacts/cadd.js "John Doe" "john@company.com" "Work"

# Long alias
./bin/contacts/contact-add.js "Jane Smith" "jane@company.com" "Clients"
```

### List All Contacts
```bash
# Short alias
./bin/contacts/clist.js

# Long alias
./bin/contacts/contact-list.js
```

### Search Contacts
```bash
# Short alias
./bin/contacts/csearch.js "john"

# Long alias
./bin/contacts/contact-search.js "company"
```

### Get Contacts by Group
```bash
# Short alias
./bin/contacts/cgroup.js "Work"

# Long alias
./bin/contacts/contact-group.js "Clients"
```

### Update Contact
```bash
# Short alias
./bin/contacts/cupdate.js contact_123 --name "John Smith Jr." --email "john.jr@company.com"

# Long alias
./bin/contacts/contact-update.js contact_123 --name "Updated Name"
```

### Delete Contact
```bash
# Short alias
./bin/contacts/cdelete.js contact_123

# Long alias
./bin/contacts/contact-delete.js contact_123
```

## 🆘 Help Commands

Every command supports help flags:
```bash
./bin/basic/esend.js --help
./bin/basic/esend.js -h
./bin/basic/esend.js help
```

## ⚠️ Important Notes

1. **Gmail Setup**: Use App Passwords, not your regular password
2. **File Permissions**: All CLI files are executable (`chmod +x` applied)
3. **Environment**: Make sure `.env` is configured before running any commands
4. **Error Handling**: Commands provide detailed error messages and suggestions
5. **Confirmation**: Destructive operations (like delete) ask for confirmation unless `--force` is used

## 🎨 CLI Features

- **Colored Output**: Uses chalk for beautiful terminal output
- **Progress Indicators**: Spinner animations for long operations  
- **Error Handling**: Comprehensive error messages with suggestions
- **Help System**: Built-in help for every command
- **Aliases**: Both short (e.g., `esend`) and long (e.g., `email-send`) versions
- **Interactive Mode**: Confirmation prompts for destructive operations
- **Flexible Arguments**: Support for optional parameters and flags

## 📊 Example Workflow

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your email settings
pnpm run build

# 2. Send an email
./bin/basic/esend.js "colleague@company.com" "Hello" "Test email from CLI"

# 3. Read recent emails
./bin/basic/eread.js 5

# 4. Search for specific emails
./bin/advanced/esearch.js --from "boss@company.com" --seen false

# 5. Add a contact
./bin/contacts/cadd.js "Important Client" "client@company.com" "VIP"

# 6. Get email statistics
./bin/advanced/estats.js
```

This CLI tool works completely independently from the MCP server and provides full email functionality through command-line interface.