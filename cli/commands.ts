/**
 * Command implementations for the Email CLI
 * All commands are exported as functions that can be called by Commander.js
 */

import chalk from 'chalk';
import { 
    initializeEmailService, 
    initializeContactService, 
    createSpinner, 
    cleanEmailBody, 
    validateAndResolveFilePath,
    pipe,
    end,
    branch,
    check,
    cross,
    bullet,
    info
} from './utils.js';
import fs from 'fs';
import readline from 'readline';

// ==================== BASIC EMAIL COMMANDS ====================

export async function sendEmail(to: string, subject: string, body: string, html?: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        // Validate input
        if (!to || to.trim() === '') {
            throw new Error('Recipient email address is required');
        }
        if (!subject || subject.trim() === '') {
            throw new Error('Email subject is required');
        }
        if (!body || body.trim() === '') {
            throw new Error('Email body is required');
        }

        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(pipe);
        console.log(pipe, '  ', chalk.dim(`Using: ${process.env.EMAIL_USER || 'Not configured'}`));
        console.log(pipe);
        
        const recipients = to.split(',').map(email => email.trim()).filter(email => email.length > 0);
        
        // Validate email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = recipients.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
            throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
        }
        
        if (recipients.length > 3) {
            throw new Error('email-send supports maximum 3 recipients. Use email-bulk for more.');
        }

        spinner.start(`Sending email to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}...`);
        await emailService.sendEmail(recipients.join(','), subject, body, html);
        spinner.succeed('Email sent successfully');

        console.log(pipe);
        console.log(bullet, chalk.green('Email sent successfully!'));
        console.log(pipe);
        console.log(branch, chalk.cyan(`To: ${recipients.join(', ')}`));
        console.log(branch, chalk.cyan(`Subject: ${subject}`));
        console.log(branch, chalk.gray(`Body: ${body.substring(0, 50)}${body.length > 50 ? '...' : ''}`));
        if (html) {
            console.log(end, chalk.blue('HTML content included'));
        } else {
            console.log(end);
        }
        console.log('');
        
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to send email');
        throw error;
    }
}

