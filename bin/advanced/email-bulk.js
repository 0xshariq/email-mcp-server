#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

async function bulkSendEmails() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-bulk <recipients-file> <subject> <body>'));
    console.log(chalk.gray('Use --help for more information'));
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

    const [recipientsFile, subject, body] = args;

    // Read recipients file
    spinner.start('Loading recipients...');
    if (!fs.existsSync(recipientsFile)) {
      spinner.fail(`Recipients file not found: ${recipientsFile}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(recipientsFile, 'utf8');
    const recipients = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.includes('@'));
    
    spinner.succeed(`Loaded ${recipients.length} recipients`);

    if (recipients.length === 0) {
      console.error(chalk.red('❌ No valid email addresses found in file'));
      process.exit(1);
    }

    // Send bulk emails
    spinner.start('Sending bulk emails...');
    const results = await emailService.sendBulkEmails(recipients, subject, body);
    spinner.succeed('Bulk email operation completed');

    console.log(chalk.green(`✅ Bulk email operation completed!`));
    console.log(chalk.cyan(`📊 Total recipients: ${recipients.length}`));
    console.log(chalk.green(`✅ Successfully sent: ${results.successful}`));
    console.log(chalk.red(`❌ Failed to send: ${results.failed}`));
    
    if (results.errors && results.errors.length > 0) {
      console.log(chalk.bold('\n❌ Errors:'));
      results.errors.forEach(error => {
        console.log(chalk.red(`  ${error.email}: ${error.error}`));
      });
    }
    
  } catch (error) {
    spinner.fail('Failed to send bulk emails');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📤 Email Bulk Send - Send emails to multiple recipients\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-bulk <recipients-file> <subject> <body>'));
  console.log(chalk.cyan('  ebulk <recipients-file> <subject> <body>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  recipients-file  Text file containing email addresses (one per line)'));
  console.log(chalk.green('  subject          Email subject line'));
  console.log(chalk.green('  body             Email message body'));
  console.log();
  
  console.log(chalk.bold('RECIPIENTS FILE FORMAT:'));
  console.log(chalk.gray('  user1@example.com'));
  console.log(chalk.gray('  user2@example.com'));
  console.log(chalk.gray('  user3@example.com'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-bulk recipients.txt "Newsletter" "Check out our latest updates!"'));
  console.log(chalk.yellow('  ebulk team-emails.txt "Meeting Reminder" "Team meeting tomorrow at 2 PM"'));
  console.log();
}

bulkSendEmails().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});