# Troubleshooting Guide

This document provides solutions to common issues you might encounter while using the Email MCP Server and CLI tools.

## Table of Contents

1. [Environment Setup Issues](#environment-setup-issues)
2. [Authentication Problems](#authentication-problems)
3. [Connection Issues](#connection-issues)
4. [CLI Command Issues](#cli-command-issues)
5. [Email Operation Errors](#email-operation-errors)
6. [Contact Management Issues](#contact-management-issues)
7. [File and Permission Issues](#file-and-permission-issues)
8. [Performance Issues](#performance-issues)

## Environment Setup Issues

### ❌ `.env file not found` Error

**Problem:** The system cannot locate your environment configuration file.

**Solutions:**
```bash
# 1. Copy the example file
cp .env.example .env

# 2. Verify the file exists in the correct location
ls -la .env

# 3. Check you're in the correct directory
pwd
# Should show: /path/to/email-mcp-server
```

### ❌ Missing Required Environment Variables

**Problem:** One or more required environment variables are not set.

**Required Variables:**
- `SMTP_HOST`
- `SMTP_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `IMAP_HOST`
- `IMAP_PORT`

**Solution:** Edit your `.env` file and ensure all required variables are set:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_MARK_SEEN=false
```

### ❌ Build Errors

**Problem:** TypeScript compilation fails.

**Solutions:**
```bash
# 1. Clean and rebuild
pnpm run clean
pnpm run build

# 2. Install dependencies
pnpm install

# 3. Check Node.js version (requires Node 18+)
node --version

# 4. Clear pnpm cache
pnpm store prune
```

## Authentication Problems

### ❌ Gmail Authentication Failed (EAUTH)

**Problem:** Cannot authenticate with Gmail servers.

**Solutions:**

1. **Enable 2-Factor Authentication:**
   - Go to Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Generate a new app password
   - Use this password in `EMAIL_PASS` (not your regular password)

3. **Update .env file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App password (no spaces)
   ```

4. **Check "Less Secure Apps":**
   - If using regular password, enable "Less secure app access"
   - **Recommended:** Use App Password instead

### ❌ Outlook/Hotmail Authentication Issues

**Problem:** Cannot connect to Outlook/Hotmail servers.

**Solutions:**
```env
# Use these settings for Outlook
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### ❌ Yahoo Authentication Issues

**Problem:** Yahoo authentication fails.

**Solutions:**
1. **Enable App Passwords:**
   - Go to Yahoo Account Security
   - Generate an app password

2. **Update settings:**
   ```env
   SMTP_HOST=smtp.mail.yahoo.com
   SMTP_PORT=587
   IMAP_HOST=imap.mail.yahoo.com
   IMAP_PORT=993
   EMAIL_PASS=your-app-password
   ```

## Connection Issues

### ❌ Connection Timeout (ETIMEDOUT)

**Problem:** Cannot connect to email servers.

**Solutions:**
1. **Check Internet Connection:**
   ```bash
   ping smtp.gmail.com
   ping imap.gmail.com
   ```

2. **Verify Firewall Settings:**
   - Ensure ports 587 (SMTP) and 993 (IMAP) are not blocked
   - Check corporate firewall settings

3. **Try Alternative Ports:**
   ```env
   # Alternative SMTP ports
   SMTP_PORT=465  # SSL
   SMTP_PORT=25   # Basic (often blocked)
   
   # Alternative IMAP ports
   IMAP_PORT=143  # Non-SSL
   ```

### ❌ SSL/TLS Issues

**Problem:** SSL certificate or TLS connection errors.

**Solutions:**
```env
# Try these settings
SMTP_SECURE=true
IMAP_TLS=true

# Or disable SSL for testing (not recommended for production)
SMTP_SECURE=false
IMAP_TLS=false
```

## CLI Command Issues

### ❌ Command Not Found

**Problem:** `email-send: command not found` or similar errors.

**Solutions:**
1. **Use the CLI wrapper:**
   ```bash
   # Instead of just: email-send
   node email-cli.js email-send "to@example.com" "Subject" "Body"
   
   # Or use short alias
   node email-cli.js esend "to@example.com" "Subject" "Body"
   ```

2. **Make scripts executable:**
   ```bash
   chmod +x bin/basic/*.js
   chmod +x bin/advanced/*.js
   chmod +x bin/contacts/*.js
   ```

3. **Check file paths:**
   ```bash
   # Verify CLI structure
   ls -la email-cli.js
   ls -la bin/basic/
   ```

### ❌ Permission Denied

**Problem:** Cannot execute CLI scripts.

**Solutions:**
```bash
# Make files executable
chmod +x email-cli.js
find bin -name "*.js" -exec chmod +x {} \;

# Check ownership
ls -la email-cli.js
```

### ❌ Node.js Module Errors

**Problem:** Cannot find module errors.

**Solutions:**
```bash
# 1. Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 2. Rebuild the project
pnpm run build

# 3. Check Node.js version compatibility
node --version  # Should be 18+ for ES modules
```

## Email Operation Errors

### ❌ Email Not Found

**Problem:** Cannot retrieve email by ID.

**Solutions:**
1. **Verify Email ID:**
   ```bash
   # List recent emails to get valid IDs
   node email-cli.js eread 10
   ```

2. **Check Email Folder:**
   - Email might be in different folder (Sent, Drafts, etc.)
   - Some email IDs may expire or change

### ❌ Attachment Too Large

**Problem:** Attachment exceeds size limits.

**Solutions:**
1. **Check File Size:**
   ```bash
   ls -lh /path/to/attachment
   ```

2. **Email Provider Limits:**
   - Gmail: 25MB
   - Outlook: 20MB
   - Yahoo: 25MB

3. **Workarounds:**
   - Use cloud storage links (Google Drive, OneDrive)
   - Compress large files
   - Split into multiple emails

### ❌ Invalid Email Address

**Problem:** Email addresses are rejected.

**Solutions:**
1. **Validate Format:**
   - Must contain @ symbol
   - Valid domain format
   - No special characters (except allowed ones)

2. **Multiple Recipients:**
   ```bash
   # Correct format for multiple recipients
   "user1@example.com,user2@example.com"
   ```

### ❌ Email Delivery Failed

**Problem:** Emails are not being delivered.

**Solutions:**
1. **Check Spam Folders:**
   - Both sender and recipient spam folders

2. **Verify Recipient Addresses:**
   - Ensure addresses are correct and active

3. **Check Email Content:**
   - Avoid spam-trigger words
   - Include proper sender identification

## Contact Management Issues

### ❌ Contact Storage Issues

**Problem:** Cannot save or retrieve contacts.

**Solutions:**
1. **Check File Permissions:**
   ```bash
   # Ensure write permissions for contact storage
   ls -la ~/.email-mcp-contacts/
   ```

2. **Create Storage Directory:**
   ```bash
   mkdir -p ~/.email-mcp-contacts
   chmod 755 ~/.email-mcp-contacts
   ```

### ❌ Duplicate Contacts

**Problem:** Adding contacts that already exist.

**Solutions:**
1. **Search Before Adding:**
   ```bash
   node email-cli.js csearch "john@example.com"
   ```

2. **Update Instead of Add:**
   ```bash
   node email-cli.js cupdate <contact-id> email "new@example.com"
   ```

## File and Permission Issues

### ❌ Cannot Read Attachment File

**Problem:** Attachment file cannot be accessed.

**Solutions:**
```bash
# 1. Check file exists
ls -la /path/to/file

# 2. Check permissions
chmod 644 /path/to/file

# 3. Use absolute paths
node email-cli.js eattach "user@example.com" "Subject" "Body" "/full/path/to/file.pdf"
```

### ❌ Bulk Email File Format Issues

**Problem:** Recipients file is not properly formatted.

**Solutions:**
1. **Correct Format:**
   ```
   user1@example.com
   user2@example.com
   user3@example.com
   ```

2. **File Encoding:**
   ```bash
   # Ensure UTF-8 encoding
   file recipients.txt
   ```

## Performance Issues

### ❌ Slow Email Operations

**Problem:** Email operations take too long.

**Solutions:**
1. **Reduce Batch Size:**
   ```bash
   # Read fewer emails at once
   node email-cli.js eread 5  # Instead of 50
   ```

2. **Optimize Search Queries:**
   ```bash
   # Use specific filters
   node email-cli.js esearch --from "specific@example.com" --limit 10
   ```

3. **Check Network Connection:**
   ```bash
   ping -c 4 smtp.gmail.com
   ```

### ❌ Memory Issues with Large Attachments

**Problem:** Out of memory when handling large files.

**Solutions:**
1. **Increase Node.js Memory:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" node email-cli.js eattach ...
   ```

2. **Process Files in Chunks:**
   - Split large operations into smaller batches

## Getting Additional Help

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=email-mcp:* node email-cli.js esend ...
```

### Log Files

Check application logs:
```bash
# Check system logs
tail -f ~/.email-mcp-server/logs/error.log

# Check email server responses
tail -f ~/.email-mcp-server/logs/email.log
```

### Contact Support

If issues persist:

1. **GitHub Issues:**
   - Create an issue at: https://github.com/0xshariq/email-mcp-server/issues
   - Include error messages and system information

2. **System Information to Include:**
   ```bash
   node --version
   pnpm --version
   uname -a  # On Linux/macOS
   echo $EMAIL_USER  # Redacted email for context
   ```

3. **Sanitized Logs:**
   - Include relevant error messages
   - **Never share passwords or sensitive information**

### Quick Diagnostic Commands

Run these to check system health:
```bash
# 1. Check environment
node -e "console.log('Node:', process.version); console.log('Platform:', process.platform);"

# 2. Test email connectivity
ping -c 3 smtp.gmail.com
ping -c 3 imap.gmail.com

# 3. Verify project structure
ls -la email-cli.js bin/basic/ bin/advanced/ bin/contacts/

# 4. Test basic CLI functionality
node email-cli.js --help
```

## Prevention Tips

1. **Regular Backups:**
   ```bash
   # Backup contacts and configuration
   cp .env .env.backup
   cp -r ~/.email-mcp-contacts ~/.email-mcp-contacts.backup
   ```

2. **Environment Management:**
   - Use different `.env` files for different environments
   - Keep app passwords secure and updated

3. **Monitoring:**
   - Regularly check email quotas and limits
   - Monitor authentication status

4. **Updates:**
   ```bash
   # Keep dependencies updated
   pnpm update
   
   # Check for security updates
   pnpm audit
   ```

This troubleshooting guide covers the most common issues. For specific errors not covered here, please refer to the individual command documentation in the `bin/` folders or create a GitHub issue with detailed error information.