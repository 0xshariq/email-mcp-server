#!/usr/bin/env node

/**
 * Search Emails CLI - Advanced Operation
 * Usage: esearch.js [options]
 */

import { initializeEmailService, handleError, handleSuccess, Spinner, printHelp, checkHelpFlag } from '../utils.js';
import chalk from 'chalk';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        printHelp(
            'Email Search',
            'email-search [options]',
            'Search emails with advanced filters.',
            [
                'email-search --from "boss@company.com" --seen false',
                'email-search --subject "meeting" --since "2024-01-01"',
                'email-search --to "me@company.com" --limit 5'
            ],
            [
                { flag: '--from <email>', description: 'Filter by sender email' },
                { flag: '--to <email>', description: 'Filter by recipient email' },
                { flag: '--subject <text>', description: 'Filter by subject keywords' },
                { flag: '--since <date>', description: 'Filter emails since date (ISO format)' },
                { flag: '--before <date>', description: 'Filter emails before date (ISO format)' },
                { flag: '--seen <true|false>', description: 'Filter by read status' },
                { flag: '--flagged <true|false>', description: 'Filter by flagged status' },
                { flag: '--page <number>', description: 'Page number (default: 1)' },
                { flag: '--limit <number>', description: 'Results per page (default: 10)' },
                { flag: '--help, -h', description: 'Show this help message' }
            ]
        );
        process.exit(0);
    }

    const searchArgs = {};

    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        const value = args[i + 1];
        
        switch (flag) {
            case '--from':
                searchArgs.from = value;
                break;
            case '--to':
                searchArgs.to = value;
                break;
            case '--subject':
                searchArgs.subject = value;
                break;
            case '--since':
                searchArgs.since = value;
                break;
            case '--before':
                searchArgs.before = value;
                break;
            case '--seen':
                searchArgs.seen = value === 'true';
                break;
            case '--flagged':
                searchArgs.flagged = value === 'true';
                break;
            case '--page':
                searchArgs.page = parseInt(value);
                break;
            case '--limit':
                searchArgs.limit = parseInt(value);
                break;
        }
    }

    try {
        const spinner = new Spinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        const searchSpinner = new Spinner('Searching emails...').start();
        const result = await emailService.searchEmails(
            searchArgs,
            searchArgs.page || 1,
            searchArgs.limit || 10
        );
        searchSpinner.stop();

        handleSuccess(null, `Found ${result.total} emails matching your criteria:`);
        console.log('');

        if (result.emails.length === 0) {
            console.log(chalk.yellow('📭 No emails found matching your search criteria.'));
            return;
        }

        result.emails.forEach((email, index) => {
            console.log(chalk.blue(`📧 Email #${index + 1}`));
            console.log(chalk.cyan(`   ID: ${email.id}`));
            console.log(chalk.cyan(`   From: ${email.from}`));
            console.log(chalk.cyan(`   To: ${email.to.join(', ')}`));
            console.log(chalk.cyan(`   Subject: ${email.subject}`));
            console.log(chalk.cyan(`   Date: ${email.date.toLocaleString()}`));
            console.log(chalk.dim(`   Flags: ${email.flags.join(', ')}`));
            console.log(chalk.gray(`   Preview: ${email.body.substring(0, 100)}${email.body.length > 100 ? '...' : ''}`));
            console.log(chalk.gray('   ' + '─'.repeat(50)));
        });

        console.log(chalk.green(`\n📊 Search Results:`));
        console.log(chalk.cyan(`   Total: ${result.total}`));
        console.log(chalk.cyan(`   Page: ${result.page}`));
        console.log(chalk.cyan(`   Limit: ${result.limit}`));
        console.log(chalk.cyan(`   Showing: ${result.emails.length} results`));
        
        await emailService.close();
        
    } catch (error) {
        handleError(error, 'searching emails');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}