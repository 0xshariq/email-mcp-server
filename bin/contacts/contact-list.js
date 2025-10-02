#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function listContacts() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '👥 Contact List - Display all contacts in your address book',
      ['contact-list [limit]', 'clist [limit]'],
      'Display all contacts in your address book with their details including name, email, group, and phone number.',
      [
        'contact-list',
        'clist 50',
        'contact-list 10'
      ],
      [
        { name: 'limit', description: 'Maximum number of contacts to display (default: 20)' }
      ]
    );
    return;
  }

  const spinner = createSpinner('Loading environment...');
  
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



listContacts().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});