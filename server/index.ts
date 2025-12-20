import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types";
import {
    ContactService,
    createEmailService,
    EmailFilter,
    Attachment
} from "../src/lib/email.js";


// Initialize email and contact services
const emailService = createEmailService({});
const contactService = new ContactService();

const server = new Server({
    name: "email-mcp-server",
    version: "1.0.0",
    description: "An advanced MCP server for comprehensive email operations including basic and advanced email management.",
    author: "Sharique Chaudhary",
    license: "MIT"
}, {
    capabilities: {
        tools: {},
        logging: {},
        experimental: {}
    }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // === BASIC EMAIL OPERATIONS ===
            {
                name: "send_email",
                description: "Send a simple email to one or more recipients.",
                parameters: {
                    type: "object",
                    properties: {
                        to: {
                            type: "string",
                            description: "Recipient email address(es), separated by commas for multiple recipients"
                        },
                        subject: { type: "string", description: "Subject of the email" },
                        body: { type: "string", description: "Body text of the email" },
                        html: { type: "string", description: "Optional HTML content for rich formatting" }
                    },
                    required: ["to", "subject", "body"]
                }
            },
            {
                name: "send_email_with_attachments",
                description: "Send an email with file attachments.",
                parameters: {
                    type: "object",
                    properties: {
                        to: { type: "string", description: "Recipient email address(es)" },
                        subject: { type: "string", description: "Subject of the email" },
                        body: { type: "string", description: "Body text of the email" },
                        attachments: {
                            type: "array",
                            description: "Array of attachment objects with filename and path",
                            items: {
                                type: "object",
                                properties: {
                                    filename: { type: "string" },
                                    path: { type: "string" }
                                }
                            }
                        },
                        html: { type: "string", description: "Optional HTML content" }
                    },
                    required: ["to", "subject", "body", "attachments"]
                }
            },
            {
                name: "read_recent_emails",
                description: "Read recent emails from the inbox.",
                parameters: {
                    type: "object",
                    properties: {
                        count: {
                            type: "number",
                            description: "Number of recent emails to read (default: 10)"
                        }
                    }
                }
            },
            {
                name: "get_email_by_id",
                description: "Get a specific email by its ID.",
                parameters: {
                    type: "object",
                    properties: {
                        email_id: { type: "string", description: "ID of the email to retrieve" }
                    },
                    required: ["email_id"]
                }
            },
            {
                name: "delete_email",
                description: "Delete an email from the inbox.",
                parameters: {
                    type: "object",
                    properties: {
                        email_id: { type: "string", description: "ID of the email to delete" }
                    },
                    required: ["email_id"]
                }
            },
            {
                name: "mark_email_read",
                description: "Mark an email as read or unread.",
                parameters: {
                    type: "object",
                    properties: {
                        email_id: { type: "string", description: "ID of the email" },
                        read: {
                            type: "boolean",
                            description: "True to mark as read, false to mark as unread (default: true)"
                        }
                    },
                    required: ["email_id"]
                }
            },

            // === ADVANCED EMAIL OPERATIONS ===
            {
                name: "search_emails",
                description: "Search emails with advanced filters and pagination.",
                parameters: {
                    type: "object",
                    properties: {
                        from: { type: "string", description: "Filter by sender email" },
                        to: { type: "string", description: "Filter by recipient email" },
                        subject: { type: "string", description: "Filter by subject keywords" },
                        since: { type: "string", description: "Filter emails since date (ISO format)" },
                        before: { type: "string", description: "Filter emails before date (ISO format)" },
                        seen: { type: "boolean", description: "Filter by read status" },
                        flagged: { type: "boolean", description: "Filter by flagged status" },
                        page: { type: "number", description: "Page number for pagination (default: 1)" },
                        limit: { type: "number", description: "Number of results per page (default: 10)" }
                    }
                }
            },
            {
                name: "forward_email",
                description: "Forward an existing email to new recipients.",
                parameters: {
                    type: "object",
                    properties: {
                        email_id: { type: "string", description: "ID of the email to forward" },
                        to: { type: "string", description: "New recipient email address(es)" },
                        additional_message: {
                            type: "string",
                            description: "Optional additional message to include"
                        }
                    },
                    required: ["email_id", "to"]
                }
            },
            {
                name: "reply_to_email",
                description: "Reply to an existing email.",
                parameters: {
                    type: "object",
                    properties: {
                        email_id: { type: "string", description: "ID of the email to reply to" },
                        reply_body: { type: "string", description: "Your reply message" },
                        reply_all: {
                            type: "boolean",
                            description: "True to reply to all recipients (default: false)"
                        }
                    },
                    required: ["email_id", "reply_body"]
                }
            },
            {
                name: "get_email_statistics",
                description: "Get statistics about your email account.",
                parameters: {
                    type: "object",
                    properties: {}
                }
            },
            {
                name: "create_email_draft",
                description: "Create an email draft for later editing or sending.",
                parameters: {
                    type: "object",
                    properties: {
                        to: { type: "string", description: "Recipient email address(es)" },
                        subject: { type: "string", description: "Subject of the email" },
                        body: { type: "string", description: "Body text of the email" },
                        attachments: {
                            type: "array",
                            description: "Optional array of attachment objects",
                            items: {
                                type: "object",
                                properties: {
                                    filename: { type: "string" },
                                    path: { type: "string" }
                                }
                            }
                        }
                    },
                    required: ["to", "subject", "body"]
                }
            },
            {
                name: "schedule_email",
                description: "Schedule an email to be sent at a later time.",
                parameters: {
                    type: "object",
                    properties: {
                        to: { type: "string", description: "Recipient email address(es)" },
                        subject: { type: "string", description: "Subject of the email" },
                        body: { type: "string", description: "Body text of the email" },
                        schedule_date: {
                            type: "string",
                            description: "Date and time to send (ISO format)"
                        },
                        attachments: {
                            type: "array",
                            description: "Optional array of attachment objects",
                            items: {
                                type: "object",
                                properties: {
                                    filename: { type: "string" },
                                    path: { type: "string" }
                                }
                            }
                        }
                    },
                    required: ["to", "subject", "body", "schedule_date"]
                }
            },
            {
                name: "bulk_send_emails",
                description: "Send multiple emails at once (bulk operation).",
                parameters: {
                    type: "object",
                    properties: {
                        emails: {
                            type: "array",
                            description: "Array of email objects to send",
                            items: {
                                type: "object",
                                properties: {
                                    to: { type: "string" },
                                    subject: { type: "string" },
                                    body: { type: "string" },
                                    html: { type: "string" },
                                    attachments: { type: "array" }
                                },
                                required: ["to", "subject", "body"]
                            }
                        }
                    },
                    required: ["emails"]
                }
            },

            // === CONTACT MANAGEMENT ===
            {
                name: "add_contact",
                description: "Add a new contact to the address book.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Contact's full name" },
                        email: { type: "string", description: "Contact's email address" },
                        group: { type: "string", description: "Optional group/category for the contact" }
                    },
                    required: ["name", "email"]
                }
            },
            {
                name: "list_contacts",
                description: "List all contacts in the address book.",
                parameters: {
                    type: "object",
                    properties: {}
                }
            },
            {
                name: "search_contacts",
                description: "Search contacts by name or email address.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search query (name or email)" }
                    },
                    required: ["query"]
                }
            },
            {
                name: "get_contacts_by_group",
                description: "Get all contacts in a specific group.",
                parameters: {
                    type: "object",
                    properties: {
                        group: { type: "string", description: "Group name" }
                    },
                    required: ["group"]
                }
            },
            {
                name: "update_contact",
                description: "Update an existing contact's information.",
                parameters: {
                    type: "object",
                    properties: {
                        contact_id: { type: "string", description: "ID of the contact to update" },
                        name: { type: "string", description: "Updated name" },
                        email: { type: "string", description: "Updated email address" },
                        group: { type: "string", description: "Updated group" }
                    },
                    required: ["contact_id"]
                }
            },
            {
                name: "delete_contact",
                description: "Delete a contact from the address book.",
                parameters: {
                    type: "object",
                    properties: {
                        contact_id: { type: "string", description: "ID of the contact to delete" }
                    },
                    required: ["contact_id"]
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: tool, arguments: parameters } = request.params;

    // Type guard to ensure parameters exist and are properly typed
    const params = parameters as Record<string, any> || {};

    try {
        switch (tool) {
            // === BASIC EMAIL OPERATIONS ===
            case "send_email":
                const { to, subject, body, html } = params;
                const recipients = (to as string).split(',').map((email: string) => email.trim());
                const result = await emailService.sendEmail(recipients, subject as string, body as string, html as string);
                return {
                    success: true,
                    message: "Email sent successfully!",
                    messageId: result.messageId
                };

            case "send_email_with_attachments":
                const sendResult = await emailService.sendEmailWithAttachments(
                    (params.to as string).split(',').map((email: string) => email.trim()),
                    params.subject as string,
                    params.body as string,
                    (params.attachments as any[]).map((att: any) => ({
                        filename: att.filename,
                        path: att.path,
                        content: att.content || ''
                    })),
                    params.html as string
                );
                return {
                    success: true,
                    message: "Email with attachments sent successfully!",
                    messageId: sendResult.messageId
                };

            case "read_recent_emails":
                const count = (params.count as number) || 10;
                const emails = await emailService.readRecentEmails(count);
                return {
                    success: true,
                    emails,
                    count: emails.length
                };

            case "get_email_by_id":
                const email = await emailService.getEmailById(params.email_id as string);
                return email
                    ? { success: true, email }
                    : { success: false, message: "Email not found" };

            case "delete_email":
                const deleted = await emailService.deleteEmail(params.email_id as string);
                return {
                    success: deleted,
                    message: deleted ? "Email deleted successfully" : "Failed to delete email"
                };

            case "mark_email_read":
                const read = (params.read as boolean) !== false; // default to true
                const marked = await emailService.markEmailAsRead(params.email_id as string, read);
                return {
                    success: marked,
                    message: marked
                        ? `Email marked as ${read ? 'read' : 'unread'}`
                        : "Failed to update email status"
                };

            // === ADVANCED EMAIL OPERATIONS ===
            case "search_emails":
                const filter: EmailFilter = {};
                if (params.from) filter.from = params.from as string;
                if (params.to) filter.to = params.to as string;
                if (params.subject) filter.subject = params.subject as string;
                if (params.since) filter.since = new Date(params.since as string);
                if (params.before) filter.before = new Date(params.before as string);
                if (params.seen !== undefined) filter.seen = params.seen as boolean;
                if (params.flagged !== undefined) filter.flagged = params.flagged as boolean;

                const searchResult = await emailService.searchEmails(
                    filter,
                    (params.page as number) || 1,
                    (params.limit as number) || 10
                );
                return { success: true, ...searchResult };

            case "forward_email":
                const forwardResult = await emailService.forwardEmail(
                    params.email_id as string,
                    (params.to as string).split(',').map((email: string) => email.trim()),
                    params.additional_message as string
                );
                return {
                    success: true,
                    message: "Email forwarded successfully!",
                    messageId: forwardResult.messageId
                };

            case "reply_to_email":
                const replyResult = await emailService.replyToEmail(
                    params.email_id as string,
                    params.reply_body as string,
                    (params.reply_all as boolean) || false
                );
                return {
                    success: true,
                    message: "Reply sent successfully!",
                    messageId: replyResult.messageId
                };

            case "get_email_statistics":
                const stats = await emailService.getEmailStatistics();
                return { success: true, statistics: stats };

            case "create_email_draft":
                const draftResult = await emailService.createDraft(
                    (params.to as string).split(',').map((email: string) => email.trim()),
                    params.subject as string,
                    params.body as string,
                    params.attachments as Attachment[]
                );
                return {
                    success: true,
                    message: "Draft created successfully!",
                    draftId: draftResult.draftId
                };

            case "schedule_email":
                const scheduleResult = await emailService.scheduleEmail(
                    (params.to as string).split(',').map((email: string) => email.trim()),
                    params.subject as string,
                    params.body as string,
                    new Date(params.schedule_date as string),
                    params.attachments as Attachment[]
                );
                return {
                    success: true,
                    message: "Email scheduled successfully!",
                    scheduledId: scheduleResult.scheduledId
                };

            case "bulk_send_emails":
                const bulkResult = await emailService.bulkSendEmails(params.emails as any[]);
                const successCount = bulkResult.filter(r => r.success).length;
                const failureCount = bulkResult.filter(r => !r.success).length;
                return {
                    success: true,
                    message: `Bulk send completed: ${successCount} successful, ${failureCount} failed`,
                    results: bulkResult,
                    summary: { successful: successCount, failed: failureCount }
                };

            // === CONTACT MANAGEMENT ===
            case "add_contact":
                const newContact = contactService.addContact(
                    params.name as string,
                    params.email as string,
                    params.group as string
                );
                return {
                    success: true,
                    message: "Contact added successfully!",
                    contact: newContact
                };

            case "list_contacts":
                const contacts = contactService.getAllContacts();
                return {
                    success: true,
                    contacts,
                    count: contacts.length
                };

            case "search_contacts":
                const foundContacts = contactService.searchContacts(params.query as string);
                return {
                    success: true,
                    contacts: foundContacts,
                    count: foundContacts.length
                };

            case "get_contacts_by_group":
                const groupContacts = contactService.getContactsByGroup(params.group as string);
                return {
                    success: true,
                    contacts: groupContacts,
                    group: params.group as string,
                    count: groupContacts.length
                };

            case "update_contact":
                const updates: any = {};
                if (params.name) updates.name = params.name as string;
                if (params.email) updates.email = params.email as string;
                if (params.group) updates.group = params.group as string;

                const updatedContact = contactService.updateContact(params.contact_id as string, updates);
                return updatedContact
                    ? { success: true, message: "Contact updated successfully!", contact: updatedContact }
                    : { success: false, message: "Contact not found" };

            case "delete_contact":
                const contactDeleted = contactService.deleteContact(params.contact_id as string);
                return {
                    success: contactDeleted,
                    message: contactDeleted ? "Contact deleted successfully!" : "Contact not found"
                };

            default:
                throw new Error(`Unknown tool: ${tool}`);
        }
    } catch (error) {
        console.error(`Error executing tool ${tool}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
});

// === SERVER INITIALIZATION ===

// Setup stdio transport for MCP communication
const transport = new StdioServerTransport();

// Start the MCP server and begin listening for requests
(async () => {
    await server.connect(transport);
})();