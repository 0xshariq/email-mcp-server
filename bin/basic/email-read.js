#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp(
            'Email Read',
            'email-read [count]',
            'Read recent emails from your inbox.',
            [
                'email-read',
                'eread 5',
                'email-read 20'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        return;
    }

    const count = args[0] ? parseInt(args[0]) : 10;

    if (isNaN(count) || count <= 0) {
        console.error(chalk.red('❌ Error: Invalid count value'));
        console.error(chalk.yellow('Usage: email-read [count]'));
        console.error(chalk.gray('Use --help for more information'));
        process.exit(1);
    }

    const spinner = createSpinner('Loading environment...');
    
    try {
        // Load environment
        spinner.start();
        const env = loadEnv();
        validateEnv(env);
        spinner.succeed('Environment loaded');

        // Initialize email service
        spinner.start('Initializing email service...');
        const emailService = await initializeEmailService(env);
        spinner.succeed('Email service initialized');

        // Read emails
        spinner.start(`Reading ${count} recent emails...`);
        const emails = await emailService.readRecentEmails(count);
        spinner.succeed(`Found ${emails.length} emails`);

        if (emails.length === 0) {
            console.log(chalk.yellow('📭 No emails found in your inbox.'));
            await emailService.close();
            return;
        }

        console.log(chalk.bold.cyan(`\n📬 Recent Emails (${emails.length} found)\n`));

        emails.forEach((email, index) => {
            console.log(chalk.bold(`${index + 1}. ${email.subject}`));
            console.log(chalk.cyan(`   📧 From: ${email.from}`));
            console.log(chalk.gray(`   📅 Date: ${email.date}`));
            console.log(chalk.dim(`   🆔 ID: ${email.id}`));
            console.log(chalk.gray(`   📄 Preview: ${email.body.substring(0, 80)}${email.body.length > 80 ? '...' : ''}`));
            console.log();
        });

        // Close email service connection to properly terminate
        await emailService.close();
        
    } catch (error) {
        spinner.fail('Failed to read emails');
        console.error(chalk.red('❌ Error:'), error.message);
        
        // Try to close email service if it was initialized
        try {
            if (typeof emailService !== 'undefined' && emailService.close) {
                await emailService.close();
            }
        } catch (closeError) {
            // Ignore close errors during error handling
        }
        
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}