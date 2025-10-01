# Email MCP Server CLI Commands

Complete guide for using the Email MCP Server CLI tools. The CLI provides comprehensive email management capabilities through both short and long command aliases.

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g @0xshariq/email-mcp-server
```

After global installation, all commands are available system-wide:
```bash
# All these work directly:
email-send "user@example.com" "Subject" "Body"
esend "user@example.com" "Subject" "Body"  
eread 10
cadd "John Doe" "john@example.com"
```

### Local Development
```bash
# Clone and build
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server
npm install
npm run build

# Use with node
node email-cli.js email-send "user@example.com" "Subject" "Body"
```

## 🔧 Environment Setup

### 1. Create .env file:
```bash
cp .env.example .env
```

### 2. Configure email settings:
```env
# Gmail Configuration (most common)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password for Gmail!

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false

# Other providers supported (Outlook, Yahoo, custom SMTP/IMAP)
```

### 3. Gmail App Password Setup:
1. Enable 2-Factor Authentication
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

## 📧 Basic Email Operations

### 📤 Send Email (`email-send` / `esend`)
Send emails to one or more recipients with optional HTML content.

```bash
# Basic usage
email-send "user@example.com" "Subject" "Email body"
esend "user@example.com" "Meeting Reminder" "Team meeting at 3 PM today"

# Multiple recipients
email-send "user1@example.com,user2@example.com" "Update" "Important update for everyone"

# With HTML content
esend "client@example.com" "Newsletter" "Plain text version" "<h1>HTML Newsletter</h1><p>Rich content here</p>"
```

**Arguments:**
- `to` - Recipient email(s), comma-separated
- `subject` - Email subject line  
- `body` - Plain text message body
- `html` - Optional HTML content

### 📬 Read Recent Emails (`email-read` / `eread`)
Retrieve and display recent emails from your inbox.

```bash
# Read default (10) emails
email-read
eread

# Read specific number
eread 5              # Read 5 recent emails
email-read 25        # Read 25 recent emails
```

**Arguments:**
- `count` - Number of emails to retrieve (default: 10)

### 📄 Get Specific Email (`email-get` / `eget`)
Retrieve detailed information about a specific email by ID.

```bash
# Get email details
email-get 12345
eget 67890

# Use with email IDs from email-read
eread 5              # Shows email IDs
eget <id-from-above>  # Get specific email
```

**Arguments:**
- `email_id` - Unique email identifier from email-read

### 🗑️ Delete Email (`email-delete` / `edelete`)
Permanently delete emails from your inbox.

```bash
# Interactive delete (asks for confirmation)
email-delete 12345
edelete 67890

# Force delete (no confirmation)
edelete 12345 --force
email-delete 67890 -f
```

**Arguments:**
- `email_id` - Email ID to delete
- `--force` / `-f` - Skip confirmation prompt

### ✅ Mark Email Read/Unread (`email-mark-read` / `emarkread`)
Change the read status of emails.

```bash
# Mark as read
email-mark-read 12345 true
emarkread 67890

# Mark as unread  
emarkread 12345 false
email-mark-read 67890 unread
```

**Arguments:**
- `email_id` - Email ID to update
- `status` - `true`/`read` or `false`/`unread`

## 🚀 Advanced Email Operations

### 🔍 Search Emails (`email-search` / `esearch`)
Search emails with advanced filters and criteria.

```bash
# Search by sender
email-search --from "boss@company.com"
esearch --from "important@client.com" --limit 5

# Search by subject and date
esearch --subject "meeting" --since "2024-01-01"
email-search --subject "invoice" --before "2024-12-31"

# Search unread emails
esearch --seen false --limit 10
email-search --from "@company.com" --seen false

