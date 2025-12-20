# Windows Setup Guide for Email MCP Server

## 🪟 Native Windows Installation & Testing

This guide helps you set up and test the Email MCP Server CLI on **native Windows** (not WSL).

### Prerequisites

1. **Node.js 18+** installed on Windows
   - Download from: https://nodejs.org/
   - Verify: Open CMD/PowerShell and run `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

### Installation Methods

#### Method 1: Automatic Installation (Recommended)

**Using Batch File:**
1. Download/clone the project to Windows (not WSL)
2. Right-click `install.bat` → "Run as administrator"
3. Wait for completion

**Using PowerShell:**
1. Open PowerShell as Administrator
2. Navigate to project folder
3. Run: `npm install -g .`

#### Method 2: Cross-Platform Installer

```powershell
# In PowerShell (as Administrator)
node install.js
```

### Testing Installation

#### Manual Verification
```powershell
# Test core commands:
email-cli send --help
email-cli read --help
email-cli contact-add --help

# Test aliases:
email-cli esend --help
email-cli eread --help
email-cli cadd --help
```

### Expected Behavior

All commands work through `email-cli` command with subcommands:

```powershell
# Send email
email-cli send "user@example.com" "Test Subject" "Test message"

# Read emails  
email-cli read 5

# Get specific email
email-cli get EMAIL_ID

# Delete emails
email-cli delete EMAIL_ID

# Mark as read
email-cli mark-read EMAIL_ID

# Search emails
email-cli search --from "boss@company.com" --subject "report"

# Forward email
email-cli forward EMAIL_ID "recipient@example.com" "See below"

# Reply to email
email-cli reply EMAIL_ID "Thanks for your message"

# Email with attachment
email-cli attach "user@example.com" "Report" "See attached" "./report.pdf"

# Get statistics
email-cli stats

# Create draft
email-cli draft "user@example.com" "Subject" "Body"

# Schedule email
email-cli schedule "user@example.com" "Subject" "Body" "2025-12-25T10:00:00Z"

# Bulk send
email-cli bulk recipients.txt "Subject" "Message"

# Add contact
email-cli contact-add "John Doe" "john@example.com" --group "work"

# List contacts
email-cli contact-list 10

# Search contacts
email-cli contact-search "john"

# Update contact
email-cli contact-update CONTACT_ID --name "John Smith" --group "friends"

# Delete contact
email-cli contact-delete CONTACT_ID

# Get contacts by group
email-cli contact-group "work"
```

**Using Aliases:**
```powershell
# Short aliases for common commands
email-cli esend "user@example.com" "Subject" "Body"
email-cli eread 10
email-cli esearch --from "boss@example.com"
email-cli cadd "Jane Doe" "jane@example.com"
email-cli clist
email-cli csearch "jane"
```

### Windows-Specific Considerations

1. **Quotes**: Use double quotes `"..."` instead of single quotes
2. **Paths**: Use Windows paths (`C:\folder\file.txt`)
3. **Admin Rights**: Some operations may require Administrator privileges
4. **Antivirus**: Some antivirus software may block npm global installations

### Troubleshooting Windows Issues

#### ❌ Commands Not Found After Installation

**Solution 1: Restart Terminal**
```powershell
# Close and reopen PowerShell/CMD after installation
```

**Solution 2: Check npm Global Path**
```powershell
# Check where npm installs global packages
npm config get prefix

# Should be something like: C:\Users\YourName\AppData\Roaming\npm
```

**Solution 3: Add to PATH**
```powershell
# Add npm global path to Windows PATH environment variable
# Go to: System Properties > Environment Variables > PATH
# Add: %APPDATA%\npm
```

#### ❌ Permission Denied

**Solution:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as administrator"
```

#### ❌ npm Install Fails

**Solutions:**
```powershell
# Clear npm cache
npm cache clean --force

# Use different registry
npm install -g . --registry https://registry.npmjs.org/

# Check network connection
npm config get registry
```

#### ❌ Node.js Module Errors

**Solutions:**
```powershell
# Reinstall dependencies
npm install

# Rebuild project  
npm run build

# Check Node.js version (needs 18+)
node --version
```

### Performance on Windows

The CLI should perform identically to Linux/WSL:

- **Fast email operations** (optimized IMAP connections)
- **Cross-platform file paths** (automatic handling)
- **Same command syntax** (no Windows-specific changes needed)

### Windows vs WSL Comparison

| Feature | Native Windows | WSL |
|---------|---------------|-----|
| Installation | `install.bat` or `npm install -g .` | `./setup-symlinks.sh` or `npm install -g .` |
| Commands | Identical syntax | Identical syntax |
| Performance | Native speed | Slightly slower (virtualization) |
| File Paths | Windows paths (`C:\`) | Unix paths (`/home/`) |
| Admin Rights | Required for global install | `sudo` for system directories |

### Success Indicators

✅ **Installation Successful When:**
- All test commands show help text
- `email-cli send --help` displays usage information
- Both full commands and aliases work (`email-cli read` and `email-cli eread`)
- No "command not found" errors

✅ **Ready for Use When:**
- Can run: `email-cli send user@example.com "test" "message"`
- Environment variables loaded from `.env` or system environment
- Email operations complete successfully

### Next Steps After Windows Installation

1. **Configure .env file** with your email credentials
2. **Test email sending** with real credentials
3. **Verify cross-platform consistency** by comparing with WSL behavior
4. **Report any Windows-specific issues** on GitHub

### Getting Help

- **General Issues**: [docs/troubleshooting.md](troubleshooting.md)
- **Installation Problems**: [docs/INSTALL.md](INSTALL.md)  
- **Windows-Specific Issues**: Create GitHub issue with "Windows" label
- **Compare with WSL**: Test same commands in both environments