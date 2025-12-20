import * as nodemailer from 'nodemailer';
import * as imaps from 'imap-simple';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * SMTP configuration for sending emails
 */
export interface SMTPConfig {
    /** SMTP server hostname */
    host: string;
    /** SMTP server port (typically 587 for TLS, 465 for SSL) */
    port: number;
    /** Whether to use SSL/TLS from the start */
    secure: boolean;
    /** Authentication credentials */
    auth: {
        user: string;
        pass: string;
    };
}

/**
 * IMAP configuration for receiving emails
 */
export interface IMAPConfig {
    /** IMAP server hostname */
    host: string;
    /** IMAP server port (typically 993 for SSL) */
    port: number;
    /** Whether to use TLS */
    tls: boolean;
    /** Authentication credentials */
    auth: {
        user: string;
        pass: string;
    };
    /** Whether to mark emails as seen when reading */
    markSeen: boolean;
}

/**
 * Complete email service configuration
 */
export interface EmailConfig {
    smtp: SMTPConfig;
    imap: IMAPConfig;
}

/**
 * Priority level for emails
 */
export type EmailPriority = 'high' | 'normal' | 'low';

/**
 * Email message structure
 */
export interface EmailMessage {
    /** Unique identifier for the email */
    id: string;
    /** Sender email address */
    from: string;
    /** Primary recipient email addresses */
    to: string[];
    /** Carbon copy recipient email addresses */
    cc?: string[];
    /** Blind carbon copy recipient email addresses */
    bcc?: string[];
    /** Email subject line */
    subject: string;
    /** Plain text body content */
    body: string;
    /** HTML body content */
    html?: string;
    /** Email attachments */
    attachments?: Attachment[];
    /** Date the email was sent/received */
    date: Date;
    /** IMAP flags (e.g., \Seen, \Flagged, \Deleted) */
    flags: string[];
    /** Email priority level */
    priority?: EmailPriority;
}

/**
 * Email attachment structure
 */
export interface Attachment {
    /** Name of the attached file */
    filename: string;
    /** File content as Buffer or string */
    content: Buffer | string;
    /** MIME type of the attachment */
    contentType?: string;
    /** Path to the file (for file attachments) */
    path?: string;
    /** Content ID for inline attachments */
    cid?: string;
}

/**
 * Contact information
 */
export interface Contact {
    /** Unique identifier for the contact */
    id: string;
    /** Contact's full name */
    name: string;
    /** Contact's email address */
    email: string;
    /** Optional group/category for organizing contacts */
    group?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Email search filter criteria
 */
export interface EmailFilter {
    /** Filter by sender email address */
    from?: string;
    /** Filter by recipient email address */
    to?: string;
    /** Filter by subject line (partial match) */
    subject?: string;
    /** Filter emails received after this date */
    since?: Date;
    /** Filter emails received before this date */
    before?: Date;
    /** Filter by read/unread status */
    seen?: boolean;
    /** Filter by flagged status */
    flagged?: boolean;
    /** Filter emails with attachments */
    hasAttachment?: boolean;
}

/**
 * Paginated search results
 */
export interface SearchResult {
    /** Array of matching emails */
    emails: EmailMessage[];
    /** Total number of matching emails */
    total: number;
    /** Current page number */
    page: number;
    /** Number of results per page */
    limit: number;
}

/**
 * Result of sending an email
 */
export interface SendEmailResult {
    /** Message ID from the email server */
    messageId: string;
    /** Server response message */
    response: string;
}

/**
 * Result of batch delete operation
 */
export interface BatchDeleteResult {
    /** Successfully deleted email IDs */
    success: string[];
    /** Failed deletions with error messages */
    failed: Array<{ id: string; error: string }>;
}

/**
 * Email statistics summary
 */
export interface EmailStatistics {
    /** Total number of emails */
    total: number;
    /** Number of unread emails */
    unread: number;
    /** Number of flagged emails */
    flagged: number;
    /** Number of recent emails */
    recent: number;
}

/**
 * Result of bulk send operation
 */
export interface BulkSendResult {
    /** Number of successfully sent emails */
    sent: number;
    /** Number of failed emails */
    failed: number;
    /** Detailed results for each email */
    results: Array<{
        recipient: string;
        success: boolean;
        result?: SendEmailResult;
        error?: string;
    }>;
}

/**
 * Custom error class for email operations
 */
export class EmailServiceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'EmailServiceError';
    }
}

