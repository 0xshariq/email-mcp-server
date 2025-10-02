#!/usr/bin/env node
/**
 * Email CLI - Basic Operation
 * Usage: email-send <to> <subject> <body> [html]
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEnv, validateEnv, initializeEmailService, Spinner, showHelp } from '../utils.js';
import chalk from 'chalk';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');



async function main() {
    // Change to project root directory to ensure relative paths work
    process.chdir(projectRoot);
    
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp(
            'Email Send',
            'email-send <to> <subject> <body> [html]',
            'Send an email to recipients with optional HTML content.',
            [
                'email-send user@example.com Hello "This is a test message"',
                'esend user1@example.com,user2@example.com Meeting "Team meeting at 3 PM"',
                'email-send user@example.com "HTML Email" "Plain text" "<h1>HTML Content</h1>"'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        return;
    }

    if (args.length < 3) {
        console.error(chalk.red('❌ Error: Missing required arguments'));
        console.error(chalk.yellow('Usage: email-send <to> <subject> <body> [html]'));
        console.error(chalk.gray('Use --help for more information'));
        process.exit(1);
    }

    const spinner = new Spinner('Loading environment...');
    
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
        
        const [to, subject, body, html] = args;

        // Send email
        spinner.start('Sending email...');
        const result = await emailService.sendEmail(to, subject, body, html);
        spinner.succeed('Email sent successfully');

        console.log(chalk.green('✅ Email sent successfully!'));
        console.log(chalk.cyan(`📧 To: ${to}`));
        console.log(chalk.cyan(`📝 Subject: ${subject}`));
        console.log(chalk.gray(`📄 Body: ${body.substring(0, 50)}${body.length > 50 ? '...' : ''}`));
        if (html) {
            console.log(chalk.blue('🌐 HTML content included'));
        }
        
    } catch (error) {
        spinner.fail('Failed to send email');
        console.error(chalk.red('❌ Error:'), error.message);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}