#!/usr/bin/env powershell

# Email MCP Server - PNPM Windows Installation Script
# Run this script as Administrator to properly install and configure with pnpm

param(
    [switch]$Force,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Email MCP Server - PNPM Windows Installation Script

Usage:
  .\install-pnpm-windows.ps1          # Standard installation
  .\install-pnpm-windows.ps1 -Force   # Force reinstall even if already installed

Requirements:
  - Run as Administrator
  - Node.js and pnpm installed
  - Internet connection

This script will:
1. Install the package globally via pnpm
2. Configure system PATH variables for pnpm global directory
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
🔄 Email MCP Server - PNPM Windows Installer
═══════════════════════════════════════════
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

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm not found! Please install pnpm first." -ForegroundColor Red
    Write-Host "💡 Install with: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check current installation
$packageName = "@0xshariq/email-mcp-server"
Write-Host "🔍 Checking current installation..." -ForegroundColor Blue

try {
    $currentInstall = pnpm list -g $packageName 2>$null
    if ($currentInstall -like "*$packageName*" -and -not $Force) {
        Write-Host "✅ Package already installed globally with pnpm" -ForegroundColor Green
        Write-Host "💡 Use -Force to reinstall" -ForegroundColor Yellow
    } else {
        if ($Force) {
            Write-Host "🔄 Force reinstall requested..." -ForegroundColor Yellow
            pnpm uninstall -g $packageName 2>$null
        }
        
        Write-Host "📦 Installing package globally with pnpm..." -ForegroundColor Blue
        pnpm install -g $packageName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Package installed successfully with pnpm!" -ForegroundColor Green
        } else {
            Write-Host "❌ Package installation failed!" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "⚠️  Could not check installation status, proceeding with install..." -ForegroundColor Yellow
    pnpm install -g $packageName
}

Write-Host ""

# Configure PATH for pnpm
Write-Host "🔧 Configuring system PATH for pnpm..." -ForegroundColor Blue

# Get pnpm global directory
try {
    $pnpmRoot = pnpm root -g
    $pnpmBinPath = Split-Path $pnpmRoot -Parent
    Write-Host "📍 pnpm global root: $pnpmRoot" -ForegroundColor Gray
    Write-Host "📍 pnpm bin path: $pnpmBinPath" -ForegroundColor Gray
} catch {
    Write-Host "❌ Could not get pnpm global directory!" -ForegroundColor Red
    Write-Host "💡 Make sure pnpm is properly installed" -ForegroundColor Yellow
    exit 1
}

# Also check for AppData pnpm path (common on Windows)
$appDataPnpmPath = "$env:APPDATA\npm"
$localAppDataPnpmPath = "$env:LOCALAPPDATA\pnpm"

$pathsToAdd = @()

# Add main pnpm bin path
if (Test-Path $pnpmBinPath) {
    $pathsToAdd += $pnpmBinPath
}

# Add AppData paths if they exist
if (Test-Path $appDataPnpmPath) {
    $pathsToAdd += $appDataPnpmPath
}

if (Test-Path $localAppDataPnpmPath) {
    $pathsToAdd += $localAppDataPnpmPath
}

# Update system PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
$pathUpdated = $false

foreach ($pathToAdd in $pathsToAdd) {
    if ($currentPath -notlike "*$pathToAdd*") {
        Write-Host "➕ Adding $pathToAdd to system PATH..." -ForegroundColor Blue
        $currentPath = $currentPath + ";" + $pathToAdd
        $pathUpdated = $true
    } else {
        Write-Host "✅ $pathToAdd already in system PATH" -ForegroundColor Green
    }
}

if ($pathUpdated) {
    [Environment]::SetEnvironmentVariable("PATH", $currentPath, "Machine")
    Write-Host "✅ System PATH updated!" -ForegroundColor Green
} else {
    Write-Host "✅ All pnpm paths already in system PATH" -ForegroundColor Green
}

Write-Host ""

# Verify installation
Write-Host "🔍 Verifying installation..." -ForegroundColor Blue

# Check if we can find the commands in pnpm global directory
$pnpmGlobalNodeModules = "$pnpmRoot\@0xshariq\email-mcp-server"

if (Test-Path $pnpmGlobalNodeModules) {
    Write-Host "  ✅ Package found in pnpm global directory" -ForegroundColor Green
    
    # List some key files
    $emailCliPath = "$pnpmGlobalNodeModules\email-cli.js"
    if (Test-Path $emailCliPath) {
        Write-Host "  ✅ email-cli.js found" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ Package not found in expected pnpm directory" -ForegroundColor Red
    Write-Host "  📍 Expected: $pnpmGlobalNodeModules" -ForegroundColor Gray
}

Write-Host ""

Write-Host "🎉 Installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. ⚠️  RESTART your computer (required for PATH changes)" -ForegroundColor Yellow
Write-Host "2. Set up environment variables for your email account" -ForegroundColor Gray
Write-Host "3. Test with any of these methods:" -ForegroundColor Gray
Write-Host ""
Write-Host "   Method A - Direct pnpm execution:" -ForegroundColor Cyan
Write-Host "   pnpm exec email-cli --version" -ForegroundColor Gray
Write-Host ""
Write-Host "   Method B - After restart (if PATH works):" -ForegroundColor Cyan  
Write-Host "   email-cli --version" -ForegroundColor Gray
Write-Host ""
Write-Host "   Method C - Using npx as fallback:" -ForegroundColor Cyan
Write-Host "   npx @0xshariq/email-mcp-server email-cli --version" -ForegroundColor Gray

Write-Host ""
Write-Host "📚 Documentation: https://github.com/0xshariq/email-mcp-server" -ForegroundColor Cyan