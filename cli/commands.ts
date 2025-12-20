/**
 * Command implementations for the Email CLI
 * All commands are exported as functions that can be called by Commander.js
 */

import chalk from 'chalk';
import { initializeEmailService, initializeContactService, createSpinner, cleanEmailBody, validateAndResolveFilePath } from './utils.js';
import fs from 'fs';
import readline from 'readline';

// ==================== BASIC EMAIL COMMANDS ====================

export async function sendEmail(to: string, subject: string, body: string, html?: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(chalk.dim(`📧 Using account: ${process.env.EMAIL_USER || 'Not configured'}`));
        
        const recipients = to.split(',').map(email => email.trim()).filter(email => email.length > 0);
        
        if (recipients.length > 3) {
            throw new Error('email-send supports maximum 3 recipients. Use email-bulk for more.');
        }

        spinner.start(`Sending email to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}...`);
        await emailService.sendEmail(recipients.join(','), subject, body, html);
        spinner.succeed('Email sent successfully');

        console.log(chalk.green('✅ Email sent successfully!'));
        console.log(chalk.cyan(`📧 To: ${recipients.join(', ')}`));
        console.log(chalk.cyan(`📝 Subject: ${subject}`));
        console.log(chalk.gray(`📄 Body: ${body.substring(0, 50)}${body.length > 50 ? '...' : ''}`));
        if (html) {
            console.log(chalk.blue('🌐 HTML content included'));
        }
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to send email');
        throw error;
    }
}

export async function readEmails(count: number = 10): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Reading ${count} recent emails...`);
        const emails = await emailService.readRecentEmails(count, false);
        spinner.succeed(`Found ${emails.length} emails`);

        if (emails.length === 0) {
            console.log(chalk.yellow('📭 No emails found in your inbox.'));
            await emailService.close();
            return;
        }

        console.log(chalk.bold.cyan(`\n📬 Recent Emails (${emails.length} found)`));
        console.log(chalk.gray('═'.repeat(60)));

        emails.forEach((email: any, index: number) => {
            console.log(`\n${chalk.bold.white(`${index + 1}.`)} ${chalk.bold.blue(email.subject || '(No Subject)')}`);
            console.log(`   ${chalk.cyan('📧 From:')} ${chalk.white(email.from)}`);
            console.log(`   ${chalk.green('📅 Date:')} ${chalk.gray(new Date(email.date).toLocaleString())}`);
            console.log(`   ${chalk.yellow('🆔 ID:')}   ${chalk.dim(email.id)}`);
            
            if (index < emails.length - 1) {
                console.log(chalk.gray('─'.repeat(50)));
            }
        });
        
        console.log(chalk.gray('═'.repeat(60)));
        console.log(chalk.dim(`💡 Use 'email-get <id>' to read full email content\n`));

        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to read emails');
        throw error;
    }
}

export async function getEmail(emailId: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(chalk.dim(`📧 Using account: ${process.env.EMAIL_USER || 'Not configured'}`));

        spinner.start(`Getting email ${emailId}...`);
        const email = await emailService.getEmailById(emailId);
        spinner.succeed('Email retrieved');

        if (!email) {
            console.log(chalk.red('❌ Email not found with ID:'), chalk.yellow(emailId));
            await emailService.close();
            return;
        }

        console.log(chalk.green('✅ Email retrieved successfully!'));
        console.log('');
        console.log(chalk.blue('📧 Email Details:'));
        console.log(chalk.cyan(`   ID: ${email.id}`));
        console.log(chalk.cyan(`   From: ${email.from}`));
        console.log(chalk.cyan(`   To: ${email.to.join(', ')}`));
        if (email.cc && email.cc.length > 0) {
            console.log(chalk.cyan(`   CC: ${email.cc.join(', ')}`));
        }
        console.log(chalk.cyan(`   Subject: ${email.subject}`));
        console.log(chalk.cyan(`   Date: ${email.date.toLocaleString()}`));
        console.log('');
        console.log(chalk.blue('📄 Email Body:'));
        console.log(chalk.gray('   ' + '─'.repeat(50)));

        if (email.body && email.body.trim()) {
            const cleanBody = cleanEmailBody(email.body);
            const lines = cleanBody.split('\n');
            lines.forEach((line: string) => console.log(`   ${line}`));
        } else {
            console.log(chalk.gray('   (No content)'));
        }
        
        console.log(chalk.gray('   ' + '─'.repeat(50)));
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to get email');
        throw error;
    }
}

export async function deleteEmails(emailIds: string[], force: boolean = false): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(chalk.blue(`📧 Processing ${emailIds.length} email${emailIds.length > 1 ? 's' : ''} for deletion:`));

        if (!force) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise<string>((resolve) => {
                rl.question(chalk.yellow(`⚠️  Delete ${emailIds.length} email(s)? This cannot be undone! (y/N): `), resolve);
            });
            rl.close();

            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log(chalk.blue('ℹ️  Deletion cancelled'));
                await emailService.close();
                return;
            }
        }

        spinner.start(`Deleting ${emailIds.length} email(s)...`);
        for (const emailId of emailIds) {
            await emailService.deleteEmail(emailId);
        }
        spinner.succeed(`Deleted ${emailIds.length} email(s)`);

        console.log(chalk.green(`✅ Successfully deleted ${emailIds.length} email(s)`));
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to delete emails');
        throw error;
    }
}

export async function markEmailRead(emailId: string, read: boolean = true): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Marking email ${emailId} as ${read ? 'read' : 'unread'}...`);
        const success = await emailService.markEmailAsRead(emailId, read);
        spinner.succeed();

        if (success) {
            console.log(chalk.green(`✅ Email ${emailId} marked as ${read ? 'read' : 'unread'}!`));
            console.log(chalk.blue(`📧 Email ID: ${emailId}`));
            console.log(chalk.cyan(`   Status: ${read ? '✅ Read' : '📩 Unread'}`));
        } else {
            console.log(chalk.red('❌ Failed to update email status. Email may not exist.'));
        }

        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to mark email');
        throw error;
    }
}

