#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function createDraft() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '📝 Email Draft - Create an email draft',
      ['email-draft <to> <subject> <body>', 'edraft <to> <subject> <body>'],
      'Create an email draft that can be edited and sent later.',
      [
        'email-draft "user@example.com" "Meeting Follow-up" "Thanks for today\'s meeting..."',
        'edraft "team@company.com" "Weekly Report" "Please find the weekly report attached"'
      ],
      [
        { name: 'to', description: 'Recipient email address' },
        { name: 'subject', description: 'Email subject line' },
        { name: 'body', description: 'Email message body' }
      ]
    );
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-draft <to> <subject> <body>'));
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

    const [to, subject, body] = args;

    // Create draft
    spinner.start('Creating email draft...');
    const draftId = await emailService.createDraft(to, subject, body);
    spinner.succeed('Draft created successfully');

    console.log(chalk.green('✅ Email draft created successfully!'));
    console.log(chalk.cyan(`📧 To: ${to}`));
    console.log(chalk.cyan(`📝 Subject: ${subject}`));
    console.log(chalk.gray(`📄 Body: ${body.substring(0, 50)}...`));
    console.log(chalk.yellow(`🆔 Draft ID: ${draftId}`));
    
  } catch (error) {
    spinner.fail('Failed to create draft');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}



createDraft().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});