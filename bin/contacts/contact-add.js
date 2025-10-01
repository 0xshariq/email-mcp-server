#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function addContact() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length < 2) {
    console.error(chalk.red('❌ Error: Missing required arguments'));
    console.log(chalk.yellow('Usage: contact-add <name> <email> [group]'));
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

    const [name, email, group = 'general'] = args;

    // Add contact
    spinner.start('Adding contact...');
    const contactId = await contactService.addContact(name, email, group);
    spinner.succeed('Contact added successfully');

    console.log(chalk.green('✅ Contact added successfully!'));
    console.log(chalk.cyan(`👤 Name: ${name}`));
    console.log(chalk.cyan(`📧 Email: ${email}`));
    console.log(chalk.cyan(`👥 Group: ${group}`));
    console.log(chalk.yellow(`🆔 Contact ID: ${contactId}`));
    
  } catch (error) {
    spinner.fail('Failed to add contact');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n👤 Contact Add - Add a new contact to your address book\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  contact-add <name> <email> [group]'));
  console.log(chalk.cyan('  cadd <name> <email> [group]'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  name     Full name of the contact'));
  console.log(chalk.green('  email    Email address of the contact'));
  console.log(chalk.green('  group    Contact group (optional, default: "general")'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  contact-add "John Doe" "john@example.com" "work"'));
  console.log(chalk.yellow('  cadd "Jane Smith" "jane@personal.com" "friends"'));
  console.log(chalk.yellow('  cadd "Bob Wilson" "bob@company.com"'));
  console.log();
}

addContact().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});