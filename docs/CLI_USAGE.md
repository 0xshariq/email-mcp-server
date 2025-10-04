# Email MCP Server CLI Commands

Complete guide for using the Email MCP Server CLI tools. The CLI provides comprehensive email management capabilities through both short and long command aliases.

## 🚨 Quick Fix for Windows "Unknown command" Errors

If you're seeing errors like "Unknown command: email-send" on Windows:

### **Immediate Solutions (Work Right Away)**

#### **For npm Users:**
```powershell
# Use npx to run commands without PATH issues:
npx @0xshariq/email-mcp-server email-cli --version
npx @0xshariq/email-mcp-server email-cli update
npx @0xshariq/email-mcp-server email-send "test@example.com" "Subject" "Body"
```

#### **For pnpm Users:**
```powershell
# Use pnpm exec to run commands:
pnpm exec email-cli --version
pnpm exec email-cli update
pnpm exec email-send "test@example.com" "Subject" "Body"

# Or use npx as alternative:
npx @0xshariq/email-mcp-server email-cli --version
```

### **Permanent Solutions (Administrator PowerShell + Restart)**

#### **For npm Users:**
```powershell
# 1. Right-click PowerShell → "Run as Administrator"
# 2. Add npm path to system PATH:
$npmPath = npm config get prefix
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $npmPath, "Machine")

# 3. Restart your computer
# 4. Test: email-cli --version
```

#### **For pnpm Users:**
```powershell
# 1. Right-click PowerShell → "Run as Administrator"
# 2. Get pnpm global directory and add to PATH:
$pnpmRoot = pnpm root -g
$pnpmBinPath = Split-Path $pnpmRoot -Parent
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable("PATH", $currentPath + ";" + $pnpmBinPath, "Machine")

# 3. Restart your computer
# 4. Test: email-cli --version
```

## 📦 Installation Guide

### 🌍 Global Installation (Recommended)

Install the Email MCP Server globally to use commands from anywhere on your system:

#### **🤖 Fully Automated Installation**

The Email MCP Server **automatically detects** installation type and runs appropriate setup:

##### **🌐 Global Installation (System-wide CLI)**
```bash
# Automatic setup - detects -g flag and runs full setup:
npm install -g @0xshariq/email-mcp-server
pnpm install -g @0xshariq/email-mcp-server

# What happens automatically:
# ✅ Detects global installation (-g flag)
# ✅ Runs platform-specific setup script  
# ✅ Configures PATH for your OS
# ✅ Creates all command symlinks
# ✅ Tests installation
# ✅ Provides setup guide
```

##### **📁 Local Installation (Development)**
```bash
# Automatic local setup - detects no -g flag:
npm install @0xshariq/email-mcp-server
git clone https://github.com/0xshariq/email-mcp-server.git && cd email-mcp-server && npm install

# What happens automatically:
# ✅ Detects local installation (no -g flag)
# ✅ Creates .env configuration file
# ✅ Provides local development instructions
# ✅ Shows how to run commands locally
```

**✨ Smart Detection Features:**
- 🔍 **Installation Type Detection** - Automatic -g flag detection
- �️ **Platform Detection** - Windows, macOS, Linux (including WSL)  
- 📦 **Package Manager Detection** - npm, pnpm, yarn
- 🔗 **Symlink Creation** - All 40+ commands available (global only)
- 🛣️ **PATH Configuration** - Automatic PATH setup (global only)
- � **Environment Setup** - .env file creation (local only)
- � **Installation Testing** - Verifies everything works

#### **📦 Manual Installation**

##### **Using npm:**
```bash
# Install globally via npm
npm install -g @0xshariq/email-mcp-server

# Verify installation
email-cli --version
esend --help
```

##### **Using pnpm:**
```bash
# Install globally via pnpm
pnpm install -g @0xshariq/email-mcp-server

# Verify installation
pnpm exec email-cli --version
pnpm exec esend --help

# Or if PATH is configured:
email-cli --version
```

#### **🖥️ Platform-Specific Installers**

##### **Windows (PowerShell as Administrator):**
```powershell
# For pnpm users:
curl -o install-pnpm-windows.ps1 https://raw.githubusercontent.com/0xshariq/email-mcp-server/main/install-pnpm-windows.ps1
.\install-pnpm-windows.ps1

# For npm users:
curl -o install-windows.ps1 https://raw.githubusercontent.com/0xshariq/email-mcp-server/main/install-windows.ps1  
.\install-windows.ps1
```

