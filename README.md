# Email MCP Server

A comprehensive Model Context Protocol (MCP) server for advanced email operations. This server provides both basic and advanced email functionalities including sending, receiving, searching, and managing emails, as well as contact management.

## Features

### Basic Email Operations
- **Send Email**: Send simple emails to one or more recipients
- **Send Email with Attachments**: Send emails with file attachments
- **Read Recent Emails**: Retrieve recent emails from inbox
- **Get Email by ID**: Retrieve a specific email by its ID
- **Delete Email**: Delete emails from inbox
- **Mark Email as Read/Unread**: Change read status of emails

### Advanced Email Operations
- **Search Emails**: Advanced email search with filters (sender, recipient, subject, dates, read status, etc.)
- **Forward Email**: Forward existing emails to new recipients
- **Reply to Email**: Reply to emails (with reply-all option)
- **Email Statistics**: Get account statistics (total, unread, flagged, recent emails)
- **Create Email Draft**: Create drafts for later editing
- **Schedule Email**: Schedule emails for future sending
- **Bulk Send Emails**: Send multiple emails in batch operations

### Contact Management
- **Add Contact**: Add new contacts to address book
- **List Contacts**: View all contacts
- **Search Contacts**: Search contacts by name or email
- **Get Contacts by Group**: Filter contacts by group/category
- **Update Contact**: Modify existing contact information
- **Delete Contact**: Remove contacts from address book

## Installation

1. Clone the repository:
```bash
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the project:
```bash
pnpm run build
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your email settings in `.env`:
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

### Gmail Setup
For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in the `EMAIL_PASS` field

### Other Email Providers
The server supports other email providers. Update the SMTP and IMAP settings accordingly:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
IMAP_HOST=outlook.office365.com
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
IMAP_HOST=imap.mail.yahoo.com
```

## Usage

### Running as MCP Server
```bash
pnpm start
```

### CLI Tools Usage

The email server also provides a comprehensive CLI interface for direct command-line usage. All operations can be performed using both long and short command aliases.

#### Command Structure
```bash
# Using full command names
email-send "user@example.com" "Subject" "Message body"
email-read 10
contact-add "John Doe" "john@example.com" "work"

# Using short aliases
esend "user@example.com" "Subject" "Message body"
eread 10
cadd "John Doe" "john@example.com" "work"
```

#### CLI Documentation

Detailed documentation for each command category is available in the `bin/` folder:

- **📁 [bin/basic/README.md](bin/basic/README.md)** - Basic email operations (send, read, get, delete, mark-read)
- **📁 [bin/advanced/README.md](bin/advanced/README.md)** - Advanced operations (search, forward, reply, stats, drafts, scheduling, bulk, attachments)  
- **📁 [bin/contacts/README.md](bin/contacts/README.md)** - Contact management (add, list, search, group, update, delete)

#### Quick CLI Reference

| Category | Commands | Short Aliases |
|----------|----------|---------------|
| **Basic Email** | `email-send`, `email-read`, `email-get`, `email-delete`, `email-mark-read` | `esend`, `eread`, `eget`, `edelete`, `emarkread` |
| **Advanced Email** | `email-search`, `email-attach`, `email-forward`, `email-reply`, `email-stats`, `email-draft`, `email-schedule`, `email-bulk` | `esearch`, `eattach`, `eforward`, `ereply`, `estats`, `edraft`, `eschedule`, `ebulk` |
| **Contact Management** | `contact-add`, `contact-list`, `contact-search`, `contact-group`, `contact-update`, `contact-delete` | `cadd`, `clist`, `csearch`, `cgroup`, `cupdate`, `cdelete` |

#### Getting CLI Help
```bash
# General help
email-cli --help

