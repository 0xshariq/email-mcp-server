#!/usr/bin/env node

import { loadEnv, validateEnv, initializeEmailService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function getEmailStats() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
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

    // Get email statistics
    spinner.start('Gathering email statistics...');
    const stats = await emailService.getEmailStatistics();
    spinner.succeed('Statistics gathered');

    console.log(chalk.bold.cyan('\n📊 Email Statistics\n'));
    console.log(chalk.green(`📧 Total Emails: ${stats.totalEmails}`));
    console.log(chalk.yellow(`📬 Unread Emails: ${stats.unreadEmails}`));
    console.log(chalk.blue(`📝 Read Emails: ${stats.readEmails}`));
    console.log(chalk.magenta(`📤 Sent Emails: ${stats.sentEmails}`));
    console.log(chalk.gray(`📅 Last Check: ${stats.lastCheck}`));
    
    if (stats.topSenders && stats.topSenders.length > 0) {
      console.log(chalk.bold('\n👥 Top Senders:'));
      stats.topSenders.forEach((sender, index) => {
        console.log(chalk.cyan(`  ${index + 1}. ${sender.email} (${sender.count} emails)`));
      });
    }
    
  } catch (error) {
    spinner.fail('Failed to get email statistics');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📊 Email Statistics - Get detailed email account statistics\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  email-stats'));
  console.log(chalk.cyan('  estats'));
  console.log();
  
  console.log(chalk.bold('DESCRIPTION:'));
  console.log(chalk.gray('  Displays comprehensive statistics about your email account including:'));
  console.log(chalk.gray('  • Total number of emails'));
  console.log(chalk.gray('  • Read vs unread email counts'));
  console.log(chalk.gray('  • Sent emails count'));
  console.log(chalk.gray('  • Top senders information'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  email-stats'));
  console.log(chalk.yellow('  estats'));
  console.log();
}

getEmailStats().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});