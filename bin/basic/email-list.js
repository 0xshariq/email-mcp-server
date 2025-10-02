#!/usr/bin/env node

import { showHelp } from '../utils.js';
import chalk from 'chalk';

function listCommands() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '📋 Email Command List - Display all available email commands',
      ['email-list', 'elist', 'list'],
      'Display a comprehensive list of all available email commands organized by category.',
      [
        'email-list',
        'elist',
        'list'
      ]
    );
    return;
  }

  console.log(chalk.bold.cyan('\n📧 Email MCP Server - Available Commands\n'));

  // Basic Email Operations
  console.log(chalk.bold.green('� BASIC EMAIL OPERATIONS\n'));
  
  console.log(chalk.cyan('📤 email-send / esend'));
  console.log(chalk.gray('   Send an email to a recipient'));
  console.log(chalk.yellow('   Usage: email-send <to> <subject> <body>'));
  console.log();

  console.log(chalk.cyan('📥 email-read / eread'));
  console.log(chalk.gray('   Read emails from inbox'));
  console.log(chalk.yellow('   Usage: email-read [count]'));
  console.log();

  console.log(chalk.cyan('📧 email-get / eget'));
  console.log(chalk.gray('   Get a specific email by ID'));
  console.log(chalk.yellow('   Usage: email-get <email-id>'));
  console.log();

  console.log(chalk.cyan('🗑️ email-delete / edelete'));
  console.log(chalk.gray('   Delete emails by ID(s)'));
  console.log(chalk.yellow('   Usage: email-delete <email-id1> [email-id2] [...]'));
  console.log();

  console.log(chalk.cyan('✅ email-mark-read / emarkread'));
  console.log(chalk.gray('   Mark email(s) as read'));
  console.log(chalk.yellow('   Usage: email-mark-read <email-id1> [email-id2] [...]'));
  console.log();

  // Advanced Email Operations
  console.log(chalk.bold.magenta('🚀 ADVANCED EMAIL OPERATIONS\n'));

  console.log(chalk.cyan('📎 email-attach / eattach'));
  console.log(chalk.gray('   Send email with file attachment'));
  console.log(chalk.yellow('   Usage: email-attach <to> <subject> <body> <file-path> [attachment-name]'));
  console.log();

  console.log(chalk.cyan('🔍 email-search / esearch'));
  console.log(chalk.gray('   Search emails by query'));
  console.log(chalk.yellow('   Usage: email-search <query>'));
  console.log();

  console.log(chalk.cyan('📤 email-bulk / ebulk'));
  console.log(chalk.gray('   Send emails to multiple recipients'));
  console.log(chalk.yellow('   Usage: email-bulk <recipients-file> <subject> <body>'));
  console.log();

  console.log(chalk.cyan('📝 email-draft / edraft'));
  console.log(chalk.gray('   Create an email draft'));
  console.log(chalk.yellow('   Usage: email-draft <to> <subject> <body>'));
  console.log();

  console.log(chalk.cyan('⏰ email-schedule / eschedule'));
  console.log(chalk.gray('   Schedule an email for later delivery'));
  console.log(chalk.yellow('   Usage: email-schedule <to> <subject> <body> <schedule-time>'));
  console.log();

  console.log(chalk.cyan('📧 email-reply / ereply'));
  console.log(chalk.gray('   Reply to an email'));
  console.log(chalk.yellow('   Usage: email-reply <email-id> <message>'));
  console.log();

  console.log(chalk.cyan('📧 email-forward / eforward'));
  console.log(chalk.gray('   Forward an email to another recipient'));
  console.log(chalk.yellow('   Usage: email-forward <email-id> <to-email> <message>'));
  console.log();

  console.log(chalk.cyan('📊 email-stats / estats'));
  console.log(chalk.gray('   Get detailed email account statistics'));
  console.log(chalk.yellow('   Usage: email-stats'));
  console.log();

  // Contact Management
  console.log(chalk.bold.blue('👥 CONTACT MANAGEMENT\n'));

  console.log(chalk.cyan('➕ contact-add / cadd'));
  console.log(chalk.gray('   Add a new contact to your address book'));
  console.log(chalk.yellow('   Usage: contact-add <name> <email> [phone] [group]'));
  console.log();

  console.log(chalk.cyan('👥 contact-list / clist'));
  console.log(chalk.gray('   Display all contacts in your address book'));
  console.log(chalk.yellow('   Usage: contact-list [limit]'));
  console.log();

  console.log(chalk.cyan('🔍 contact-search / csearch'));
  console.log(chalk.gray('   Search contacts by name or email'));
  console.log(chalk.yellow('   Usage: contact-search <query>'));
  console.log();

  console.log(chalk.cyan('✏️ contact-update / cupdate'));
  console.log(chalk.gray('   Update contact information'));
  console.log(chalk.yellow('   Usage: contact-update <contact-id> <field> <value>'));
  console.log();

  console.log(chalk.cyan('🗑️ contact-delete / cdelete'));
  console.log(chalk.gray('   Remove a contact from your address book'));
  console.log(chalk.yellow('   Usage: contact-delete <contact-id>'));
  console.log();

  console.log(chalk.cyan('👥 contact-group / cgroup'));
  console.log(chalk.gray('   List contacts in a specific group'));
  console.log(chalk.yellow('   Usage: contact-group <group-name>'));
  console.log();

  // Utility Commands
  console.log(chalk.bold.yellow('🛠️  UTILITY COMMANDS\n'));

  console.log(chalk.cyan('📋 email-list / elist / list'));
  console.log(chalk.gray('   Show this list of all available commands'));
  console.log(chalk.yellow('   Usage: email-list'));
  console.log();

  // Usage Tips
  console.log(chalk.bold.white('💡 USAGE TIPS'));
  console.log(chalk.gray('  • Use --help or -h with any command for detailed usage'));
  console.log(chalk.gray('  • Short aliases are available for faster typing'));
  console.log(chalk.gray('  • Examples: esend, eread, cadd, clist, etc.'));
  console.log();

  // Configuration
  console.log(chalk.bold.red('⚙️ CONFIGURATION'));
  console.log(chalk.gray('  • Configure email settings in .env file'));
  console.log(chalk.gray('  • Copy .env.example to .env and update your credentials'));
  console.log(chalk.gray('  • Run npm run build after making changes'));
  console.log();

  // Getting Help
  console.log(chalk.bold.white('❓ GETTING HELP\n'));
  console.log(chalk.gray('   Add --help or -h to any command for detailed usage information'));
  console.log(chalk.yellow('   Example: email-send --help'));
  console.log();

  // Installation Info
  console.log(chalk.bold.gray('📦 INSTALLATION\n'));
  console.log(chalk.gray('   Global: npm install -g @0xshariq/email-mcp-server'));
  console.log(chalk.gray('   Local:  npm install @0xshariq/email-mcp-server'));
  console.log();
  
  // Quick Examples
  console.log(chalk.bold.cyan('📝 QUICK START EXAMPLES\n'));
  console.log(chalk.yellow('   email-send "user@example.com" "Hello" "Test message"'));
  console.log(chalk.yellow('   email-bulk recipients.txt "Newsletter" "Monthly update"'));
  console.log(chalk.yellow('   contact-add "John Doe" "john@example.com" "+1-555-0123" "work"'));
  console.log(chalk.yellow('   email-attach "user@example.com" "Report" "See attached" "./report.pdf"'));
  console.log();
  console.log(chalk.dim('💡 Tip: All commands have short aliases (shown after /) for faster typing!'));
}

listCommands();