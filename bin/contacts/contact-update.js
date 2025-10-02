#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function updateContact() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '✏️ Contact Update - Update contact information',
      ['contact-update <contact-id> <field> <value>', 'cupdate <contact-id> <field> <value>'],
      'Update a specific field of an existing contact in your address book.',
      [
        'contact-update 123 name "John Smith"',
        'cupdate 456 email "new.email@example.com"',
        'contact-update 789 phone "+1-555-0123"'
      ],
      [
        { name: 'contact-id', description: 'Unique identifier of the contact to update' },
        { name: 'field', description: 'Field to update (name, email, phone, group)' },
        { name: 'value', description: 'New value for the field' }
      ]
    );
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: contact-update <contact-id> <field> <value>'));
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

    const [contactId, field, ...valueParts] = args;
    const value = valueParts.join(' ');

    // Validate field
    const validFields = ['name', 'email', 'phone', 'group'];
    if (!validFields.includes(field)) {
      console.error(chalk.red(`❌ Invalid field: ${field}`));
      console.log(chalk.yellow(`Valid fields: ${validFields.join(', ')}`));
      process.exit(1);
    }

    // Update contact
    spinner.start('Updating contact...');
    const updatedContact = await contactService.updateContact(contactId, field, value);
    spinner.succeed('Contact updated successfully');

    console.log(chalk.green('✅ Contact updated successfully!'));
    console.log(chalk.cyan(`👤 Name: ${updatedContact.name}`));
    console.log(chalk.cyan(`📧 Email: ${updatedContact.email}`));
    console.log(chalk.cyan(`👥 Group: ${updatedContact.group || 'general'}`));
    if (updatedContact.phone) {
      console.log(chalk.cyan(`📞 Phone: ${updatedContact.phone}`));
    }
    console.log(chalk.yellow(`🆔 Contact ID: ${updatedContact.id}`));
    
  } catch (error) {
    spinner.fail('Failed to update contact');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}



updateContact().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});