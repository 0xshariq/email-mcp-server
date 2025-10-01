#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function forwardEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-forward <email-id> <to-email> <message>'));
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

    const [emailId, toEmail, message] = args;

    // Forward email
    spinner.start('Forwarding email...');
    const result = await emailService.forwardEmail(emailId, toEmail, message);
    spinner.succeed('Email forwarded successfully');

    console.log(chalk.green('✅ Email forwarded successfully!'));
    console.log(chalk.cyan(`📧 To: ${toEmail}`));
    console.log(chalk.gray(`📄 Forward message: ${message}`));
    
  } catch (error) {
    spinner.fail('Failed to forward email');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📧 Email Forward - Forward an email to another recipient\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-forward <email-id> <to-email> <message>'));
  console.log(chalk.cyan('  eforward <email-id> <to-email> <message>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  email-id    ID of the email to forward'));
  console.log(chalk.green('  to-email    Recipient email address'));
  console.log(chalk.green('  message     Additional message to include'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-forward 123 "colleague@company.com" "Please review this"'));
  console.log(chalk.yellow('  eforward 456 "team@company.com" "FYI"'));
  console.log();
}

forwardEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});