# Command-specific help
email-send --help
esend --help
```

### MCP Server Tools

#### Basic Email Tools

##### send_email
Send a simple email to recipients.
```json
{
  "to": "recipient@example.com,another@example.com",
  "subject": "Hello World",
  "body": "This is a test email",
  "html": "<h1>Hello World</h1><p>This is a test email</p>"
}
```

##### send_email_with_attachments
Send email with file attachments.
```json
{
  "to": "recipient@example.com",
  "subject": "Document Attached",
  "body": "Please find the attached document",
  "attachments": [
    {
      "filename": "document.pdf",
      "path": "/path/to/document.pdf"
    }
  ]
}
```

##### read_recent_emails
Read recent emails from inbox.
```json
{
  "count": 10
}
```

##### get_email_by_id
Get a specific email by ID.
```json
{
  "email_id": "12345"
}
```

##### delete_email
Delete an email.
```json
{
  "email_id": "12345"
}
```

##### mark_email_read
Mark email as read or unread.
```json
{
  "email_id": "12345",
  "read": true
}
```

#### Advanced Email Tools

##### search_emails
Search emails with advanced filters.
```json
{
  "from": "sender@example.com",
  "subject": "important",
  "since": "2024-01-01T00:00:00Z",
  "seen": false,
  "page": 1,
  "limit": 20
}
```

##### forward_email
Forward an existing email.
```json
{
  "email_id": "12345",
  "to": "newrecipient@example.com",
  "additional_message": "Please see the forwarded message below."
}
```

##### reply_to_email
Reply to an email.
```json
{
  "email_id": "12345",
  "reply_body": "Thank you for your message.",
  "reply_all": false
}
```

##### get_email_statistics
Get email account statistics.
```json
{}
```

##### create_email_draft
Create an email draft.
```json
{
  "to": "recipient@example.com",
  "subject": "Draft Email",
  "body": "This is a draft email"
}
```

##### schedule_email
Schedule an email for later sending.
```json
{
  "to": "recipient@example.com",
  "subject": "Scheduled Email",
  "body": "This email was scheduled",
  "schedule_date": "2024-12-31T09:00:00Z"
}
```

##### bulk_send_emails
Send multiple emails at once.
```json
{
  "emails": [
    {
      "to": "user1@example.com",
      "subject": "Newsletter 1",
      "body": "Content for user 1"
    },
    {
      "to": "user2@example.com",
      "subject": "Newsletter 2",  
      "body": "Content for user 2"
    }
  ]
}
```

#### Contact Management Tools

##### add_contact
Add a new contact.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "group": "Work"
}
```

##### list_contacts
List all contacts.
```json
{}
```

##### search_contacts
Search contacts by name or email.
```json
{
  "query": "john"
}
```

##### get_contacts_by_group
Get contacts in a specific group.
```json
{
  "group": "Work"
}
```

##### update_contact
Update contact information.
```json
{
  "contact_id": "contact_123",
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

##### delete_contact
Delete a contact.
```json
{
  "contact_id": "contact_123"
}
```

## Security Considerations

1. **App Passwords**: Use app-specific passwords, not your main email password
2. **Environment Variables**: Keep your `.env` file secure and never commit it to version control
3. **Network Security**: Ensure your network connection is secure when using email operations
4. **Rate Limiting**: Be mindful of email provider rate limits for bulk operations

## Error Handling

The server includes comprehensive error handling:
- Network connectivity issues
- Authentication failures
- Invalid email addresses
- Missing attachments
- IMAP/SMTP server errors

All operations return a standardized response format:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": { /* relevant data */ },
  "error": "Error message (if applicable)"
}
```

## Development

### Building
```bash
pnpm run build
```

### Cleaning
```bash
pnpm run clean
```

### File Structure
```
src/
├── index.ts              # Main MCP server implementation
├── email.ts              # Email service classes and functions
bin/
├── basic/                # Basic email operations CLI
│   ├── README.md         # Basic operations documentation
│   ├── email-send.js     # Send email (esend)
│   ├── email-read.js     # Read emails (eread)
│   ├── email-get.js      # Get email by ID (eget)
│   ├── email-delete.js   # Delete email (edelete)
│   └── email-mark-read.js # Mark read/unread (emarkread)
├── advanced/             # Advanced email operations CLI
│   ├── README.md         # Advanced operations documentation
│   ├── email-search.js   # Search emails (esearch)
│   ├── email-attach.js   # Send with attachment (eattach)
│   ├── email-forward.js  # Forward email (eforward)
│   ├── email-reply.js    # Reply to email (ereply)
│   ├── email-stats.js    # Email statistics (estats)
│   ├── email-draft.js    # Create draft (edraft)
│   ├── email-schedule.js # Schedule email (eschedule)
│   └── email-bulk.js     # Bulk send (ebulk)
├── contacts/             # Contact management CLI
│   ├── README.md         # Contact management documentation
│   ├── contact-add.js    # Add contact (cadd)
│   ├── contact-list.js   # List contacts (clist)
│   ├── contact-search.js # Search contacts (csearch)
│   ├── contact-group.js  # Contacts by group (cgroup)
│   ├── contact-update.js # Update contact (cupdate)
│   └── contact-delete.js # Delete contact (cdelete)
└── utils.js              # Shared CLI utilities
email-cli.js              # Main CLI entry point
docs/                     # Documentation
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- `nodemailer`: SMTP email sending
- `imap-simple`: IMAP email reading and management
- `typescript`: TypeScript support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- **📁 [Troubleshooting Guide](docs/troubleshooting.md)** - Common issues and solutions
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the CLI documentation in `bin/` folders

## Changelog

### v1.0.0
- Initial release with comprehensive email operations
- Basic email sending and receiving
- Advanced search and filtering
- Contact management system
- Bulk operations support
- Draft and scheduling capabilities
- Multi-provider email support