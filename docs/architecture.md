# Email MCP Server Architecture

## Overview

The Email MCP Server is built with a modular TypeScript architecture that separates concerns between:
- **CLI operations** (`cli/` folder) - Commander.js-powered CLI
- **MCP server** (`server/` folder) - Model Context Protocol server
- **Shared library** (`src/lib/` folder) - Core email and contact services

**Version 2.0** introduces a complete restructure with TypeScript, improved error handling, comprehensive JSDoc documentation, and unified configuration.

## Project Structure

```
email-mcp-server/
├── cli/                    # CLI implementation
│   ├── index.ts           # Commander.js entry point
│   ├── commands.ts        # All command implementations
│   └── utils.ts           # CLI utilities
├── server/                # MCP server
│   └── index.ts           # MCP server implementation
├── src/lib/               # Shared core library
│   └── email.ts           # Email & Contact services
├── dist/                  # Compiled JavaScript output
└── docs/                  # Documentation
```

## Architecture Components

### 1. Core Library (`src/lib/email.ts`)

The shared library used by both CLI and MCP server.

#### EmailService Class
The main service class that handles all email operations with comprehensive error handling.

**Key Features:**
- **SMTP integration** via nodemailer with TLS support
- **IMAP integration** via imap-simple with keepalive
- **Connection management** with retry logic and timeouts
- **Custom error handling** via EmailServiceError class
- **Input validation** for all operations
- **Comprehensive JSDoc documentation**
- **Type-safe interfaces** for all data structures

**Methods:**
- `sendEmail()` - Basic email sending
- `sendEmailWithAttachments()` - Email with file attachments
- `readRecentEmails()` - Fetch recent emails
- `getEmailById()` - Get specific email
- `deleteEmail()` - Delete email
- `markEmailAsRead()` - Change read status
- `searchEmails()` - Advanced email search
- `forwardEmail()` - Forward emails
- `replyToEmail()` - Reply to emails
- `getEmailStatistics()` - Account statistics
- `createDraft()` - Create email drafts
- `scheduleEmail()` - Schedule emails
- `bulkSendEmails()` - Bulk operations

#### ContactService Class
Manages contact information and address book functionality.

**Methods:**
- `addContact()` - Add new contact
- `getAllContacts()` - List all contacts
- `searchContacts()` - Search contacts
- `getContactsByGroup()` - Filter by group
- `updateContact()` - Modify contact
- `deleteContact()` - Remove contact

### 2. CLI Implementation (`cli/`)

#### CLI Entry Point (`cli/index.ts`)
Commander.js-based CLI with 40+ commands and aliases.

**Features:**
- Command routing via Commander.js
- Alias support (e.g., `esend` for `email-send`)
- Consistent help documentation
- Error handling with user-friendly messages

**Structure:**
```typescript
program
  .command('send <to> <subject> <body>')
  .alias('esend')
  .description('Send an email')
  .action(async (to, subject, body) => {
    await sendEmail(to, subject, body);
  });
```

#### Command Implementations (`cli/commands.ts`)
All command logic consolidated in exported async functions.

**Benefits:**
- Centralized command logic
- Reusable across different entry points
- Easy to test and maintain
- Consistent error handling

#### CLI Utilities (`cli/utils.ts`)
Shared utilities for CLI operations:
- Environment variable loading
- Configuration validation
- Service initialization
- Spinner and progress indicators
- Success/error message formatting

### 3. MCP Server Implementation (`server/index.ts`)

#### Server Setup
- Initializes MCP server with comprehensive tool definitions
- Sets up request handlers for tool execution
- Manages service instances

#### Tool Registration
All tools are registered with detailed parameter schemas:
- Input validation
- Parameter type definitions
- Required vs optional parameters
- Help documentation

#### Request Handling
- Parameter parsing and validation
- Service method invocation
- Error handling and response formatting
- Standardized response structure

## Data Models

### Core Interfaces

#### EmailMessage Interface
```typescript
interface EmailMessage {
  id: string;                    // Unique email identifier
  from: string;                  // Sender email address
  to: string[];                  // Primary recipients
  cc?: string[];                 // Carbon copy recipients
  bcc?: string[];                // Blind carbon copy recipients
  subject: string;               // Email subject
  body: string;                  // Plain text body
  html?: string;                 // HTML body (optional)
  attachments?: Attachment[];    // File attachments
  date: Date;                    // Send/receive date
  flags: string[];               // IMAP flags (\Seen, \Flagged, etc.)
  priority?: EmailPriority;      // Email priority level
}

type EmailPriority = 'high' | 'normal' | 'low';
```

#### Contact Interface
```typescript
interface Contact {
  id: string;                    // Unique contact identifier
  name: string;                  // Contact's full name
  email: string;                 // Contact's email address
  group?: string;                // Optional group/category
  metadata?: Record<string, unknown>; // Additional metadata
}
```