##### **Unix/Linux/macOS:**
```bash
# Download and run setup script
curl -o setup-symlinks.sh https://raw.githubusercontent.com/0xshariq/email-mcp-server/main/setup-symlinks.sh
chmod +x setup-symlinks.sh
./setup-symlinks.sh
```

**✅ After global installation, all 40+ commands work directly:**
```bash
# Email operations
email-send "user@example.com" "Subject" "Body"
esend "user@example.com" "Subject" "Body"  
eread 10
list --unread

# Contact management  
cadd "John Doe" "john@example.com" "work"
contact-list
csearch "gmail.com"

# All commands available system-wide!
```

### 🔄 **Installation Types Explained**

#### **🌐 Global Installation (`-g` flag)**
```bash
npm install -g @0xshariq/email-mcp-server  # Global
pnpm install -g @0xshariq/email-mcp-server # Global
```

**✅ What you get:**
- **System-wide CLI access** - Commands work from any directory
- **All 40+ command aliases** - `email-send`, `esend`, `email-read`, etc.
- **Automatic symlinks** - No manual configuration needed
- **PATH setup** - Automatic platform-specific configuration
- **Environment variables** - System-level configuration (Windows) or shell profile (Unix)

**🎯 Perfect for:** End users who want CLI tools available everywhere

#### **📁 Local Installation (no `-g` flag)**  
```bash
npm install @0xshariq/email-mcp-server      # Local
git clone <repo> && npm install             # Development
```

**✅ What you get:**
- **Project-specific installation** - Commands via `node` prefix
- **`.env` file configuration** - Automatic creation from template
- **Development setup** - Full source code access
- **Local commands** - `node email-cli.js`, `node bin/basic/email-send.js`
- **Build tools** - TypeScript compilation, development scripts

**🎯 Perfect for:** Developers, custom integrations, project-specific usage

### 🔗 **Automatic Features**

**Symlinks & PATH (Global Only):**
- ✅ **No manual symlink creation needed**
- ✅ **All 40+ command aliases work immediately**  
- ✅ **Cross-platform compatibility**
- ✅ **Automatic PATH configuration**

**Environment Setup:**
- 🌐 **Global:** System environment variables or shell profile
- 📁 **Local:** `.env` file configuration (created automatically)

The installation **automatically detects** which type you're doing and configures accordingly!

### 🏠 Local Installation

For development or project-specific usage:

```bash
# Clone repository
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Use with node prefix
node email-cli.js email-send "user@example.com" "Subject" "Body"
node email-cli.js list 5
node email-cli.js cadd "Jane Doe" "jane@example.com"
```

### 🔗 Symlink Setup

#### For Global Installation
If global installation doesn't create symlinks automatically, set them up manually:

**Windows (Run as Administrator):**
```cmd
# Navigate to global npm directory
npm config get prefix
cd %AppData%\npm

# Create symlinks (example for key commands)
mklink email-send.cmd node_modules\.bin\email-send.cmd
mklink esend.cmd node_modules\.bin\esend.cmd
mklink list.cmd node_modules\.bin\list.cmd
```

**macOS/Linux:**
```bash
# Check global npm directory
npm config get prefix

# If symlinks missing, create manually
sudo ln -sf $(npm config get prefix)/lib/node_modules/@0xshariq/email-mcp-server/email-cli.js /usr/local/bin/email-send
sudo ln -sf $(npm config get prefix)/lib/node_modules/@0xshariq/email-mcp-server/email-cli.js /usr/local/bin/esend
sudo ln -sf $(npm config get prefix)/lib/node_modules/@0xshariq/email-mcp-server/email-cli.js /usr/local/bin/list

# Or use provided setup script
chmod +x setup-symlinks.sh
sudo ./setup-symlinks.sh
```

#### For Local Installation
Create symlinks for local development convenience:

**macOS/Linux:**
```bash
# Navigate to project directory
cd email-mcp-server

# Make setup script executable and run
chmod +x setup-symlinks.sh
sudo ./setup-symlinks.sh

# Or create manual symlinks to /usr/local/bin/
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/email-send
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/esend  
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/list
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/cadd
sudo ln -sf "$(pwd)/email-cli.js" /usr/local/bin/contact-list
# ... (continue for all 40+ commands)
```

**Windows (Local Development):**
```cmd
# Run as Administrator in project directory
cd email-mcp-server

# Create batch files for convenience
echo @echo off > email-send.bat
echo node "%~dp0email-cli.js" email-send %* >> email-send.bat

echo @echo off > esend.bat  
echo node "%~dp0email-cli.js" email-send %* >> esend.bat

echo @echo off > list.bat
echo node "%~dp0email-cli.js" list %* >> list.bat

# Add project directory to PATH
setx PATH "%PATH%;%CD%"
```

