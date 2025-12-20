# email-cli — top-level usage

This file documents only the top-level `email-cli` helper and installer commands. Full command reference (send, bulk, attach, contacts, etc.) lives in `docs/commands.md`.

## Synopsis

email-cli [subcommand] [options]

## Top-level subcommands

- setup [--force|-f] [--mask|--no-mask] [--use-keychain] [--test-send]
   - Run interactive setup to configure EMAIL_USER and EMAIL_PASS, attempt SMTP/IMAP auto-detection and verification, and persist recommended settings.
- update
   - Update the installed package to the latest version (uses npm/pnpm).

- help, -h
   - Show this usage information.

- --version, -v
   - Print CLI and package version information.

## Examples

Interactive setup (visible password by default):

```bash
email-cli setup
```

Mask password input and store in OS keychain (if available):

```bash
email-cli setup --mask --use-keychain --test-send
```

Non-interactive / CI example (provide credentials from environment or CI secrets):

```bash
# prefer using CI secrets or environment variables for EMAIL_PASS
email-cli setup --email-user ci-bot@example.com --email-pass "$CI_EMAIL_PASS" --ci --use-keychain --profile default
```

For full command documentation see `docs/commands.md` or run `email-cli --help` which prints the full commands reference.

For full command documentation see `docs/commands.md`.

<!-- End of top-level CLI usage. Detailed command reference moved to docs/commands.md -->



# Or create manual symlinks to /usr/local/bin/
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/email-send
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/esend  
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/list
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/cadd
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/email-cli contact-list
# ... (continue for all 40+ commands)
```

**Windows (Local Development):**
```cmd
# Run as Administrator in project directory
# email-cli — top-level usage

This file documents only the top-level `email-cli` helper and installer commands. For full command documentation run `email-cli --help` or see `docs/commands.md`.

## Synopsis

email-cli [subcommand] [options]

## Top-level subcommands

- setup
   - Configure credentials and SMTP/IMAP settings. Supports interactive and non-interactive modes.

- update
   - Update the installed package to the latest version.

- help, -h
   - Show this usage information. Running `email-cli --help` with no other arguments prints the full `docs/commands.md` reference.

- --version, -v
   - Print CLI and package version information.

## Global flags (supported by `email-cli` and `email-cli setup`)

- `--profile <name>` — store/load settings under a named profile (future multi-profile support).
- `--ci`, `--non-interactive` — run non-interactively; requires `--email-user` and `--email-pass` to be provided or set via environment variables.
- `--email-user <user>` — provide EMAIL_USER non-interactively.
- `--email-pass <pass>` — provide EMAIL_PASS non-interactively (prefer CI secrets; avoid shell history).

## Setup flags

- `--mask` — mask password input in interactive prompts.
- `--use-keychain` — attempt to store password in OS keyring (uses `keytar` when available). If successful, the CLI will avoid leaving the password in local files.
- `--test-send` — after verification, send a small test email to confirm end-to-end capability.
- `--force`, `-f` — overwrite existing persisted settings.

## Examples

Interactive setup:

```bash
email-cli setup
```

Masked interactive setup with keychain storage:

```bash
email-cli setup --mask --use-keychain --test-send
```

Non-interactive / CI example:

```bash
email-cli setup --email-user ci-bot@example.com --email-pass "$CI_EMAIL_PASS" --ci --use-keychain --profile default
```

For full command documentation, see `docs/commands.md` or run `email-cli --help`.
npm config set prefix ~/.local
export PATH=~/.local/bin:$PATH
```

#### Windows Path Issues
```cmd
# Check npm global directory
npm config get prefix

# Add to PATH if missing
setx PATH "%PATH%;%AppData%\npm"

# Restart terminal/command prompt
```

## 🔧 Environment Setup

Email MCP Server can be used in two ways with different configuration approaches:

### 🏠 **Local Development (Easy - .env file)**
### 🌍 **Global Installation (Complex - System Environment Variables)**

> **⚠️ IMPORTANT PLATFORM NOTE:**  
> Environment variable commands are **platform-specific**:
> - **Linux/macOS/WSL:** Use `export VAR="value"`
> - **Windows PowerShell:** Use `$env:VAR = "value"` or `[Environment]::SetEnvironmentVariable()`
> - **Windows CMD:** Use `set VAR=value` or `setx VAR "value"`
> 
> **Do NOT use `export` commands on Windows** - they will not work!

---

## 🏠 **Local Development Setup (EASY)**

# email-cli — top-level usage

This file documents only the top-level `email-cli` helper and installer commands. Full command reference (send, bulk, attach, contacts, etc.) lives in `docs/commands.md` and is printed by `email-cli --help`.

## 📋 Quick Start: Setup Command

**The easiest way to get started is with the interactive setup wizard:**

```bash
email-cli setup
```

This interactive wizard will:
- ✅ Ask for your email credentials (with masked password input)
- ✅ Auto-detect SMTP/IMAP settings for popular providers (Gmail, Outlook, Yahoo, iCloud)
- ✅ Save configuration locally or globally (your choice)
- ✅ Guide you through the entire process step-by-step

**No manual environment variable configuration needed!**

### Setup Wizard Features

The `email-cli setup` command provides:

1. **Auto-Detection**: Automatically configures settings for:
   - Gmail (smtp.gmail.com / imap.gmail.com)
   - Outlook/Hotmail (smtp-mail.outlook.com / outlook.office365.com)
   - Yahoo (smtp.mail.yahoo.com / imap.mail.yahoo.com)
   - iCloud (smtp.mail.me.com / imap.mail.me.com)
   - Custom SMTP/IMAP servers

2. **Flexible Storage Options**:
   - **Local**: `.env` file (development, project-specific)
   - **Global**: System environment variables (production, permanent)
     - Linux: `~/.bashrc` or `~/.zshrc`
     - macOS: `~/.zshrc`
     - Windows: System Environment Variables
   - **Both**: Maximum compatibility

3. **Security Features**:
   - Masked password input (shows `*****`)
   - Validates email format
   - Secure storage in shell profiles

### Setup Example

```bash
$ email-cli setup

╔════════════════════════════════════════════╗
║     📧 Email CLI Configuration Setup      ║
╚════════════════════════════════════════════╝

Step 1/3: Email Credentials
──────────────────────────────────────────────────
📧 Email address: user@gmail.com
🔑 Password/App Password: **********
✓ Credentials saved

Step 2/3: Server Configuration
──────────────────────────────────────────────────
✓ Auto-detected settings for gmail.com

  SMTP Server: smtp.gmail.com:587
  IMAP Server: imap.gmail.com:993

Use these settings? [Y/n]: Y
✓ Using auto-detected settings

Step 3/3: Save Configuration
──────────────────────────────────────────────────
  [1] 📁 Local (.env file)
  [2] 🌍 Global (System environment)
  [3] 📁 + 🌍 Both locations

Select option [1-3]: 3

Saving to .env file... ✓
Saving to ~/.zshrc... ✓

╔════════════════════════════════════════════╗
║          ✓ Setup Completed!                ║
╚════════════════════════════════════════════╝

⚠️  Action Required:
  → Run: source ~/.zshrc
  → Or restart your terminal

📋 Next Steps:

Test your configuration:
  $ email-cli send recipient@example.com "Test" "Hello!"

View all commands:
  $ email-cli --help
