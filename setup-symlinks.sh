#!/bin/bash

# Cross-platform CLI installation script for Email MCP Server
# This script creates symlinks on Unix-like systems (Linux/macOS/WSL)

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_FILE="$PROJECT_DIR/email-cli.js"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "📦 Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check if CLI file exists
if [ ! -f "$CLI_FILE" ]; then
    echo "❌ CLI file not found: $CLI_FILE"
    echo "📁 Make sure you're running this script from the project directory"
    exit 1
fi

# Make CLI file executable
chmod +x "$CLI_FILE"

echo "🧹 Removing existing symlinks..."

# Define all command names
COMMANDS=(
    # Basic Email Commands
    "email-send" "esend"
    "email-read" "eread"
    "email-get" "eget"
    "email-delete" "edelete"
    "email-mark-read" "emarkread"
    "list"
    # Advanced Email Commands
    "email-search" "esearch"
    "email-attach" "eattach"
    "email-forward" "eforward"
    "email-reply" "ereply"
    "email-stats" "estats"
    "email-draft" "edraft"
    "email-schedule" "eschedule"
    "email-bulk" "ebulk"
    # Contact Commands
    "contact-add" "cadd"
    "contact-list" "clist"
    "contact-search" "csearch"
    "contact-group" "cgroup"
    "contact-update" "cupdate"
    "contact-delete" "cdelete"
)

# Remove existing symlinks
for cmd in "${COMMANDS[@]}"; do
    if [ -L "/usr/local/bin/$cmd" ] || [ -f "/usr/local/bin/$cmd" ]; then
        echo "  Removing: /usr/local/bin/$cmd"
        sudo rm -f "/usr/local/bin/$cmd"
    fi
done

echo "🔗 Creating new symlinks..."

# Create new symlinks
for cmd in "${COMMANDS[@]}"; do
    echo "  Creating: /usr/local/bin/$cmd -> $CLI_FILE"
    sudo ln -sf "$CLI_FILE" "/usr/local/bin/$cmd"
done

echo ""
echo "✅ All CLI commands installed successfully!"
echo ""
echo "📋 Available commands:"
echo "   Basic: email-send, email-read, email-get, email-delete, email-mark-read, list"
echo "   Advanced: email-search, email-attach, email-forward, email-reply, email-stats"
echo "   Contacts: contact-add, contact-list, contact-search, contact-update, contact-delete"
echo ""
echo "🚀 Usage examples:"
echo "   email-send recipient@example.com 'Subject' 'Message'"
echo "   email-read 10"
echo "   email-get 1234"
echo ""
echo "💡 For cross-platform usage, install globally with npm:"
echo "   npm install -g ."