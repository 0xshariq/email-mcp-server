#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

async function bulkSendEmails() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      'Email Bulk Send',
      'email-bulk <recipients-file-or-emails> <subject> <body>',
      'Send emails to multiple recipients from a file or comma-separated list.',
      [
        'email-bulk recipients.txt "Newsletter" "Welcome to our newsletter!"',
        'ebulk emails.txt "Update" "New features available"',
        'email-bulk user1@example.com,user2@example.com,user3@example.com "Meeting" "Team meeting tomorrow"',
        'ebulk alice@company.com,bob@company.com "Update" "Project status update"'
      ],
      [
        { flag: '--help, -h', description: 'Show this help message' },
        { flag: 'recipients-file-or-emails', description: 'Either a file path containing emails (one per line) or comma-separated email addresses' }
      ]
    );
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-bulk <recipients-file-or-emails> <subject> <body>'));
    console.log(chalk.gray('Recipients can be a file path or comma-separated email addresses'));
    console.log(chalk.gray('Use --help for more information'));
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

    // Display current user info
    console.log(chalk.dim(`📧 Using account: ${process.env.EMAIL_USER || 'Not configured'}`));

    const [recipientsInput, subject, body] = args;

    // Load recipients - support both file and comma-separated emails
    spinner.start('Loading recipients...');
    let recipients = [];
    
    // Check if input contains @ symbols (indicating email addresses)
    if (recipientsInput.includes('@')) {
      // Input is comma-separated email addresses
      recipients = recipientsInput
        .split(',')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));
      
      spinner.succeed(`Loaded ${recipients.length} recipients from comma-separated list`);
    } else {
      // Input is a file path
      if (!fs.existsSync(recipientsInput)) {
        spinner.fail(`Recipients file not found: ${recipientsInput}`);
        process.exit(1);
      }

      const fileContent = fs.readFileSync(recipientsInput, 'utf8');
      recipients = fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.includes('@'));
      
      spinner.succeed(`Loaded ${recipients.length} recipients from file: ${recipientsInput}`);
    }

    if (recipients.length === 0) {
      console.error(chalk.red('❌ No valid email addresses found'));
      console.error(chalk.yellow('💡 Ensure emails contain @ symbol and are properly formatted'));
      process.exit(1);
    }

    // Send bulk emails
    spinner.start('Sending bulk emails...');
    const results = await emailService.sendBulkEmails(recipients, subject, body);
    spinner.succeed('Bulk email operation completed');

    console.log(chalk.green(`✅ Bulk email operation completed!`));
    console.log(chalk.cyan(`📊 Total recipients: ${recipients.length}`));
    console.log(chalk.green(`✅ Successfully sent: ${results.sent}`));
    console.log(chalk.red(`❌ Failed to send: ${results.failed}`));
    
    // Show failed sends if any
    const failedSends = results.results.filter(r => !r.success);
    if (failedSends.length > 0) {
      console.log(chalk.bold('\n❌ Failed Recipients:'));
      failedSends.forEach(failed => {
        console.log(chalk.red(`  ${failed.recipient}: ${failed.error}`));
      });
    }
    
  } catch (error) {
    spinner.fail('Failed to send bulk emails');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}



bulkSendEmails().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});