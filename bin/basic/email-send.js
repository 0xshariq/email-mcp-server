#!/usr/bin/env node

/**
 * Send Email CLI - Basic Operation
 * Usage: email-send <to> <subject> <body> [html]
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

function showHelp() {
  console.log(chalk.bold.cyan('\n📧 Email Send - Send an email to recipients\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-send <to> <subject> <body> [html]'));
  console.log(chalk.cyan('  esend <to> <subject> <body> [html]'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  to          Recipient email address(es), comma-separated'));
  console.log(chalk.green('  subject     Email subject line'));
  console.log(chalk.green('  body        Email message body (plain text)'));
  console.log(chalk.green('  html        Optional HTML content'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-send "user@example.com" "Hello" "This is a test message"'));
  console.log(chalk.yellow('  esend "user1@example.com,user2@example.com" "Meeting" "Team meeting at 3 PM"'));
  console.log(chalk.yellow('  email-send "user@example.com" "HTML Email" "Plain text" "<h1>HTML Content</h1>"'));
  console.log();
}

async function main() {
    // Change to project root directory to ensure relative paths work
    process.chdir(projectRoot);
    
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
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