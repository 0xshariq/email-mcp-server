#!/usr/bin/env node

/**
 * Email MCP Server CLI - Main Entry Point
 * Uses Commander.js to orchestrate all email and contact commands
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setup } from './setup.js';
import {
    sendEmail,
    readEmails,
    getEmail,
    deleteEmails,
    markEmailRead,
    listCommands,
    searchEmails,
    attachEmail,
    forwardEmail,
    replyEmail,
    emailStats,
    draftEmail,
    scheduleEmail,
    bulkSend,
    addContact,
    listContacts,
    searchContacts,
    deleteContact,
    updateContact,
    getContactGroup
} from './commands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json for version
// In dist: dist/cli/index.js -> ../../package.json
// In source: cli/index.ts -> ../package.json
const packagePath = path.join(__dirname, '..', '..', 'package.json');
let packageJson: any;
try {
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (err) {
    // Fallback for source development (cli/index.ts)
    const sourcePath = path.join(__dirname, '..', 'package.json');
    packageJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
}

const program = new Command();

// Configure main program
program
    .name('email-cli')
    .description('📧 Email MCP Server CLI - A powerful command-line interface for email operations')
    .version(packageJson.version, '-v, --version', 'Display version information')
    .helpOption('-h, --help', 'Display help information');

// ==================== BASIC EMAIL COMMANDS ====================

program
    .command('send')
    .alias('esend')
    .description('Send an email to recipients')
    .argument('<to>', 'Recipient email address (comma-separated for multiple)')
    .argument('<subject>', 'Email subject')
    .argument('<body>', 'Email body text')
    .argument('[html]', 'Optional HTML content')
    .action(async (to, subject, body, html) => {
        try {
            await sendEmail(to, subject, body, html);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('read')
    .alias('eread')
    .description('Read recent emails from inbox')
    .argument('[count]', 'Number of emails to read', '10')
    .action(async (count) => {
        try {
            const numCount = parseInt(count);
            if (isNaN(numCount) || numCount <= 0) {
                throw new Error('Count must be a positive number');
            }
            await readEmails(numCount);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('get')
    .alias('eget')
    .description('Get a specific email by ID')
    .argument('<emailId>', 'Email ID to retrieve')
    .action(async (emailId) => {
        try {
            await getEmail(emailId);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('delete')
    .alias('edelete')
    .description('Delete email(s) by ID')
    .argument('<emailIds...>', 'Email ID(s) to delete')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (emailIds, options) => {
        try {
            await deleteEmails(emailIds, options.force);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('mark-read')
    .alias('emarkread')
    .description('Mark email as read or unread')
    .argument('<emailId>', 'Email ID')
    .argument('[status]', 'Read status (true/false)', 'true')
    .action(async (emailId, status) => {
        try {
            const read = status !== 'false';
            await markEmailRead(emailId, read);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('list')
    .description('List all available commands')
    .action(async () => {
        try {
            await listCommands();
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

// ==================== ADVANCED EMAIL COMMANDS ====================

program
    .command('search')
    .alias('esearch')
    .description('Search emails with filters')
    .option('--from <email>', 'Filter by sender email')
    .option('--to <email>', 'Filter by recipient email')
    .option('--subject <text>', 'Filter by subject keywords')
    .option('--since <date>', 'Filter emails since date (ISO format)')
    .option('--before <date>', 'Filter emails before date (ISO format)')
    .option('--seen <boolean>', 'Filter by read status')
    .option('--flagged <boolean>', 'Filter by flagged status')
    .option('--page <number>', 'Page number', '1')
    .option('--limit <number>', 'Results per page', '10')
    .action(async (options) => {
        try {
            await searchEmails(options);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('attach')
    .alias('eattach')
    .description('Send email with file attachment')
    .argument('<to>', 'Recipient email address')
    .argument('<subject>', 'Email subject')
    .argument('<body>', 'Email body')
    .argument('<filePath>', 'Path to attachment file')
    .argument('[attachmentName]', 'Optional attachment name')
    .action(async (to, subject, body, filePath, attachmentName) => {
        try {
            await attachEmail(to, subject, body, filePath, attachmentName);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('forward')
    .alias('eforward')
    .description('Forward an email to another recipient')
    .argument('<emailId>', 'Email ID to forward')
    .argument('<to>', 'Forward to email address')
    .argument('[message]', 'Optional message to add')
    .action(async (emailId, to, message) => {
        try {
            await forwardEmail(emailId, to, message);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('reply')
    .alias('ereply')
    .description('Reply to an email')
    .argument('<emailId>', 'Email ID to reply to')
    .argument('<message>', 'Reply message')
    .action(async (emailId, message) => {
        try {
            await replyEmail(emailId, message);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('stats')
    .alias('estats')
    .description('Get email account statistics')
    .action(async () => {
        try {
            await emailStats();
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('draft')
    .alias('edraft')
    .description('Create an email draft')
    .argument('<to>', 'Recipient email address')
    .argument('<subject>', 'Email subject')
    .argument('<body>', 'Email body')
    .action(async (to, subject, body) => {
        try {
            await draftEmail(to, subject, body);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('schedule')
    .alias('eschedule')
    .description('Schedule an email for later delivery')
    .argument('<to>', 'Recipient email address')
    .argument('<subject>', 'Email subject')
    .argument('<body>', 'Email body')
    .argument('<scheduledTime>', 'Scheduled time (ISO format)')
    .action(async (to, subject, body, scheduledTime) => {
        try {
            await scheduleEmail(to, subject, body, scheduledTime);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('bulk')
    .alias('ebulk')
    .description('Send emails to multiple recipients from file')
    .argument('<recipientsFile>', 'Path to recipients file (one email per line)')
    .argument('<subject>', 'Email subject')
    .argument('<body>', 'Email body')
    .action(async (recipientsFile, subject, body) => {
        try {
            await bulkSend(recipientsFile, subject, body);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

// ==================== CONTACT COMMANDS ====================

program
    .command('contact-add')
    .alias('cadd')
    .description('Add a new contact')
    .argument('<name>', 'Contact name')
    .argument('<email>', 'Contact email')
    .option('-g, --group <group>', 'Contact group')
    .option('-p, --phone <phone>', 'Contact phone number')
    .action(async (name, email, options) => {
        try {
            await addContact(name, email, options.group, options.phone);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('contact-list')
    .alias('clist')
    .description('List all contacts')
    .argument('[limit]', 'Maximum number of contacts to display', '20')
    .action(async (limit) => {
        try {
            const numLimit = parseInt(limit);
            await listContacts(numLimit);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('contact-search')
    .alias('csearch')
    .description('Search contacts')
    .argument('<query>', 'Search query')
    .action(async (query) => {
        try {
            await searchContacts(query);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('contact-delete')
    .alias('cdelete')
    .description('Delete a contact')
    .argument('<contactId>', 'Contact ID to delete')
    .action(async (contactId) => {
        try {
            await deleteContact(contactId);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('contact-update')
    .alias('cupdate')
    .description('Update a contact')
    .argument('<contactId>', 'Contact ID to update')
    .option('-n, --name <name>', 'New name')
    .option('-e, --email <email>', 'New email')
    .option('-g, --group <group>', 'New group')
    .option('-p, --phone <phone>', 'New phone')
    .action(async (contactId, options) => {
        try {
            const updates: any = {};
            if (options.name) updates.name = options.name;
            if (options.email) updates.email = options.email;
            if (options.group) updates.group = options.group;
            if (options.phone) updates.phone = options.phone;
            await updateContact(contactId, updates);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('contact-group')
    .alias('cgroup')
    .description('Get contacts by group')
    .argument('<group>', 'Group name')
    .action(async (group) => {
        try {
            await getContactGroup(group);
        } catch (error: any) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

// ==================== SETUP & UPDATE COMMANDS ====================

program
    .command('setup')
    .description('Configure email credentials and settings')
    .option('--force', 'Force reconfiguration')
    .option('--use-keychain', 'Store password in OS keychain')
    .option('--test-send', 'Send a test email after setup')
    .option('--mask', 'Mask password input')
    .option('--ci, --non-interactive', 'Run in non-interactive mode')
    .option('--profile <name>', 'Use named profile')
    .option('--email-user <user>', 'Email user for non-interactive setup')
    .option('--email-pass <pass>', 'Email password for non-interactive setup')
    .action(async (_options) => {
        console.log(chalk.yellow('⚠️  Setup command needs to be implemented with inquirer prompts'));
        console.log(chalk.blue('For now, please configure your .env file manually'));
    });

program
    .command('update')
    .description('Update CLI to latest version')
    .action(async () => {
        console.log(chalk.yellow('⚠️  Update command needs implementation'));
        console.log(chalk.blue('Run: npm install -g @0xshariq/email-mcp-server@latest'));
    });

// Custom help
program.on('--help', () => {
    console.log('');
    console.log(chalk.bold.cyan('Examples:'));
    console.log(chalk.gray('  $ email-cli send user@example.com "Hello" "Test message"'));
    console.log(chalk.gray('  $ email-cli read 5'));
    console.log(chalk.gray('  $ email-cli search --from boss@company.com'));
    console.log(chalk.gray('  $ email-cli contact-add "John Doe" john@example.com'));
    console.log('');
    console.log(chalk.dim('For more information on a specific command, use:'));
    console.log(chalk.dim('  $ email-cli <command> --help'));
    console.log('');
});

// Parse arguments
program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
