#!/usr/bin/env node

/**
 * Shared utilities for email CLI commands
 * Handles environment loading and service initialization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora, { Ora } from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface EnvVars {
    [key: string]: string;
}

export interface EmailConfig {
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
        tls: {
            rejectUnauthorized: boolean;
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
        connTimeout: number;
        authTimeout: number;
        tlsOptions: {
            rejectUnauthorized: boolean;
        };
    };
}

export interface HelpOption {
    flag?: string;
    name?: string;
    description: string;
}

// Load environment variables from .env file
export function loadEnv(): EnvVars {
    const envPath = path.join(__dirname, '..', '.env');
    
    if (!fs.existsSync(envPath)) {
        console.error(chalk.red('❌ .env file not found.'));
        console.error(chalk.yellow('💡 Please copy .env.example to .env and configure your email settings.'));
        process.exit(1);
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: EnvVars = {};
    
    envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
    
    // Set environment variables
    Object.assign(process.env, envVars);
    
    return envVars;
}

// Validate required environment variables
export function validateEnv(): void {
    const required = [
        'SMTP_HOST', 'SMTP_PORT', 'EMAIL_USER', 'EMAIL_PASS',
        'IMAP_HOST', 'IMAP_PORT'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(chalk.red('❌ Missing required environment variables:'));
        missing.forEach(key => console.error(chalk.red(`   - ${key}`)));
        console.error(chalk.yellow('\n💡 Please configure your .env file with all required email settings.'));
        process.exit(1);
    }
}

// Initialize email service with environment config
export async function initializeEmailService(): Promise<any> {
    try {
        loadEnv();
        validateEnv();
        
        // Import email service (must be after env loading)
        const { createEmailService } = await import('../src/lib/email.js');
        
        const config: EmailConfig = {
            smtp: {
                host: process.env.SMTP_HOST!,
                port: parseInt(process.env.SMTP_PORT!),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER!,
                    pass: process.env.EMAIL_PASS!
                },
                tls: {
                    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
                }
            },
            imap: {
                host: process.env.IMAP_HOST!,
                port: parseInt(process.env.IMAP_PORT!),
                tls: process.env.IMAP_TLS !== 'false',
                auth: {
                    user: process.env.EMAIL_USER!,
                    pass: process.env.EMAIL_PASS!
                },
                markSeen: process.env.IMAP_MARK_SEEN === 'true',
                connTimeout: parseInt(process.env.IMAP_CONN_TIMEOUT || '60000'),
                authTimeout: parseInt(process.env.IMAP_AUTH_TIMEOUT || '30000'),
                tlsOptions: {
                    rejectUnauthorized: process.env.IMAP_REJECT_UNAUTHORIZED !== 'false'
                }
            }
        };
        
        return createEmailService(config);
    } catch (error: any) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error(chalk.red('❌ Email service not built.'));
            console.error(chalk.yellow('💡 Please build the project first:'));
            console.error(chalk.cyan('   npm run build'));
            process.exit(1);
        }
        throw error;
    }
}

// Initialize contact service
export async function initializeContactService(): Promise<any> {
    loadEnv();
    validateEnv();
    
    const { createContactService } = await import('../src/lib/email.js');
    return createContactService();
}

// Common error handler
export function handleError(error: any, operation: string = 'operation'): void {
    console.error(chalk.red(`❌ Error during ${operation}:`));
    console.error(chalk.red(error.message));
    
    if (error.code === 'EAUTH') {
        console.error(chalk.yellow('\n💡 Authentication failed. Please check:'));
        console.error(chalk.yellow('   - Email address and password in .env file'));
        console.error(chalk.yellow('   - For Gmail: Use App Password, not regular password'));
        console.error(chalk.yellow('   - Enable 2FA and generate App Password in Google Account settings'));
    } else if (error.code === 'ECONNECTION') {
        console.error(chalk.yellow('\n💡 Connection failed. Please check:'));
        console.error(chalk.yellow('   - Internet connection'));
        console.error(chalk.yellow('   - SMTP/IMAP server settings in .env file'));
        console.error(chalk.yellow('   - Firewall settings'));
    } else if (error.message.includes('self signed certificate') || error.code === 'CERT_HAS_EXPIRED') {
        console.error(chalk.yellow('\n💡 SSL Certificate issue detected. Try:'));
        console.error(chalk.yellow('   - Add to .env file: SMTP_REJECT_UNAUTHORIZED=false'));
        console.error(chalk.yellow('   - Add to .env file: IMAP_REJECT_UNAUTHORIZED=false'));
        console.error(chalk.yellow('   - Or try running Node.js with --use-system-ca flag'));
    } else if (error.code === 'MODULE_NOT_FOUND') {
        console.error(chalk.yellow('\n💡 Module not found. Please:'));
        console.error(chalk.yellow('   - Run: npm run build'));
        console.error(chalk.yellow('   - Make sure all dependencies are installed: npm install'));
    }
    
    process.exit(1);
}

// Success handler with formatting
export function handleSuccess(result: any, message: string): void {
    console.log(chalk.green('✅'), chalk.bold(message));
    if (result && typeof result === 'object') {
        console.log(chalk.cyan(JSON.stringify(result, null, 2)));
    }
}

// Generic clean help function - template for all commands
export function showHelp(
    title: string,
    usage: string | string[],
    description: string,
    examples: string[],
    options: HelpOption[] = []
): void {
    console.log(chalk.bold.cyan(`\n${title}\n`));
    
    console.log(chalk.bold('USAGE:'));
    if (Array.isArray(usage)) {
        usage.forEach(u => console.log(chalk.cyan(`  ${u}`)));
    } else {
        console.log(chalk.cyan(`  ${usage}`));
    }
    console.log();
    
    console.log(chalk.bold('DESCRIPTION:'));
    console.log(`  ${description}`);
    console.log();
    
    if (options && options.length > 0) {
        console.log(chalk.bold('ARGUMENTS:'));
        options.forEach(option => {
            if (option) {
                const optionName = option.flag || option.name || '';
                if (optionName && option.description) {
                    console.log(chalk.green(`  ${optionName.padEnd(20)} ${option.description}`));
                }
            }
        });
        console.log();
    }
    
    console.log(chalk.bold('EXAMPLES:'));
    examples.forEach(example => {
        console.log(chalk.yellow(`  ${example}`));
    });
    console.log();
}

// Legacy function for backward compatibility
export function printHelp(
    commandName: string,
    usage: string | string[],
    description: string,
    examples: string[],
    options: HelpOption[] = []
): void {
    showHelp(commandName, usage, description, examples, options);
}

// createSpinner using ora package
export function createSpinner(message: string = 'Loading...'): Ora {
    return ora(message);
}

// Legacy Spinner class for backward compatibility
export class Spinner {
    private spinner: Ora;
    
    constructor(message: string = 'Loading...') {
        this.spinner = ora(message);
    }
    
    start(message?: string): void {
        if (message) {
            this.spinner.text = message;
        }
        this.spinner.start();
    }
    
    succeed(message?: string): void {
        this.spinner.succeed(message);
    }
    
    fail(message?: string): void {
        this.spinner.fail(message);
    }
    
    stop(): void {
        this.spinner.stop();
    }
}

// Check for help flags
export function checkHelpFlag(args: string[]): boolean {
    return args.includes('--help') || args.includes('-h') || args.includes('help');
}

// Function to clean and format email body text
export function cleanEmailBody(body: string): string {
    if (!body) return '(No content)';
    
    let cleaned = body;
    
    // Remove quoted-printable encoding
    cleaned = cleaned.replace(/=([0-9A-F]{2})/g, (_match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
    
    // Remove soft line breaks (= at end of line)
    cleaned = cleaned.replace(/=\r?\n/g, '');
    
    // Remove CSS styles and scripts first
    cleaned = cleaned.replace(/<style[^>]*>.*?<\/style>/gis, '');
    cleaned = cleaned.replace(/<script[^>]*>.*?<\/script>/gis, '');
    
    // Clean up HTML tags but preserve some structure
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
    cleaned = cleaned.replace(/<div[^>]*>/gi, '\n');
    cleaned = cleaned.replace(/<\/div>/gi, '\n');
    cleaned = cleaned.replace(/<[^>]*>/g, ' ');
    
    // Remove CSS media queries and styles that leaked through
    cleaned = cleaned.replace(/@media[^{]*\{[^}]*\}/gi, '');
    cleaned = cleaned.replace(/\*\[class\][^{]*\{[^}]*\}/gi, '');
    cleaned = cleaned.replace(/\.[\w-]+\{[^}]*\}/gi, '');
    cleaned = cleaned.replace(/@font-face[^{]*\{[^}]*\}/gi, '');
    
    // Decode HTML entities (more comprehensive)
    cleaned = cleaned.replace(/&quot;/g, '"');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&#39;/g, "'");
    cleaned = cleaned.replace(/&#(\d+);/g, (_match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
    });
    
    // Fix common Unicode/encoding issues
    cleaned = cleaned.replace(/Ã¢â‚¬â€¹/g, '•'); // Bullet point
    cleaned = cleaned.replace(/Â /g, ' '); // Non-breaking space issues
    cleaned = cleaned.replace(/Â/g, ''); // Remove standalone Â
    cleaned = cleaned.replace(/â€™/g, "'"); // Smart apostrophe
    cleaned = cleaned.replace(/â€œ/g, '"'); // Smart quote open
    cleaned = cleaned.replace(/â€/g, '"'); // Smart quote close
    cleaned = cleaned.replace(/â€¢/g, '•'); // Bullet point
    cleaned = cleaned.replace(/\u00C2\u00A0/g, ' '); // Non-breaking space
    cleaned = cleaned.replace(/\u00A0/g, ' '); // Non-breaking space
    
    // Clean up URLs and make them more readable
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, (url) => {
        // Clean up URL parameters for readability
        if (url.includes('facebook.com')) {
            return '[Facebook Link]';
        } else if (url.length > 50) {
            const domain = url.match(/https?:\/\/([^\/]+)/);
            return domain ? `[Link: ${domain[1]}...]` : '[Link]';
        }
        return url;
    });
    
    // Remove MIME boundaries and headers first
    cleaned = cleaned.replace(/^--[a-zA-Z0-9_\-]+.*$/gm, '');
    cleaned = cleaned.replace(/^Content-[^:]+:.*$/gm, '');
    cleaned = cleaned.replace(/^MIME-Version:.*$/gm, '');
    cleaned = cleaned.replace(/^charset=.*$/gm, '');
    
    // Clean up excessive equals signs (common in email formatting)
    cleaned = cleaned.replace(/={10,}/g, '---');
    
    // Remove excessive whitespace but preserve paragraph breaks
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
    cleaned = cleaned.replace(/^\s*[\r\n]/gm, '\n'); // Remove empty lines
    cleaned = cleaned.trim();
    
    // Format bullet points and lists better
    cleaned = cleaned.replace(/^[\s]*[•·]\s*/gm, '  • ');
    cleaned = cleaned.replace(/^[\s]*\*\s*/gm, '  • ');
    cleaned = cleaned.replace(/^[\s]*-\s*/gm, '  • ');
    
    return cleaned || '(No readable content)';
}

// Validate and resolve file paths for attachments
export function validateAndResolveFilePath(filePath: string): string {
    if (!filePath) {
        throw new Error('File path is required');
    }
    
    // Handle different path formats
    let resolvedPath: string;
    
    if (path.isAbsolute(filePath)) {
        // Absolute path
        resolvedPath = filePath;
    } else {
        // Relative path - resolve from current working directory
        resolvedPath = path.resolve(process.cwd(), filePath);
    }
    
    // Handle home directory shortcuts
    if (filePath.startsWith('~/')) {
        resolvedPath = path.join(process.env.HOME || process.env.USERPROFILE || '', filePath.slice(2));
    }
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found: ${resolvedPath}`);
    }
    
    // Check if it's actually a file (not a directory)
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
        throw new Error(`Path is not a file: ${resolvedPath}`);
    }
    
    return resolvedPath;
}