```

---

## 📋 Important: Environment Configuration

**The MCP server and CLI use the same environment configuration!**

📖 **[Complete Configuration Guide](CONFIGURATION.md)** - Comprehensive setup for all platforms

### Configuration Methods:

**Option 1: Use Setup Wizard (Recommended)**
```bash
email-cli setup
```

**Option 2: Manual Configuration**
- **Local Development**: Use `.env` file in project directory (both server & CLI)
- **Global Installation**: Set environment variables in shell profile or system settings
  - Linux: `~/.bashrc`
  - macOS: `~/.zshrc`
  - Windows: System Environment Variables or PowerShell `$PROFILE`

---

## Synopsis

email-cli [subcommand] [options]

## Top-level subcommands

- setup
  - Interactive wizard to configure email credentials and SMTP/IMAP settings
  - Auto-detects popular providers (Gmail, Outlook, Yahoo, iCloud)
  - Saves configuration locally (.env) or globally (system environment)
  - Supports custom SMTP/IMAP servers
  - **Recommended**: Start here for first-time setup

- update
  - Update the installed package to the latest version (uses npm/pnpm).

- help, -h
  - Show this usage information or run `email-cli --help` with no args to print the full `docs/commands.md` reference.

- --version, -v
  - Print CLI and package version information.

## Setup Command Details

The `setup` command provides an interactive wizard for easy configuration:

**Basic Usage:**
```bash
email-cli setup
```

**What it configures:**
- EMAIL_USER: Your email address
- EMAIL_PASS: Your password or app password
- SMTP_HOST: SMTP server address (auto-detected or manual)
- SMTP_PORT: SMTP port (default: 587)
- IMAP_HOST: IMAP server address (auto-detected or manual)
- IMAP_PORT: IMAP port (default: 993)
- EMAIL_FROM: Sender address (defaults to EMAIL_USER)
- IMAP_TLS: Enable TLS for IMAP (default: true)
- SMTP_SECURE: SMTP security mode (default: false, uses STARTTLS)

**Supported Email Providers:**
- ✅ Gmail (gmail.com) - **Requires App Password**
- ✅ Outlook/Hotmail (outlook.com, hotmail.com)
- ✅ Yahoo Mail (yahoo.com)
- ✅ iCloud (icloud.com)
- ✅ Custom SMTP/IMAP servers

**Platform Support:**
- ✅ Linux (saves to ~/.bashrc or ~/.zshrc)
- ✅ macOS (saves to ~/.zshrc)
- ✅ Windows (saves to System Environment Variables)
- ✅ WSL (same as Linux)

## Global flags (supported by `email-cli` and `email-cli setup`)

- `--profile <name>` — (future multi-profile) save/apply settings under a named profile.
- `--ci`, `--non-interactive` — run non-interactively; requires `--email-user` and `--email-pass` to be provided or set via environment variables.
- `--email-user <user>` — provide EMAIL_USER non-interactively.
- `--email-pass <pass>` — provide EMAIL_PASS non-interactively (be careful with shell history; prefer CI secrets).

## Setup flags (interactive or non-interactive)

- `--mask` — mask password input during interactive prompt.
- `--use-keychain` — attempt to store password securely in the OS keychain (uses `keytar` if available). On success the CLI will avoid leaving the password in local files.
- `--test-send` — after verification, send a small test email to confirm end-to-end send capability.
- `--force`, `-f` — overwrite existing persisted settings.

## Examples

Interactive setup (visible password by default):

```bash
email-cli setup
```

Masked password input and store in OS keychain (if available):

```bash
email-cli setup --mask --use-keychain --test-send
```

Non-interactive / CI example (provide credentials from environment or CI secrets):

```bash
# prefer using CI secrets or environment variables for EMAIL_PASS
email-cli setup --email-user ci-bot@example.com --email-pass "$CI_EMAIL_PASS" --ci --use-keychain --profile default
```

For full command documentation see `docs/commands.md` or run `email-cli --help`.

**🔧 Method 2: Regular PowerShell (User-level)**

```powershell
# Temporary (current session only)
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_SECURE = "false"
$env:EMAIL_USER = "your-email@gmail.com"
$env:EMAIL_PASS = "your-app-password"
$env:IMAP_HOST = "imap.gmail.com"
$env:IMAP_PORT = "993"
$env:IMAP_TLS = "true"
$env:SMTP_REJECT_UNAUTHORIZED=false
$env:IMAP_REJECT_UNAUTHORIZED=false
$env:IMAP_CONN_TIMEOUT=60000
$env:IMAP_AUTH_TIMEOUT=30000

# Permanent setup (User-level only)
[Environment]::SetEnvironmentVariable("SMTP_HOST", "smtp.gmail.com", "User")
[Environment]::SetEnvironmentVariable("SMTP_PORT", "587", "User")
[Environment]::SetEnvironmentVariable("SMTP_SECURE", "false", "User")
[Environment]::SetEnvironmentVariable("EMAIL_USER", "your-email@gmail.com", "User")
[Environment]::SetEnvironmentVariable("EMAIL_PASS", "your-app-password", "User")
[Environment]::SetEnvironmentVariable("IMAP_HOST", "imap.gmail.com", "User")
[Environment]::SetEnvironmentVariable("IMAP_PORT", "993", "User")
[Environment]::SetEnvironmentVariable("IMAP_TLS", "true", "User")
[Environment]::SetEnvironmentVariable("SMTP_REJECT_UNAUTHORIZED", "false", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_REJECT_UNAUTHORIZED", "false", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_CONN_TIMEOUT", "60000", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_AUTH_TIMEOUT", "60000", "Machine")

# IMPORTANT: Restart PowerShell after setting permanent variables
```

**🎯 Which PowerShell Method to Choose?**

| Method | Admin Required | Scope | Best For |
|--------|----------------|-------|----------|
| **Administrator** | Yes | Machine-wide | ✅ **Global CLI usage (RECOMMENDED)** |
| **Regular User** | No | User-only | Local development, testing |

**💡 Tip:** Use **Administrator method** for the email CLI - it's the proper way to set up global CLI tools!

#### **🖥️ Windows Command Prompt**
```cmd
# Temporary (current session only)
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_SECURE=false
set EMAIL_USER=your-email@gmail.com
set EMAIL_PASS=your-app-password
set IMAP_HOST=imap.gmail.com
set IMAP_PORT=993
set IMAP_TLS=true

# Permanent setup (User-level)
setx SMTP_HOST "smtp.gmail.com"
setx SMTP_PORT "587"
setx SMTP_SECURE "false"
setx EMAIL_USER "your-email@gmail.com"
setx EMAIL_PASS "your-app-password"
setx IMAP_HOST "imap.gmail.com"
setx IMAP_PORT "993"
setx IMAP_TLS "true"

# Restart Command Prompt to load permanent variables
```

### 🔄 **Platform Compatibility Summary**

| Platform | Temporary Command | Permanent Method | Shell Restart Required |
|----------|-------------------|------------------|----------------------|
| **Linux/macOS/WSL** | `export VAR="value"` | Add to `~/.bashrc` | `source ~/.bashrc` |
| **Windows PowerShell** | `$env:VAR = "value"` | `[Environment]::SetEnvironmentVariable()` | Yes |
| **Windows CMD** | `set VAR=value` | `setx VAR "value"` | Yes |

### **Step 4: Use Global Commands**
```bash
# After global setup, commands work from anywhere
email-cli --version
email-cli send "user@example.com" "Subject" "Body"
email-cli esend "user@example.com" "Subject" "Body"
email-cli stats
```

**🚨 Global Installation Challenges:**
- ❌ Platform-specific environment variable syntax
- ❌ System-wide configuration required
- ❌ Windows PATH issues with npm
- ❌ Requires admin privileges on some systems
- ❌ Environment persists system-wide
- ❌ Harder to manage multiple email accounts

---

## 🤔 **Which Method Should You Choose?**

| Factor | Local Development (.env) | Global Installation |
|--------|--------------------------|-------------------|
| **Ease of Setup** | ✅ Very Easy | ❌ Complex |
| **Platform Compatibility** | ✅ Universal | ❌ Platform-specific |
| **Admin Rights Required** | ✅ No | ❌ Often yes |
| **Multiple Accounts** | ✅ Easy (different .env files) | ❌ Difficult |
| **System Impact** | ✅ None | ❌ System-wide changes |
| **Command Usage** | `node email-cli.js command` | `command` directly |
| **Recommended For** | Development, Testing, Projects | Daily use, Production |

### **💡 Recommendations**

**🎯 For Most Users:** Start with **Local Development** method
- Easier setup process  
- No system configuration headaches
- Perfect for trying out the CLI
- Can always switch to global later

**🎯 For Power Users:** Use **Global Installation** if you:
- Use email CLI daily across multiple projects
- Don't mind complex environment setup
- Want shortest possible commands
- Are comfortable with system administration

**⚠️ Critical Platform Warning:** 
- The `export` command **ONLY works on Unix-like systems** (Linux/macOS/WSL)
- **Windows users MUST use** `$env:` (PowerShell) or `set`/`setx` (CMD)
- **Common Error:** Using `export` in Windows Command Prompt or PowerShell will fail

### 🚨 **Common Platform Issues & Solutions**

#### **Windows-Specific Issues:**

**Problem 1:** `The system cannot find the path specified` or `'email-send' is not recognized`

**Solution A: Administrator PowerShell Fix (RECOMMENDED)**
```powershell
# 1. Right-click PowerShell → "Run as Administrator"
# 2. Check if package is installed globally
npm list -g @0xshariq/email-mcp-server

# 3. Add npm global path to system PATH (Machine-level)
$npmPath = npm config get prefix
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "Machine")