export async function listCommands(): Promise<void> {
    console.log(chalk.bold.cyan('\n📧 Email MCP Server - Available Commands\n'));

    console.log(chalk.bold.green('📨 BASIC EMAIL OPERATIONS\n'));
    console.log(chalk.cyan('📤 email-send / esend'));
    console.log(chalk.gray('   Send an email to a recipient'));
    console.log(chalk.yellow('   Usage: email-send <to> <subject> <body>'));
    console.log();

    console.log(chalk.cyan('📥 email-read / eread'));
    console.log(chalk.gray('   Read emails from inbox'));
    console.log(chalk.yellow('   Usage: email-read [count]'));
    console.log();

    console.log(chalk.cyan('📧 email-get / eget'));
    console.log(chalk.gray('   Get a specific email by ID'));
    console.log(chalk.yellow('   Usage: email-get <email-id>'));
    console.log();

    console.log(chalk.cyan('🗑️ email-delete / edelete'));
    console.log(chalk.gray('   Delete emails by ID(s)'));
    console.log(chalk.yellow('   Usage: email-delete <email-id1> [email-id2] [...]'));
    console.log();

    console.log(chalk.cyan('✅ email-mark-read / emarkread'));
    console.log(chalk.gray('   Mark email(s) as read'));
    console.log(chalk.yellow('   Usage: email-mark-read <email-id1> [email-id2] [...]'));
    console.log();

    console.log(chalk.bold.magenta('🚀 ADVANCED EMAIL OPERATIONS\n'));
    console.log(chalk.cyan('📎 email-attach / eattach'));
    console.log(chalk.gray('   Send email with file attachment'));
    console.log();

    console.log(chalk.cyan('🔍 email-search / esearch'));
    console.log(chalk.gray('   Search emails by query'));
    console.log();

    console.log(chalk.cyan('📤 email-bulk / ebulk'));
    console.log(chalk.gray('   Send emails to multiple recipients'));
    console.log();

    console.log(chalk.cyan('📧 email-forward / eforward'));
    console.log(chalk.gray('   Forward an email'));
    console.log();

    console.log(chalk.cyan('📧 email-reply / ereply'));
    console.log(chalk.gray('   Reply to an email'));
    console.log();

    console.log(chalk.cyan('📊 email-stats / estats'));
    console.log(chalk.gray('   Get account statistics'));
    console.log();

    console.log(chalk.bold.blue('👥 CONTACT MANAGEMENT\n'));
    console.log(chalk.cyan('➕ contact-add / cadd'));
    console.log(chalk.gray('   Add a new contact'));
    console.log();

    console.log(chalk.cyan('📋 contact-list / clist'));
    console.log(chalk.gray('   List all contacts'));
    console.log();

    console.log(chalk.cyan('🔍 contact-search / csearch'));
    console.log(chalk.gray('   Search contacts'));
    console.log();
}

