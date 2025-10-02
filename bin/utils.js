#!/usr/bin/env node

/**
 * Shared utilities for email CLI commands
 * Handles environment loading and service initialization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
export function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    
    if (!fs.existsSync(envPath)) {
        console.error(chalk.red('❌ .env file not found.'));
        console.error(chalk.yellow('💡 Please copy .env.example to .env and configure your email settings.'));
        process.exit(1);
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
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
export function validateEnv() {
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
export async function initializeEmailService() {
    try {
        loadEnv();
        validateEnv();
        
        // Import email service (must be after env loading)
        const { createEmailService } = await import('../dist/email.js');
        
        const config = {
            smtp: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
                }
            },
            imap: {
                host: process.env.IMAP_HOST,
                port: parseInt(process.env.IMAP_PORT),
                tls: process.env.IMAP_TLS !== 'false',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
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
    } catch (error) {
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
export async function initializeContactService() {
    loadEnv();
    validateEnv();
    
    const { createContactService } = await import('../dist/email.js');
    return createContactService();
}

// Common error handler
export function handleError(error, operation = 'operation') {
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
export function handleSuccess(result, message) {
    console.log(chalk.green('✅'), chalk.bold(message));
    if (result && typeof result === 'object') {
        console.log(chalk.cyan(JSON.stringify(result, null, 2)));
    }
}

// Generic clean help function - template for all commands
export function showHelp(title, usage, description, examples, options = []) {
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
            if (option && option.name && option.description) {
                console.log(chalk.green(`  ${option.name.padEnd(20)} ${option.description}`));
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
export function printHelp(commandName, usage, description, examples, options = []) {
    showHelp(commandName, usage, description, examples, options);
}

// createSpinner using ora package
export function createSpinner(message = 'Loading...') {
    return ora(message);
}

// Legacy Spinner class for backward compatibility
export class Spinner {
    constructor(message = 'Loading...') {
        this.spinner = ora(message);
    }
    
    start(message) {
        if (message) {
            this.spinner.text = message;
        }
        this.spinner.start();
    }
    
    succeed(message) {
        this.spinner.succeed(message);
    }
    
    fail(message) {
        this.spinner.fail(message);
    }
    
    stop() {
        this.spinner.stop();
    }
}

// Check for help flags
export function checkHelpFlag(args) {
    return args.includes('--help') || args.includes('-h') || args.includes('help');
}

// Validate and resolve file paths for attachments
export function validateAndResolveFilePath(filePath) {
    if (!filePath) {
        throw new Error('File path is required');
    }
    
    // Handle different path formats
    let resolvedPath;
    
    if (path.isAbsolute(filePath)) {
        // Absolute path
        resolvedPath = filePath;
    } else {
        // Relative path - resolve from current working directory
        resolvedPath = path.resolve(process.cwd(), filePath);
    }
    
    // Handle home directory shortcuts
    if (filePath.startsWith('~/')) {
        resolvedPath = path.join(process.env.HOME || process.env.USERPROFILE, filePath.slice(2));
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