#!/bin/bash

# Email MCP Server CLI Installation Script
# This script creates global symlinks for all CLI commands

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📧 Installing Email MCP Server CLI Commands...${NC}"

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="/usr/local/bin"

# Check if we have permission to write to /usr/local/bin
if [ ! -w "$BIN_DIR" ]; then
    echo -e "${YELLOW}⚠️  Need sudo permissions to install to $BIN_DIR${NC}"
    echo -e "${YELLOW}You can also run 'npm link' after 'npm install -g' instead${NC}"
fi

# Function to create symlink
create_symlink() {
    local source_file="$1"
    local command_name="$2"
    local target_path="$BIN_DIR/$command_name"
    
    if [ -f "$source_file" ]; then
        if [ -L "$target_path" ] || [ -f "$target_path" ]; then
            echo -e "${YELLOW}⚠️  Removing existing $command_name${NC}"
            sudo rm -f "$target_path"
        fi
        
        echo -e "${GREEN}✅ Installing $command_name${NC}"
        sudo ln -s "$source_file" "$target_path"
    else
        echo -e "${RED}❌ Source file not found: $source_file${NC}"
    fi
}

# Install basic email commands
echo -e "\n${BLUE}📧 Installing Basic Email Commands...${NC}"
create_symlink "$PROJECT_DIR/bin/basic/email-send.js" "basic-email-send"
create_symlink "$PROJECT_DIR/bin/basic/email-send.js" "basic-esend"
create_symlink "$PROJECT_DIR/bin/basic/email-read.js" "basic-email-read"
create_symlink "$PROJECT_DIR/bin/basic/email-read.js" "basic-eread"
create_symlink "$PROJECT_DIR/bin/basic/email-get.js" "basic-email-get"
create_symlink "$PROJECT_DIR/bin/basic/email-get.js" "basic-eget"
create_symlink "$PROJECT_DIR/bin/basic/email-delete.js" "basic-email-delete"
create_symlink "$PROJECT_DIR/bin/basic/email-delete.js" "basic-edelete"
create_symlink "$PROJECT_DIR/bin/basic/email-mark-read.js" "basic-email-mark-read"
create_symlink "$PROJECT_DIR/bin/basic/email-mark-read.js" "basic-emarkread"

# Also create simple aliases without basic- prefix for commonly used commands
echo -e "\n${BLUE}📧 Installing Common Email Aliases...${NC}"
create_symlink "$PROJECT_DIR/bin/basic/email-send.js" "email-send"
create_symlink "$PROJECT_DIR/bin/basic/email-send.js" "esend"
create_symlink "$PROJECT_DIR/bin/basic/email-read.js" "email-read"
create_symlink "$PROJECT_DIR/bin/basic/email-read.js" "eread"

# Install advanced email commands
echo -e "\n${BLUE}🚀 Installing Advanced Email Commands...${NC}"
create_symlink "$PROJECT_DIR/bin/advanced/email-search.js" "advanced-email-search"
create_symlink "$PROJECT_DIR/bin/advanced/email-search.js" "advanced-esearch"
create_symlink "$PROJECT_DIR/bin/advanced/email-attach.js" "advanced-email-attach"
create_symlink "$PROJECT_DIR/bin/advanced/email-attach.js" "advanced-eattach"
create_symlink "$PROJECT_DIR/bin/advanced/email-forward.js" "advanced-email-forward"
create_symlink "$PROJECT_DIR/bin/advanced/email-forward.js" "advanced-eforward"
create_symlink "$PROJECT_DIR/bin/advanced/email-reply.js" "advanced-email-reply"
create_symlink "$PROJECT_DIR/bin/advanced/email-reply.js" "advanced-ereply"
create_symlink "$PROJECT_DIR/bin/advanced/email-stats.js" "advanced-email-stats"
create_symlink "$PROJECT_DIR/bin/advanced/email-stats.js" "advanced-estats"
create_symlink "$PROJECT_DIR/bin/advanced/email-draft.js" "advanced-email-draft"
create_symlink "$PROJECT_DIR/bin/advanced/email-draft.js" "advanced-edraft"
create_symlink "$PROJECT_DIR/bin/advanced/email-schedule.js" "advanced-email-schedule"
create_symlink "$PROJECT_DIR/bin/advanced/email-schedule.js" "advanced-eschedule"
create_symlink "$PROJECT_DIR/bin/advanced/email-bulk.js" "advanced-email-bulk"
create_symlink "$PROJECT_DIR/bin/advanced/email-bulk.js" "advanced-ebulk"

