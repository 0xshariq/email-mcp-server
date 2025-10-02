#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, createSpinner, showHelp } from '../utils.js';
import chalk from 'chalk';

async function getContactsByGroup() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(
      '👥 Contact Group - List contacts in a specific group',
      ['contact-group <group-name>', 'cgroup <group-name>'],
      'Display all contacts that belong to a specific group in your address book.',
      [
        'contact-group work',
        'cgroup family',
        'contact-group clients'
      ],
      [
        { name: 'group-name', description: 'Name of the group to list contacts from' }
      ]
    );
    return;
  }

  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Missing group name'));
    console.log(chalk.yellow('Usage: contact-group <group-name>'));
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

    const groupName = args[0];

    // Get contacts by group
    spinner.start('Loading group contacts...');
    const contacts = await contactService.getContactsByGroup(groupName);
    spinner.succeed(`Found ${contacts.length} contacts in group "${groupName}"`);

    if (contacts.length === 0) {
      console.log(chalk.yellow(`📭 No contacts found in group: "${groupName}"`));
      return;
    }

    console.log(chalk.bold.cyan(`\n👥 Contacts in "${groupName}" group (${contacts.length} contacts)\n`));
    
    contacts.forEach((contact, index) => {
      console.log(chalk.bold(`${index + 1}. ${contact.name}`));
      console.log(chalk.cyan(`   📧 ${contact.email}`));
      if (contact.phone) {
        console.log(chalk.gray(`   📞 ${contact.phone}`));
      }
      console.log(chalk.dim(`   🆔 ID: ${contact.id}`));
      console.log();
    });
    
  } catch (error) {
    spinner.fail('Failed to get group contacts');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}



getContactsByGroup().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});