# Complex searches
esearch --to "me@company.com" --flagged true --since "2024-10-01"
```

**Filter Options:**
- `--from <email>` - Filter by sender
- `--to <email>` - Filter by recipient  
- `--subject <text>` - Filter by subject keywords
- `--since <date>` - Emails after date (ISO format)
- `--before <date>` - Emails before date
- `--seen <true|false>` - Read/unread status
- `--flagged <true|false>` - Flagged status
- `--limit <number>` - Max results (default: 10)

### 📎 Send with Attachment (`email-attach` / `eattach`)
Send emails with file attachments up to 25MB.

```bash
# Basic attachment
email-attach "user@example.com" "Report" "Please find attached report" "/path/to/report.pdf"
eattach "client@example.com" "Invoice" "Monthly invoice attached" "./invoice-oct.pdf"

# Multiple file types supported
eattach "team@company.com" "Presentation" "Meeting slides" "/home/user/slides.pptx"
email-attach "hr@company.com" "Documents" "Required forms" "/documents/forms.zip"
```

**Supported File Types:**
- Documents: PDF, DOC, DOCX, TXT, RTF
- Spreadsheets: XLS, XLSX, CSV
- Images: JPG, PNG, GIF, BMP
- Archives: ZIP, RAR, 7Z, TAR.GZ
- Others: Most file types up to 25MB

### ↪️ Forward Email (`email-forward` / `eforward`)
Forward existing emails to new recipients with additional message.

```bash
# Basic forwarding
email-forward 12345 "colleague@company.com" "Please review this email"
eforward 67890 "team@company.com" "FYI - important update"

# Forward without additional message
eforward 12345 "manager@company.com"
```

**Arguments:**
- `email_id` - ID of email to forward
- `to_email` - Recipient email address
- `message` - Additional forwarding message (optional)

### 💬 Reply to Email (`email-reply` / `ereply`)
Reply to existing emails with automatic threading.

```bash
# Simple reply
email-reply 12345 "Thank you for the information"
ereply 67890 "I'll review this and get back to you"

# Reply with confirmation
ereply 12345 "Confirmed - I'll attend the meeting"
```

**Arguments:**
- `email_id` - ID of email to reply to
- `message` - Reply message content

### 📊 Email Statistics (`email-stats` / `estats`)
Get comprehensive statistics about your email account.

```bash
# Get account statistics
email-stats
estats
```

**Statistics Include:**
- Total emails in account
- Unread vs read counts
- Recent activity summary  
- Top senders analysis
- Folder/label statistics
- Storage usage information

### 📝 Create Email Draft (`email-draft` / `edraft`)
Create email drafts for later editing and sending.

```bash
# Create basic draft
email-draft "client@example.com" "Proposal Draft" "Initial proposal content..."
edraft "team@company.com" "Meeting Notes" "Draft meeting notes from today"

# Create detailed draft
edraft "important@client.com" "Project Update" "Quarterly project status and next steps"
```

**Arguments:**
- `to` - Recipient email address
- `subject` - Draft subject line
- `body` - Draft message content

### ⏰ Schedule Email (`email-schedule` / `eschedule`)
Schedule emails for future delivery with flexible time formats.

```bash
# Schedule with ISO timestamp
email-schedule "team@company.com" "Weekly Report" "Report content" "2024-12-31T09:00:00Z"

# Schedule with relative time  
eschedule "client@example.com" "Follow-up" "Following up on our meeting" "+2h"
eschedule "all@company.com" "Newsletter" "Monthly newsletter" "+1d"

# Schedule for specific date/time
email-schedule "hr@company.com" "Reminder" "Deadline reminder" "2024-12-25T08:00:00Z"
```

**Time Formats:**
- ISO Format: `2024-12-31T09:00:00Z`
- Relative: `+1h` (1 hour), `+30m` (30 min), `+1d` (1 day), `+1w` (1 week)

### 📤 Bulk Send (`email-bulk` / `ebulk`)
Send personalized emails to multiple recipients from a file.

```bash
# Send to recipients from file
email-bulk recipients.txt "Newsletter" "Monthly company newsletter content"
ebulk team-emails.txt "Meeting Reminder" "Team meeting tomorrow at 2 PM"