#### EmailFilter Interface
```typescript
interface EmailFilter {
  from?: string;                 // Filter by sender
  to?: string;                   // Filter by recipient
  subject?: string;              // Filter by subject (partial match)
  since?: Date;                  // Emails after this date
  before?: Date;                 // Emails before this date
  seen?: boolean;                // Read/unread status
  flagged?: boolean;             // Flagged status
  hasAttachment?: boolean;       // Has attachments
}
```

#### Configuration Interfaces
```typescript
interface EmailConfig {
  smtp: SMTPConfig;              // SMTP configuration
  imap: IMAPConfig;              // IMAP configuration
}

interface SMTPConfig {
  host: string;                  // SMTP server hostname
  port: number;                  // SMTP port (587 for TLS, 465 for SSL)
  secure: boolean;               // Use SSL from start
  auth: {
    user: string;                // Email address
    pass: string;                // App password
  };
}

interface IMAPConfig {
  host: string;                  // IMAP server hostname
  port: number;                  // IMAP port (typically 993)
  tls: boolean;                  // Use TLS
  auth: {
    user: string;                // Email address
    pass: string;                // App password
  };
  markSeen: boolean;             // Mark emails as read when fetched
}
```

### Result Types

```typescript
interface SendEmailResult {
  messageId: string;             // Email message ID
  response: string;              // Server response
}

interface SearchResult {
  emails: EmailMessage[];        // Matching emails
  total: number;                 // Total matches
  page: number;                  // Current page
  limit: number;                 // Results per page
}

interface BatchDeleteResult {
  success: string[];             // Successfully deleted IDs
  failed: Array<{                // Failed deletions
    id: string;
    error: string;
  }>;
}

interface EmailStatistics {
  total: number;                 // Total emails
  unread: number;                // Unread count
  flagged: number;               // Flagged count
  recent: number;                // Recent count
}
```

### Error Handling

```typescript
class EmailServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

// Error codes:
// - INVALID_SMTP_CONFIG
// - INVALID_IMAP_CONFIG
// - INVALID_EMAIL_ADDRESS
// - SEND_EMAIL_FAILED
// - IMAP_CONNECT_FAILED
// - EMAIL_NOT_FOUND
// etc.
```
## Configuration Management

### Environment Variables

Both CLI and MCP server use the **same environment variables**:

```bash
# Email credentials
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

# SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# IMAP settings
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false
```

### Configuration Priority

1. **Environment variables** (highest priority)
2. **`.env` file** in project directory
3. **Default values** (lowest priority)

### Local vs Global

**Local Development:**
- Use `.env` file in project directory
- Works for both CLI and MCP server
- Convenient for development and testing

**Global Installation (CLI):**
- Set environment variables in shell profile
- Linux: `~/.bashrc`
- macOS: `~/.zshrc`
- Windows: System Environment Variables

**MCP Server (Claude Desktop):**
- Configure in MCP settings JSON
- Environment variables passed to server process

📖 See [CONFIGURATION.md](CONFIGURATION.md) for detailed setup instructions.

## Build and Deployment

### TypeScript Compilation

```bash
# Build all TypeScript files
npm run build

# Output structure:
dist/
├── cli/              # Compiled CLI
│   ├── index.js
│   ├── commands.js
│   └── utils.js
├── server/           # Compiled MCP server
│   └── index.js
└── src/lib/          # Compiled library
    └── email.js
```

### Package Distribution

Single package with multiple entry points:

```json
{
  "name": "@0xshariq/email-mcp-server",
  "main": "./dist/src/lib/email.js",
  "types": "./dist/src/lib/email.d.ts",
  "bin": {
    "email-cli": "./dist/cli/index.js",
    "email-send": "./dist/cli/index.js",
    "email-read": "./dist/cli/index.js",
    // ... 40+ command aliases
  }
}
```

## Key Architectural Decisions

### 1. Shared Library Approach
**Decision:** Use a single shared library for both CLI and MCP server.

**Benefits:**
- Code reuse and consistency
- Single source of truth
- Easier maintenance
- Type safety across all components

### 2. TypeScript Migration
**Decision:** Migrate entire codebase from JavaScript to TypeScript.

**Benefits:**
- Type safety and compile-time error checking
- Better IDE support and autocomplete
- Improved documentation with JSDoc
- Easier refactoring

### 3. Commander.js for CLI
**Decision:** Use Commander.js instead of custom routing.

**Benefits:**
- Standard CLI framework
- Built-in help generation
- Alias support
- Better argument parsing
- Consistent user experience

### 4. Unified Configuration
**Decision:** Share environment variables between CLI and server.

**Benefits:**
- Consistent configuration
- Simpler setup process
- Reduced duplication
- Single documentation source

### 5. Custom Error Types
**Decision:** Create EmailServiceError class for all errors.

**Benefits:**
- Structured error information
- Error codes for programmatic handling
- Better debugging with details
- Consistent error messages

