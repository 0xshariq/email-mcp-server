#!/usr/bin/env node

/**
 * Get Specific Email CLI - Basic Operation (Long alias)
 * Usage: email-get.js <email_id>
 */

import { initializeEmailService, handleError, handleSuccess, createSpinner, showHelp, checkHelpFlag, cleanEmailBody } from '../utils.js';
import chalk from 'chalk';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        showHelp(
            '📧 Email Get - Retrieve a specific email by ID',
            ['email-get <email-id>', 'eget <email-id>'],
            'Retrieve and display a specific email from your inbox using its unique ID.',
            [
                'email-get 12345',
                'eget 12345'
            ],
            [
                { name: 'email-id', description: 'Unique identifier of the email to retrieve' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 1) {
        console.error(chalk.red('❌ Error: Missing email ID'));
        console.error(chalk.yellow('Usage: email-get <email-id>'));
        console.error(chalk.dim('💡 Use "email-read" command first to get email IDs'));
        process.exit(1);
    }

    const [emailId] = args;

    try {
        const spinner = createSpinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        // Display current user info
        console.log(chalk.dim(`📧 Using account: ${process.env.EMAIL_USER || 'Not configured'}`));

        const getSpinner = createSpinner(`Getting email ${emailId}...`).start();
        const email = await emailService.getEmailById(emailId);
        getSpinner.succeed('Email retrieved');

        if (!email) {
            console.log(chalk.red('❌ Email not found with ID:'), chalk.yellow(emailId));
            console.log(chalk.dim('💡 Use "email-read" command to see available email IDs'));
            process.exit(1);
        }

        handleSuccess(null, 'Email retrieved successfully!');
        console.log('');

        console.log(chalk.blue('📧 Email Details:'));
        console.log(chalk.cyan(`   ID: ${email.id}`));
        console.log(chalk.cyan(`   From: ${email.from}`));
        console.log(chalk.cyan(`   To: ${email.to.join(', ')}`));
        if (email.cc && email.cc.length > 0) {
            console.log(chalk.cyan(`   CC: ${email.cc.join(', ')}`));
        }
        if (email.bcc && email.bcc.length > 0) {
            console.log(chalk.cyan(`   BCC: ${email.bcc.join(', ')}`));
        }
        console.log(chalk.cyan(`   Subject: ${email.subject}`));
        console.log(chalk.cyan(`   Date: ${email.date.toLocaleString()}`));
        console.log(chalk.dim(`   Flags: ${email.flags.join(', ')}`));
        console.log('');
        console.log(chalk.blue('📄 Email Body:'));
        console.log(chalk.gray('   ' + '─'.repeat(50)));

        if (email.body && email.body.trim()) {
            // Use the utility function to clean and format the email body
            const cleanBody = cleanEmailBody(email.body);
            
            // Display the full cleaned body with proper formatting
            const lines = cleanBody.split('\n');
            lines.forEach(line => {
                if (line.length > 70) {
                    // Wrap long lines
                    const words = line.split(' ');
                    let currentLine = '';
                    for (const word of words) {
                        if ((currentLine + ' ' + word).length > 70) {
                            if (currentLine) {
                                console.log(`   ${currentLine}`);
                                currentLine = word;
                            } else {
                                console.log(`   ${word}`);
                            }
                        } else {
                            currentLine += (currentLine ? ' ' : '') + word;
                        }
                    }
                    if (currentLine) {
                        console.log(`   ${currentLine}`);
                    }
                } else {
                    console.log(`   ${line}`);
                }
            });
            
            console.log();
            console.log(chalk.dim(`   📏 Email body: ${cleanBody.length} characters (full content displayed)`));
        } else {
            console.log(chalk.dim('   (No body content)'));
        }

        console.log(chalk.gray('   ' + '─'.repeat(50)));

        if (email.attachments && email.attachments.length > 0) {
            console.log('');
            console.log(chalk.blue('📎 Attachments:'));
            email.attachments.forEach((att, index) => {
                console.log(chalk.cyan(`   ${index + 1}. ${att.filename} (${att.contentType || 'unknown type'})`));
            });
        }

        await emailService.close();

    } catch (error) {
        handleError(error, 'getting email');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}