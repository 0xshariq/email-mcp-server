#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function listContacts() {
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

    // Initialize contact service
    spinner.start('Initializing contact service...');
    const contactService = await initializeContactService(env);
    spinner.succeed('Contact service initialized');

    const limit = args[0] ? parseInt(args[0]) : 20;

    // List contacts
    spinner.start('Loading contacts...');
    const contacts = await contactService.listContacts(limit);
    spinner.succeed(`Loaded ${contacts.length} contacts`);

    if (contacts.length === 0) {
      console.log(chalk.yellow('📭 No contacts found'));
      return;
    }

    console.log(chalk.bold.cyan(`\n👥 Contact List (${contacts.length} contacts)\n`));
    
    contacts.forEach((contact, index) => {
      console.log(chalk.bold(`${index + 1}. ${contact.name}`));
      console.log(chalk.cyan(`   📧 ${contact.email}`));
      console.log(chalk.gray(`   👥 ${contact.group || 'general'}`));
      if (contact.phone) {
        console.log(chalk.gray(`   📞 ${contact.phone}`));
      }
      console.log(chalk.dim(`   🆔 ID: ${contact.id}`));
      console.log();
    });
    
  } catch (error) {
    spinner.fail('Failed to list contacts');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n👥 Contact List - Display all contacts in your address book\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  contact-list [limit]'));
  console.log(chalk.cyan('  clist [limit]'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  limit    Maximum number of contacts to display (default: 20)'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  contact-list'));
  console.log(chalk.yellow('  clist 50'));
  console.log(chalk.yellow('  contact-list 10'));
  console.log();
}

listContacts().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});