## Performance Considerations

### Connection Management
- IMAP connections are reused when possible
- Connection timeouts prevent hanging
- Keepalive prevents connection drops

### Email Reading
- Headers-only mode for faster list views
- Full body fetch only when needed
- Pagination support for large mailboxes

### Bulk Operations
- Batch processing for deletions
- Single expunge operation for efficiency
- Progress reporting for long operations

## Security

### Password Handling
- App passwords recommended over regular passwords
- Passwords never logged or displayed
- Environment variable support for secure storage
- Optional OS keychain integration

### TLS/SSL
- TLS enabled by default for IMAP
- Self-signed certificate support (configurable)
- Secure SMTP with STARTTLS

### Input Validation
- Email address format validation
- Required field checking
- Type validation for all inputs
- Error messages without exposing sensitive data

## Testing Strategy

### Unit Tests
- Test individual service methods
- Mock SMTP/IMAP connections
- Validate error handling

### Integration Tests
- Test CLI commands end-to-end
- Test MCP server tool calls
- Verify configuration loading

### Manual Testing
- Test across platforms (Windows, macOS, Linux)
- Test with different email providers
- Test global installation

## Future Enhancements

### Planned Features
- [ ] Draft folder integration
- [ ] Email scheduling with job queue
- [ ] Multiple email account support
- [ ] Email templates
- [ ] Advanced search with filters
- [ ] Email threading
- [ ] Attachment preview
- [ ] Contact groups management
- [ ] Email signature support

### Performance Improvements
- [ ] Connection pooling for IMAP
- [ ] Email caching
- [ ] Lazy loading for attachments
- [ ] Streaming for large emails

### Developer Experience
- [ ] Plugin system for extensions
- [ ] Webhooks for email events
- [ ] REST API wrapper
- [ ] GraphQL support

## References

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Nodemailer Documentation](https://nodemailer.com/)
- [IMAP-Simple Documentation](https://github.com/chadxz/imap-simple)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Last Updated:** December 20, 2025  
**Version:** 2.0.0
  since?: Date;
  before?: Date;
  seen?: boolean;
  flagged?: boolean;
  hasAttachment?: boolean;
}
```

## Configuration Management

### Environment Variables
The server uses environment variables for configuration:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` - SMTP settings
- `IMAP_HOST`, `IMAP_PORT`, `IMAP_TLS` - IMAP settings
- `EMAIL_USER`, `EMAIL_PASS` - Authentication
- `IMAP_MARK_SEEN` - Read behavior

### Factory Pattern
The `createEmailService()` function provides a factory method with default configurations that can be overridden.

## Error Handling Strategy

### Layered Error Handling
1. **Service Level**: Catch and handle specific email provider errors
2. **MCP Level**: Wrap service errors in standardized responses
3. **Client Level**: Provide meaningful error messages

### Error Types
- Authentication failures
- Network connectivity issues
- Invalid email addresses
- Attachment handling errors
- Rate limiting responses

### Response Format
```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```

## Security Considerations

### Authentication
- App-specific passwords recommended
- Environment variable protection
- No hardcoded credentials

### Data Protection
- Secure connection requirements (TLS/SSL)
- Minimal data retention
- Sensitive information handling

### Rate Limiting
- Built-in awareness of provider limits
- Bulk operation throttling
- Error backoff strategies

## Performance Optimizations

### Connection Management
- Connection pooling for SMTP
- Persistent IMAP connections
- Automatic connection cleanup

### Bulk Operations
- Batch processing for multiple emails
- Parallel processing where safe
- Progress tracking and reporting

### Caching Strategy
- Contact information caching
- Email metadata caching
- Connection state management

## Extensibility

### Provider Support
The architecture supports multiple email providers:
- Gmail (default)
- Outlook/Hotmail
- Yahoo Mail
- Custom SMTP/IMAP servers

### Plugin Architecture
Easy to extend with new functionality:
- Additional email operations
- New contact management features
- Integration with external services

### Configuration Flexibility
- Runtime configuration changes
- Multiple account support
- Provider-specific optimizations

## Testing Strategy

### Unit Tests
- Service method testing
- Error condition handling
- Configuration validation

### Integration Tests
- Email provider connectivity
- End-to-end operation testing
- Performance benchmarking

### Mock Services
- Development without real email accounts
- Consistent testing environments
- Error simulation capabilities

## Development Workflow

### Build Process
1. TypeScript compilation
2. Dependency bundling
3. Output validation

### Development Tools
- Hot reloading during development
- Comprehensive logging
- Debug mode capabilities

### Production Deployment
- Environment validation
- Service health checks
- Monitoring and alerting

## Future Enhancements

### Planned Features
- Email templates
- Advanced scheduling
- Email tracking
- Webhook integrations
- Multi-account support

### Scalability Improvements
- Database integration for contacts
- Queue-based email processing
- Distributed processing support
- Advanced caching mechanisms