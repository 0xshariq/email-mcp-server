#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function replyToEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 2) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-reply <email-id> <message>'));
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

    const [emailId, message] = args;

    // Reply to email
    spinner.start('Sending reply...');
    const result = await emailService.replyToEmail(emailId, message);
    spinner.succeed('Reply sent successfully');

    console.log(chalk.green('✅ Reply sent successfully!'));
    console.log(chalk.gray(`📄 Reply message: ${message}`));
    
  } catch (error) {
    spinner.fail('Failed to send reply');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📧 Email Reply - Reply to an email\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-reply <email-id> <message>'));
  console.log(chalk.cyan('  ereply <email-id> <message>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  email-id    ID of the email to reply to'));
  console.log(chalk.green('  message     Reply message content'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-reply 123 "Thanks for the update!"'));
  console.log(chalk.yellow('  ereply 456 "I agree with your proposal"'));
  console.log();
}

replyToEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});