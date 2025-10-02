#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function replyToEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '📧 Email Reply - Reply to an email',
      ['email-reply <email-id> <message>', 'ereply <email-id> <message>'],
      'Reply to an existing email with a new message.',
      [
        'email-reply 123 "Thanks for the update!"',
        'ereply 456 "I agree with your proposal"'
      ],
      [
        { name: 'email-id', description: 'ID of the email to reply to' },
        { name: 'message', description: 'Reply message content' }
      ]
    );
    return;
  }

  if (args.length < 2) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-reply <email-id> <message>'));
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



replyToEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});