// ============================================================================
// EMAIL SERVICE CLASS
// ============================================================================

/**
 * Main service class for email operations
 * Provides methods for sending, receiving, and managing emails
 */
export class EmailService {
    private config: EmailConfig;
    private transporter?: nodemailer.Transporter;
    private imapConnection?: any;
    private isConnecting = false;

    /**
     * Create a new EmailService instance
     * @param config - Email configuration for SMTP and IMAP
     * @throws {EmailServiceError} If configuration is invalid
     */
    constructor(config: EmailConfig) {
        this.validateConfig(config);
        this.config = config;
    }

    // ========================================================================
    // VALIDATION METHODS
    // ========================================================================

    /**
     * Validate email configuration
     * @private
     */
    private validateConfig(config: EmailConfig): void {
        if (!config.smtp?.host || !config.smtp?.auth?.user || !config.smtp?.auth?.pass) {
            throw new EmailServiceError(
                'Invalid SMTP configuration',
                'INVALID_SMTP_CONFIG',
                { provided: config.smtp }
            );
        }
        if (!config.imap?.host || !config.imap?.auth?.user || !config.imap?.auth?.pass) {
            throw new EmailServiceError(
                'Invalid IMAP configuration',
                'INVALID_IMAP_CONFIG',
                { provided: config.imap }
            );
        }
    }

    /**
     * Validate email address format
     * @private
     */
    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate recipients list
     * @private
     */
    private validateRecipients(recipients: string | string[]): void {
        const emails = Array.isArray(recipients) ? recipients : [recipients];
        const invalid = emails.filter(email => !this.validateEmail(email));

        if (invalid.length > 0) {
            throw new EmailServiceError(
                'Invalid email addresses',
                'INVALID_EMAIL_ADDRESS',
                { invalidEmails: invalid }
            );
        }
    }

    // ========================================================================
    // CONNECTION INITIALIZATION
    // ========================================================================

    /**
     * Initialize SMTP transporter for sending emails
     * @private
     */
    private async initializeTransporter(): Promise<nodemailer.Transporter> {
        if (!this.transporter) {
            try {
                const smtpConfig = {
                    ...this.config.smtp,
                    tls: {
                        rejectUnauthorized: false // Allow self-signed certificates
                    }
                };
                this.transporter = nodemailer.createTransport(smtpConfig);

                // Verify connection
                await this.transporter.verify();
            } catch (error) {
                throw new EmailServiceError(
                    'Failed to initialize SMTP connection',
                    'SMTP_INIT_FAILED',
                    error
                );
            }
        }
        return this.transporter;
    }

    /**
     * Initialize IMAP connection for receiving emails
     * @private
     */
    private async initializeIMAP(): Promise<any> {
        if (!this.imapConnection && !this.isConnecting) {
            this.isConnecting = true;
            try {
                this.imapConnection = await imaps.connect({
                    imap: {
                        ...this.config.imap,
                        user: this.config.imap.auth.user,
                        password: this.config.imap.auth.pass,
                        connTimeout: 15000,
                        authTimeout: 10000,
                        keepalive: {
                            interval: 10000,
                            idleInterval: 300000,
                            forceNoop: true
                        },
                        tlsOptions: {
                            rejectUnauthorized: false
                        }
                    }
                });
            } catch (error) {
                this.imapConnection = undefined;
                throw new EmailServiceError(
                    'Failed to connect to IMAP server',
                    'IMAP_CONNECT_FAILED',
                    error
                );
            } finally {
                this.isConnecting = false;
            }
        }
        return this.imapConnection;
    }

    // ========================================================================
    // BASIC EMAIL OPERATIONS
    // ========================================================================

    /**
     * Send a simple email
     * @param to - Recipient email address(es)
     * @param subject - Email subject line
     * @param body - Plain text email body
     * @param html - Optional HTML email body
     * @returns Promise with message ID and server response
     * @throws {EmailServiceError} If sending fails or recipients are invalid
     */
    async sendEmail(to: string | string[], subject: string, body: string, html?: string): Promise<SendEmailResult> {
        this.validateRecipients(to);

        if (!subject?.trim()) {
            throw new EmailServiceError('Subject is required', 'MISSING_SUBJECT');
        }
        if (!body?.trim() && !html?.trim()) {
            throw new EmailServiceError('Email body is required', 'MISSING_BODY');
        }

        try {
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
        } catch (error) {
            throw new EmailServiceError(
                'Failed to send email',
                'SEND_EMAIL_FAILED',
                error
            );
        }
    }

