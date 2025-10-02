#!/bin/bash

# Create all CLI command symlinks properly
PROJECT_DIR="/home/sharique/desktop/shariq-mcp-servers/email-mcp-server"
CLI_FILE="$PROJECT_DIR/email-cli.js"

# Basic Email Commands
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-send
sudo ln -sf "$CLI_FILE" /usr/local/bin/esend
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-read  
sudo ln -sf "$CLI_FILE" /usr/local/bin/eread
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-get
sudo ln -sf "$CLI_FILE" /usr/local/bin/eget
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-delete
sudo ln -sf "$CLI_FILE" /usr/local/bin/edelete
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-mark-read
sudo ln -sf "$CLI_FILE" /usr/local/bin/emarkread

# Advanced Email Commands
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-search
sudo ln -sf "$CLI_FILE" /usr/local/bin/esearch
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-attach
sudo ln -sf "$CLI_FILE" /usr/local/bin/eattach
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-forward
sudo ln -sf "$CLI_FILE" /usr/local/bin/eforward
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-reply
sudo ln -sf "$CLI_FILE" /usr/local/bin/ereply
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-stats
sudo ln -sf "$CLI_FILE" /usr/local/bin/estats
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-draft
sudo ln -sf "$CLI_FILE" /usr/local/bin/edraft
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-schedule
sudo ln -sf "$CLI_FILE" /usr/local/bin/eschedule
sudo ln -sf "$CLI_FILE" /usr/local/bin/email-bulk
sudo ln -sf "$CLI_FILE" /usr/local/bin/ebulk

# Contact Commands
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-add
sudo ln -sf "$CLI_FILE" /usr/local/bin/cadd
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-list
sudo ln -sf "$CLI_FILE" /usr/local/bin/clist
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-search
sudo ln -sf "$CLI_FILE" /usr/local/bin/csearch
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-group
sudo ln -sf "$CLI_FILE" /usr/local/bin/cgroup
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-update
sudo ln -sf "$CLI_FILE" /usr/local/bin/cupdate
sudo ln -sf "$CLI_FILE" /usr/local/bin/contact-delete
sudo ln -sf "$CLI_FILE" /usr/local/bin/cdelete

echo "✅ All CLI commands installed successfully!"