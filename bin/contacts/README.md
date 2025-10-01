# Contact Management Operations

This folder contains CLI commands for managing your email contacts and address book. These tools help you organize, search, and maintain your contact information.

## Available Commands

### 👤 Contact Add (`contact-add.js` / `cadd`)
Add a new contact to your address book.

**Usage:**
```bash
contact-add <name> <email> [group]
cadd <name> <email> [group]
```

**Examples:**
```bash
contact-add "John Doe" "john@example.com" "work"
cadd "Jane Smith" "jane@personal.com" "friends"
cadd "Bob Wilson" "bob@company.com"  # Uses default group "general"
```

### 📋 Contact List (`contact-list.js` / `clist`)
Display all contacts in your address book.

**Usage:**
```bash
contact-list [limit]
clist [limit]
```

**Examples:**
```bash
contact-list      # Show default number of contacts
clist 50          # Show up to 50 contacts
contact-list 10   # Show only 10 contacts
```

### 🔍 Contact Search (`contact-search.js` / `csearch`)
Search contacts by name, email, or group.

**Usage:**
```bash
contact-search <query>
csearch <query>
```

**Search Types:**
- **Name search**: "John", "Smith"
- **Email search**: "gmail.com", "user@"
- **Group search**: "work", "friends"

**Examples:**
```bash
contact-search "John"        # Search by name
csearch "gmail.com"          # Search by email domain
contact-search "work"        # Search by group
```

### 👥 Contact Group (`contact-group.js` / `cgroup`)
Get all contacts in a specific group.

**Usage:**
```bash
contact-group <group-name>
cgroup <group-name>
```

**Common Groups:**
- work, friends, family, general
- clients, suppliers, team

**Examples:**
```bash
contact-group "work"     # Get all work contacts
cgroup "friends"         # Get all friends
contact-group "clients"  # Get all client contacts
```

### ✏️ Contact Update (`contact-update.js` / `cupdate`)
Update existing contact information.

**Usage:**
```bash
contact-update <contact-id> <field> <value>
cupdate <contact-id> <field> <value>
```

**Available Fields:**
- `name` - Full name of the contact
- `email` - Email address
- `phone` - Phone number
- `group` - Contact group

**Examples:**
```bash
contact-update 123 name "John Smith Jr."
cupdate 456 email "newemail@example.com"
contact-update 789 group "family"
cupdate 101 phone "+1-555-0123"
```

### 🗑️ Contact Delete (`contact-delete.js` / `cdelete`)
Remove a contact from your address book.

**Usage:**
```bash
contact-delete <contact-id> [--force]
cdelete <contact-id> [--force]
```

**Examples:**
```bash
contact-delete 123           # Shows confirmation prompt
cdelete 456 --force         # Skips confirmation
```

## Quick Reference

| Command | Short Alias | Description |
|---------|-------------|-------------|
| `contact-add` | `cadd` | Add a new contact |
| `contact-list` | `clist` | List all contacts |
| `contact-search` | `csearch` | Search contacts |
| `contact-group` | `cgroup` | Get contacts by group |
| `contact-update` | `cupdate` | Update contact info |
| `contact-delete` | `cdelete` | Delete a contact |

## Contact Information Fields

Each contact can store the following information:

| Field | Description | Required | Default |
|-------|-------------|----------|---------|
| `name` | Full name | Yes | - |
| `email` | Email address | Yes | - |
| `phone` | Phone number | No | - |
| `group` | Contact group | No | "general" |
| `id` | Unique identifier | Auto | System generated |

## Contact Groups

Organize your contacts using groups:

### Default Groups
- **general** - Default group for new contacts
- **work** - Work colleagues and business contacts
- **friends** - Personal friends
- **family** - Family members

### Custom Groups
You can create custom groups by simply using them:
- **clients** - Business clients
- **suppliers** - Vendors and suppliers
- **team** - Team members
- **vip** - Important contacts

## Contact Management Workflow

### Adding Contacts
1. Add basic contact: `cadd "Name" "email@example.com"`
2. Add with group: `cadd "Name" "email@example.com" "work"`
3. Update additional info: `cupdate <id> phone "+1-555-0123"`

### Organizing Contacts
1. List all contacts: `clist`
2. Group contacts: `cupdate <id> group "work"`
3. View by group: `cgroup "work"`

### Finding Contacts
1. Search by name: `csearch "John"`
2. Search by domain: `csearch "@company.com"`
3. List group: `cgroup "work"`

## Getting Help

All commands support the `--help` flag:

```bash
contact-add --help
cadd --help
```

## Data Storage

Contacts are stored locally and synchronized with your email account when possible. The system maintains:

- **Local Storage**: Fast access and offline availability
- **Backup**: Automatic backups of contact data
- **Sync**: Integration with email provider contacts (where supported)

## Import/Export

### Importing Contacts
```bash
# Import from CSV file (if supported)
contact-import contacts.csv
```

### Exporting Contacts
```bash
# Export to CSV file (if supported)
contact-export contacts.csv
```

## Error Handling

Common solutions:
- **Contact not found**: Verify contact ID with `clist`
- **Duplicate contact**: Use `contact-update` instead of `contact-add`
- **Invalid email**: Check email format (must contain @)
- **Permission denied**: Check file system permissions for contact storage

## Security Notes

- Contact data is stored locally and encrypted
- No contact information is shared without explicit permission
- Regular backups are recommended
- Use secure, unique contact IDs