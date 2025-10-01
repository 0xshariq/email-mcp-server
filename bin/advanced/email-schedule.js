#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function scheduleEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 4) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-schedule <to> <subject> <body> <schedule-time>'));
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

    const [to, subject, body, scheduleTime] = args;

    // Schedule email
    spinner.start('Scheduling email...');
    const scheduleId = await emailService.scheduleEmail(to, subject, body, scheduleTime);
    spinner.succeed('Email scheduled successfully');

    console.log(chalk.green('✅ Email scheduled successfully!'));
    console.log(chalk.cyan(`📧 To: ${to}`));
    console.log(chalk.cyan(`📝 Subject: ${subject}`));
    console.log(chalk.gray(`📄 Body: ${body.substring(0, 50)}...`));
    console.log(chalk.yellow(`⏰ Scheduled for: ${scheduleTime}`));
    console.log(chalk.blue(`🆔 Schedule ID: ${scheduleId}`));
    
  } catch (error) {
    spinner.fail('Failed to schedule email');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n⏰ Email Schedule - Schedule an email for later delivery\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-schedule <to> <subject> <body> <schedule-time>'));
  console.log(chalk.cyan('  eschedule <to> <subject> <body> <schedule-time>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  to             Recipient email address'));
  console.log(chalk.green('  subject        Email subject line'));
  console.log(chalk.green('  body           Email message body'));
  console.log(chalk.green('  schedule-time  When to send (ISO format or relative)'));
  console.log();
  
  console.log(chalk.bold('TIME FORMATS:'));
  console.log(chalk.gray('  ISO Format: 2024-12-25T09:00:00Z'));
  console.log(chalk.gray('  Relative: +1h (1 hour), +30m (30 minutes), +1d (1 day)'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-schedule "user@example.com" "Reminder" "Don\'t forget!" "2024-12-25T09:00:00Z"'));
  console.log(chalk.yellow('  eschedule "team@company.com" "Report" "Weekly report" "+2h"'));
  console.log();
}

scheduleEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});