# 4. Close admin PowerShell, open regular PowerShell
# 5. Test: email-cli --version
```

**Solution B: Alternative Fixes**
```powershell
# Quick workaround - use npx
npx @0xshariq/email-mcp-server email-send "test@example.com" "Subject" "Body"

# Check current PATH
npm config get prefix
echo $env:PATH

# Reinstall if needed
npm uninstall -g @0xshariq/email-mcp-server
npm install -g @0xshariq/email-mcp-server

# User-level PATH fix (less reliable)
$npmPath = npm config get prefix
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "User")
```

**Problem 2:** `'export' is not recognized as an internal or external command`
```
Solution: You're using Unix commands on Windows. Use Windows-specific commands:
- PowerShell: $env:SMTP_HOST = "smtp.gmail.com" 
- CMD: set SMTP_HOST=smtp.gmail.com
```

**Problem 3:** Environment variables not persisting after restart
```
Solution: Use permanent setup commands:
- Linux/macOS: Add export commands to ~/.bashrc or ~/.zshrc
- Windows PowerShell: Use [Environment]::SetEnvironmentVariable() with "User" or "Machine"
- Windows CMD: Use setx command
- ALWAYS restart terminal after setting permanent variables
```

**Problem 4:** Commands work in one terminal but not another
```
Solution: Restart ALL terminal windows after setting permanent variables
- Close all PowerShell/CMD windows
- Open new terminal
- Test with: echo $env:EMAIL_USER (PowerShell) or echo %EMAIL_USER% (CMD)
```

#### **Cross-Platform Issues:**

**Problem:** Environment variables not detected by CLI
```bash
# Test if variables are set:
# Linux/macOS: echo $EMAIL_USER
# Windows PS: echo $env:EMAIL_USER  
# Windows CMD: echo %EMAIL_USER%

# If not set, use temporary setup first, then permanent
```

### 📧 Gmail App Password Setup:
1. **Enable 2-Factor Authentication** in your Google Account
2. Go to **Google Account → Security → App Passwords**
3. Select **Mail** and generate a 16-character password
4. Use this generated password in `EMAIL_PASS` (not your regular Gmail password)

### 🔍 Verify Environment Setup:

**Check if variables are set:**
```powershell
# PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "*EMAIL*" -or $_.Name -like "*SMTP*" -or $_.Name -like "*IMAP*"}

# Command Prompt  
set | findstr /i "EMAIL SMTP IMAP"

# Linux/macOS
env | grep -E "(EMAIL|SMTP|IMAP)"
```

**Test with a command:**
```bash
# Should show your configured email account
email-cli stats
email-cli --version
```

### � Quick Start

## **⚡ 5-Minute Local Setup (EASY - Recommended)**

```bash
# 1. Get the code (local development)
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server
npm install && npm run build

# 2. Create .env file
cp .env.example .env  # Linux/macOS
# OR copy .env.example .env  # Windows

# 3. Edit .env with your email settings
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password

# 4. Test it works
node email-cli.js --version        # Check version + config
node email-cli.js                  # List emails
node email-cli.js email-send "test@example.com" "Hello" "Test"
```

## **🌍 Global Setup (COMPLEX - Advanced Users)**

```bash
# 1. Install globally
npm install -g @0xshariq/email-mcp-server

# 2. Set system environment variables (see platform-specific instructions above)

# 3. Fix Windows PATH issues (if on Windows):
npx @0xshariq/email-mcp-server email-cli --version  # Workaround

# 4. Test global commands
email-cli --version               # Should work globally
email-cli send "test@example.com" "Hello" "Test message"
```

**Complete Setup Examples by Platform:**

**Linux/macOS/WSL:**
```bash
# 1. Set Gmail environment variables
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587" 
export SMTP_SECURE="false"
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
export IMAP_TLS="true"

# 2. Test the setup
email-cli read                   # View recent emails
email-cli stats                  # Check account info
```

**Windows PowerShell (Administrator Setup):**
```powershell
# 1. Verify environment variables are set (Machine-level)
# Open regular PowerShell (not admin) and check:
echo $env:EMAIL_USER    # Should show: your-email@gmail.com
echo $env:SMTP_HOST     # Should show: smtp.gmail.com

# 2. If variables not showing, set them as Administrator:
# Right-click PowerShell → "Run as Administrator", then:
[Environment]::SetEnvironmentVariable("EMAIL_USER", "your-email@gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_HOST", "smtp.gmail.com", "Machine")
# ... (set all other variables)

# 3. Fix PATH if commands not found:
# In Administrator PowerShell, run ALL these commands:
$npmPath = npm config get prefix
$npmBinPath = "$npmPath"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmBinPath, "Machine")

# 4. IMPORTANT: Close ALL PowerShell windows and restart your computer
# This ensures the Machine-level PATH changes take effect

# 5. After restart, test in regular PowerShell:
email-cli --version          # Should show version + your email
email-cli                    # View recent emails
where.exe email-send         # Should show the command location

