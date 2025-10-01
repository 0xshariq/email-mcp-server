#!/usr/bin/env node

/**
 * Add Contact CLI - Contact Management (Long alias)
 * Usage: contact-add.js <name> <email> [group]
 */

import { initializeContactService, handleError, handleSuccess, Spinner, printHelp, checkHelpFlag, loadEnv, validateEnv } from '../utils.js';
import chalk from 'chalk';

async function main() {
  const args = process.argv.slice(2);

  if (checkHelpFlag(args)) {
    printHelp(
      'Contact Add',
      'contact-add.js <name> <email> [group]',
      'Add a new contact to your address book.',
      [
        'contact-add "John Doe" john@example.com work',
        'contact-add "Jane Smith" jane@example.com',
        'cadd "Jane Smith" jane@example.com',
        'contact-add "Bob Wilson" bob@example.com friends',
        'cadd "Bob Wilson" bob@example.com friends'
      ],
      [
        { flag: '--help, -h', description: 'Show this help message' }
      ]
    );
    process.exit(0);
  }

  if (args.length < 2) {
    console.log(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: contact-add <name> <email> [group]'));
    console.log(chalk.gray('Use --help for more information'));
    process.exit(1);
  }

  const spinner = new Spinner('Loading environment...');
  
  try {
    // Load environment
    spinner.start();
    loadEnv();
    validateEnv();
    spinner.succeed('Environment loaded');

    // Initialize contact service
    spinner.start('Initializing contact service...');
    const contactService = await initializeContactService();
    spinner.succeed('Contact service initialized');

    const [name, email, group = 'general'] = args;

    // Add contact
    spinner.start('Adding contact...');
    const contact = contactService.addContact(name, email, group);
    spinner.succeed('Contact added successfully');

    console.log(chalk.green('✅ Contact added successfully!'));
    console.log(chalk.cyan(`👤 Name: ${contact.name}`));
    console.log(chalk.cyan(`📧 Email: ${contact.email}`));
    console.log(chalk.cyan(`👥 Group: ${contact.group || 'general'}`));
    console.log(chalk.cyan(`🆔 Contact ID: ${contact.id}`));
    
  } catch (error) {
    if (spinner) spinner.fail('Failed to add contact');
    handleError(error, 'adding contact');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}