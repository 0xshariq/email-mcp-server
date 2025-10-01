#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function getContactsByGroup() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Missing group name'));
    console.log(chalk.yellow('Usage: contact-group <group-name>'));
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

function showHelp() {
  console.log(chalk.bold.cyan('\n👥 Contact Group - Get all contacts in a specific group\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  contact-group <group-name>'));
  console.log(chalk.cyan('  cgroup <group-name>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  group-name   Name of the contact group'));
  console.log();
  
  console.log(chalk.bold('COMMON GROUPS:'));
  console.log(chalk.gray('  • work, friends, family, general'));
  console.log(chalk.gray('  • clients, suppliers, team'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  contact-group "work"'));
  console.log(chalk.yellow('  cgroup "friends"'));
  console.log(chalk.yellow('  contact-group "clients"'));
  console.log();
}

getContactsByGroup().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});