# 6. If STILL not working after restart, try this complete PATH fix:
# In Administrator PowerShell:
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
$npmPrefix = npm config get prefix
$newPath = $currentPath + ";" + $npmPrefix
[Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")

# 7. Verify PATH was updated:
[Environment]::GetEnvironmentVariable("PATH", "Machine") | Select-String "npm"

# 8. Backup option - use npx if PATH issues persist:
npx @0xshariq/email-mcp-server email-cli --version
npx @0xshariq/email-mcp-server email-send "test@example.com" "Test" "Hello"
```

**🚨 Windows PATH Troubleshooting:**

If you're seeing "Unknown command" errors like in your screenshot:

```powershell
# Step 1: Check if package is installed
npm list -g @0xshariq/email-mcp-server

# Step 2: Find npm global directory
npm config get prefix
# Result should be: C:\Users\[username]\AppData\Roaming\npm

# Step 3: Check if commands exist in that directory
dir "C:\Users\khans\AppData\Roaming\npm" | findstr email

# Step 4: In Administrator PowerShell, add the EXACT path:
$exactPath = "C:\Users\khans\AppData\Roaming\npm"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $exactPath, "Machine")

# Step 5: Restart computer (required for Machine-level PATH changes)

# Step 6: Test after restart:
email-cli --version
```

**🎯 Administrator Setup Benefits:**
- ✅ **Permanent solution** - No repeated configuration needed
- ✅ **System-wide access** - Works from any directory/user
- ✅ **Professional setup** - Industry standard approach  
- ✅ **No conflicts** - Avoids user-level permission issues

**Windows Command Prompt:**
```cmd
# 1. Set Gmail environment variables (temporary)
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_SECURE=false
set EMAIL_USER=your-email@gmail.com
set EMAIL_PASS=your-app-password
set IMAP_HOST=imap.gmail.com
set IMAP_PORT=993
set IMAP_TLS=true

# 2. Test the setup
email-cli read                   # View recent emails
email-cli stats                  # Check account info
```

## 📧 Basic Email Operations

### 📤 Send Email (`send` / `esend`)
Send emails to up to 3 recipients with optional HTML content. For more recipients, use `bulk`.

```bash
# Basic usage
email-cli send "user@example.com" "Subject" "Email body"
email-cli esend "user@example.com" "Meeting Reminder" "Team meeting at 3 PM today"

# Multiple recipients (up to 3)
email-cli send "user1@example.com,user2@example.com,user3@example.com" "Update" "Important update for everyone"

# With HTML content
email-cli esend "client@example.com" "Newsletter" "Plain text version" "<h1>HTML Newsletter</h1><p>Rich content here</p>"
```

**Arguments:**
- `to` - Recipient email(s), comma-separated (max 3 recipients)
- `subject` - Email subject line  
- `body` - Plain text message body
- `html` - Optional HTML content

**Note:** For more than 3 recipients, use the `email-bulk` command instead.

### 📬 Read Recent Emails (`email-read` / `eread`)
Retrieve and display recent emails from your inbox.

```bash
# Read default (10) emails
email-cli read
email-cli eread

# Read specific number
eread 5              # Read 5 recent emails
email-cli read 25        # Read 25 recent emails
```

**Arguments:**
- `count` - Number of emails to retrieve (default: 10)

### 📄 Get Specific Email (`email-get` / `eget`)
Retrieve detailed information about a specific email by ID.

```bash
# Get email details
email-cli get 12345
email-cli eget 67890

# Use with email IDs from email-read
eread 5              # Shows email IDs
email-cli eget <id-from-above>  # Get specific email
```

**Arguments:**
- `email_id` - Unique email identifier from email-read

### 🗑️ Delete Email (`email-delete` / `edelete`)
Permanently delete emails from your inbox.

```bash
# Interactive delete (asks for confirmation)
email-cli delete 12345
email-cli edelete 67890

# Force delete (no confirmation)
email-cli edelete 12345 --force
email-cli delete 67890 -f
```

**Arguments:**
- `email_id` - Email ID to delete
- `--force` / `-f` - Skip confirmation prompt

### ✅ Mark Email Read/Unread (`email-mark-read` / `emarkread`)
Change the read status of emails.

```bash
# Mark as read
email-cli mark-read 12345 true
email-cli emarkread 67890 true

# Mark as unread
email-cli mark-read 12345 false
email-cli emarkread 67890 false
```

**Arguments:**
- `email_id` - Email ID to update
- `read_status` - `true` (read) or `false` (unread)

### 📋 List All Commands (`list`)
Display all available CLI commands with descriptions and aliases.

```bash
# Show all commands
list

# Example output shows:
# - Basic email operations (send, read, get, delete, etc.)
# - Advanced operations (search, attach, forward, etc.)  
# - Contact management (add, list, search, etc.)
# - Both full names and short aliases
```

**Features:**
- **Organized by category** - Basic, Advanced, Contacts
- **Shows aliases** - Both full and short command names
- **Usage hints** - Quick examples for each command type
- **No arguments needed** - Just run `list` to see all commands  
email-cli emarkread 12345 false
email-cli mark-read 67890 unread
```

**Arguments:**
- `email_id` - Email ID to update
- `status` - `true`/`read` or `false`/`unread`

## 🚀 Advanced Email Operations

### 🔍 Search Emails (`email-search` / `esearch`)
Search emails with advanced filters and criteria.

```bash
# Search by sender
email-cli search --from "boss@company.com"
email-cli esearch --from "important@client.com" --limit 5

# Search by subject and date
email-cli esearch --subject "meeting" --since "2024-01-01"
email-cli search --subject "invoice" --before "2024-12-31"

# Search unread emails
email-cli esearch --seen false --limit 10
email-cli search --from "@company.com" --seen false

# Complex searches
email-cli esearch --to "me@company.com" --flagged true --since "2024-10-01"
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
Send emails with unlimited file attachments (comma-separated paths and optional custom names).

```bash
# Single attachment
email-cli attach "user@example.com" "Report" "Please find attached report" "./report.pdf"

# Multiple attachments with custom names
email-cli attach "user@example.com" "Files" "Multiple files attached" "./file1.pdf,./file2.jpg,./data.xlsx" "Report,Photo,Spreadsheet"

# Multiple attachments without custom names (uses original filenames)
email-cli eattach "team@company.com" "Resources" "Project files" "./code.js,./docs.pdf,./image.png"

# Complex example with full paths
email-cli attach "client@example.com" "Deliverables" "Final project files" "/home/user/final.pdf,/home/user/code.zip,/home/user/demo.mp4" "Final Report,Source Code,Demo Video"
```

**Arguments:**
- `to` - Recipient email address
- `subject` - Email subject line
- `body` - Email message body
- `attachment-paths` - Comma-separated file paths (unlimited)
- `attachment-names` - Optional comma-separated custom names (must match order)

**Features:**
- **Unlimited attachments**: No limit on number of files
- **Custom naming**: Override default filenames with custom names
- **Auto-detection**: Automatic MIME type detection
- **Size validation**: Total size limit depends on email provider (Gmail: 25MB)

### ↪️ Forward Email (`email-forward` / `eforward`)
Forward existing emails to new recipients with additional message.

```bash
# Basic forwarding
email-cli forward 12345 "colleague@company.com" "Please review this email"
email-cli eforward 67890 "team@company.com" "FYI - important update"

# Forward without additional message
email-cli eforward 12345 "manager@company.com"
```

**Arguments:**
- `email_id` - ID of email to forward
- `to_email` - Recipient email address
- `message` - Additional forwarding message (optional)

### 💬 Reply to Email (`email-reply` / `ereply`)
Reply to existing emails with automatic threading.

```bash
# Simple reply
email-cli reply 12345 "Thank you for the information"
email-cli ereply 67890 "I'll review this and get back to you"

