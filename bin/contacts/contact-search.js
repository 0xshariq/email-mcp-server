#!/usr/bin/env node

import { loadEnv, validateEnv, initializeContactService, Spinner } from '../utils.js';
import chalk from 'chalk';

async function searchContacts() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.length === 0) {
    console.error(chalk.red('❌ Error: Missing search query'));
    console.log(chalk.yellow('Usage: contact-search <query>'));
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

    const query = args.join(' ');

    // Search contacts
    spinner.start('Searching contacts...');
    const contacts = await contactService.searchContacts(query);
    spinner.succeed(`Found ${contacts.length} matching contacts`);

    if (contacts.length === 0) {
      console.log(chalk.yellow(`📭 No contacts found matching: "${query}"`));
      return;
    }

    console.log(chalk.bold.cyan(`\n🔍 Search Results for "${query}" (${contacts.length} contacts)\n`));
    
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
    spinner.fail('Failed to search contacts');
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n🔍 Contact Search - Search contacts by name, email, or group\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log(chalk.cyan('  contact-search <query>'));
  console.log(chalk.cyan('  csearch <query>'));
  console.log();
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(chalk.green('  query    Search term (name, email, or group)'));
  console.log();
  
  console.log(chalk.bold('SEARCH TYPES:'));
  console.log(chalk.gray('  • Name search: "John", "Smith"'));
  console.log(chalk.gray('  • Email search: "gmail.com", "user@"'));
  console.log(chalk.gray('  • Group search: "work", "friends"'));
  console.log();
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(chalk.yellow('  contact-search "John"'));
  console.log(chalk.yellow('  csearch "gmail.com"'));
  console.log(chalk.yellow('  contact-search "work"'));
  console.log();
}

searchContacts().catch(error => {
  console.error(chalk.red('❌ Fatal error:'), error.message);
  process.exit(1);
});