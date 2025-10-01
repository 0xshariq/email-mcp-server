#!/usr/bin/env node

/**
 * Delete Email CLI - Basic Operation (Long alias)
 * Usage: email-delete.js <email_id>
 */

import { initializeEmailService, handleError, handleSuccess, Spinner, printHelp, checkHelpFlag } from '../utils.js';
import chalk from 'chalk';
import readline from 'readline';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        printHelp(
            'Email Delete',
            'email-delete.js <email_id>',
            'Delete an email from your inbox permanently.',
            [
                'email-delete.js 12345   # Delete email with ID 12345'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' },
                { flag: '--force, -f', description: 'Skip confirmation prompt' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 1) {
        console.error(chalk.red('❌ Error: Missing email ID'));
        console.error(chalk.yellow('Usage: email-delete.js <email_id>'));
        console.error(chalk.dim('💡 Use "email-read.js" command first to get email IDs'));
        console.error(chalk.red('⚠️  This action cannot be undone!'));
        process.exit(1);
    }

    const emailId = args.find(arg => !arg.startsWith('-'));
    const force = args.includes('--force') || args.includes('-f');

    try {
        const spinner = new Spinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        // First, get the email to show what will be deleted
        const getSpinner = new Spinner('Getting email details...').start();
        const email = await emailService.getEmailById(emailId);
        getSpinner.stop();

        if (!email) {
            console.log(chalk.red('❌ Email not found with ID:'), chalk.yellow(emailId));
            console.log(chalk.dim('💡 Use "email-read.js" command to see available email IDs'));
            process.exit(1);
        }

        console.log(chalk.blue('📧 Email to be deleted:'));
        console.log(chalk.cyan(`   ID: ${email.id}`));
        console.log(chalk.cyan(`   From: ${email.from}`));
        console.log(chalk.cyan(`   Subject: ${email.subject}`));
        console.log(chalk.cyan(`   Date: ${email.date.toLocaleString()}`));
        console.log('');

        if (!force) {
            console.log(chalk.red('⚠️  Are you sure you want to delete this email? This cannot be undone!'));
            console.log(chalk.yellow('Type "yes" to confirm or anything else to cancel:'));
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const confirmation = await new Promise(resolve => {
                rl.question('> ', (answer) => {
                    rl.close();
                    resolve(answer.toLowerCase().trim());
                });
            });

            if (confirmation !== 'yes') {
                console.log(chalk.yellow('❌ Delete cancelled.'));
                process.exit(0);
            }
        }

        const deleteSpinner = new Spinner('Deleting email...').start();
        const success = await emailService.deleteEmail(emailId);
        deleteSpinner.stop();

        if (success) {
            handleSuccess(null, 'Email deleted successfully!');
            console.log(chalk.red(`🗑️  Email ${emailId} has been permanently deleted.`));
        } else {
            console.log(chalk.red('❌ Failed to delete email. It may have already been deleted or moved.'));
        }

        await emailService.close();
        
    } catch (error) {
        handleError(error, 'deleting email');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}