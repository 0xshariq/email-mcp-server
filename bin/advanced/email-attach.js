#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, checkHelpFlag, showHelp, handleError, handleSuccess, validateAndResolveFilePath } from '../utils.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        showHelp(
            '📎 Email Attach - Send email with file attachment',
            ['email-attach <to> <subject> <body> <attachment-path> [attachment-name]', 'eattach <to> <subject> <body> <attachment-path> [attachment-name]'],
            'Send an email with file attachments from anywhere on your system. The attachment name is optional - if not provided, the original filename will be used.',
            [
                'email-attach user@example.com "Report" "Please find attached" /home/user/documents/report.pdf',
                'email-attach user@example.com "Document" "See attachment" ~/Desktop/file.doc custom-name.doc',
                'eattach user@example.com "Images" "Photos attached" /absolute/path/to/image.jpg',
                'eattach user@example.com "Contract" "Legal document" ./relative/path/contract.pdf'
            ],
            [
                { name: 'to', description: 'Recipient email address(es) - comma separated for multiple' },
                { name: 'subject', description: 'Email subject line' },
                { name: 'body', description: 'Email message body' },
                { name: 'attachment-path', description: 'Path to the file to attach (absolute, relative, or ~/home paths)' },
                { name: '[attachment-name]', description: 'Optional custom name for the attachment (uses original filename if not specified)' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 4) {
        console.error(chalk.red('❌ Error: Missing required arguments'));
        console.error(chalk.yellow('Usage: email-attach <to> <subject> <body> <attachment-path> [attachment-name]'));
        console.error(chalk.gray('Note: attachment-name is optional - original filename will be used if not specified'));
        console.error(chalk.dim('Use --help for more information'));
        process.exit(1);
    }

    const [to, subject, body, attachmentPath, attachmentName] = args;

    try {
        // Validate and resolve the attachment file path
        const spinner = createSpinner('Validating attachment file...').start();
        const resolvedPath = validateAndResolveFilePath(attachmentPath);
        spinner.succeed(`Attachment file found: ${resolvedPath}`);

        // Initialize email service
        const initSpinner = createSpinner('Initializing email service...').start();
        loadEnv();
        validateEnv();
        const emailService = await initializeEmailService();
        initSpinner.succeed('Email service initialized');

        // Prepare attachment
        const filename = attachmentName || path.basename(resolvedPath);
        const attachments = [{
            filename: filename,
            path: resolvedPath
        }];

        console.log(chalk.blue('\n📎 Attachment Details:'));
        console.log(chalk.cyan(`   File: ${resolvedPath}`));
        console.log(chalk.cyan(`   Name: ${filename}`));
        console.log(chalk.cyan(`   Size: ${(fs.statSync(resolvedPath).size / 1024).toFixed(2)} KB`));

        // Send email with attachment
        const sendSpinner = createSpinner('Sending email with attachment...').start();
        const recipients = to.split(',').map(email => email.trim());
        const result = await emailService.sendEmailWithAttachments(recipients, subject, body, attachments);
        sendSpinner.succeed('Email sent successfully');

        handleSuccess(null, 'Email with attachment sent successfully!');
        
        console.log(chalk.blue('\n📧 Email Details:'));
        console.log(chalk.cyan(`   To: ${recipients.join(', ')}`));
        console.log(chalk.cyan(`   Subject: ${subject}`));
        console.log(chalk.cyan(`   Attachment: ${filename}`));
        if (result.messageId) {
            console.log(chalk.cyan(`   Message ID: ${result.messageId}`));
        }
        
        await emailService.close();
        
    } catch (error) {
        handleError(error, 'sending email with attachment');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}