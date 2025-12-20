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
    .description('Interactive setup for email configuration (SMTP/IMAP)')
    .action(async () => {
        try {
            await setup();
        } catch (error: any) {
            console.error(chalk.red('Setup error:'), error.message);
            process.exit(1);
        }
    });

program
    .command('update')
    .description('Update CLI to latest version')
    .action(async () => {
        console.log(chalk.yellow('⚠️  Update command needs implementation'));
        console.log(chalk.blue('Run: npm install -g @0xshariq/email-mcp-server@latest'));
    });

// Helper function to wrap text at word boundaries
function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = word;
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

// Custom help formatting
program.configureHelp({
    formatHelp: (cmd, helper) => {
        // Get terminal width (default to 100 for better formatting)
        const terminalWidth = process.stdout.columns || 100;
        
        // Calculate proper column width for better alignment
        const commands = helper.visibleCommands(cmd);
        const options = helper.visibleOptions(cmd);
        
        // Find max length of command/option names
        let maxNameLength = 0;
        commands.forEach((subCmd: any) => {
            const name = helper.subcommandTerm(subCmd);
            maxNameLength = Math.max(maxNameLength, name.length);
        });
        options.forEach((option: any) => {
            const flags = helper.optionTerm(option);
            maxNameLength = Math.max(maxNameLength, flags.length);
        });
        
        // Set padding: cap at 45% of terminal width or 50 chars max
        const maxPadding = Math.min(Math.floor(terminalWidth * 0.45), 50);
        const padding = Math.min(maxNameLength + 2, maxPadding);
        const descriptionWidth = terminalWidth - padding - 4; // 4 = 2 spaces indent + 2 spaces gap
        
        let output = '';
        
        // Header
        output += '\n';
        output += chalk.bold.cyan('📧 Email MCP Server CLI') + chalk.gray(' - A powerful command-line interface for email operations\n');
        output += '\n';
        
        // Usage
        output += chalk.bold.white('Usage:') + ' ' + chalk.cyan(cmd.name()) + ' ' + chalk.gray('[options] [command]') + '\n';
        output += '\n';
        
        // Options
        if (options.length > 0) {
            output += chalk.bold.white('Options:') + '\n';
            options.forEach((option: any) => {
                const flags = helper.optionTerm(option);
                const description = helper.optionDescription(option);
                const spacing = ' '.repeat(Math.max(2, padding - flags.length));
                
                // Wrap description if needed
                const descLines = wrapText(description, descriptionWidth);
                output += `  ${chalk.cyan(flags)}${spacing}${chalk.gray(descLines[0])}\n`;
                
                // Add continuation lines with proper indentation
                for (let i = 1; i < descLines.length; i++) {
                    const indent = ' '.repeat(padding + 2);
                    output += `${indent}${chalk.gray(descLines[i])}\n`;
                }
            });
            output += '\n';
        }
        
        // Commands
        if (commands.length > 0) {
            output += chalk.bold.white('Commands:') + '\n';
            commands.forEach((subCmd: any) => {
                const name = helper.subcommandTerm(subCmd);
                const description = helper.subcommandDescription(subCmd);
                const spacing = ' '.repeat(Math.max(2, padding - name.length));
                
                // Wrap description if needed
                const descLines = wrapText(description, descriptionWidth);
                output += `  ${chalk.cyan(name)}${spacing}${chalk.gray(descLines[0])}\n`;
                
                // Add continuation lines with proper indentation
                for (let i = 1; i < descLines.length; i++) {
                    const indent = ' '.repeat(padding + 2);
                    output += `${indent}${chalk.gray(descLines[i])}\n`;
                }
            });
            output += '\n';
        }
        
        // Examples
        output += chalk.bold.cyan('Examples:') + '\n';
        output += `  ${chalk.gray('$ email-cli send user@example.com "Hello" "Test message"')}\n`;
        output += `  ${chalk.gray('$ email-cli read 5')}\n`;
        output += `  ${chalk.gray('$ email-cli search --from boss@company.com')}\n`;
        output += `  ${chalk.gray('$ email-cli contact-add "John Doe" john@example.com')}\n`;
        output += '\n';
        
        output += chalk.dim('For more information on a specific command, use:') + '\n';
        output += `  ${chalk.dim('$ email-cli <command> --help')}\n`;
        output += '\n';
        
        return output;
    }
});

program
    .command('help [command]')
    .description('display help for command')
    .action((command) => {
        if (command) {
            const cmd = program.commands.find(c => c.name() === command || c.aliases().includes(command));
            if (cmd) {
                cmd.help();
            } else {
                console.log(chalk.red(`Unknown command: ${command}`));
                program.help();
            }
        } else {
            program.help();
        }
    });

// Parse arguments
program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
