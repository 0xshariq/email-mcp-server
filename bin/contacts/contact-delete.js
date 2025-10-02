#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function deleteContact() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '🗑️ Contact Delete - Remove a contact from your address book',
      ['contact-delete <contact-id>', 'cdelete <contact-id>'],
      'Permanently delete a contact from your address book using their unique ID.',
      [
        'contact-delete 123',
        'cdelete abc-def-456'
      ],
      [
        { name: 'contact-id', description: 'Unique identifier of the contact to delete' }
      ]
    );
    return;
  }

  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Missing contact ID'));
    console.log(chalk.yellow('Usage: contact-delete <contact-id>'));
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

    // Initialize contact service
    spinner.start('Initializing contact service...');
    const contactService = await initializeContactService(env);
    spinner.succeed('Contact service initialized');

    const contactId = args[0];

    // Get contact details first for confirmation
    spinner.start('Loading contact details...');
    const contact = await contactService.getContact(contactId);
    spinner.succeed('Contact loaded');

    // Confirm deletion (unless --force flag is used)
    if (!args.includes('--force')) {
      console.log(chalk.yellow('\n⚠️  You are about to delete:'));
      console.log(chalk.cyan(`👤 Name: ${contact.name}`));
      console.log(chalk.cyan(`📧 Email: ${contact.email}`));
      console.log(chalk.cyan(`👥 Group: ${contact.group || 'general'}`));
      console.log(chalk.red('\n❌ This action cannot be undone!'));
      console.log(chalk.gray('Use --force flag to skip this confirmation.'));
      
      // In a real CLI, you'd use readline for user input
      // For now, we'll require --force flag
      console.log(chalk.yellow('\nTo proceed, use: contact-delete ' + contactId + ' --force'));
      return;
    }

    // Delete contact
    spinner.start('Deleting contact...');
    await contactService.deleteContact(contactId);
    spinner.succeed('Contact deleted successfully');

    console.log(chalk.green('✅ Contact deleted successfully!'));
    console.log(chalk.gray(`Deleted: ${contact.name} (${contact.email})`));
    
  } catch (error) {
    spinner.fail('Failed to delete contact');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}



deleteContact().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});