    /**
     * Send email with attachments
     * @param to - Recipient email address(es)
     * @param subject - Email subject line
     * @param body - Plain text email body
     * @param attachments - Array of file attachments
     * @param html - Optional HTML email body
     * @returns Promise with message ID and server response
     * @throws {EmailServiceError} If sending fails or validation fails
     */
    async sendEmailWithAttachments(
        to: string | string[],
        subject: string,
        body: string,
        attachments: Attachment[],
        html?: string
    ): Promise<SendEmailResult> {
        this.validateRecipients(to);

        if (!Array.isArray(attachments) || attachments.length === 0) {
            throw new EmailServiceError(
                'At least one attachment is required',
                'NO_ATTACHMENTS'
            );
        }

        try {
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
        } catch (error) {
            throw new EmailServiceError(
                'Failed to send email with attachments',
                'SEND_WITH_ATTACHMENTS_FAILED',
                error
            );
        }
    }

    /**
     * Read recent emails from inbox
     * @param count - Number of emails to retrieve (default: 10)
     * @param fullBody - Whether to fetch full email body (default: false for faster loading)
     * @returns Promise with array of email messages
     * @throws {EmailServiceError} If connection or reading fails
     */
    async readRecentEmails(count: number = 10, fullBody: boolean = false): Promise<EmailMessage[]> {
        if (count < 1 || count > 1000) {
            throw new EmailServiceError(
                'Count must be between 1 and 1000',
                'INVALID_COUNT',
                { count }
            );
        }

        try {
            const connection = await this.initializeIMAP();
            await connection.openBox('INBOX');

            const searchCriteria = ['ALL'];
            const fetchOptions = {
                bodies: fullBody
                    ? ['HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)', 'TEXT']
                    : 'HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)',
                markSeen: this.config.imap.markSeen,
                struct: true
            };

            const messages = await connection.search(searchCriteria, fetchOptions);
            const recentMessages = messages.slice(-count).reverse();

            return recentMessages.map((message: any) => this.parseEmailMessage(message, fullBody));
        } catch (error) {
            throw new EmailServiceError(
                'Failed to read emails',
                'READ_EMAILS_FAILED',
                error
            );
        }
    }

    /**
     * Get a specific email by its unique ID
     * @param emailId - The unique identifier of the email
     * @returns Promise with the email message or null if not found
     * @throws {EmailServiceError} If email ID is invalid or retrieval fails
     */
    async getEmailById(emailId: string): Promise<EmailMessage | null> {
        if (!emailId?.trim()) {
            throw new EmailServiceError('Email ID is required', 'MISSING_EMAIL_ID');
        }

        try {
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
        } catch (error) {
            throw new EmailServiceError(
                `Failed to get email with ID: ${emailId}`,
                'GET_EMAIL_FAILED',
                error
            );
        }
    }