export async function readEmails(count: number = 10): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        // Validate count
        if (count <= 0) {
            throw new Error('Count must be a positive number');
        }
        if (count > 100) {
            console.log(chalk.yellow('⚠️  Large count detected. Limiting to 100 emails for performance.'));
            count = 100;
        }

        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Reading ${count} recent emails...`);
        const emails = await emailService.readRecentEmails(count, false);
        spinner.succeed(`Found ${emails.length} emails`);

        if (emails.length === 0) {
            console.log(pipe);
            console.log(info, chalk.yellow('No emails found in your inbox'));
            console.log('');
            await emailService.close();
            return;
        }

        console.log(pipe);
        console.log(chalk.bold.cyan(`📬 Recent Emails (${emails.length} found)`));
        console.log(pipe);

        emails.forEach((email: any, index: number) => {
            console.log(branch, chalk.bold.blue(email.subject || '(No Subject)'));
            console.log(pipe, '  ', chalk.cyan('From:'), chalk.white(email.from));
            console.log(pipe, '  ', chalk.green('Date:'), chalk.gray(new Date(email.date).toLocaleString()));
            console.log(pipe, '  ', chalk.yellow('ID:'), chalk.dim(email.id));
            
            if (index < emails.length - 1) {
                console.log(pipe);
            }
        });
        
        console.log(end);
        console.log(chalk.dim(`💡 Tip: Use 'email-cli get <id>' to read full email content`));
        console.log('');

        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to read emails');
        throw error;
    }
}

export async function getEmail(emailId: string): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        // Validate email ID
        if (!emailId || emailId.trim() === '') {
            throw new Error('Email ID is required');
        }

        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(pipe);
        console.log(pipe, '  ', chalk.dim(`Using: ${process.env.EMAIL_USER || 'Not configured'}`));
        console.log(pipe);

        spinner.start(`Getting email ${emailId}...`);
        const email = await emailService.getEmailById(emailId);
        spinner.succeed('Email retrieved');

        if (!email) {
            console.log(pipe);
            console.log(cross, chalk.red('Email not found with ID:'), chalk.yellow(emailId));
            console.log('');
            await emailService.close();
            return;
        }

        console.log(pipe);
        console.log(bullet, chalk.green('Email retrieved successfully!'));
        console.log(pipe);
        console.log(branch, chalk.cyan(`ID: ${email.id}`));
        console.log(branch, chalk.cyan(`From: ${email.from}`));
        console.log(branch, chalk.cyan(`To: ${email.to.join(', ')}`));
        if (email.cc && email.cc.length > 0) {
            console.log(branch, chalk.cyan(`CC: ${email.cc.join(', ')}`));
        }
        console.log(branch, chalk.cyan(`Subject: ${email.subject}`));
        console.log(branch, chalk.cyan(`Date: ${email.date.toLocaleString()}`));
        console.log(pipe);
        console.log(branch, chalk.blue('Body:'));
        console.log(pipe);

        if (email.body && email.body.trim()) {
            const cleanBody = cleanEmailBody(email.body);
            const lines = cleanBody.split('\n');
            lines.forEach((line: string, idx: number) => {
                if (idx < lines.length - 1) {
                    console.log(pipe, '  ', line);
                } else {
                    console.log(end, '  ', line);
                }
            });
        } else {
            console.log(end, chalk.gray('(No content)'));
        }
        
        console.log('');
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to get email');
        throw error;
    }
}

export async function deleteEmails(emailIds: string[], force: boolean = false): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        // Validate input
        if (!emailIds || emailIds.length === 0) {
            throw new Error('At least one email ID is required');
        }
        
        // Remove duplicates and empty strings
        const uniqueIds = [...new Set(emailIds.filter(id => id && id.trim() !== ''))];
        if (uniqueIds.length === 0) {
            throw new Error('No valid email IDs provided');
        }

        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(pipe);
        console.log(pipe, '  ', chalk.blue(`Processing ${uniqueIds.length} email${uniqueIds.length > 1 ? 's' : ''} for deletion`));
        console.log(pipe);

        if (!force) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise<string>((resolve) => {
                rl.question(`${pipe}   ${chalk.yellow(`Delete ${uniqueIds.length} email(s)? This cannot be undone! (y/N):`)} `, resolve);
            });
            rl.close();

            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log(pipe);
                console.log(info, chalk.blue('Deletion cancelled'));
                console.log('');
                await emailService.close();
                return;
            }
        }

        spinner.start(`Deleting ${uniqueIds.length} email(s)...`);
        let deleted = 0;
        const failed: string[] = [];
        
        for (const emailId of uniqueIds) {
            try {
                await emailService.deleteEmail(emailId);
                deleted++;
            } catch (error) {
                failed.push(emailId);
            }
        }
        
        if (failed.length === 0) {
            spinner.succeed(`Deleted ${deleted} email(s)`);
        } else {
            spinner.warn(`Deleted ${deleted}/${uniqueIds.length} email(s)`);
        }

        console.log(pipe);
        if (deleted > 0) {
            console.log(check, chalk.green(`Successfully deleted ${deleted} email(s)`));
        }
        if (failed.length > 0) {
            console.log(cross, chalk.red(`Failed to delete ${failed.length} email(s): ${failed.join(', ')}`));
        }
        console.log('');
        await emailService.close();
    } catch (error: any) {
        spinner.fail('Failed to delete emails');
        throw error;
    }
}

export async function markEmailRead(emailId: string, read: boolean = true): Promise<void> {
    const spinner = createSpinner('Initializing email service...');
    
    try {
        // Validate email ID
        if (!emailId || emailId.trim() === '') {
            throw new Error('Email ID is required');
        }

        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        spinner.start(`Marking email ${emailId} as ${read ? 'read' : 'unread'}...`);
        const success = await emailService.markEmailAsRead(emailId, read);
        spinner.succeed();

        if (success) {
            console.log(pipe);
            console.log(check, chalk.green(`Email ${emailId} marked as ${read ? 'read' : 'unread'}!`));
            console.log(pipe);
            console.log(branch, chalk.blue(`Email ID: ${emailId}`));
            console.log(end, chalk.cyan(`Status: ${read ? 'Read' : 'Unread'}`));
            console.log('');
        } else {
            console.log(pipe);
            console.log(cross, chalk.red('Failed to update email status. Email may not exist.'));
            console.log('');
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
        // Validate input
        if (!to || to.trim() === '') {
            throw new Error('Recipient email address is required');
        }
        if (!subject || subject.trim() === '') {
            throw new Error('Email subject is required');
        }
        if (!body || body.trim() === '') {
            throw new Error('Email body is required');
        }
        if (!filePath || filePath.trim() === '') {
            throw new Error('File path is required');
        }

        const resolvedPath = validateAndResolveFilePath(filePath);
        
        // Check file size (warn if > 25MB, which is Gmail's limit)
        const stats = fs.statSync(resolvedPath);
        const fileSizeMB = stats.size / (1024 * 1024);
        if (fileSizeMB > 25) {
            console.log(chalk.yellow(`⚠️  Warning: File size is ${fileSizeMB.toFixed(2)}MB. Gmail has a 25MB attachment limit.`));
        }
        
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
        // Validate input
        if (!emailId || emailId.trim() === '') {
            throw new Error('Email ID is required');
        }
        if (!to || to.trim() === '') {
            throw new Error('Recipient email address is required');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to.trim())) {
            throw new Error(`Invalid email address: ${to}`);
        }

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
        // Validate input
        if (!emailId || emailId.trim() === '') {
            throw new Error('Email ID is required');
        }
        if (!message || message.trim() === '') {
            throw new Error('Reply message is required');
        }

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
        // Validate input
        if (!recipientsFile || recipientsFile.trim() === '') {
            throw new Error('Recipients file path is required');
        }
        if (!subject || subject.trim() === '') {
            throw new Error('Email subject is required');
        }
        if (!body || body.trim() === '') {
            throw new Error('Email body is required');
        }
        
        // Check if file exists
        if (!fs.existsSync(recipientsFile)) {
            throw new Error(`Recipients file not found: ${recipientsFile}`);
        }
        
        const recipients = fs.readFileSync(recipientsFile, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));
        
        if (recipients.length === 0) {
            throw new Error('No recipients found in file');
        }
        
        // Validate email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = recipients.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
            console.log(chalk.yellow(`⚠️  Warning: Found ${invalidEmails.length} invalid email(s). They will be skipped.`));
            console.log(chalk.gray(`   Invalid: ${invalidEmails.slice(0, 5).join(', ')}${invalidEmails.length > 5 ? '...' : ''}`));
        }
        
        const validRecipients = recipients.filter(email => emailRegex.test(email));
        if (validRecipients.length === 0) {
            throw new Error('No valid email addresses found in file');
        }
        
        spinner.start();
        const emailService = await initializeEmailService();
        spinner.succeed('Email service initialized');

        console.log(pipe);
        console.log(pipe, '  ', chalk.blue(`Preparing to send to ${validRecipients.length} valid recipient(s)...`));
        console.log(pipe);

        spinner.start(`Sending to ${validRecipients.length} recipients...`);
        await emailService.bulkSend(validRecipients, subject, body);
        spinner.succeed(`Sent to ${validRecipients.length} recipients`);

        console.log(pipe);
        console.log(check, chalk.green(`Bulk send completed! Sent to ${validRecipients.length} recipients`));
        console.log('');
        
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
        // Validate input
        if (!name || name.trim() === '') {
            throw new Error('Contact name is required');
        }
        if (!email || email.trim() === '') {
            throw new Error('Contact email is required');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new Error(`Invalid email address: ${email}`);
        }

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
        // Validate query
        if (!query || query.trim() === '') {
            throw new Error('Search query is required');
        }
        if (query.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters');
        }

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
        // Validate contact ID
        if (!contactId || contactId.trim() === '') {
            throw new Error('Contact ID is required');
        }

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
        // Validate input
        if (!contactId || contactId.trim() === '') {
            throw new Error('Contact ID is required');
        }
        if (!updates || Object.keys(updates).length === 0) {
            throw new Error('At least one field to update is required');
        }
        
        // Validate email if provided
        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email.trim())) {
                throw new Error(`Invalid email address: ${updates.email}`);
            }
        }

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
        // Validate group name
        if (!group || group.trim() === '') {
            throw new Error('Group name is required');
        }

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
