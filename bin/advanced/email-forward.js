#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function forwardEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '📧 Email Forward - Forward an email to another recipient',
      ['email-forward <email-id> <to-email> <message>', 'eforward <email-id> <to-email> <message>'],
      'Forward an existing email to another recipient with an additional message.',
      [
        'email-forward 123 "colleague@company.com" "Please review this"',
        'eforward 456 "team@company.com" "FYI"'
      ],
      [
        { name: 'email-id', description: 'ID of the email to forward' },
        { name: 'to-email', description: 'Recipient email address' },
        { name: 'message', description: 'Additional message to include' }
      ]
    );
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-forward <email-id> <to-email> <message>'));
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



forwardEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});