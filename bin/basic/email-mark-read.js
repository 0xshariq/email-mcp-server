#!/usr/bin/env node

/**
 * Mark Email as Read CLI - Basic Operation (Long alias)
 * Usage: email-mark-read.js <email_id> [true|false]
 */

import { initializeEmailService, handleError, handleSuccess, createSpinner, showHelp, checkHelpFlag } from '../utils.js';
import chalk from 'chalk';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        showHelp(
            'Email Mark Read',
            'email-mark-read.js <email_id> [true|false]',
            'Mark an email as read or unread.',
            [
                'email-mark-read.js 12345        # Mark email as read',
                'email-mark-read.js 12345 true   # Mark email as read',
                'email-mark-read.js 12345 false  # Mark email as unread'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 1) {
        console.error(chalk.red('❌ Error: Missing email ID'));
        console.error(chalk.yellow('Usage: email-mark-read.js <email_id> [true|false]'));
        console.error(chalk.dim('Use --help for more information'));
        process.exit(1);
    }

    const [emailId, readStatus] = args;
    const read = readStatus !== 'false';

    try {
        const spinner = createSpinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        const markcreateSpinner = createSpinner(`Marking email ${emailId} as ${read ? 'read' : 'unread'}...`).start();
        const success = await emailService.markEmailAsRead(emailId, read);
        markcreateSpinner.stop();

        if (success) {
            handleSuccess(null, `Email ${emailId} marked as ${read ? 'read' : 'unread'}!`);
            console.log(chalk.blue(`📧 Email ID: ${emailId}`));
            console.log(chalk.cyan(`   Status: ${read ? '✅ Read' : '📩 Unread'}`));
        } else {
            console.log(chalk.red('❌ Failed to update email status. Email may not exist.'));
        }

        await emailService.close();
        
    } catch (error) {
        handleError(error, 'marking email');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}