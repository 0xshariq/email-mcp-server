#!/usr/bin/env node

/**
 * Get Specific Email CLI - Basic Operation (Long alias)
 * Usage: email-get.js <email_id>
 */

import { initializeEmailService, handleError, handleSuccess, Spinner, printHelp, checkHelpFlag } from '../utils.js';
import chalk from 'chalk';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        printHelp(
            'Email Get',
            'email-get.js <email_id>',
            'Get a specific email by its ID.',
            [
                'email-get.js 12345      # Get email with ID 12345'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 1) {
        console.error(chalk.red('❌ Error: Missing email ID'));
        console.error(chalk.yellow('Usage: email-get.js <email_id>'));
        console.error(chalk.dim('💡 Use "email-read.js" command first to get email IDs'));
        process.exit(1);
    }

    const [emailId] = args;

    try {
        const spinner = new Spinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        const getSpinner = new Spinner(`Getting email ${emailId}...`).start();
        const email = await emailService.getEmailById(emailId);
        getSpinner.stop();

        if (!email) {
            console.log(chalk.red('❌ Email not found with ID:'), chalk.yellow(emailId));
            console.log(chalk.dim('💡 Use "email-read.js" command to see available email IDs'));
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
        console.log(email.body);
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