#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, checkHelpFlag, showHelp, handleError, handleSuccess, validateAndResolveFilePath } from '../utils.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        showHelp(
            '📎 Email Attach - Send email with unlimited file attachments',
            ['email-attach <to> <subject> <body> <attachment-paths> [attachment-names]', 'eattach <to> <subject> <body> <attachment-paths> [attachment-names]'],
            'Send an email with unlimited file attachments. Use comma-separated paths for multiple files and comma-separated names for custom attachment names.',
            [
                'email-attach user@example.com "Report" "Please find attached" /home/user/report.pdf',
                'email-attach user@example.com "Documents" "Multiple files" ./file1.pdf,./file2.doc "Report,Contract"',
                'eattach user@example.com "Mixed Files" "See attachments" ~/Desktop/image.jpg,./script.sh,/tmp/data.csv',
                'eattach user@example.com "Custom Names" "Files with custom names" ./file1.txt,./file2.pdf "ReadMe,Manual"'
            ],
            [
                { name: 'to', description: 'Recipient email address(es) - comma separated for multiple' },
                { name: 'subject', description: 'Email subject line' },
                { name: 'body', description: 'Email message body' },
                { name: 'attachment-paths', description: 'File paths to attach - comma separated for multiple (absolute, relative, or ~/home paths)' },
                { name: '[attachment-names]', description: 'Optional custom names for attachments - comma separated, must match number of paths' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 4) {
        console.error(chalk.red('❌ Error: Missing required arguments'));
        console.error(chalk.yellow('Usage: email-attach <to> <subject> <body> <attachment-paths> [attachment-names]'));
        console.error(chalk.gray('Note: Use comma-separated paths for multiple files, and comma-separated names for custom names'));
        console.error(chalk.dim('Use --help for more information'));
        process.exit(1);
    }

    const [to, subject, body, attachmentPaths, attachmentNames] = args;

    try {
        // Parse attachment paths (comma-separated)
        const paths = attachmentPaths.split(',').map(p => p.trim()).filter(p => p.length > 0);
        
        // Parse attachment names (comma-separated, optional)
        let customNames = [];
        if (attachmentNames) {
            customNames = attachmentNames.split(',').map(n => n.trim()).filter(n => n.length > 0);
            
            // Validate that number of names matches number of paths (if names provided)
            if (customNames.length > 0 && customNames.length !== paths.length) {
                console.error(chalk.red('❌ Error: Number of attachment names must match number of attachment paths'));
                console.error(chalk.yellow(`📁 Paths provided: ${paths.length}`));
                console.error(chalk.yellow(`📝 Names provided: ${customNames.length}`));
                console.error(chalk.gray('Either provide names for all attachments or none at all'));
                process.exit(1);
            }
        }

        // Validate and resolve all attachment file paths
        const spinner = createSpinner(`Validating ${paths.length} attachment file${paths.length > 1 ? 's' : ''}...`).start();
        const attachments = [];
        let totalSize = 0;

        for (let i = 0; i < paths.length; i++) {
            const filePath = paths[i];
            try {
                const resolvedPath = validateAndResolveFilePath(filePath);
                const stats = fs.statSync(resolvedPath);
                const fileSize = stats.size;
                totalSize += fileSize;
                
                const filename = (customNames.length > 0 && customNames[i]) 
                    ? customNames[i] 
                    : path.basename(resolvedPath);
                
                attachments.push({
                    filename: filename,
                    path: resolvedPath,
                    size: fileSize
                });
                
            } catch (error) {
                spinner.fail(`Attachment validation failed`);
                console.error(chalk.red(`❌ Error with file ${i + 1}: ${filePath}`));
                console.error(chalk.red(`   ${error.message}`));
                process.exit(1);
            }
        }
        
        spinner.succeed(`${attachments.length} attachment${attachments.length > 1 ? 's' : ''} validated`);

        // Initialize email service
        const initSpinner = createSpinner('Initializing email service...').start();
        loadEnv();
        validateEnv();
        const emailService = await initializeEmailService();
        initSpinner.succeed('Email service initialized');

        // Display attachment details
        console.log(chalk.blue(`\n📎 Attachment Details (${attachments.length} files):`));
        attachments.forEach((attachment, index) => {
            console.log(chalk.cyan(`   ${index + 1}. ${attachment.filename}`));
            console.log(chalk.gray(`      Path: ${attachment.path}`));
            console.log(chalk.gray(`      Size: ${(attachment.size / 1024).toFixed(2)} KB`));
        });
        console.log(chalk.blue(`📊 Total size: ${(totalSize / 1024).toFixed(2)} KB`));

        // Send email with attachments
        const sendSpinner = createSpinner(`Sending email with ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}...`).start();
        const recipients = to.split(',').map(email => email.trim()).filter(email => email.length > 0);
        const result = await emailService.sendEmailWithAttachments(recipients, subject, body, attachments);
        sendSpinner.succeed('Email sent successfully');

        handleSuccess(null, `Email with ${attachments.length} attachment${attachments.length > 1 ? 's' : ''} sent successfully!`);
        
        console.log(chalk.blue('\n📧 Email Details:'));
        console.log(chalk.cyan(`   To: ${recipients.join(', ')}`));
        console.log(chalk.cyan(`   Subject: ${subject}`));
        console.log(chalk.cyan(`   Attachments: ${attachments.map(a => a.filename).join(', ')}`));
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