# With custom recipient file
ebulk ./contacts/vip-clients.txt "Important Update" "Exclusive client update"
```

**Recipients File Format:**
```
user1@example.com
user2@company.com  
client@important.com
team@startup.com
```

**Features:**
- Progress tracking for large lists
- Error handling for invalid emails
- Delivery confirmation reporting
- Rate limiting to avoid spam filters

## 👥 Contact Management

### 👤 Add Contact (`contact-add` / `cadd`)
Add new contacts to your address book with groups and additional information.

```bash
# Basic contact
contact-add "John Doe" "john@example.com"
cadd "Jane Smith" "jane@company.com" "work"

# With specific groups
cadd "Important Client" "client@example.com" "vip"
contact-add "Team Lead" "lead@company.com" "management"

# Various groups
cadd "Family Member" "family@personal.com" "family"
cadd "Freelancer" "dev@freelance.com" "contractors"
```

**Arguments:**
- `name` - Full contact name
- `email` - Contact email address
- `group` - Contact group (optional, default: "general")

**Common Groups:** work, clients, family, friends, vip, management, contractors, suppliers

### 📋 List Contacts (`contact-list` / `clist`)
Display all contacts with their information and groups.

```bash
# List all contacts (default: 20)
contact-list
clist

# List specific number
clist 50             # Show 50 contacts
contact-list 10      # Show 10 contacts

# List all contacts
clist 999            # Show maximum contacts
```

**Arguments:**
- `limit` - Maximum contacts to display (default: 20)

### 🔍 Search Contacts (`contact-search` / `csearch`)
Search contacts by name, email domain, or any text.

```bash
# Search by name
contact-search "john"
csearch "smith"

# Search by email domain
csearch "gmail.com"
contact-search "@company.com"

# Search by group
csearch "work"
contact-search "clients"

# Partial searches
csearch "dev"        # Finds "Developer", "dev@email.com", etc.
```

**Arguments:**
- `query` - Search term (searches name, email, and group fields)

### 👥 Contacts by Group (`contact-group` / `cgroup`)
Get all contacts belonging to a specific group.

```bash
# Get work contacts
contact-group "work"
cgroup "clients"

# Get specific groups  
cgroup "family"
contact-group "vip"
cgroup "management"
```

**Arguments:**
- `group_name` - Name of the contact group

### ✏️ Update Contact (`contact-update` / `cupdate`)
Update existing contact information including name, email, phone, and group.

```bash
# Update name
contact-update contact_123 name "John Smith Jr."
cupdate contact_456 name "Jane Smith-Johnson"

# Update email
cupdate contact_123 email "newemail@example.com"
contact-update contact_456 email "updated@company.com"

# Update group
cupdate contact_789 group "management"
contact-update contact_101 group "vip"

# Update phone number
cupdate contact_123 phone "+1-555-0123"
```

**Arguments:**
- `contact_id` - ID of contact to update (from contact-list)
- `field` - Field to update: `name`, `email`, `phone`, `group`
- `value` - New value for the field

### 🗑️ Delete Contact (`contact-delete` / `cdelete`)
Remove contacts from your address book with confirmation.

```bash
# Delete with confirmation prompt
contact-delete contact_123
cdelete contact_456

# Force delete without confirmation
cdelete contact_123 --force
contact-delete contact_456 -f
```

**Arguments:**
- `contact_id` - ID of contact to delete
- `--force` / `-f` - Skip confirmation prompt

**Safety Features:**
- Shows contact details before deletion
- Requires confirmation unless `--force` used
- Cannot be undone - use with caution

## 🆘 Help System

Every command has comprehensive help documentation:

```bash
# General CLI help
email-cli --help

# Command-specific help
email-send --help
esend --help
eread -h
cadd --help