### 🔍 Verify Installation

Test your installation with these commands:

```bash
# Check if CLI is available
email-cli --version
email-cli --help

# Test basic commands
esend --help              # Should show email-send help
list --help               # Should show list help  
cadd --help               # Should show contact-add help

# Test actual functionality (after .env setup)
email-stats               # Should show inbox statistics
contact-list              # Should show contact list (may be empty)
list 1                    # Should show latest email
```

### 📋 Installation Troubleshooting

#### Command Not Found
```bash
# Check if globally installed
npm list -g @0xshariq/email-mcp-server

# Check PATH includes npm global bin
echo $PATH | grep npm

# Reinstall if needed
npm uninstall -g @0xshariq/email-mcp-server
npm install -g @0xshariq/email-mcp-server
```

#### Permission Issues (Linux/macOS)
```bash
# Fix npm global permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use npm prefix for user directory
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

Perfect for development, testing, or project-specific use. Uses `.env` file - works on all platforms!

### **Step 1: Clone/Download Project**
```bash
git clone https://github.com/0xshariq/email-mcp-server.git
cd email-mcp-server
npm install
npm run build
```

### **Step 2: Create .env File**
```bash
# Linux/macOS
cp .env.example .env

# Windows Command Prompt  
copy .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

### **Step 3: Configure .env File**
Edit the `.env` file with your email settings:
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
```

### **Step 4: Use Commands**
```bash
# All commands work with node prefix
node email-cli.js --version
node email-cli.js                    # List emails
node email-cli.js email-send "user@example.com" "Subject" "Body"
node email-cli.js email-stats

# Create shortcuts (optional)
# Linux/macOS: alias esend="node email-cli.js email-send"
# Windows: Create .bat files or use doskey
```

**✅ Local Development Benefits:**
- ✅ Easy setup - just edit one file
- ✅ Works on all platforms identically  
- ✅ Project-specific configuration
- ✅ No system-wide changes needed
- ✅ Perfect for development and testing

---

## 🌍 **Global Installation Setup (COMPLEX)**

For system-wide access to commands. Requires setting system environment variables.

### **Step 1: Install Globally**
```bash
npm install -g @0xshariq/email-mcp-server
```

### **Step 2: Fix Windows PATH Issues (Windows Only)**
Windows often has PATH issues with global npm packages:

**🔥 Administrator Method (BEST FIX):**
```powershell
# 1. Right-click PowerShell → "Run as Administrator"
# 2. Check npm global directory
npm config get prefix

# 3. Add to system PATH (Machine-level)
$npmPath = npm config get prefix  
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "Machine")

# 4. Close admin PowerShell, test in regular PowerShell
email-cli --version
```

**Alternative Methods:**
```powershell
# Quick test - check if commands are available
email-cli --version

# Workaround - use npx (always works)
npx @0xshariq/email-mcp-server email-cli --version

# User-level PATH fix (less reliable)
$npmPath = npm config get prefix
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "User")
```

### **Step 3: Configure System Environment Variables**

⚠️ **Complex Part:** Environment variable setup differs by platform and requires system-level changes.

**Choose your platform:**

#### **🐧 Linux/macOS/WSL (Bash/Zsh)**
```bash
# Temporary (current session only)
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_SECURE="false"
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
export IMAP_HOST="imap.gmail.com"
export IMAP_PORT="993"
export IMAP_TLS="true"
export SMTP_REJECT_UNAUTHORIZED=false
export IMAP_REJECT_UNAUTHORIZED=false
export IMAP_CONN_TIMEOUT=60000
export IMAP_AUTH_TIMEOUT=30000

