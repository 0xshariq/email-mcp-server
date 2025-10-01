#!/usr/bin/env node

/**
 * Shared utilities for email CLI commands
 * Handles environment loading and service initialization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

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
            markSeen: process.env.IMAP_MARK_SEEN === 'true'
        }
    };
    
    return createEmailService(config);
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

// Print styled help message
export function printHelp(commandName, usage, description, examples, options = []) {
    console.log(chalk.blue.bold(`\n📧 ${commandName.toUpperCase()}`));
    console.log(chalk.gray('━'.repeat(50)));
    
    console.log(chalk.bold('\nUSAGE:'));
    console.log(chalk.cyan(`  ${usage}`));
    
    console.log(chalk.bold('\nDESCRIPTION:'));
    console.log(`  ${description}`);
    
    if (options.length > 0) {
        console.log(chalk.bold('\nOPTIONS:'));
        options.forEach(option => {
            console.log(chalk.cyan(`  ${option.flag.padEnd(20)} ${option.description}`));
        });
    }
    
    console.log(chalk.bold('\nEXAMPLES:'));
    examples.forEach(example => {
        console.log(chalk.green(`  ${example}`));
    });
    
    console.log(chalk.gray('\n━'.repeat(50)));
    console.log(chalk.dim('💡 Make sure your .env file is configured with email settings'));
}

// Spinner for loading states
export class Spinner {
    constructor(message = 'Loading...') {
        this.message = message;
        this.chars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.index = 0;
        this.interval = null;
    }
    
    start(message = null) {
        if (message) this.message = message;
        process.stdout.write(`\r${chalk.yellow(this.chars[this.index])} ${chalk.dim(this.message)}`);
        this.interval = setInterval(() => {
            this.index = (this.index + 1) % this.chars.length;
            process.stdout.write(`\r${chalk.yellow(this.chars[this.index])} ${chalk.dim(this.message)}`);
        }, 80);
        return this;
    }
    
    succeed(message = null) {
        this.stop();
        const successMessage = message || this.message.replace('...', '');
        console.log(`${chalk.green('✅')} ${chalk.dim(successMessage)}`);
    }
    
    fail(message = null) {
        this.stop();
        const failMessage = message || this.message.replace('...', '');
        console.log(`${chalk.red('❌')} ${chalk.dim(failMessage)}`);
    }
    
    stop(message = null) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        if (message) {
            console.log(message);
        }
    }
}

// Check for help flags
export function checkHelpFlag(args) {
    return args.includes('--help') || args.includes('-h') || args.includes('help');
}