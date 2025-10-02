import * as nodemailer from 'nodemailer';
import * as imaps from 'imap-simple';

// Email interfaces
export interface EmailConfig {
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    imap: {
        host: string;
        port: number;
        tls: boolean;
        auth: {
            user: string;
            pass: string;
        };
        markSeen: boolean;
    };
}

export interface EmailMessage {
    id: string;
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    html?: string;
    attachments?: Attachment[];
    date: Date;
    flags: string[];
    priority?: 'high' | 'normal' | 'low';
}

export interface Attachment {
    filename: string;
    content: Buffer | string;
    contentType?: string;
    path?: string;
    cid?: string;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    group?: string;
}

export interface EmailFilter {
    from?: string;
    to?: string;
    subject?: string;
    since?: Date;
    before?: Date;
    seen?: boolean;
    flagged?: boolean;
    hasAttachment?: boolean;
}

export interface SearchResult {
    emails: EmailMessage[];
    total: number;
    page: number;
    limit: number;
}

// Email service class
export class EmailService {
    private config: EmailConfig;
    private transporter?: nodemailer.Transporter;
    private imapConnection?: any;

    constructor(config: EmailConfig) {
        this.config = config;
    }

    // Initialize SMTP transporter
    private async initializeTransporter(): Promise<nodemailer.Transporter> {
        if (!this.transporter) {
            // Add TLS options to handle self-signed certificates
            const smtpConfig = {
                ...this.config.smtp,
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates
                }
            };
            this.transporter = nodemailer.createTransport(smtpConfig);
        }
        return this.transporter;
    }

    // Initialize IMAP connection
    private async initializeIMAP(): Promise<any> {
        if (!this.imapConnection) {
            this.imapConnection = await imaps.connect({
                imap: {
                    ...this.config.imap,
                    user: this.config.imap.auth.user,
                    password: this.config.imap.auth.pass,
                    connTimeout: 15000, // 15 second connection timeout (faster)
                    authTimeout: 10000, // 10 second auth timeout (faster)
                    keepalive: {
                        interval: 10000, // 10 seconds
                        idleInterval: 300000, // 5 minutes
                        forceNoop: true
                    },
                    tlsOptions: {
                        rejectUnauthorized: false // Allow self-signed certificates
                    }
                }
            });
        }
        return this.imapConnection;
    }

    // === BASIC EMAIL OPERATIONS ===

    /**
     * Send a simple email
     */
    async sendEmail(to: string | string[], subject: string, body: string, html?: string): Promise<{ messageId: string; response: string }> {
        const transporter = await this.initializeTransporter();
        
        const mailOptions = {
            from: this.config.smtp.auth.user,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text: body,
            html: html || body
        };

        const result = await transporter.sendMail(mailOptions);
        return {
            messageId: result.messageId,
            response: result.response
        };
    }

    /**
     * Send email with attachments
     */
    async sendEmailWithAttachments(
        to: string | string[], 
        subject: string, 
        body: string, 
        attachments: Attachment[], 
        html?: string
    ): Promise<{ messageId: string; response: string }> {
        const transporter = await this.initializeTransporter();
        
        const mailOptions = {
            from: this.config.smtp.auth.user,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text: body,
            html: html || body,
            attachments: attachments.map(att => ({
                filename: att.filename,
                content: att.content,
                contentType: att.contentType,
                path: att.path,
                cid: att.cid
            }))
        };

        const result = await transporter.sendMail(mailOptions);
        return {
            messageId: result.messageId,
            response: result.response
        };
    }

    /**
     * Read recent emails from inbox (optimized for list view)
     */
    async readRecentEmails(count: number = 10, fullBody: boolean = false): Promise<EmailMessage[]> {
        const connection = await this.initializeIMAP();
        
        await connection.openBox('INBOX');
        
        // Use a more efficient search for recent messages
        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: fullBody 
                ? ['HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)', 'TEXT']
                : 'HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)',  // Headers only for faster loading
            markSeen: this.config.imap.markSeen,
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        
        // Take only the most recent messages (slice from end and reverse)
        const recentMessages = messages.slice(-count).reverse();

        return recentMessages.map((message: any) => this.parseEmailMessage(message, fullBody));
    }

    /**
     * Get email by ID
     */
    async getEmailById(emailId: string): Promise<EmailMessage | null> {
        const connection = await this.initializeIMAP();
        
        await connection.openBox('INBOX');
        const searchCriteria = [['UID', emailId]];
        const fetchOptions = {
            bodies: ['HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)', 'TEXT'],
            markSeen: false,
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        return messages.length > 0 ? this.parseEmailMessage(messages[0], true) : null;
    }

    /**
     * Delete email by ID
     */
    async deleteEmail(emailId: string): Promise<boolean> {
        try {
            const connection = await this.initializeIMAP();
            
            await connection.openBox('INBOX');
            
            // Add the deleted flag to the email
            await new Promise((resolve, reject) => {
                connection.imap.addFlags(emailId, '\\Deleted', (err: any) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
            
            // Expunge to permanently delete
            await new Promise((resolve, reject) => {
                connection.imap.expunge((err: any) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
            
            return true;
        } catch (error) {
            console.error('Error deleting email:', error);
            return false;
        }
    }

    /**
     * Delete multiple emails in batch (more efficient than individual deletes)
     */
    async deleteEmails(emailIds: string[]): Promise<{ success: string[], failed: Array<{ id: string, error: string }> }> {
        const results = {
            success: [] as string[],
            failed: [] as Array<{ id: string, error: string }>
        };

        if (emailIds.length === 0) {
            return results;
        }

        try {
            const connection = await this.initializeIMAP();
            await connection.openBox('INBOX');
            
            // Add deleted flag to all emails at once
            for (const emailId of emailIds) {
                try {
                    await new Promise((resolve, reject) => {
                        connection.imap.addFlags(emailId, '\\Deleted', (err: any) => {
                            if (err) reject(err);
                            else resolve(null);
                        });
                    });
                    results.success.push(emailId);
                } catch (error) {
                    results.failed.push({ 
                        id: emailId, 
                        error: error instanceof Error ? error.message : 'Unknown error' 
                    });
                }
            }
            
            // Single expunge operation for all deleted emails (more efficient)
            if (results.success.length > 0) {
                await new Promise((resolve, reject) => {
                    connection.imap.expunge((err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });
            }
            
        } catch (error) {
            // If connection fails, mark all as failed
            emailIds.forEach(id => {
                if (!results.success.includes(id) && !results.failed.find(f => f.id === id)) {
                    results.failed.push({ 
                        id, 
                        error: error instanceof Error ? error.message : 'Connection error' 
                    });
                }
            });
        }

        return results;
    }

    /**
     * Mark email as read/unread
     */
    async markEmailAsRead(emailId: string, read: boolean = true): Promise<boolean> {
        try {
            const connection = await this.initializeIMAP();
            
            await connection.openBox('INBOX');
            
            if (read) {
                // Add the seen flag
                await new Promise((resolve, reject) => {
                    connection.imap.addFlags(emailId, '\\Seen', (err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });
            } else {
                // Remove the seen flag
                await new Promise((resolve, reject) => {
                    connection.imap.delFlags(emailId, '\\Seen', (err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });
            }
            
            return true;
        } catch (error) {
            console.error('Error marking email:', error);
            return false;
        }
    }

    // === ADVANCED EMAIL OPERATIONS ===

    /**
     * Search emails with filters
     */
    async searchEmails(filter: EmailFilter, page: number = 1, limit: number = 10): Promise<SearchResult> {
        const connection = await this.initializeIMAP();
        
        await connection.openBox('INBOX');
        
        // Build search criteria
        const searchCriteria: any[] = [];
        
        if (filter.from) searchCriteria.push(['FROM', filter.from]);
        if (filter.to) searchCriteria.push(['TO', filter.to]);
        if (filter.subject) searchCriteria.push(['SUBJECT', filter.subject]);
        if (filter.since) searchCriteria.push(['SINCE', filter.since]);
        if (filter.before) searchCriteria.push(['BEFORE', filter.before]);
        if (filter.seen !== undefined) {
            searchCriteria.push(filter.seen ? ['SEEN'] : ['UNSEEN']);
        }
        if (filter.flagged !== undefined) {
            searchCriteria.push(filter.flagged ? ['FLAGGED'] : ['UNFLAGGED']);
        }

        const fetchOptions = {
            bodies: 'HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)',
            markSeen: false,
            struct: true
        };

        const messages = await connection.search(searchCriteria.length > 0 ? searchCriteria : ['ALL'], fetchOptions);
        
        // Pagination
        const total = messages.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMessages = messages.slice(startIndex, endIndex);

        const emails = paginatedMessages.map((message: any) => this.parseEmailMessage(message, false));

        return {
            emails,
            total,
            page,
            limit
        };
    }

    /**
     * Forward an email
     */
    async forwardEmail(emailId: string, to: string | string[], additionalMessage?: string): Promise<{ messageId: string; response: string }> {
        const originalEmail = await this.getEmailById(emailId);
        if (!originalEmail) {
            throw new Error('Email not found');
        }

        const forwardSubject = `Fwd: ${originalEmail.subject}`;
        const forwardBody = `${additionalMessage || ''}\n\n---------- Forwarded message ----------\n` +
            `From: ${originalEmail.from}\n` +
            `Date: ${originalEmail.date}\n` +
            `Subject: ${originalEmail.subject}\n` +
            `To: ${originalEmail.to.join(', ')}\n\n` +
            `${originalEmail.body}`;

        return await this.sendEmail(to, forwardSubject, forwardBody);
    }

    /**
     * Reply to an email
     */
    async replyToEmail(emailId: string, replyBody: string, replyAll: boolean = false): Promise<{ messageId: string; response: string }> {
        const originalEmail = await this.getEmailById(emailId);
        if (!originalEmail) {
            throw new Error('Email not found');
        }

        const replySubject = originalEmail.subject.startsWith('Re:') 
            ? originalEmail.subject 
            : `Re: ${originalEmail.subject}`;

        const recipients = replyAll 
            ? [originalEmail.from, ...originalEmail.to, ...(originalEmail.cc || [])]
            : [originalEmail.from];

        const fullReplyBody = `${replyBody}\n\nOn ${originalEmail.date}, ${originalEmail.from} wrote:\n${originalEmail.body}`;

        return await this.sendEmail(recipients, replySubject, fullReplyBody);
    }

    /**
     * Get email statistics
     */
    async getEmailStatistics(): Promise<{
        total: number;
        unread: number;
        flagged: number;
        recent: number;
    }> {
        const connection = await this.initializeIMAP();
        
        await connection.openBox('INBOX');

        const [total, unread, flagged, recent] = await Promise.all([
            connection.search(['ALL'], { bodies: '' }),
            connection.search(['UNSEEN'], { bodies: '' }),
            connection.search(['FLAGGED'], { bodies: '' }),
            connection.search(['RECENT'], { bodies: '' })
        ]);

        return {
            total: total.length,
            unread: unread.length,
            flagged: flagged.length,
            recent: recent.length
        };
    }

    /**
     * Create email draft
     */
    async createDraft(to: string | string[], subject: string, body: string, attachments?: Attachment[]): Promise<{ draftId: string }> {
        // This would typically save to a drafts folder in IMAP
        // For now, we'll return a mock draft ID
        const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In a real implementation, you would save this to the IMAP DRAFTS folder
        console.log('Draft created:', { draftId, to, subject, body, attachments });
        
        return { draftId };
    }

    /**
     * Schedule email for later sending
     */
    async scheduleEmail(
        to: string | string[], 
        subject: string, 
        body: string, 
        scheduleDate: Date,
        attachments?: Attachment[]
    ): Promise<{ scheduledId: string }> {
        // This would typically integrate with a job scheduler
        const scheduledId = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In a real implementation, you would use a job scheduler like node-cron or bull queue
        console.log('Email scheduled:', { scheduledId, to, subject, scheduleDate });
        
        return { scheduledId };
    }

    /**
     * Send bulk emails to multiple recipients
     */
    async sendBulkEmails(recipients: string[], subject: string, body: string, html?: string): Promise<{ sent: number, failed: number, results: any[] }> {
        let sent = 0;
        let failed = 0;
        const results: any[] = [];

        for (const recipient of recipients) {
            try {
                const result = await this.sendEmail(recipient, subject, body, html);
                results.push({ recipient, success: true, result });
                sent++;
            } catch (error) {
                results.push({ recipient, success: false, error: error instanceof Error ? error.message : String(error) });
                failed++;
            }
        }

        return { sent, failed, results };
    }

    /**
     * Bulk send emails
     */
    async bulkSendEmails(emails: Array<{
        to: string | string[];
        subject: string;
        body: string;
        html?: string;
        attachments?: Attachment[];
    }>): Promise<Array<{ success: boolean; messageId?: string; error?: string }>> {
        const results = [];
        
        for (const email of emails) {
            try {
                const result = email.attachments && email.attachments.length > 0
                    ? await this.sendEmailWithAttachments(email.to, email.subject, email.body, email.attachments, email.html)
                    : await this.sendEmail(email.to, email.subject, email.body, email.html);
                
                results.push({ success: true, messageId: result.messageId });
            } catch (error) {
                results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
            }
        }
        
        return results;
    }

    // === UTILITY FUNCTIONS ===

    /**
     * Parse IMAP message to EmailMessage interface
     */
    private parseEmailMessage(message: any, fullBody: boolean = true): EmailMessage {
        const header = message.parts?.find((part: any) => part.which === 'HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)')?.body || {};
        
        // Extract body from TEXT part
        let body = '';
        if (fullBody) {
            const textPart = message.parts?.find((part: any) => part.which === 'TEXT');
            if (textPart && textPart.body) {
                body = textPart.body.toString('utf8');
            }
            
            // Fallback to any available body content
            if (!body) {
                const bodyPart = message.parts?.find((part: any) => part.body && part.which !== 'HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)');
                if (bodyPart && bodyPart.body) {
                    body = bodyPart.body.toString('utf8');
                }
            }
        } else {
            // For preview mode, just provide empty body to speed up loading
            body = '(Preview not available in list mode)';
        }
        
        return {
            id: message.attributes?.uid?.toString() || 'unknown',
            from: this.parseAddressHeader(header.from?.[0] || ''),
            to: this.parseAddressHeaders(header.to || []),
            cc: this.parseAddressHeaders(header.cc || []),
            bcc: this.parseAddressHeaders(header.bcc || []),
            subject: header.subject?.[0] || '',
            body: body || '',
            date: new Date(header.date?.[0] || Date.now()),
            flags: message.attributes?.flags || []
        };
    }

    private parseAddressHeader(address: string): string {
        return address.replace(/[<>]/g, '');
    }

    private parseAddressHeaders(addresses: string[]): string[] {
        return addresses.map(addr => this.parseAddressHeader(addr));
    }

    /**
     * Close connections
     */
    async close(): Promise<void> {
        if (this.imapConnection) {
            await this.imapConnection.end();
        }
    }
}

// === CONTACT MANAGEMENT ===

export class ContactService {
    private contacts: Contact[] = [];

    /**
     * Add a new contact
     */
    addContact(name: string, email: string, group?: string): Contact {
        const contact: Contact = {
            id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            group
        };
        
        this.contacts.push(contact);
        return contact;
    }

    /**
     * Get all contacts
     */
    getAllContacts(): Contact[] {
        return [...this.contacts];
    }

    /**
     * List contacts with limit (alias for getAllContacts)
     */
    listContacts(limit?: number): Contact[] {
        const contacts = this.getAllContacts();
        return limit ? contacts.slice(0, limit) : contacts;
    }

    /**
     * Get contacts by group
     */
    getContactsByGroup(group: string): Contact[] {
        return this.contacts.filter(contact => contact.group === group);
    }

    /**
     * Search contacts by name or email
     */
    searchContacts(query: string): Contact[] {
        const lowercaseQuery = query.toLowerCase();
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(lowercaseQuery) ||
            contact.email.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * Update contact
     */
    updateContact(id: string, field: string, value: string): Contact | null;
    updateContact(id: string, updates: Partial<Omit<Contact, 'id'>>): Contact | null;
    updateContact(id: string, fieldOrUpdates: string | Partial<Omit<Contact, 'id'>>, value?: string): Contact | null {
        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) return null;

        if (typeof fieldOrUpdates === 'string' && value !== undefined) {
            // Single field update
            const updates = { [fieldOrUpdates]: value } as Partial<Contact>;
            this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...updates };
        } else if (typeof fieldOrUpdates === 'object') {
            // Bulk update
            this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...fieldOrUpdates };
        }

        return this.contacts[contactIndex];
    }

    /**
     * Get contact by ID
     */
    getContact(id: string): Contact | null {
        return this.contacts.find(contact => contact.id === id) || null;
    }

    /**
     * Delete contact
     */
    deleteContact(id: string): boolean {
        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) return false;

        this.contacts.splice(contactIndex, 1);
        return true;
    }
}

// Factory function to create email service with default config
export function createEmailService(config: Partial<EmailConfig>): EmailService {
    const defaultConfig: EmailConfig = {
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASS || ''
            }
        },
        imap: {
            host: process.env.IMAP_HOST || 'imap.gmail.com',
            port: parseInt(process.env.IMAP_PORT || '993'),
            tls: process.env.IMAP_TLS !== 'false',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASS || ''
            },
            markSeen: process.env.IMAP_MARK_SEEN === 'true'
        }
    };

    return new EmailService({ ...defaultConfig, ...config });
}

// Factory function to create contact service
export function createContactService(): ContactService {
    return new ContactService();
}