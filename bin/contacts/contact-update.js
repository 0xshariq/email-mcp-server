#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function updateContact() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 3) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: contact-update <contact-id> <field> <value>'));
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

function showHelp() {
  console.log(chalk.bold.cyan('\n✏️ Contact Update - Update contact information\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  contact-update <contact-id> <field> <value>'));
  console.log(chalk.cyan('  cupdate <contact-id> <field> <value>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  contact-id   ID of the contact to update'));
  console.log(chalk.green('  field        Field to update (name, email, phone, group)'));
  console.log(chalk.green('  value        New value for the field'));
  console.log();
  
  console.log(chalk.bold('AVAILABLE FIELDS:'));
  console.log(chalk.gray('  name    - Full name of the contact'));
  console.log(chalk.gray('  email   - Email address'));
  console.log(chalk.gray('  phone   - Phone number'));
  console.log(chalk.gray('  group   - Contact group'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  contact-update 123 name "John Smith Jr."'));
  console.log(chalk.yellow('  cupdate 456 email "newemail@example.com"'));
  console.log(chalk.yellow('  contact-update 789 group "family"'));
  console.log();
}

updateContact().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});