# Email MCP Server — Commands Reference

This document lists all commands provided by the project, grouped by category. Each command includes a short purpose, a usage synopsis, options (when applicable), and examples. For top-level helper and installer commands see `docs/CLI_USAGE.md`.

## Basic commands

### email-send (alias: esend)

Purpose: Send a single email (up to 3 recipients). Use `email-bulk` for larger lists.

Synopsis:

```bash
email-send <to> <subject> <body> [html]
```

Options:

- None (positional arguments)

Examples:

```bash
email-send "user@example.com" "Meeting" "Here is the agenda"
esend "user1@example.com,user2@example.com" "Update" "Important update"
```

---

### email-read (alias: eread)

Purpose: Read recent emails from the inbox.

Synopsis:

```bash
email-read [count]
```

Options:

- `count` — Number of emails to retrieve (default: 10)

Examples:

```bash
eread
eread 5
```

---

### email-get (alias: eget)

Purpose: Get full details of a single email by id.

Synopsis:

```bash
email-get <email_id>
```

Example:

```bash
email-get 12345
```

---

### email-delete (alias: edelete)

Purpose: Permanently delete an email by id.

Synopsis:

```bash
email-delete <email_id> [--force|-f]
```

Options:

- `--force`, `-f` — skip confirmation

Example:

```bash
email-delete 12345
```

---

### email-mark-read (alias: emarkread)

Purpose: Mark an email read or unread.

Synopsis:

```bash
email-mark-read <email_id> <true|false>
```

Example:

```bash
email-mark-read 12345 true
```

---
 
## Advanced commands

### email-search (alias: esearch)

Purpose: Search emails with filters.

Synopsis:

```bash
email-search [--from <email>] [--to <email>] [--subject <text>] [--since <date>] [--before <date>] [--seen <true|false>] [--limit <n>]
```

Example:

```bash
email-search --from "boss@company.com" --since "2024-01-01"
```

---

### email-attach (alias: eattach)

Purpose: Send attachments with an email. Supports multiple comma-separated file paths.

Synopsis:

```bash
email-attach <to> <subject> <body> <attachment-paths> [attachment-names]
```

Example:

```bash
email-attach "team@company.com" "Files" "See attachments" "./a.pdf,./b.png"
```

---

### email-forward (alias: eforward)

Purpose: Forward an existing email to new recipients.

Synopsis:

```bash
email-forward <email_id> <to> [message]
```

Example:

```bash
email-forward 12345 "colleague@company.com" "Please review"
```

---

### email-reply (alias: ereply)

Purpose: Reply to an existing email.

Synopsis:

```bash
email-reply <email_id> <message>
```

Example:

```bash
email-reply 12345 "Thanks, I'll review"
```

---

### email-stats (alias: estats)

Purpose: Show account statistics (unread, total, top senders).

Synopsis:

```bash
email-stats
```

Example:

```bash
email-stats
```

---

### email-draft (alias: edraft)

Purpose: Create a draft message.

Synopsis:

```bash
email-draft <to> <subject> <body>
```

Example:

```bash
email-draft "client@example.com" "Draft" "Work in progress"
```

---

### email-schedule (alias: eschedule)

Purpose: Schedule an email for future delivery.

Synopsis:

```bash
email-schedule <to> <subject> <body> <time>
```

Examples:

```bash
email-schedule "team@company.com" "Reminder" "Meeting at 3" "2024-12-31T09:00:00Z"
email-schedule "client@example.com" "Follow-up" "Quick note" "+2h"
```

---

### email-bulk (alias: ebulk)

Purpose: Send personalized/bulk emails from a file or comma-separated list.

Synopsis:

```bash
email-bulk <recipients|file> <subject> <body>
```

Notes:

- If the first argument contains an `@` and commas, it's treated as a comma-separated list of recipients.
- If the first argument is a path to a file, it will read recipients line-by-line.

Examples:

```bash
email-bulk recipients.txt "Newsletter" "Content"
email-bulk user1@example.com,user2@example.com "Update" "Content"
```

## Contacts

### contact-add (alias: cadd)

Purpose: Add a contact to address book.

Synopsis:

```bash
contact-add <name> <email> [group]
```

Example:

```bash
contact-add "Jane Smith" "jane@example.com" "clients"
```

---

### contact-list (alias: clist)

Purpose: List contacts.

Synopsis:

```bash
contact-list [limit]
```

Example:

```bash
contact-list 50
```

---

### contact-search (alias: csearch)

Purpose: Search contacts.

Synopsis:

```bash
contact-search <query>
```

Example:

```bash
contact-search "company.com"
```

---

### contact-group (alias: cgroup)

Purpose: Show contacts in a specific group.

Synopsis:

```bash
contact-group <group>
```

Example:

```bash
contact-group "vip"
```

---

### contact-update (alias: cupdate)

Purpose: Update an existing contact field.

Synopsis:

```bash
contact-update <contact_id> <field> <value>
```

Example:

```bash
contact-update contact_123 email "new@example.com"
```

---

### contact-delete (alias: cdelete)

Purpose: Delete a contact.

Synopsis:

```bash
contact-delete <contact_id>
```

Example:

```bash
contact-delete contact_123
```

## Utility and helper commands

Purpose: Utility commands for inspecting available commands and getting help.

### list

Synopsis:

```bash
list
```

Use `list` to show an organized list of all commands with brief descriptions.

### README & help

- Use `--help` with any command for in-command usage.
- Many commands accept `--limit`, `--verbose`, and `--dry-run` flags where applicable.

---

## Examples and common workflows

- Send a quick email:

```bash
esend "user@example.com" "Hello" "Quick note"
```

- Bulk send from file:

```bash
email-bulk ./contacts/team.txt "Update" "Important message"
```

- Add a contact:

```bash
cadd "John Doe" "john@example.com" "work"
```

---

For troubleshooting, installation, and environment setup, see `docs/CLI_USAGE.md` and `troubleshooting.md`.
