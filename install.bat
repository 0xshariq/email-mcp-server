@echo off
echo 🚀 Installing Email MCP Server CLI for Windows...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo 📦 Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    echo 📦 Please make sure npm is installed with Node.js
    pause
    exit /b 1
)

:: Build the project
echo 🔨 Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

:: Install globally
echo 📦 Installing CLI commands globally...
npm install -g .
if %errorlevel% neq 0 (
    echo ❌ Installation failed. Try running as Administrator
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed successfully!
echo.
echo 📋 Available commands:
echo    📧 Basic: email-send, email-read, email-get, email-delete, email-list
echo    🔍 Advanced: email-search, email-attach, email-forward, email-reply
echo    📊 Stats: email-stats, email-bulk, email-draft, email-schedule
echo    👥 Contacts: contact-add, contact-list, contact-search, contact-update
echo.
echo 🚀 Quick start:
echo    email-send recipient@example.com "Subject" "Message"
echo    email-read 10
echo.
echo 💡 All commands now work in PowerShell, CMD, and any terminal!
pause