// ==================== ADVANCED EMAIL COMMANDS ====================

export async function searchEmails(options: any): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start('Searching emails...');
        const results = await emailService.searchEmails(options);
        spinner.succeed(`Found ${results.length} emails`);

        if (results.length === 0) {
            console.log(chalk.yellow('📭 No emails found matching your search criteria'));
            await emailService.close();
            return;
        }

        console.log(chalk.bold.cyan(`\n🔍 Search Results (${results.length} found)`));
        console.log(chalk.gray('═'.repeat(60)));

        results.forEach((email: any, index: number) => {
            console.log(`\n${chalk.bold.white(`${index + 1}.`)} ${chalk.bold.blue(email.subject || '(No Subject)')}`);
            console.log(`   ${chalk.cyan('📧 From:')} ${chalk.white(email.from)}`);
            console.log(`   ${chalk.green('📅 Date:')} ${chalk.gray(new Date(email.date).toLocaleString())}`);
            console.log(`   ${chalk.yellow('🆔 ID:')}   ${chalk.dim(email.id)}`);
        });

        console.log(chalk.gray('═'.repeat(60)));
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Search failed');
        throw error;
    }
}

export async function attachEmail(to: string, subject: string, body: string, filePath: string, attachmentName?: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        const resolvedPath = validateAndResolveFilePath(filePath);
        
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        const fileContent = fs.readFileSync(resolvedPath);
        const fileName = attachmentName || filePath.split('/').pop() || 'attachment';

        spinner.start('Sending email with attachment...');
        await emailService.sendEmailWithAttachment(to, subject, body, [{
            filename: fileName,
            content: fileContent
        }]);
        spinner.succeed('Email sent successfully');

        console.log(chalk.green('✅ Email with attachment sent successfully!'));
        console.log(chalk.cyan(`📧 To: ${to}`));
        console.log(chalk.cyan(`📎 Attachment: ${fileName}`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to send email with attachment');
        throw error;
    }
}

export async function forwardEmail(emailId: string, to: string, message?: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Forwarding email ${emailId}...`);
        await emailService.forwardEmail(emailId, to, message);
        spinner.succeed('Email forwarded successfully');

        console.log(chalk.green('✅ Email forwarded successfully!'));
        console.log(chalk.cyan(`📧 To: ${to}`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to forward email');
        throw error;
    }
}

export async function replyEmail(emailId: string, message: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Replying to email ${emailId}...`);
        await emailService.replyToEmail(emailId, message);
        spinner.succeed('Reply sent successfully');

        console.log(chalk.green('✅ Reply sent successfully!'));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to send reply');
        throw error;
    }
}

export async function emailStats(): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start('Getting email statistics...');
        const stats = await emailService.getStats();
        spinner.succeed('Statistics retrieved');

        console.log(chalk.bold.cyan('\n📊 Email Account Statistics\n'));
        console.log(chalk.cyan(`📧 Total Emails: ${stats.total}`));
        console.log(chalk.cyan(`📩 Unread: ${stats.unread}`));
        console.log(chalk.cyan(`✅ Read: ${stats.read}`));
        console.log(chalk.cyan(`⭐ Flagged: ${stats.flagged}`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to get statistics');
        throw error;
    }
}