# Reply with confirmation
email-cli ereply 12345 "Confirmed - I'll attend the meeting"
```

**Arguments:**
- `email_id` - ID of email to reply to
- `message` - Reply message content

### 📊 Email Statistics (`email-stats` / `estats`)
Get comprehensive statistics about your email account.

```bash
# Get account statistics
email-cli stats
email-cli estats
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
email-cli draft "client@example.com" "Proposal Draft" "Initial proposal content..."
email-cli edraft "team@company.com" "Meeting Notes" "Draft meeting notes from today"

# Create detailed draft
email-cli edraft "important@client.com" "Project Update" "Quarterly project status and next steps"
```

**Arguments:**
- `to` - Recipient email address
- `subject` - Draft subject line
- `body` - Draft message content

### ⏰ Schedule Email (`email-schedule` / `eschedule`)
Schedule emails for future delivery with flexible time formats.

```bash
# Schedule with ISO timestamp
email-cli schedule "team@company.com" "Weekly Report" "Report content" "2024-12-31T09:00:00Z"

# Schedule with relative time  
email-cli eschedule "client@example.com" "Follow-up" "Following up on our meeting" "+2h"
email-cli eschedule "all@company.com" "Newsletter" "Monthly newsletter" "+1d"

# Schedule for specific date/time
email-cli schedule "hr@company.com" "Reminder" "Deadline reminder" "2024-12-25T08:00:00Z"
```

**Time Formats:**
- ISO Format: `2024-12-31T09:00:00Z`
- Relative: `+1h` (1 hour), `+30m` (30 min), `+1d` (1 day), `+1w` (1 week)

### 📤 Bulk Send (`email-bulk` / `ebulk`)
Send personalized emails to multiple recipients from a file or comma-separated list.

```bash
# Send to recipients from file
email-cli bulk recipients.txt "Newsletter" "Monthly company newsletter content"
email-cli ebulk team-emails.txt "Meeting Reminder" "Team meeting tomorrow at 2 PM"

# Send to comma-separated email addresses (no quotes needed)
email-cli bulk user1@example.com,user2@example.com,user3@example.com "Update" "Important announcement"
email-cli ebulk alice@company.com,bob@company.com,charlie@company.com "Meeting" "Team meeting at 3 PM"

# With custom recipient file
email-cli ebulk ./contacts/vip-clients.txt "Important Update" "Exclusive client update"
```

**Recipients File Format:**
```
user1@example.com
user2@company.com  
client@important.com
team@startup.com
```

**Comma-Separated Format:**
```bash
# No spaces around commas (optional)
user1@example.com,user2@example.com,user3@example.com

# Spaces around commas (also supported)  
user1@example.com, user2@example.com, user3@example.com
```

**Input Methods:**
- **File Input**: Text file with one email per line
- **Comma-Separated**: Direct email list in command (no quotes needed)
- **Auto-Detection**: Automatically detects input type based on @ symbol presence

**Features:**
- Progress tracking for large lists
- Error handling for invalid emails
- Delivery confirmation reporting
- Rate limiting to avoid spam filters
- Flexible input: supports both file and direct email list

## 👥 Contact Management

### 👤 Add Contact (`contact-add` / `cadd`)
Add new contacts to your address book with groups and additional information.

```bash
# Basic contact
email-cli contact-add "John Doe" "john@example.com"
email-cli cadd "Jane Smith" "jane@company.com" "work"

# With specific groups
email-cli cadd "Important Client" "client@example.com" "vip"
email-cli contact-add "Team Lead" "lead@company.com" "management"

# Various groups
email-cli cadd "Family Member" "family@personal.com" "family"
email-cli cadd "Freelancer" "dev@freelance.com" "contractors"
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
email-cli email-cli contact-list
email-cli clist

# List specific number
email-cli clist 50             # Show 50 contacts
email-cli contact-list 10      # Show 10 contacts

# List all contacts
email-cli clist 999            # Show maximum contacts
```

**Arguments:**
- `limit` - Maximum contacts to display (default: 20)

### 🔍 Search Contacts (`contact-search` / `csearch`)
Search contacts by name, email domain, or any text.

```bash
# Search by name
email-cli contact-search "john"
email-cli csearch "jane"

# Search by email domain
email-cli csearch "@company.com"        # All company contacts
email-cli csearch "@gmail.com"         # All Gmail contacts

# Search by partial email
email-cli csearch "support@"           # All support emails

# Search by any text
email-cli csearch "client"             # Contacts with "client" in name/email
```

**Arguments:**
- `query` - Search term (name, email, or partial text)

**Search Examples:**
- Names: "john", "smith", "jane doe"
- Domains: "@company.com", "@gmail.com"
- Partials: "support@", "admin@", "sales@"
### 👥 Contacts by Group (`contact-group` / `cgroup`)
Get all contacts belonging to a specific group.

```bash
# Get work contacts
email-cli contact-group "work"
email-cli cgroup "clients"

# Get specific groups  
email-cli cgroup "family"
email-cli contact-group "vip"
email-cli cgroup "management"
email-cli cgroup "developers"

# View all available groups
email-cli cgroup --help    # Shows available groups if any
```

**Arguments:**
- `group` - Group name to filter contacts

**Common Groups:**
- "work", "clients", "family", "friends"
- "vip", "management", "developers", "support"

### ✏️ Update Contact (`contact-update` / `cupdate`)
Update existing contact information including name, email, phone, and group.

```bash
# Update name
email-cli contact-update contact_123 name "John Smith Jr."
email-cli cupdate contact_456 name "Jane Smith-Johnson"

# Update email
email-cli cupdate contact_123 email "newemail@example.com"
email-cli contact-update contact_456 email "updated@company.com"

# Update phone number
email-cli cupdate contact_123 phone "+1-555-0123"
email-cli contact-update contact_789 phone "555.123.4567"

# Update group assignment
email-cli cupdate contact_789 group "management"
email-cli contact-update contact_101 group "vip"
email-cli cupdate contact_202 group "developers"

# Clear a field (set to empty)
email-cli cupdate contact_123 phone ""
email-cli cupdate contact_456 group ""
```

**Arguments:**
- `contact_id` - ID of contact to update (get from `contact-list`)
- `field` - Field to update: `name`, `email`, `phone`, `group`  
- `value` - New value for the field (use empty string to clear)

**Update Examples:**
- Names: "John Smith", "Jane Doe-Johnson", "Dr. Smith"
- Emails: "new@company.com", "personal@gmail.com"
- Phones: "+1-555-0123", "555.123.4567", "(555) 123-4567"
- Groups: "work", "family", "clients", "vip"

### 🗑️ Delete Contact (`contact-delete` / `cdelete`)
Remove contacts from your address book with confirmation.

```bash
# Delete by contact ID
email-cli contact-delete contact_123
email-cli cdelete contact_456

# Delete with confirmation
email-cli cdelete contact_789    # Will prompt for confirmation

# Batch delete (if supported)
email-cli contact-delete contact_123 contact_456 contact_789
```

**Arguments:**
- `contact_id` - ID of contact to delete (get from `contact-list`)

**Safety Features:**
- Prompts for confirmation before deletion
- Shows contact details before deleting
- Cannot be undone - use carefully

---

## 🆘 Help System

Every command has comprehensive help documentation built-in:

```bash
# General CLI help
email-cli --help
email-cli -h

