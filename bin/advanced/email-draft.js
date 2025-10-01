#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function createDraft() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-draft <to> <subject> <body>'));
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

function showHelp() {
  console.log(chalk.bold.cyan('\n📝 Email Draft - Create an email draft\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-draft <to> <subject> <body>'));
  console.log(chalk.cyan('  edraft <to> <subject> <body>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  to          Recipient email address'));
  console.log(chalk.green('  subject     Email subject line'));
  console.log(chalk.green('  body        Email message body'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-draft "user@example.com" "Meeting Follow-up" "Thanks for today\'s meeting..."'));
  console.log(chalk.yellow('  edraft "team@company.com" "Weekly Report" "Please find the weekly report attached"'));
  console.log();
}

createDraft().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});