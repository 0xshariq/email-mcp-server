#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        printHelp(
            'Email Send with Attachment',
            'email-attach.js <to> <subject> <body> <attachment_path> [attachment_name]',
            'Send an email with file attachment.',
            [
                'email-attach.js "user@example.com" "Report" "Please find attached" "/path/to/file.pdf"',
                'email-attach.js "user@example.com" "Document" "See attachment" "/home/file.doc" "mydoc.doc"'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 4) {
        console.error(chalk.red('❌ Error: Missing required arguments'));
        console.error(chalk.yellow('Usage: email-attach.js <to> <subject> <body> <attachment_path> [attachment_name]'));
        console.error(chalk.dim('Use --help for more information'));
        process.exit(1);
    }

    const [to, subject, body, attachmentPath, attachmentName] = args;

    // Check if attachment file exists
    if (!fs.existsSync(attachmentPath)) {
        console.error(chalk.red('❌ Error: Attachment file not found:'), chalk.yellow(attachmentPath));
        process.exit(1);
    }

    try {
        const spinner = new Spinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        const attachments = [{
            filename: attachmentName || attachmentPath.split('/').pop(),
            path: attachmentPath
        }];

        const sendSpinner = new Spinner('Sending email with attachment...').start();
        const recipients = to.split(',').map(email => email.trim());
        const result = await emailService.sendEmailWithAttachments(recipients, subject, body, attachments);
        sendSpinner.stop();

        handleSuccess(null, 'Email with attachment sent successfully!');
        
        console.log(chalk.blue('📧 Email Details:'));
        console.log(chalk.cyan(`   To: ${recipients.join(', ')}`));
        console.log(chalk.cyan(`   Subject: ${subject}`));
        console.log(chalk.cyan(`   Attachment: ${attachments[0].filename}`));
        console.log(chalk.cyan(`   Message ID: ${result.messageId}`));
        console.log(chalk.dim(`   Response: ${result.response}`));
        
        await emailService.close();
        
    } catch (error) {
        handleError(error, 'sending email with attachment');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}