# Basic command help
email-cli send --help          # Send email help
list --help               # List emails help  
email-cli read --help         # Read email help
email-cli reply --help        # Reply help

# Advanced command help
email-cli attach --help       # Attachment help
email-cli forward --help      # Forward help
email-cli search --help       # Search help

# Contact management help
email-cli email-cli contact-add --help        # Add contact help
email-cli contact-list --help       # List contacts help
email-cli contact-search --help     # Search contacts help

# Help works with all aliases
email-cli esend -h                  # Same as email-cli send --help
eread --help             # Same as email-cli read --help
email-cli cadd -h                  # Same as email-cli contact-add --help
```

**Help Information Includes:**
- ✅ Command usage syntax and examples
- 📝 Detailed argument descriptions  
- 🔧 Available options and flags
- 💡 Practical usage examples
- 🔗 Related commands and workflows
- ⚠️ Important notes and limitations

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
# 1. Morning email check
email-cli list --unread              # See unread emails
email-cli list 10                    # Show latest 10 emails
email-cli stats               # Get inbox statistics

# 2. Read important emails  
email-cli read 1              # Read newest email
eread --id email_12345    # Read specific email

# 3. Send quick updates
email-cli esend "team@company.com" "Daily Standup" "Today's priorities and blockers"
email-cli esend "boss@company.com" "Status Update" "Project on track, will deliver by Friday"

# 4. Follow up on important emails
email-cli esearch --from "client@company.com" --unread
email-cli esearch --subject "urgent" --since "today"
```

### Contact Management Workflow  
```bash
# 1. Add new business contacts
email-cli cadd "Jane Smith" "jane@newclient.com" "clients"
email-cli contact-add "John Developer" "john.dev@company.com" "developers" "+1-555-0199"

# 2. Organize and manage contacts
email-cli contact-list              # See all contacts
email-cli cgroup "work"             # Check work contacts  
email-cli csearch "gmail.com"       # Find Gmail contacts
email-cli csearch "manager"         # Search by role/name

# 3. Update contact information
email-cli cupdate contact_123 group "vip"           # Promote to VIP
email-cli contact-update contact_456 phone "+1-555-0200"  # Update phone
email-cli cupdate contact_789 email "newemail@company.com"  # Update email
```

### Advanced Email Operations
```bash
# 1. Handle attachments
email-cli attach "client@company.com" "Contract Review" "Please review attached contract" "contract.pdf"
email-cli eattach "team@company.com" "Resources" "Meeting materials" "agenda.pdf,slides.ppt,notes.txt"

# 2. Email management and organization
email-cli esearch --subject "invoice" --since "2024-01-01"    # Find invoices
email-cli esearch --from "support@" --unread                  # Unread support emails
email-cli forward 12345 "accounting@company.com" "Please process this invoice"

# 3. Bulk operations (when available)
email-cli ebulk newsletter-list.txt "Monthly Update" "Our latest news and updates"
email-cli bulk subscribers.txt "Product Launch" "Exciting new features available!"

# 4. Advanced search and filtering
email-cli esearch --subject "meeting" --since "last week"     # Recent meeting emails
email-cli esearch --has-attachment --from "@company.com"      # Company emails with files
email-cli esearch --flagged --priority high                   # Important flagged emails
```

### Complete Project Communication Workflow
```bash
# 1. Setup project contacts
email-cli cadd "Project Manager" "pm@client.com" "project-alpha"
email-cli cadd "Lead Developer" "lead@team.com" "project-alpha"  
email-cli cadd "Client Stakeholder" "stakeholder@client.com" "project-alpha"

# 2. Daily project communication
email-cli esend "pm@client.com,lead@team.com" "Daily Update" "Progress report and next steps"
email-cli eattach "stakeholder@client.com" "Weekly Report" "Status update" "report.pdf,metrics.xlsx"

# 3. Follow project communications
email-cli cgroup "project-alpha"                    # View project team
email-cli esearch --from "@client.com" --unread    # Check client messages
email-cli esearch --subject "project-alpha" --since "this week"  # Project emails

# 4. Handle project issues
email-cli reply 54321 "Re: Bug Report" "Fix deployed, please verify on your end"
email-cli eforward 67890 "dev-team@company.com" "Please investigate this issue ASAP"
```

## ⚠️ Important Notes

### **Security & Setup**
1. **Gmail Users**: Must use App Passwords (not regular password)
2. **Environment File**: Keep `.env` secure, never commit to version control
3. **Network Security**: Use secure connections, verify SMTP/IMAP settings
4. **Rate Limiting**: Respect email provider limits for bulk operations

### **Best Practices**
1. **Test Small**: Use small batches for bulk operations before scaling up
2. **Backup Regularly**: Export contact lists and important emails  
3. **Monitor Limits**: Check email provider quotas and daily sending limits
4. **Read Errors**: Error messages contain troubleshooting guidance
5. **Use Aliases**: Short commands (`esend`) are faster for frequent use
6. **Group Contacts**: Organize contacts by project/role for easier management

### **File Management**  
1. **Attachments**: 
   - Use absolute file paths: `/home/user/documents/file.pdf`
   - Check file sizes (most providers limit 25MB per attachment)
   - Multiple attachments: `file1.pdf,file2.doc,file3.xlsx`
   
2. **Bulk Email Lists**:
   - Use plain text files with one email per line
   - Format: `recipient@example.com` (one per line)
   - Remove duplicates and invalid emails before bulk sending

### **Command Limitations**
1. **email-send**: Maximum 3 recipients (use `email-bulk` for more)
2. **email-attach**: Unlimited attachments (comma-separated)  
3. **Rate Limits**: Most providers limit daily sending (check your provider)
4. **Search Scope**: Search limited to accessible IMAP folders
5. **File Permissions**: Ensure CLI has read access to attachment files

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

---

## 🎯 Summary

This Email MCP Server CLI provides **40+ commands** with comprehensive email and contact management capabilities. Key features:

### ✅ **Core Functionality**
- **Email Operations**: Send (max 3 recipients), read, reply, forward, search
- **Attachments**: Unlimited files with custom naming via `email-attach`
- **Contact Management**: Add, list, search, update, delete, group contacts  
- **Advanced Features**: Bulk operations, scheduling, filtering, statistics

### ✅ **User Experience**
- **Dual Command Aliases**: Short (`esend`) and descriptive (`email-send`)
- **Cross-Platform**: Works on Windows, macOS, Linux
- **Comprehensive Help**: Every command has detailed `--help` documentation
- **Smart Error Handling**: Clear error messages with solution guidance

### ✅ **Enhanced Commands**
- **`list`**: Renamed from `email-list` for clarity as custom command
- **`email-send`**: Limited to 3 recipients (suggests `email-bulk` for more)
- **`email-attach`**: Supports unlimited comma-separated attachments

## 🚀 **Zero-Configuration Installation**

The Email MCP Server now features **completely automatic setup**:

### **🌐 For End Users (Global Installation):**
```bash
# Single command - everything automatic:
npm install -g @0xshariq/email-mcp-server
# OR
pnpm install -g @0xshariq/email-mcp-server

# What happens automatically:
# ✅ Detects -g flag (global installation)
# ✅ Runs platform-specific setup (Windows/macOS/Linux)
# ✅ Creates all 40+ command symlinks
# ✅ Configures system PATH
# ✅ Tests installation
# ✅ Provides setup instructions
# ✅ Ready to use immediately!

# Just set your email credentials and start using:
email-cli send "user@example.com" "Subject" "Message"
```

