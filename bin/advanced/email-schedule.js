#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function scheduleEmail() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '⏰ Email Schedule - Schedule an email for later delivery',
      ['email-schedule <to> <subject> <body> <schedule-time>', 'eschedule <to> <subject> <body> <schedule-time>'],
      'Schedule an email to be sent at a specific time in the future.',
      [
        'email-schedule "user@example.com" "Reminder" "Don\'t forget!" "2024-12-25T09:00:00Z"',
        'eschedule "team@company.com" "Report" "Weekly report" "+2h"'
      ],
      [
        { name: 'to', description: 'Recipient email address' },
        { name: 'subject', description: 'Email subject line' },
        { name: 'body', description: 'Email message body' },
        { name: 'schedule-time', description: 'When to send (ISO format or relative like +1h, +30m, +1d)' }
      ]
    );
    return;
  }

  if (args.length < 4) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: email-schedule <to> <subject> <body> <schedule-time>'));
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



scheduleEmail().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});