# Help works with both aliases
email-search --help
esearch --help
```

**Help Information Includes:**
- Command usage syntax
- Argument descriptions  
- Available options/flags
- Practical examples
- Related commands

## 🎨 CLI Features

### **Visual Features**
- 🌈 **Colored Output** - Beautiful, readable terminal output
- ⏳ **Progress Indicators** - Spinner animations for operations
- 📊 **Structured Display** - Well-formatted email and contact lists
- ✅ **Status Messages** - Clear success/error feedback

### **User Experience**
- 🔍 **Smart Error Messages** - Detailed errors with solutions
- 🛡️ **Safety Confirmations** - Prompts for destructive operations  
- ⚡ **Fast Performance** - Optimized for quick operations
- 🔧 **Flexible Input** - Multiple argument formats supported

### **Command Features**
- 📝 **Dual Aliases** - Both short (`esend`) and long (`email-send`) versions
- 🎯 **Context Aware** - Commands adapt based on available data
- 🔄 **Batch Operations** - Bulk email sending and contact management
- 📅 **Scheduling** - Future email delivery support

## 🚀 Quick Start Examples

### Daily Email Workflow
```bash
# Morning email check
eread 10
estats

# Send project update
esend "team@company.com" "Daily Standup" "Today's priorities and blockers"

# Follow up on important emails
esearch --from "boss@company.com" --seen false
```

### Contact Management Workflow
```bash
# Add new business contact
cadd "Jane Smith" "jane@newclient.com" "clients"

# Organize existing contacts
clist                        # See all contacts
cgroup "work"               # Check work contacts
cupdate contact_123 group "vip"  # Promote important contact
```

### Advanced Email Operations
```bash
# Schedule weekly report
eschedule "management@company.com" "Weekly Report" "Automated weekly summary" "+1w"

# Send newsletter to subscribers
ebulk newsletter-subscribers.txt "Monthly Update" "Our latest news and updates"

# Search and organize emails
esearch --subject "invoice" --since "2024-10-01"
eforward 12345 "accounting@company.com" "Please process this invoice"
```

## ⚠️ Important Notes

### **Security & Setup**
1. **Gmail Users**: Must use App Passwords (not regular password)
2. **Environment File**: Keep `.env` secure, never commit to version control
3. **Network Security**: Use secure connections, verify SMTP/IMAP settings
4. **Rate Limiting**: Respect email provider limits for bulk operations

### **Best Practices**
1. **Test First**: Use small batches for bulk operations
2. **Backup Contacts**: Export contact lists regularly
3. **Monitor Quotas**: Check email provider limits and usage
4. **Error Handling**: Read error messages for troubleshooting guidance

### **File Management**
1. **Attachments**: Use absolute paths, check file sizes (25MB limit)
2. **Bulk Lists**: Use plain text files with one email per line
3. **Permissions**: Ensure CLI has read access to attachment files

## 🔗 Additional Resources

- 📁 **[Basic Commands Documentation](../bin/basic/README.md)** - Detailed basic operations guide
- 📁 **[Advanced Commands Documentation](../bin/advanced/README.md)** - Complex operations and features  
- 📁 **[Contact Management Documentation](../bin/contacts/README.md)** - Complete contact system guide
- 📁 **[Troubleshooting Guide](troubleshooting.md)** - Common issues and solutions
- 📁 **[Architecture Documentation](architecture.md)** - Technical implementation details

## 💡 Pro Tips

1. **Alias Setup**: Create shell aliases for frequently used commands
   ```bash
   alias morning-emails="eread 10 && estats"
   alias check-important="esearch --from 'boss@company.com' --seen false"
   ```

2. **Batch Scripts**: Create scripts for routine tasks
   ```bash
   #!/bin/bash
   # daily-email-routine.sh
   eread 5
   esearch --seen false --limit 3
   estats
   ```

3. **Contact Organization**: Use consistent group naming
   - `work-internal`, `work-external`, `clients-active`, `clients-potential`

4. **Email Templates**: Save common email content as files
   ```bash
   esend "client@example.com" "Weekly Check-in" "$(cat templates/weekly-checkin.txt)"
   ```

This CLI provides professional-grade email management capabilities suitable for individual users, small teams, and automated workflows.