export async function draftEmail(to: string, subject: string, body: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start('Creating draft...');
        await emailService.createDraft(to, subject, body);
        spinner.succeed('Draft created successfully');

        console.log(chalk.green('✅ Draft created successfully!'));
        console.log(chalk.cyan(`📧 To: ${to}`));
        console.log(chalk.cyan(`📝 Subject: ${subject}`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to create draft');
        throw error;
    }
}

export async function scheduleEmail(to: string, subject: string, body: string, scheduledTime: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start('Scheduling email...');
        await emailService.scheduleEmail(to, subject, body, new Date(scheduledTime));
        spinner.succeed('Email scheduled successfully');

        console.log(chalk.green('✅ Email scheduled successfully!'));
        console.log(chalk.cyan(`📧 To: ${to}`));
        console.log(chalk.cyan(`⏰ Scheduled for: ${new Date(scheduledTime).toLocaleString()}`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to schedule email');
        throw error;
    }
}

export async function bulkSend(recipientsFile: string, subject: string, body: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        const recipients = fs.readFileSync(recipientsFile, 'utf8').split('\n').filter(line => line.trim());
        
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Sending to ${recipients.length} recipients...`);
        await emailService.bulkSend(recipients, subject, body);
        spinner.succeed(`Sent to ${recipients.length} recipients`);

        console.log(chalk.green(`✅ Bulk send completed! Sent to ${recipients.length} recipients`));
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Bulk send failed');
        throw error;
    }
}

// ==================== CONTACT COMMANDS ====================

export async function addContact(name: string, email: string, group?: string, phone?: string): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start('Adding contact...');
        await contactService.addContact({ name, email, group, phone });
        spinner.succeed('Contact added successfully');

        console.log(chalk.green('✅ Contact added successfully!'));
        console.log(chalk.cyan(`👤 Name: ${name}`));
        console.log(chalk.cyan(`📧 Email: ${email}`));
        if (group) console.log(chalk.cyan(`📁 Group: ${group}`));
        if (phone) console.log(chalk.cyan(`📞 Phone: ${phone}`));
    } catch (error: any) {
        spinner.fail('Failed to add contact');
        throw error;
    }
}

export async function listContacts(limit: number = 20): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start('Loading contacts...');
        const contacts = await contactService.listContacts(limit);
        spinner.succeed(`Loaded ${contacts.length} contacts`);

        if (contacts.length === 0) {
            console.log(chalk.yellow('📭 No contacts found'));
            return;
        }

        console.log(chalk.bold.cyan(`\n👥 Contacts (${contacts.length} found)\n`));
        contacts.forEach((contact: any, index: number) => {
            console.log(`${chalk.bold.white(`${index + 1}.`)} ${chalk.bold.blue(contact.name)}`);
            console.log(`   ${chalk.cyan('📧 Email:')} ${contact.email}`);
            if (contact.group) console.log(`   ${chalk.yellow('📁 Group:')} ${contact.group}`);
            if (contact.phone) console.log(`   ${chalk.green('📞 Phone:')} ${contact.phone}`);
            console.log();
        });
    } catch (error: any) {
        spinner.fail('Failed to list contacts');
        throw error;
    }
}

export async function searchContacts(query: string): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start('Searching contacts...');
        const contacts = await contactService.searchContacts(query);
        spinner.succeed(`Found ${contacts.length} contacts`);

        if (contacts.length === 0) {
            console.log(chalk.yellow('📭 No contacts found matching your search'));
            return;
        }

        console.log(chalk.bold.cyan(`\n🔍 Search Results (${contacts.length} found)\n`));
        contacts.forEach((contact: any, index: number) => {
            console.log(`${chalk.bold.white(`${index + 1}.`)} ${chalk.bold.blue(contact.name)}`);
            console.log(`   ${chalk.cyan('📧 Email:')} ${contact.email}`);
            if (contact.group) console.log(`   ${chalk.yellow('📁 Group:')} ${contact.group}`);
            console.log();
        });
    } catch (error: any) {
        spinner.fail('Search failed');
        throw error;
    }
}

export async function deleteContact(contactId: string): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start('Deleting contact...');
        await contactService.deleteContact(contactId);
        spinner.succeed('Contact deleted successfully');

        console.log(chalk.green('✅ Contact deleted successfully!'));
    } catch (error: any) {
        spinner.fail('Failed to delete contact');
        throw error;
    }
}

export async function updateContact(contactId: string, updates: any): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start('Updating contact...');
        await contactService.updateContact(contactId, updates);
        spinner.succeed('Contact updated successfully');

        console.log(chalk.green('✅ Contact updated successfully!'));
    } catch (error: any) {
        spinner.fail('Failed to update contact');
        throw error;
    }
}

export async function getContactGroup(group: string): Promise<void> {
    const spinner = createSpinner('Initializing contact service...');
    
    try {
        spinner.start();
        const contactService = await initializeContactService();
        spinner.succeed('Contact service initialized');

        spinner.start(`Getting contacts in group: ${group}...`);
        const contacts = await contactService.getContactsByGroup(group);
        spinner.succeed(`Found ${contacts.length} contacts`);

        if (contacts.length === 0) {
            console.log(chalk.yellow(`📭 No contacts found in group: ${group}`));
            return;
        }

        console.log(chalk.bold.cyan(`\n📁 Group: ${group} (${contacts.length} contacts)\n`));
        contacts.forEach((contact: any, index: number) => {
            console.log(`${chalk.bold.white(`${index + 1}.`)} ${chalk.bold.blue(contact.name)}`);
            console.log(`   ${chalk.cyan('📧 Email:')} ${contact.email}`);
            console.log();
        });
    } catch (error: any) {
        spinner.fail('Failed to get group contacts');
        throw error;
    }
}
