#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Function to display current user email at the start of commands
function displayCurrentUser() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const emailUserMatch = envContent.match(/^EMAIL_USER=(.+)$/m);
      if (emailUserMatch) {
        const userEmail = emailUserMatch[1].trim().replace(/['"]/g, '');
        console.log(chalk.blue(`📧 Account: ${chalk.cyan(userEmail)}`));
        console.log(); // Add spacing
      }
    }
  } catch (error) {
    // Silently ignore errors - env file might not exist yet
  }
}

// Function to clean and format email body text
function cleanEmailBody(body) {
  if (!body) return '(No content)';
  
  let cleaned = body;
  
  // Remove quoted-printable encoding
  cleaned = cleaned.replace(/=([0-9A-F]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  // Remove soft line breaks (= at end of line)
  cleaned = cleaned.replace(/=\r?\n/g, '');
  
  // Clean up HTML tags but preserve some structure
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&#39;/g, "'");
  
  // Clean up URLs and make them more readable
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, (url) => {
    if (url.length > 60) {
      return url.substring(0, 50) + '...';
    }
    return url;
  });
  
  // Remove excessive whitespace but preserve paragraph breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.trim();
  
  // Remove email headers and MIME boundaries
  cleaned = cleaned.replace(/^--[a-zA-Z0-9_]+.*$/gm, '');
  cleaned = cleaned.replace(/^Content-[^:]+:.*$/gm, '');
  cleaned = cleaned.replace(/^MIME-Version:.*$/gm, '');
  
  return cleaned || '(No readable content)';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the command name from the actual command used to invoke this script
const fullPath = process.argv[1];
let commandName = path.basename(fullPath);

// For pnpm-generated wrappers, detect the actual command
if (commandName === 'email-cli.js') {
  let detectedCommand = null;
  
  // Try to detect from parent process
  try {
    const ppid = process.ppid;
    if (ppid) {
      const psOutput = execSync(`ps -p ${ppid} -o args= 2>/dev/null || echo ""`, { encoding: 'utf8' }).trim();
      const wrapperMatch = psOutput.match(/(?:bash|sh|dash)\s+.*?\/([e][a-z-]+)(?:\s|$)/);
      if (wrapperMatch && wrapperMatch[1]) {
        detectedCommand = wrapperMatch[1];
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Fallback to environment variable
  if (!detectedCommand && process.env._) {
    const envCommand = path.basename(process.env._);
    if (envCommand.startsWith('e') && envCommand !== 'email-mcp-server') {
      detectedCommand = envCommand;
    }
  }
  
  if (detectedCommand) {
    commandName = detectedCommand;
  }
}

// Available commands mapping
const commands = {
  // Basic Email Operations
  'email-send': 'basic/email-send.js',
  'esend': 'basic/email-send.js',
  'email-read': 'basic/email-read.js',
  'eread': 'basic/email-read.js',
  'email-get': 'basic/email-get.js',
  'eget': 'basic/email-get.js',
  'email-delete': 'basic/email-delete.js',
  'edelete': 'basic/email-delete.js',
  'email-mark-read': 'basic/email-mark-read.js',
  'emarkread': 'basic/email-mark-read.js',

  // Advanced Email Operations  
  'email-search': 'advanced/email-search.js',
  'esearch': 'advanced/email-search.js',
  'email-forward': 'advanced/email-forward.js',
  'eforward': 'advanced/email-forward.js',
  'email-reply': 'advanced/email-reply.js',
  'ereply': 'advanced/email-reply.js',
  'email-stats': 'advanced/email-stats.js',
  'estats': 'advanced/email-stats.js',
  'email-draft': 'advanced/email-draft.js',
  'edraft': 'advanced/email-draft.js',
  'email-schedule': 'advanced/email-schedule.js',
  'eschedule': 'advanced/email-schedule.js',
  'email-bulk': 'advanced/email-bulk.js',
  'ebulk': 'advanced/email-bulk.js',
  'email-attach': 'advanced/email-attach.js',
  'eattach': 'advanced/email-attach.js',

  // Contact Management
  'contact-add': 'contacts/contact-add.js',
  'cadd': 'contacts/contact-add.js',
  'contact-list': 'contacts/contact-list.js',
  'clist': 'contacts/contact-list.js',
  'contact-search': 'contacts/contact-search.js',
  'csearch': 'contacts/contact-search.js',
  'contact-group': 'contacts/contact-group.js',
  'cgroup': 'contacts/contact-group.js',
  'contact-update': 'contacts/contact-update.js',
  'cupdate': 'contacts/contact-update.js',
  'contact-delete': 'contacts/contact-delete.js',
  'cdelete': 'contacts/contact-delete.js',
  
  // Utility Commands  
  'list': 'basic/list.js',
  'email-cli': null // Special case - handled in main function
};

async function main() {
  const args = process.argv.slice(2);
  let command = commandName;
  let commandArgs = args;
  
  // If called as email-cli.js, get command from arguments
  if (commandName === 'email-cli.js' || commandName === 'email-cli') {
    // Handle version flag
    if (args.includes('--version') || args.includes('-v')) {
      showVersion();
      return;
    }
    
    if (args.length === 0 || (args.includes('--help') || args.includes('-h')) && args.length === 1) {
      showUsage();
      return;
    }
    command = args[0];
    commandArgs = args.slice(1);
  }

  // Handle special email-cli command
  if (command === 'email-cli') {
    if (commandArgs.includes('--version') || commandArgs.includes('-v')) {
      showVersion();
      return;
    } else if (commandArgs.includes('--help') || commandArgs.includes('-h') || commandArgs.length === 0) {
      showUsage();
      return;
    } else {
      console.error(chalk.red.bold(`❌ Unknown option for email-cli: ${commandArgs[0]}`));
      console.log(chalk.yellow('💡 Use --help or --version'));
      process.exit(1);
    }
  }

  // Handle direct command execution (when called as the command itself)
  if (commands[command] && commands[command] !== null) {
    // Display current user email (except for help commands)
    if (!commandArgs.includes('--help') && !commandArgs.includes('-h')) {
      displayCurrentUser();
    }
    
    const scriptPath = path.join(__dirname, 'bin', commands[command]);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red.bold(`❌ Script not found: ${scriptPath}`));
      console.log(chalk.yellow('Available commands:'));
      Object.keys(commands).forEach(cmd => {
        console.log(chalk.cyan(`  ${cmd}`));
      });
      process.exit(1);
    }
    
    // Change to the project directory to ensure relative imports work
    process.chdir(__dirname);
    
    // Execute the script with proper environment
    const childProcess = spawn('node', [scriptPath, ...commandArgs], {
      stdio: 'inherit',
      cwd: __dirname,
      env: { 
        ...process.env,
        NODE_PATH: __dirname
      }
    });

    childProcess.on('close', (code) => {
      process.exit(code || 0);
    });

    childProcess.on('error', (err) => {
      console.error(chalk.red.bold('❌ Error executing script:'), err.message);
      process.exit(1);
    });
  } else {
    console.error(chalk.red.bold(`❌ Unknown command: ${command}`));
    console.log(chalk.yellow('\n💡 Run with --help to see available commands'));
    showUsage();
    process.exit(1);
  }
}

function showVersion() {
  // Read version from package.json
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(chalk.bold.cyan('📧 Email MCP Server CLI'));
    console.log(chalk.gray(`Version: ${chalk.white(packageJson.version)}`));
    console.log(chalk.gray(`Package: ${chalk.white(packageJson.name)}`));
    console.log();
    console.log(chalk.dim('A powerful command-line interface for email operations'));
    console.log(chalk.dim('Use --help to see available commands'));
  } catch (error) {
    console.log(chalk.bold.cyan('📧 Email MCP Server CLI'));
    console.log(chalk.red('Version information not available'));
  }
}

function showUsage() {
  console.log();
  console.log(chalk.bold.cyan('📧 Email MCP CLI') + chalk.gray(' - ') + chalk.bold.white('Email Operations Suite'));
  console.log(chalk.dim('═'.repeat(60)));
  console.log();
  
  console.log(chalk.bold.yellow('Basic Email Operations:'));
  console.log(chalk.green('  email-send, esend          Send an email'));
  console.log(chalk.green('  email-read, eread          Read recent emails'));
  console.log(chalk.green('  email-get, eget            Get specific email by ID'));
  console.log(chalk.green('  email-delete, edelete      Delete an email'));
  console.log(chalk.green('  email-mark-read, emarkread Mark email as read/unread'));
  console.log(chalk.green('  email-attach, eattach      Send email with attachment'));
  console.log();
  
  console.log(chalk.bold.yellow('Advanced Email Operations:'));
  console.log(chalk.cyan('  email-search, esearch      Search emails with filters'));
  console.log(chalk.cyan('  email-forward, eforward    Forward an email'));
  console.log(chalk.cyan('  email-reply, ereply        Reply to an email'));
  console.log(chalk.cyan('  email-stats, estats        Get email statistics'));
  console.log(chalk.cyan('  email-draft, edraft        Create email draft'));
  console.log(chalk.cyan('  email-schedule, eschedule  Schedule email for later'));
  console.log(chalk.cyan('  email-bulk, ebulk          Send bulk emails'));
  console.log();
  
  console.log(chalk.bold.yellow('Contact Management:'));
  console.log(chalk.magenta('  contact-add, cadd          Add a new contact'));
  console.log(chalk.magenta('  contact-list, clist        List all contacts'));
  console.log(chalk.magenta('  contact-search, csearch    Search contacts'));
  console.log(chalk.magenta('  contact-group, cgroup      Get contacts by group'));
  console.log(chalk.magenta('  contact-update, cupdate    Update contact info'));
  console.log(chalk.magenta('  contact-delete, cdelete    Delete a contact'));
  console.log();
  
  console.log(chalk.bold.blue('Utility Commands:'));
  console.log(chalk.cyan('  list                       Show recent emails (renamed from email-list)'));
  console.log(chalk.cyan('  email-cli                  Show this help or version'));
  console.log();
  
  console.log(chalk.bold.yellow('Usage:'));
  console.log(chalk.blue('  email-cli <command> [arguments]'));
  console.log(chalk.blue('  email-cli --version') + chalk.gray('        Show version information'));
  console.log(chalk.blue('  email-cli --help') + chalk.gray('           Show this help message'));
  console.log(chalk.blue('  <command> --help') + chalk.gray('           Show help for specific command'));
  console.log();
}

// Always run main
main().catch((error) => {
  console.error(chalk.red.bold('❌ Fatal error:'), error.message);
  process.exit(1);
});

// =============================================================================
// BASIC EMAIL OPERATIONS
// =============================================================================

// Send Email - send an email to recipients
// Aliases: esend.js, send-email.js, send.js

// Read Emails - read recent emails from inbox  
// Aliases: eread.js, read-emails.js, read.js

// Get Email - get specific email by ID
// Aliases: eget.js, get-email.js, get.js

// Delete Email - delete an email permanently
// Aliases: edelete.js, delete-email.js, delete.js

// Mark Read - mark email as read/unread
// Aliases: emarkread.js, mark-read.js, mark.js

// Send with Attachment - send email with file attachments
// Aliases: eattach.js, attach-email.js, attach.js

// =============================================================================
// ADVANCED EMAIL OPERATIONS  
// =============================================================================

// Search Emails - search emails with advanced filters
// Aliases: esearch.js, search-emails.js, search.js

// Forward Email - forward an existing email
// Aliases: eforward.js, forward-email.js, forward.js

// Reply Email - reply to an existing email  
// Aliases: ereply.js, reply-email.js, reply.js

// Email Statistics - get account statistics
// Aliases: estats.js, email-stats.js, stats.js

// Draft Email - create email draft
// Aliases: edraft.js, draft-email.js, draft.js

// Schedule Email - schedule email for later sending
// Aliases: eschedule.js, schedule-email.js, schedule.js

// Bulk Send - send multiple emails at once
// Aliases: ebulk.js, bulk-send.js, bulk.js

// =============================================================================
// CONTACT MANAGEMENT
// =============================================================================

// Add Contact - add new contact to address book
// Aliases: cadd.js, add-contact.js

// List Contacts - list all contacts
// Aliases: clist.js, list-contacts.js, contacts.js

// Search Contacts - search contacts by name/email
// Aliases: csearch.js, search-contacts.js

// Contact Group - get contacts by group
// Aliases: cgroup.js, contact-group.js, group.js

// Update Contact - update existing contact
// Aliases: cupdate.js, update-contact.js

// Delete Contact - delete a contact
// Aliases: cdelete.js, delete-contact.js

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
Basic Email Operations:
  esend.js "user@example.com" "Hello" "Test message"
  eread.js 5
  eget.js 12345
  edelete.js 12345
  emarkread.js 12345 true
  eattach.js "user@example.com" "Report" "See attached" "/path/to/file.pdf"

Advanced Operations:
  esearch.js --from "boss@company.com" --seen false
  eforward.js 12345 "colleague@company.com" "Please review"
  ereply.js 12345 "Thank you for the update"
  estats.js
  edraft.js "client@example.com" "Proposal" "Draft content"
  eschedule.js "team@company.com" "Reminder" "Meeting tomorrow" "2024-12-31T09:00:00Z"
  ebulk.js emails.json

Contact Management:
  cadd.js "John Doe" "john@company.com" "Work"
  clist.js
  csearch.js "john"
  cgroup.js "Work"
  cupdate.js contact_123 --name "John Smith"
  cdelete.js contact_123

Environment Setup:
  1. cp .env.example .env
  2. Configure your email settings in .env
  3. pnpm run build
  4. Use any command above

Help:
  Any command supports --help flag for detailed usage
  Example: esend.js --help
*/