# Install contact management commands  
echo -e "\n${BLUE}👥 Installing Contact Management Commands...${NC}"
create_symlink "$PROJECT_DIR/bin/contacts/contact-add.js" "contacts-add"
create_symlink "$PROJECT_DIR/bin/contacts/contact-add.js" "contacts-cadd"
create_symlink "$PROJECT_DIR/bin/contacts/contact-list.js" "contacts-list"
create_symlink "$PROJECT_DIR/bin/contacts/contact-list.js" "contacts-clist"
create_symlink "$PROJECT_DIR/bin/contacts/contact-search.js" "contacts-search"
create_symlink "$PROJECT_DIR/bin/contacts/contact-search.js" "contacts-csearch"
create_symlink "$PROJECT_DIR/bin/contacts/contact-group.js" "contacts-group"
create_symlink "$PROJECT_DIR/bin/contacts/contact-group.js" "contacts-cgroup"
create_symlink "$PROJECT_DIR/bin/contacts/contact-update.js" "contacts-update"
create_symlink "$PROJECT_DIR/bin/contacts/contact-update.js" "contacts-cupdate"
create_symlink "$PROJECT_DIR/bin/contacts/contact-delete.js" "contacts-delete"
create_symlink "$PROJECT_DIR/bin/contacts/contact-delete.js" "contacts-cdelete"

# Also create simple aliases for commonly used contact commands
create_symlink "$PROJECT_DIR/bin/contacts/contact-add.js" "contact-add"
create_symlink "$PROJECT_DIR/bin/contacts/contact-add.js" "cadd"
create_symlink "$PROJECT_DIR/bin/contacts/contact-list.js" "contact-list"
create_symlink "$PROJECT_DIR/bin/contacts/contact-list.js" "clist"

# Install main CLI wrapper
create_symlink "$PROJECT_DIR/email-cli.js" "email-cli"

echo -e "\n${GREEN}✅ Installation complete!${NC}"
echo -e "\n${BLUE}📚 Usage Examples:${NC}"
echo -e "${BLUE}Basic Commands:${NC}"
echo -e "${YELLOW}  email-send user@example.com 'Hello' 'Test message'${NC}"
echo -e "${YELLOW}  esend user@example.com 'Hello' 'Test message'${NC}"
echo -e "${YELLOW}  email-read 5${NC}"
echo -e "${YELLOW}  basic-email-send user@example.com 'Subject' 'Body'${NC}"
echo -e "\n${BLUE}Advanced Commands:${NC}"
echo -e "${YELLOW}  advanced-email-search 'query text'${NC}"
echo -e "${YELLOW}  advanced-email-forward 123 user@example.com${NC}"
echo -e "${YELLOW}  advanced-estats${NC}"
echo -e "\n${BLUE}Contact Commands:${NC}"
echo -e "${YELLOW}  contact-add 'John Doe' john@example.com work${NC}"
echo -e "${YELLOW}  cadd 'Jane Smith' jane@example.com friends${NC}"
echo -e "${YELLOW}  contacts-list${NC}"
echo -e "${YELLOW}  contacts-search 'John'${NC}"
echo -e "\n${BLUE}🆘 Help:${NC}"
echo -e "${YELLOW}  email-send --help${NC}"
echo -e "${YELLOW}  contact-add --help${NC}"
echo -e "${YELLOW}  advanced-email-search --help${NC}"
echo -e "${YELLOW}  Any command with --help flag${NC}"
echo -e "\n${BLUE}📁 Configuration:${NC}"
echo -e "${YELLOW}  Make sure to configure your .env file before using${NC}"