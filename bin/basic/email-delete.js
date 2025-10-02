#!/usr/bin/env node

/**
 * Delete Email CLI - Basic Operation (Long alias)
 * Usage: email-delete.js <email_id1> [email_id2] [email_id3] ...
 * Supports: Single email, multiple emails (space or comma separated), batch mode
 */

import { initializeEmailService, handleError, handleSuccess, Spinner, printHelp, checkHelpFlag } from '../utils.js';
import chalk from 'chalk';
import readline from 'readline';

async function main() {
    const args = process.argv.slice(2);

    if (checkHelpFlag(args)) {
        printHelp(
            'Email Delete',
            'email-delete.js <email_id1> [email_id2] [email_id3] ...',
            'Delete one or multiple emails from your inbox permanently.',
            [
                'email-delete.js 12345                    # Delete single email',
                'email-delete.js 12345,12346,12347       # Delete multiple emails (comma-separated)',
                'email-delete.js 12345 12346 12347       # Delete multiple emails (space-separated)',
                'email-delete.js 12345 --force           # Delete without confirmation',
                'email-delete.js 12345,12346 --force     # Delete multiple without confirmation'
            ],
            [
                { flag: '--help, -h', description: 'Show this help message' },
                { flag: '--force, -f', description: 'Skip confirmation prompt' },
                { flag: '--batch', description: 'Process emails in batch mode (faster for many emails)' }
            ]
        );
        process.exit(0);
    }

    if (args.length < 1) {
        console.error(chalk.red('❌ Error: Missing email ID(s)'));
        console.error(chalk.yellow('Usage: email-delete.js <email_id1> [email_id2] [email_id3] ...'));
        console.error(chalk.dim('💡 Use "email-read.js" command first to get email IDs'));
        console.error(chalk.yellow('💡 You can provide multiple IDs: space-separated or comma-separated'));
        console.error(chalk.red('⚠️  This action cannot be undone!'));
        process.exit(1);
    }

    // Extract email IDs and flags
    const force = args.includes('--force') || args.includes('-f');
    const batchMode = args.includes('--batch');
    
    // Get all email IDs (exclude flags)
    const emailIdArgs = args.filter(arg => !arg.startsWith('-'));
    
    // Parse email IDs - support both comma-separated and space-separated
    let emailIds = [];
    for (const arg of emailIdArgs) {
        if (arg.includes(',')) {
            // Comma-separated: "12345,12346,12347"
            emailIds.push(...arg.split(',').map(id => id.trim()).filter(id => id));
        } else {
            // Space-separated or single ID
            emailIds.push(arg.trim());
        }
    }

    // Remove duplicates
    emailIds = [...new Set(emailIds)];

    try {
        const spinner = new Spinner('Initializing email service...').start();
        const emailService = await initializeEmailService();
        spinner.stop();

        console.log(chalk.blue(`📧 Processing ${emailIds.length} email${emailIds.length > 1 ? 's' : ''} for deletion:`));
        console.log('');

        // Get all emails to show what will be deleted
        const getSpinner = new Spinner('Fetching email details...').start();
        const emailsToDelete = [];
        const notFoundIds = [];

        for (const emailId of emailIds) {
            try {
                const email = await emailService.getEmailById(emailId);
                if (email) {
                    emailsToDelete.push({ id: emailId, email });
                } else {
                    notFoundIds.push(emailId);
                }
            } catch (error) {
                console.error(chalk.yellow(`⚠️  Could not fetch email ${emailId}: ${error.message}`));
                notFoundIds.push(emailId);
            }
        }
        getSpinner.stop();

        if (notFoundIds.length > 0) {
            console.log(chalk.yellow(`⚠️  ${notFoundIds.length} email(s) not found:`));
            notFoundIds.forEach(id => console.log(chalk.gray(`   - ID: ${id}`)));
            console.log('');
        }

        if (emailsToDelete.length === 0) {
            console.log(chalk.red('❌ No valid emails found to delete.'));
            console.log(chalk.dim('💡 Use "email-read" command to see available email IDs'));
            process.exit(1);
        }

        // Display emails to be deleted
        console.log(chalk.blue(`� ${emailsToDelete.length} email${emailsToDelete.length > 1 ? 's' : ''} will be deleted:`));
        emailsToDelete.forEach((item, index) => {
            const { id, email } = item;
            console.log(chalk.cyan(`${index + 1}. ID: ${id}`));
            console.log(chalk.gray(`   From: ${email.from || 'Unknown'}`));
            console.log(chalk.gray(`   Subject: ${email.subject || 'No subject'}`));
            console.log(chalk.gray(`   Date: ${email.date ? email.date.toLocaleString() : 'Unknown date'}`));
            console.log('');
        });

        // Confirmation
        if (!force) {
            const message = emailsToDelete.length === 1 
                ? '⚠️  Are you sure you want to delete this email? This cannot be undone!'
                : `⚠️  Are you sure you want to delete these ${emailsToDelete.length} emails? This cannot be undone!`;
            
            console.log(chalk.red(message));
            console.log(chalk.yellow('Type "yes" to confirm or anything else to cancel:'));
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const confirmation = await new Promise(resolve => {
                rl.question('> ', (answer) => {
                    rl.close();
                    resolve(answer.toLowerCase().trim());
                });
            });

            if (confirmation !== 'yes') {
                console.log(chalk.yellow('❌ Delete cancelled.'));
                process.exit(0);
            }
        }

        // Delete emails
        let successCount = 0;
        let failureCount = 0;
        const failures = [];

        if (batchMode && emailsToDelete.length > 1) {
            // Batch delete - faster for multiple emails
            console.log(chalk.blue('🚀 Batch deleting emails...'));
            const deleteSpinner = new Spinner(`Deleting ${emailsToDelete.length} emails in batch...`).start();
            
            try {
                // Delete all emails in parallel for better performance
                const deletePromises = emailsToDelete.map(async (item) => {
                    try {
                        const success = await emailService.deleteEmail(item.id);
                        return { id: item.id, success };
                    } catch (error) {
                        return { id: item.id, success: false, error: error.message };
                    }
                });

                const results = await Promise.all(deletePromises);
                
                results.forEach(result => {
                    if (result.success) {
                        successCount++;
                    } else {
                        failureCount++;
                        failures.push({ id: result.id, error: result.error || 'Unknown error' });
                    }
                });
                
                deleteSpinner.stop();
            } catch (error) {
                deleteSpinner.fail('Batch delete failed');
                console.error(chalk.red(`❌ Batch delete error: ${error.message}`));
                process.exit(1);
            }
        } else {
            // Individual delete - with progress for each email
            for (let i = 0; i < emailsToDelete.length; i++) {
                const { id, email } = emailsToDelete[i];
                const deleteSpinner = new Spinner(`Deleting email ${i + 1}/${emailsToDelete.length} (ID: ${id})...`).start();
                
                try {
                    const success = await emailService.deleteEmail(id);
                    deleteSpinner.stop();
                    
                    if (success) {
                        successCount++;
                        console.log(chalk.green(`✅ Deleted email ${id}: ${email.subject || 'No subject'}`));
                    } else {
                        failureCount++;
                        failures.push({ id, error: 'Delete operation returned false' });
                        console.log(chalk.red(`❌ Failed to delete email ${id}: ${email.subject || 'No subject'}`));
                    }
                } catch (error) {
                    deleteSpinner.fail(`Failed to delete email ${id}`);
                    failureCount++;
                    failures.push({ id, error: error.message });
                    console.log(chalk.red(`❌ Error deleting email ${id}: ${error.message}`));
                }
            }
        }

        // Summary
        console.log('');
        console.log(chalk.blue('📊 Deletion Summary:'));
        console.log(chalk.green(`✅ Successfully deleted: ${successCount} email${successCount !== 1 ? 's' : ''}`));
        
        if (failureCount > 0) {
            console.log(chalk.red(`❌ Failed to delete: ${failureCount} email${failureCount !== 1 ? 's' : ''}`));
            console.log('');
            console.log(chalk.yellow('Failed emails:'));
            failures.forEach(failure => {
                console.log(chalk.red(`   - ID: ${failure.id} (${failure.error})`));
            });
        }

        if (successCount > 0) {
            const message = successCount === 1 
                ? `🗑️  ${successCount} email has been permanently deleted.`
                : `🗑️  ${successCount} emails have been permanently deleted.`;
            console.log(chalk.red(message));
        }

        await emailService.close();
        
    } catch (error) {
        handleError(error, 'deleting email');
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}