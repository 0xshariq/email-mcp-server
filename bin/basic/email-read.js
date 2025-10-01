#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

function showHelp() {
  console.log(chalk.bold.cyan('\n📬 Email Read - Read recent emails from inbox\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-read [count]'));
  console.log(chalk.cyan('  eread [count]'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  count       Number of emails to read (default: 10)'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-read           # Read 10 recent emails'));
  console.log(chalk.yellow('  eread 5              # Read 5 recent emails'));
  console.log(chalk.yellow('  email-read 20        # Read 20 recent emails'));
  console.log();
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }

    const count = args[0] ? parseInt(args[0]) : 10;

    if (isNaN(count) || count <= 0) {
        console.error(chalk.red('❌ Error: Invalid count value'));
        console.error(chalk.yellow('Usage: email-read [count]'));
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

        // Read emails
        spinner.start(`Reading ${count} recent emails...`);
        const emails = await emailService.readRecentEmails(count);
        spinner.succeed(`Found ${emails.length} emails`);

        if (emails.length === 0) {
            console.log(chalk.yellow('📭 No emails found in your inbox.'));
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
        
    } catch (error) {
        spinner.fail('Failed to read emails');
        console.error(chalk.red('❌ Error:'), error.message);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}