    /**
     * Delete a single email by ID
     * @param emailId - The unique identifier of the email to delete
     * @returns Promise resolving to true if successful
     * @throws {EmailServiceError} If deletion fails
     */
    async deleteEmail(emailId: string): Promise<boolean> {
        if (!emailId?.trim()) {
            throw new EmailServiceError('Email ID is required', 'MISSING_EMAIL_ID');
        }

        try {
            const connection = await this.initializeIMAP();
            await connection.openBox('INBOX');

            await new Promise((resolve, reject) => {
                connection.imap.addFlags(emailId, '\\Deleted', (err: any) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });

            await new Promise((resolve, reject) => {
                connection.imap.expunge((err: any) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });

            return true;
        } catch (error) {
            throw new EmailServiceError(
                `Failed to delete email with ID: ${emailId}`,
                'DELETE_EMAIL_FAILED',
                error
            );
        }
    }

    /**
     * Delete multiple emails in batch
     * @param emailIds - Array of email IDs to delete
     * @returns Promise with arrays of successful and failed deletions
     * @throws {EmailServiceError} If email IDs array is invalid
     */
    async deleteEmails(emailIds: string[]): Promise<BatchDeleteResult> {
        if (!Array.isArray(emailIds)) {
            throw new EmailServiceError(
                'Email IDs must be an array',
                'INVALID_EMAIL_IDS'
            );
        }
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
     * Mark an email as read or unread
     * @param emailId - The unique identifier of the email
     * @param read - Whether to mark as read (true) or unread (false)
     * @returns Promise resolving to true if successful
     * @throws {EmailServiceError} If operation fails
     */
    async markEmailAsRead(emailId: string, read: boolean = true): Promise<boolean> {
        if (!emailId?.trim()) {
            throw new EmailServiceError('Email ID is required', 'MISSING_EMAIL_ID');
        }

        try {
            const connection = await this.initializeIMAP();
            await connection.openBox('INBOX');

            if (read) {
                await new Promise((resolve, reject) => {
                    connection.imap.addFlags(emailId, '\\Seen', (err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });
            } else {
                await new Promise((resolve, reject) => {
                    connection.imap.delFlags(emailId, '\\Seen', (err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });
            }

            return true;
        } catch (error) {
            throw new EmailServiceError(
                `Failed to mark email as ${read ? 'read' : 'unread'}`,
                'MARK_EMAIL_FAILED',
                error
            );
        }
    }

    // ========================================================================
    // ADVANCED EMAIL OPERATIONS
    // ========================================================================

    /**
     * Search emails with advanced filters and pagination
     * @param filter - Search criteria (from, to, subject, dates, flags, etc.)
     * @param page - Page number (default: 1)
     * @param limit - Results per page (default: 10)
     * @returns Promise with paginated search results
     * @throws {EmailServiceError} If search fails
     */
    async searchEmails(filter: EmailFilter, page: number = 1, limit: number = 10): Promise<SearchResult> {
        if (page < 1) {
            throw new EmailServiceError('Page must be >= 1', 'INVALID_PAGE');
        }
        if (limit < 1 || limit > 100) {
            throw new EmailServiceError('Limit must be between 1 and 100', 'INVALID_LIMIT');
        }

        try {
            const connection = await this.initializeIMAP();
            await connection.openBox('INBOX');

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

            const messages = await connection.search(
                searchCriteria.length > 0 ? searchCriteria : ['ALL'],
                fetchOptions
            );

            const total = messages.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedMessages = messages.slice(startIndex, endIndex);

            const emails = paginatedMessages.map((message: any) =>
                this.parseEmailMessage(message, false)
            );

            return { emails, total, page, limit };
        } catch (error) {
            throw new EmailServiceError(
                'Email search failed',
                'SEARCH_FAILED',
                error
            );
        }
    }

    /**
     * Forward an email to other recipients
     * @param emailId - The ID of the email to forward
     * @param to - Recipient(s) to forward to
     * @param additionalMessage - Optional message to prepend
     * @returns Promise with send result
     * @throws {EmailServiceError} If email not found or forwarding fails
     */
    async forwardEmail(
        emailId: string,
        to: string | string[],
        additionalMessage?: string
    ): Promise<SendEmailResult> {
        const originalEmail = await this.getEmailById(emailId);
        if (!originalEmail) {
            throw new EmailServiceError(
                `Email with ID ${emailId} not found`,
                'EMAIL_NOT_FOUND'
            );
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
     * @param emailId - The ID of the email to reply to
     * @param replyBody - Your reply message
     * @param replyAll - Whether to reply to all recipients (default: false)
     * @returns Promise with send result
     * @throws {EmailServiceError} If email not found or reply fails
     */
    async replyToEmail(
        emailId: string,
        replyBody: string,
        replyAll: boolean = false
    ): Promise<SendEmailResult> {
        if (!replyBody?.trim()) {
            throw new EmailServiceError('Reply body is required', 'MISSING_REPLY_BODY');
        }

        const originalEmail = await this.getEmailById(emailId);
        if (!originalEmail) {
            throw new EmailServiceError(
                `Email with ID ${emailId} not found`,
                'EMAIL_NOT_FOUND'
            );
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
     * Get email statistics from inbox
     * @returns Promise with counts of total, unread, flagged, and recent emails
     * @throws {EmailServiceError} If statistics retrieval fails
     */
    async getEmailStatistics(): Promise<EmailStatistics> {
        try {
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
        } catch (error) {
            throw new EmailServiceError(
                'Failed to get email statistics',
                'STATS_FAILED',
                error
            );
        }
    }

    /**
     * Create an email draft (saved but not sent)
     * @param to - Recipient(s)
     * @param subject - Email subject
     * @param body - Email body
     * @param attachments - Optional attachments
     * @returns Promise with draft ID
     * @note This is a placeholder - implement IMAP draft folder integration for production
     */
    async createDraft(
        to: string | string[],
        subject: string,
        body: string,
        attachments?: Attachment[]
    ): Promise<{ draftId: string }> {
        this.validateRecipients(to);

        const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('Draft created:', { draftId, to, subject, body, attachments });

        return { draftId };
    }

    /**
     * Schedule an email to be sent at a future time
     * @param to - Recipient(s)
     * @param subject - Email subject
     * @param body - Email body
     * @param scheduleDate - When to send the email
     * @param attachments - Optional attachments
     * @returns Promise with scheduled ID and schedule details
     * @note This is a placeholder - integrate with a job scheduler (node-cron, bull) for production
     */
    async scheduleEmail(
        to: string | string[], 
        subject: string, 
        body: string, 
        scheduleDate: Date,
        attachments?: Attachment[]
    ): Promise<{ scheduledId: string; to: string | string[]; subject: string; scheduledFor: string }> {
        this.validateRecipients(to);
        
        if (scheduleDate <= new Date()) {
            throw new EmailServiceError(
                'Schedule date must be in the future',
                'INVALID_SCHEDULE_DATE'
            );
        }
        
        const scheduledId = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store scheduling data for future implementation
        const scheduleData = {
            id: scheduledId,
            to,
            subject,
            body,
            scheduleDate: scheduleDate.toISOString(),
            attachments: attachments || [],
            created: new Date().toISOString()
        };
        
        // TODO: Integrate with job scheduler (node-cron, bull, or agenda)
        // For now, log the schedule data
        console.log('Email scheduled:', scheduleData);

        return { 
            scheduledId, 
            to,
            subject,
            scheduledFor: scheduleDate.toISOString()
        };
    }

    /**
     * Send the same email to multiple recipients
     * @param recipients - Array of recipient email addresses
     * @param subject - Email subject
     * @param body - Email body
     * @param html - Optional HTML body
     * @returns Promise with sent/failed counts and detailed results
     */
    async sendBulkEmails(
        recipients: string[],
        subject: string,
        body: string,
        html?: string
    ): Promise<BulkSendResult> {
        if (!Array.isArray(recipients) || recipients.length === 0) {
            throw new EmailServiceError(
                'Recipients array cannot be empty',
                'NO_RECIPIENTS'
            );
        }

        let sent = 0;
        let failed = 0;
        const results: BulkSendResult['results'] = [];

        for (const recipient of recipients) {
            try {
                const result = await this.sendEmail(recipient, subject, body, html);
                results.push({ recipient, success: true, result });
                sent++;
            } catch (error) {
                results.push({ 
                    recipient, 
                    success: false, 
                    error: error instanceof Error ? error.message : String(error) 
                });
                failed++;
            }
        }

        return { sent, failed, results };
    }

    /**
     * Send multiple different emails in batch
     * @param emails - Array of email objects with recipients, subject, body, etc.
     * @returns Promise with array of success/failure results for each email
     */
    async bulkSendEmails(emails: Array<{
        to: string | string[];
        subject: string;
        body: string;
        html?: string;
        attachments?: Attachment[];
    }>): Promise<Array<{ success: boolean; messageId?: string; error?: string }>> {
        if (!Array.isArray(emails) || emails.length === 0) {
            throw new EmailServiceError(
                'Emails array cannot be empty',
                'NO_EMAILS'
            );
        }

        const results = [];
        
        for (const email of emails) {
            try {
                const result = email.attachments && email.attachments.length > 0
                    ? await this.sendEmailWithAttachments(
                        email.to,
                        email.subject,
                        email.body,
                        email.attachments,
                        email.html
                    )
                    : await this.sendEmail(email.to, email.subject, email.body, email.html);
                
                results.push({ success: true, messageId: result.messageId });
            } catch (error) {
                results.push({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                });
            }
        }

        return results;
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================

    /**
     * Parse IMAP message to EmailMessage interface
     * @private
     * @param message - Raw IMAP message object
     * @param fullBody - Whether to parse the full body content
     * @returns Parsed EmailMessage object
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

    /**
     * Parse a single email address header
     * @private
     */
    private parseAddressHeader(address: string): string {
        return address.replace(/[<>]/g, '');
    }

    /**
     * Parse multiple email address headers
     * @private
     */
    private parseAddressHeaders(addresses: string[]): string[] {
        return addresses.map(addr => this.parseAddressHeader(addr));
    }

    /**
     * Close all active connections (IMAP)
     * Call this when done using the service to clean up resources
     */
    async close(): Promise<void> {
        if (this.imapConnection) {
            try {
                await this.imapConnection.end();
                this.imapConnection = undefined;
            } catch (error) {
                console.error('Error closing IMAP connection:', error);
            }
        }
    }
}

// ============================================================================
// CONTACT SERVICE CLASS
// ============================================================================

/**
 * Service class for managing email contacts
 * Provides in-memory contact storage and management
 */
export class ContactService {
    private contacts: Contact[] = [];

    /**
     * Add a new contact
     * @param name - Contact's full name
     * @param email - Contact's email address
     * @param group - Optional group/category
     * @returns The created contact with generated ID
     * @throws {EmailServiceError} If email is invalid
     */
    addContact(name: string, email: string, group?: string): Contact {
        if (!name?.trim()) {
            throw new EmailServiceError('Contact name is required', 'MISSING_NAME');
        }
        if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new EmailServiceError('Valid email address is required', 'INVALID_EMAIL');
        }
        
        const contact: Contact = {
            id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            group: group?.trim()
        };

        this.contacts.push(contact);
        return contact;
    }

    /**
     * Get all contacts
     * @returns Array of all contacts
     */
    getAllContacts(): Contact[] {
        return [...this.contacts];
    }

    /**
     * List contacts with optional limit
     * @param limit - Maximum number of contacts to return
     * @returns Array of contacts
     */
    listContacts(limit?: number): Contact[] {
        const contacts = this.getAllContacts();
        return limit ? contacts.slice(0, limit) : contacts;
    }

    /**
     * Get contacts by group
     * @param group - The group name to filter by
     * @returns Array of contacts in the specified group
     */
    getContactsByGroup(group: string): Contact[] {
        if (!group?.trim()) {
            return [];
        }
        return this.contacts.filter(contact => contact.group === group.trim());
    }

    /**
     * Search contacts by name or email
     * @param query - Search term (case-insensitive)
     * @returns Array of matching contacts
     */
    searchContacts(query: string): Contact[] {
        if (!query?.trim()) {
            return [];
        }
        const lowercaseQuery = query.toLowerCase();
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(lowercaseQuery) ||
            contact.email.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * Update a contact's information
     * Supports both single field updates and bulk updates
     * @param id - Contact ID
     * @param fieldOrUpdates - Either a field name (string) or an updates object
     * @param value - The new value (when using single field update)
     * @returns Updated contact or null if not found
     * @throws {EmailServiceError} If contact ID is invalid
     */
    updateContact(id: string, field: string, value: string): Contact | null;
    updateContact(id: string, updates: Partial<Omit<Contact, 'id'>>): Contact | null;
    updateContact(id: string, fieldOrUpdates: string | Partial<Omit<Contact, 'id'>>, value?: string): Contact | null {
        if (!id?.trim()) {
            throw new EmailServiceError('Contact ID is required', 'MISSING_CONTACT_ID');
        }

        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) return null;

        if (typeof fieldOrUpdates === 'string' && value !== undefined) {
            const updates = { [fieldOrUpdates]: value } as Partial<Contact>;
            this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...updates };
        } else if (typeof fieldOrUpdates === 'object') {
            this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...fieldOrUpdates };
        }

        return this.contacts[contactIndex];
    }

    /**
     * Get a contact by ID
     * @param id - Contact ID
     * @returns Contact object or null if not found
     */
    getContact(id: string): Contact | null {
        if (!id?.trim()) {
            return null;
        }
        return this.contacts.find(contact => contact.id === id) || null;
    }

    /**
     * Delete a contact
     * @param id - Contact ID to delete
     * @returns true if deleted, false if not found
     */
    deleteContact(id: string): boolean {
        if (!id?.trim()) {
            return false;
        }
        
        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) return false;

        this.contacts.splice(contactIndex, 1);
        return true;
    }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create an EmailService instance with default configuration from environment variables
 * @param config - Partial email configuration (merges with defaults)
 * @returns Configured EmailService instance
 * @example
 * ```typescript
 * const emailService = createEmailService({
 *   smtp: { host: 'smtp.custom.com', port: 587 }
 * });
 * ```
 */
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

/**
 * Create a ContactService instance
 * @returns New ContactService instance with empty contact list
 * @example
 * ```typescript
 * const contactService = createContactService();
 * contactService.addContact('John Doe', 'john@example.com');
 * ```
 */
export function createContactService(): ContactService {
    return new ContactService();
}