### **📁 For Developers (Local Installation):**
```bash
# Local installation - automatic dev setup:
npm install @0xshariq/email-mcp-server
# OR
git clone https://github.com/0xshariq/email-mcp-server && npm install

# What happens automatically:
# ✅ Detects local installation (no -g flag)  
# ✅ Creates .env configuration file
# ✅ Provides development instructions
# ✅ Sets up local command usage

# Use locally with:
node email-cli.js --version
node bin/basic/email-send.js "user@example.com" "Subject" "Message"
```

### **🎯 No Manual Steps Required:**
- ❌ **No symlink creation** - Automatic
- ❌ **No PATH configuration** - Automatic  
- ❌ **No platform detection** - Automatic
- ❌ **No setup scripts to run** - Runs automatically
- ✅ **Just install and use!**

---

Start with `email-cli --help` and explore individual command help with `--help` flag. Happy emailing! 📧

This CLI provides professional-grade email management capabilities with **zero-configuration setup** suitable for individual users, small teams, and automated workflows.

---

# 🛠️ Comprehensive Troubleshooting Guide

## 📋 Table of Contents
- [Windows Issues](#windows-issues)
- [macOS/Linux Issues](#macoslinux-issues)
- [Package Manager Issues](#package-manager-issues)
- [Environment Variables Issues](#environment-variables-issues)
- [Email Authentication Issues](#email-authentication-issues)
- [Network & Connection Issues](#network--connection-issues)
- [General CLI Issues](#general-cli-issues)

---

## 🪟 Windows Issues

### **Problem: "Unknown command" or "Command not found" Errors**

#### **🔍 Symptoms:**
- `email-send` shows "Unknown command"
- `where email-send` returns nothing
- Commands work with `npx` but not directly

#### **📊 Diagnosis:**
Check installation status:
```powershell
# Check if package is installed
npm list -g @0xshariq/email-mcp-server
pnpm list -g @0xshariq/email-mcp-server

# Check PATH
echo $env:PATH | Select-String "npm"
echo $env:PATH | Select-String "pnpm"
```

#### **✅ Solutions:**

##### **Solution 1: npm Users - Permanent PATH Fix**
```powershell
# 1. Open PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"

# 2. Install package globally (if not installed)
npm install -g @0xshariq/email-mcp-server

# 3. Add npm path to system PATH
$npmPath = npm config get prefix
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $npmPath, "Machine")

# 4. Verify PATH update
[Environment]::GetEnvironmentVariable("PATH", "Machine") | Select-String "npm"

# 5. RESTART COMPUTER (Required!)

# 6. Test after restart
email-cli --version
where.exe email-send
```

##### **Solution 2: pnpm Users - Permanent PATH Fix**
```powershell
# 1. Open PowerShell as Administrator

# 2. Install package globally (if not installed)
pnpm install -g @0xshariq/email-mcp-server

# 3. Get pnpm paths and add to system PATH
$pnpmRoot = pnpm root -g
$pnpmBinPath = Split-Path $pnpmRoot -Parent
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $pnpmBinPath, "Machine")

# Also add common pnpm paths
$appDataPnpm = "$env:APPDATA\npm"
$localAppDataPnpm = "$env:LOCALAPPDATA\pnpm"
if (Test-Path $appDataPnpm) {
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    [Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $appDataPnpm, "Machine")
}

# 4. RESTART COMPUTER (Required!)

# 5. Test after restart
email-cli --version
pnpm exec email-cli --version
```

##### **Solution 3: Immediate Workarounds (No Restart Required)**
```powershell
# Option A - Use pnpm exec (for pnpm users)
pnpm exec email-cli --version
pnpm exec email-send "test@example.com" "Subject" "Body"

# Option B - Use npx (works for both npm and pnpm)
npx @0xshariq/email-mcp-server email-cli --version
npx @0xshariq/email-mcp-server email-send "test@example.com" "Subject" "Body"

# Option C - Create batch files (Administrator required)
$npmPath = npm config get prefix  # or use pnpm root -g for pnpm
@"
@echo off
node "$npmPath\node_modules\@0xshariq\email-mcp-server\email-cli.js" %*
"@ | Out-File -FilePath "$env:WINDIR\email-cli.bat" -Encoding ASCII
```

### **Problem: Environment Variables Not Persisting**

#### **🔍 Symptoms:**
- Variables work in current session but disappear after restart
- `echo $env:EMAIL_USER` shows empty after restart

#### **✅ Solution: Machine-Level Environment Variables**
```powershell
# 1. Open PowerShell as Administrator

# 2. Set Machine-level environment variables (permanent)
[Environment]::SetEnvironmentVariable("EMAIL_USER", "your-email@gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("EMAIL_PASS", "your-app-password", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_HOST", "smtp.gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_PORT", "587", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_SECURE", "false", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_HOST", "imap.gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_PORT", "993", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_TLS", "true", "Machine")

# 3. Verify variables are set
[Environment]::GetEnvironmentVariable("EMAIL_USER", "Machine")

# 4. RESTART COMPUTER or close all PowerShell windows

# 5. Test in new PowerShell
echo $env:EMAIL_USER
```

---

## 🍎 macOS/Linux Issues

### **Problem: Permission Denied on Global Installation**

#### **🔍 Symptoms:**
- `npm install -g` fails with permission errors
- `EACCES: permission denied` errors

#### **✅ Solutions:**

##### **Solution 1: Use sudo (Quick Fix)**
```bash
sudo npm install -g @0xshariq/email-mcp-server
```

##### **Solution 2: Fix npm Permissions (Recommended)**
```bash
# 1. Create a directory for global packages
mkdir ~/.npm-global

# 2. Configure npm to use the new directory
npm config set prefix '~/.npm-global'

# 3. Add to PATH in your shell profile
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
# or for zsh:
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc

# 4. Reload shell
source ~/.bashrc  # or source ~/.zshrc

# 5. Install package
npm install -g @0xshariq/email-mcp-server
```

### **Problem: Command Not Found on macOS/Linux**

#### **✅ Solution: Check and Fix PATH**
```bash
# 1. Check if package is installed
npm list -g @0xshariq/email-mcp-server

# 2. Find npm global directory
npm config get prefix

# 3. Check if directory is in PATH
echo $PATH | grep $(npm config get prefix)

# 4. Add to PATH if missing
echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 5. Test
email-cli --version
```

---

## 📦 Package Manager Issues

### **Problem: Package Not Found or Outdated**

#### **✅ Solutions:**

##### **For npm:**
```bash
# Update npm itself
npm install -g npm@latest

# Clear npm cache
npm cache clean --force

# Install/update package
npm uninstall -g @0xshariq/email-mcp-server
npm install -g @0xshariq/email-mcp-server@latest

# Verify
npm list -g @0xshariq/email-mcp-server
```

##### **For pnpm:**
```bash
# Update pnpm
npm install -g pnpm@latest

# Clear pnpm cache
pnpm store prune

# Install/update package
pnpm uninstall -g @0xshariq/email-mcp-server
pnpm install -g @0xshariq/email-mcp-server@latest

# Verify
pnpm list -g @0xshariq/email-mcp-server
```

### **Problem: Multiple Package Managers Conflict**

#### **🔍 Symptoms:**
- Commands work with one package manager but not another
- Different versions installed with different managers

#### **✅ Solution: Choose One Package Manager**
```bash
# Option A: Clean everything and use npm only
pnpm uninstall -g @0xshariq/email-mcp-server
npm install -g @0xshariq/email-mcp-server

# Option B: Clean everything and use pnpm only  
npm uninstall -g @0xshariq/email-mcp-server
pnpm install -g @0xshariq/email-mcp-server

# Use consistent commands
# For npm: npx @0xshariq/email-mcp-server email-cli
# For pnpm: pnpm exec email-cli
```

---

## 🔐 Environment Variables Issues

### **Problem: Authentication Errors**

#### **🔍 Symptoms:**
- "Invalid login credentials" errors
- "Authentication failed" messages
- Connection timeouts

#### **✅ Solutions:**

##### **Solution 1: Verify Environment Variables**
```bash
# Check all required variables
echo "EMAIL_USER: $EMAIL_USER"
echo "EMAIL_PASS: $EMAIL_PASS"
echo "SMTP_HOST: $SMTP_HOST"
echo "SMTP_PORT: $SMTP_PORT"
echo "IMAP_HOST: $IMAP_HOST"
echo "IMAP_PORT: $IMAP_PORT"
```

##### **Solution 2: Gmail App Password Setup**
```bash
# 1. Enable 2-Factor Authentication in Gmail
# 2. Generate App Password:
#    - Go to Google Account settings
#    - Security → 2-Step Verification → App passwords
#    - Generate password for "Mail"
# 3. Use app password (not regular password)

# Set correct Gmail settings
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password  # Not regular password!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
```

##### **Solution 3: Outlook/Hotmail Setup**
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
IMAP_TLS=true
```

### **Problem: Environment Variables Not Loading**

#### **✅ Solution: Check Loading Order**
```bash
# 1. Check if .env file exists
ls -la .env

# 2. Verify .env file format (no spaces around =)
cat .env
# Should look like:
# EMAIL_USER=test@gmail.com
# EMAIL_PASS=password123

# 3. Check current directory when running commands
pwd

# 4. Use absolute path for .env or set system variables
```

---

## 📧 Email Authentication Issues

### **Problem: Gmail "Less Secure Apps" Error**

#### **✅ Solution: Use App Passwords (Required)**
Gmail no longer supports "less secure apps." You MUST use app passwords:

1. **Enable 2-Factor Authentication**
2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification
   - App passwords → Select "Mail" → Generate
3. **Use 16-character app password instead of regular password**

### **Problem: Corporate Email Issues**

#### **✅ Solutions:**

##### **For Office 365/Exchange:**
```bash
EMAIL_USER=your-email@company.com
EMAIL_PASS=your-password
SMTP_HOST=smtp.office365.com  # or your company's SMTP
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
IMAP_TLS=true
```

##### **For Custom SMTP:**
```bash
# Contact your IT department for:
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587  # or 25, 465, 2525
SMTP_SECURE=false  # or true for port 465
IMAP_HOST=mail.yourcompany.com
IMAP_PORT=993  # or 143
IMAP_TLS=true
```

---

## 🌐 Network & Connection Issues

### **Problem: Connection Timeouts**

#### **✅ Solutions:**

##### **Solution 1: Check Network Connectivity**
```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Test IMAP connection  
telnet imap.gmail.com 993

# If telnet fails, check firewall/proxy settings
```

##### **Solution 2: Corporate Firewall/Proxy**
```bash
# Set proxy if required (contact IT)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or set environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

##### **Solution 3: Alternative Ports**
```bash
# Try alternative SMTP ports
SMTP_PORT=25    # Standard SMTP
SMTP_PORT=465   # SMTP over SSL
SMTP_PORT=587   # SMTP with STARTTLS (recommended)
SMTP_PORT=2525  # Alternative port (some providers)

# Adjust SMTP_SECURE accordingly
SMTP_SECURE=true   # for port 465
SMTP_SECURE=false  # for ports 25, 587, 2525
```

---

## ⚙️ General CLI Issues

### **Problem: Command Hangs or Freezes**

#### **✅ Solutions:**

##### **Solution 1: Timeout Settings**
```bash
# Set timeout environment variables
IMAP_CONN_TIMEOUT=60000  # 60 seconds
SMTP_TIMEOUT=30000       # 30 seconds
```

##### **Solution 2: Debug Mode**
```bash
# Run commands with debug output
DEBUG=* email-cli --version
DEBUG=* email-send "test@example.com" "Subject" "Body"
```

### **Problem: Weird Characters or Encoding Issues**

#### **✅ Solutions:**

##### **Windows:**
```powershell
# Set UTF-8 encoding
chcp 65001
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

##### **macOS/Linux:**
```bash
# Set locale
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

### **Problem: Update Command Not Working**

#### **✅ Solution: Manual Update**
```bash
# Check current version
email-cli --version

# Manual update
npm uninstall -g @0xshariq/email-mcp-server
npm install -g @0xshariq/email-mcp-server@latest

# Or for pnpm
pnpm uninstall -g @0xshariq/email-mcp-server
pnpm install -g @0xshariq/email-mcp-server@latest

# Verify update
email-cli --version
```

---

## 🔧 Advanced Troubleshooting

### **Problem: Nothing Works - Nuclear Option**

When all else fails, complete clean reinstall:

```bash
# 1. Uninstall from all package managers
npm uninstall -g @0xshariq/email-mcp-server
pnpm uninstall -g @0xshariq/email-mcp-server

# 2. Clear all caches
npm cache clean --force
pnpm store prune

# 3. Remove global node_modules (be careful!)
# On Windows: C:\Users\username\AppData\Roaming\npm\node_modules
# On macOS/Linux: /usr/local/lib/node_modules (if using sudo)

# 4. Reinstall Node.js if necessary

# 5. Fresh install with preferred package manager
npm install -g @0xshariq/email-mcp-server@latest
# or
pnpm install -g @0xshariq/email-mcp-server@latest

# 6. Use npx/pnpm exec as workaround while fixing PATH
npx @0xshariq/email-mcp-server email-cli --version
pnpm exec email-cli --version
```

### **Getting Help**

If you're still having issues:

1. **Check the logs:** Most commands show detailed error messages
2. **Use debug mode:** `DEBUG=* email-cli command`
3. **Try npx/pnpm exec:** These always work regardless of PATH issues
4. **Check GitHub Issues:** [GitHub Issues](https://github.com/0xshariq/email-mcp-server/issues)
5. **Create new issue:** Include your OS, package manager, and error messages

---

## 📋 Quick Reference - Common Solutions

| Problem | Quick Fix |
|---------|-----------|
| Windows "Unknown command" | `pnpm exec email-cli --version` or `npx @0xshariq/email-mcp-server email-cli` |
| PATH not working | Use Administrator PowerShell + restart computer |
| Permission denied | `sudo npm install -g` or fix npm permissions |
| Authentication failed | Use Gmail app password, not regular password |
| Connection timeout | Check firewall, try different ports |
| Package not found | `npm cache clean --force && npm install -g @0xshariq/email-mcp-server@latest` |
| Environment variables not working | Set Machine-level vars (Windows) or check .env file format |
| Command hangs | Set timeout environment variables |
| Update fails | Manual uninstall + reinstall |

**Remember:** When in doubt, `npx @0xshariq/email-mcp-server email-cli --version` or `pnpm exec email-cli --version` always works! 🚀