# Permanent setup (add to ~/.bashrc or ~/.zshrc)
echo 'export SMTP_HOST="smtp.gmail.com"' >> ~/.bashrc
echo 'export SMTP_PORT="587"' >> ~/.bashrc
echo 'export SMTP_SECURE="false"' >> ~/.bashrc
echo 'export EMAIL_USER="your-email@gmail.com"' >> ~/.bashrc
echo 'export EMAIL_PASS="your-app-password"' >> ~/.bashrc
echo 'export IMAP_HOST="imap.gmail.com"' >> ~/.bashrc
echo 'export IMAP_PORT="993"' >> ~/.bashrc
echo 'export IMAP_TLS="true"' >> ~/.bashrc
echo 'export SMTP_REJECT_UNAUTHORIZED="false"' >> ~/.bashrc
echo 'export IMAP_REJECT_UNAUTHORIZED="false"' >> ~/.bashrc
echo 'export IMAP_CONN_TIMEOUT="60000"' >> ~/.bashrc
echo 'export IMAP_AUTH_TIMEOUT="60000"' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc  # or source ~/.zshrc
```

#### **🪟 Windows PowerShell**

**🔥 Method 1: Administrator PowerShell (RECOMMENDED)**

Right-click PowerShell → "Run as Administrator", then:

```powershell
# Permanent setup (Machine-level) - BEST FOR GLOBAL CLI
[Environment]::SetEnvironmentVariable("SMTP_HOST", "smtp.gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_PORT", "587", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_SECURE", "false", "Machine")
[Environment]::SetEnvironmentVariable("EMAIL_USER", "your-email@gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("EMAIL_PASS", "your-app-password", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_HOST", "imap.gmail.com", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_PORT", "993", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_TLS", "true", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_TLS", "true", "Machine")
[Environment]::SetEnvironmentVariable("SMTP_REJECT_UNAUTHORIZED", "false", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_REJECT_UNAUTHORIZED", "false", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_CONN_TIMEOUT", "60000", "Machine")
[Environment]::SetEnvironmentVariable("IMAP_AUTH_TIMEOUT", "60000", "Machine")

# Also add npm global path to system PATH (if needed)
$npmPath = npm config get prefix
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "Machine")

# IMPORTANT: Close PowerShell and open NEW PowerShell window (not as admin)
# Test with: $env:EMAIL_USER (should show your email)
```

**✅ Administrator Benefits:**
- ✅ **System-wide access** - Works for ALL users and applications
- ✅ **More persistent** - Survives user profile changes  
- ✅ **Perfect for global CLI** - Ideal for npm global packages
- ✅ **Professional setup** - Production-ready configuration
- ✅ **No permission issues** - Bypasses user-level restrictions

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
email-send "user@example.com" "Subject" "Body"
esend "user@example.com" "Subject" "Body"
email-stats
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
email-stats
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
email-send "test@example.com" "Hello" "Test message"
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
email-cli                    # View recent emails
email-stats                  # Check account info
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
email-cli                    # View recent emails
email-stats                  # Check account info
```

## 📧 Basic Email Operations

### 📤 Send Email (`email-send` / `esend`)
Send emails to up to 3 recipients with optional HTML content. For more recipients, use `email-bulk`.

```bash
# Basic usage
email-send "user@example.com" "Subject" "Email body"
esend "user@example.com" "Meeting Reminder" "Team meeting at 3 PM today"

# Multiple recipients (up to 3)
email-send "user1@example.com,user2@example.com,user3@example.com" "Update" "Important update for everyone"

# With HTML content
esend "client@example.com" "Newsletter" "Plain text version" "<h1>HTML Newsletter</h1><p>Rich content here</p>"
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
emarkread 67890 true

# Mark as unread
email-mark-read 12345 false
emarkread 67890 false
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
Send emails with unlimited file attachments (comma-separated paths and optional custom names).

```bash
# Single attachment
email-attach "user@example.com" "Report" "Please find attached report" "./report.pdf"

# Multiple attachments with custom names
email-attach "user@example.com" "Files" "Multiple files attached" "./file1.pdf,./file2.jpg,./data.xlsx" "Report,Photo,Spreadsheet"

# Multiple attachments without custom names (uses original filenames)
eattach "team@company.com" "Resources" "Project files" "./code.js,./docs.pdf,./image.png"

# Complex example with full paths
email-attach "client@example.com" "Deliverables" "Final project files" "/home/user/final.pdf,/home/user/code.zip,/home/user/demo.mp4" "Final Report,Source Code,Demo Video"
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
Send personalized emails to multiple recipients from a file or comma-separated list.

```bash
# Send to recipients from file
email-bulk recipients.txt "Newsletter" "Monthly company newsletter content"
ebulk team-emails.txt "Meeting Reminder" "Team meeting tomorrow at 2 PM"

# Send to comma-separated email addresses (no quotes needed)
email-bulk user1@example.com,user2@example.com,user3@example.com "Update" "Important announcement"
ebulk alice@company.com,bob@company.com,charlie@company.com "Meeting" "Team meeting at 3 PM"

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
csearch "jane"

# Search by email domain
csearch "@company.com"        # All company contacts
csearch "@gmail.com"         # All Gmail contacts

# Search by partial email
csearch "support@"           # All support emails

# Search by any text
csearch "client"             # Contacts with "client" in name/email
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
contact-group "work"
cgroup "clients"

# Get specific groups  
cgroup "family"
contact-group "vip"
cgroup "management"
cgroup "developers"

# View all available groups
cgroup --help    # Shows available groups if any
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
contact-update contact_123 name "John Smith Jr."
cupdate contact_456 name "Jane Smith-Johnson"

# Update email
cupdate contact_123 email "newemail@example.com"
contact-update contact_456 email "updated@company.com"

# Update phone number
cupdate contact_123 phone "+1-555-0123"
contact-update contact_789 phone "555.123.4567"

# Update group assignment
cupdate contact_789 group "management"
contact-update contact_101 group "vip"
cupdate contact_202 group "developers"

# Clear a field (set to empty)
cupdate contact_123 phone ""
cupdate contact_456 group ""
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
contact-delete contact_123
cdelete contact_456

# Delete with confirmation
cdelete contact_789    # Will prompt for confirmation

# Batch delete (if supported)
contact-delete contact_123 contact_456 contact_789
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
email-send --help          # Send email help
list --help               # List emails help  
email-read --help         # Read email help
email-reply --help        # Reply help

# Advanced command help
email-attach --help       # Attachment help
email-forward --help      # Forward help
email-search --help       # Search help

# Contact management help
contact-add --help        # Add contact help
contact-list --help       # List contacts help
contact-search --help     # Search contacts help

# Help works with all aliases
esend -h                  # Same as email-send --help
eread --help             # Same as email-read --help
cadd -h                  # Same as contact-add --help
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
list --unread              # See unread emails
list 10                    # Show latest 10 emails
email-stats               # Get inbox statistics

# 2. Read important emails  
email-read 1              # Read newest email
eread --id email_12345    # Read specific email

# 3. Send quick updates
esend "team@company.com" "Daily Standup" "Today's priorities and blockers"
esend "boss@company.com" "Status Update" "Project on track, will deliver by Friday"

# 4. Follow up on important emails
esearch --from "client@company.com" --unread
esearch --subject "urgent" --since "today"
```

### Contact Management Workflow  
```bash
# 1. Add new business contacts
cadd "Jane Smith" "jane@newclient.com" "clients"
contact-add "John Developer" "john.dev@company.com" "developers" "+1-555-0199"

# 2. Organize and manage contacts
contact-list              # See all contacts
cgroup "work"             # Check work contacts  
csearch "gmail.com"       # Find Gmail contacts
csearch "manager"         # Search by role/name

# 3. Update contact information
cupdate contact_123 group "vip"           # Promote to VIP
contact-update contact_456 phone "+1-555-0200"  # Update phone
cupdate contact_789 email "newemail@company.com"  # Update email
```

### Advanced Email Operations
```bash
# 1. Handle attachments
email-attach "client@company.com" "Contract Review" "Please review attached contract" "contract.pdf"
eattach "team@company.com" "Resources" "Meeting materials" "agenda.pdf,slides.ppt,notes.txt"

# 2. Email management and organization
esearch --subject "invoice" --since "2024-01-01"    # Find invoices
esearch --from "support@" --unread                  # Unread support emails
email-forward 12345 "accounting@company.com" "Please process this invoice"

# 3. Bulk operations (when available)
ebulk newsletter-list.txt "Monthly Update" "Our latest news and updates"
email-bulk subscribers.txt "Product Launch" "Exciting new features available!"

# 4. Advanced search and filtering
esearch --subject "meeting" --since "last week"     # Recent meeting emails
esearch --has-attachment --from "@company.com"      # Company emails with files
esearch --flagged --priority high                   # Important flagged emails
```

### Complete Project Communication Workflow
```bash
# 1. Setup project contacts
cadd "Project Manager" "pm@client.com" "project-alpha"
cadd "Lead Developer" "lead@team.com" "project-alpha"  
cadd "Client Stakeholder" "stakeholder@client.com" "project-alpha"

# 2. Daily project communication
esend "pm@client.com,lead@team.com" "Daily Update" "Progress report and next steps"
eattach "stakeholder@client.com" "Weekly Report" "Status update" "report.pdf,metrics.xlsx"

# 3. Follow project communications
cgroup "project-alpha"                    # View project team
esearch --from "@client.com" --unread    # Check client messages
esearch --subject "project-alpha" --since "this week"  # Project emails

# 4. Handle project issues
email-reply 54321 "Re: Bug Report" "Fix deployed, please verify on your end"
eforward 67890 "dev-team@company.com" "Please investigate this issue ASAP"
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
email-send "user@example.com" "Subject" "Message"
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