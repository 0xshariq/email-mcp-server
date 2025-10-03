#!/usr/bin/env powershell

# Email MCP Server - Windows Installation Script
# Run this script as Administrator to properly install and configure

param(
    [switch]$Force,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Email MCP Server - Windows Installation Script

Usage:
  .\install-windows.ps1          # Standard installation
  .\install-windows.ps1 -Force   # Force reinstall even if already installed

Requirements:
  - Run as Administrator
  - Node.js and npm installed
  - Internet connection

This script will:
1. Install the package globally via npm
2. Configure system PATH variables
3. Set up all email CLI commands
4. Verify the installation

"@ -ForegroundColor Cyan
    exit 0
}

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "💡 Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host @"
🔄 Email MCP Server - Windows Installer
═══════════════════════════════════════
"@ -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "💡 Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found! Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check current installation
$packageName = "@0xshariq/email-mcp-server"
Write-Host "🔍 Checking current installation..." -ForegroundColor Blue

try {
    $currentInstall = npm list -g $packageName --depth=0 2>$null
    if ($currentInstall -like "*$packageName*" -and -not $Force) {
        Write-Host "✅ Package already installed globally" -ForegroundColor Green
        Write-Host "💡 Use -Force to reinstall" -ForegroundColor Yellow
    } else {
        if ($Force) {
            Write-Host "🔄 Force reinstall requested..." -ForegroundColor Yellow
            npm uninstall -g $packageName 2>$null
        }
        
        Write-Host "📦 Installing package globally..." -ForegroundColor Blue
        npm install -g $packageName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Package installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Package installation failed!" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "⚠️  Could not check installation status, proceeding with install..." -ForegroundColor Yellow
    npm install -g $packageName
}

Write-Host ""

# Configure PATH
Write-Host "🔧 Configuring system PATH..." -ForegroundColor Blue

$npmPath = npm config get prefix
Write-Host "📍 NPM global path: $npmPath" -ForegroundColor Gray

$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

if ($currentPath -notlike "*$npmPath*") {
    Write-Host "➕ Adding npm path to system PATH..." -ForegroundColor Blue
    $newPath = $currentPath + ";" + $npmPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "✅ System PATH updated!" -ForegroundColor Green
} else {
    Write-Host "✅ NPM path already in system PATH" -ForegroundColor Green
}

Write-Host ""

# Verify installation
Write-Host "🔍 Verifying installation..." -ForegroundColor Blue

$testCommands = @("email-cli", "email-send", "esend", "email-read", "eread")
$workingCommands = 0

foreach ($cmd in $testCommands) {
    $cmdPath = "$npmPath\$cmd.cmd"
    if (Test-Path $cmdPath) {
        Write-Host "  ✅ $cmd" -ForegroundColor Green
        $workingCommands++
    } else {
        Write-Host "  ❌ $cmd (not found)" -ForegroundColor Red
    }
}

Write-Host ""

if ($workingCommands -gt 0) {
    Write-Host "🎉 Installation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. ⚠️  RESTART your computer (required for PATH changes)" -ForegroundColor Yellow
    Write-Host "2. Set up environment variables for your email account" -ForegroundColor Gray
    Write-Host "3. Test with: email-cli --version" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 If commands still don't work after restart, use:" -ForegroundColor Cyan
    Write-Host "   npx @0xshariq/email-mcp-server email-cli --version" -ForegroundColor Gray
} else {
    Write-Host "❌ Installation verification failed!" -ForegroundColor Red
    Write-Host "💡 Try manual installation:" -ForegroundColor Yellow
    Write-Host "   npm install -g @0xshariq/email-mcp-server" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📚 Documentation: https://github.com/0xshariq/email-mcp-server" -ForegroundColor Cyan