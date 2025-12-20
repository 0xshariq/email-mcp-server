#!/usr/bin/env node

/**
 * Email CLI Setup Command
 * Interactive configuration for email credentials and SMTP/IMAP settings
 * Stores configuration permanently across platforms (Linux/macOS/Windows)
 */

import * as readline from 'node:readline';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import figures from 'figures';
import { getGlobalConfigDir, getGlobalEnvPath } from './utils.js';

// UI Elements
const pipe = chalk.gray('│');
const end = chalk.gray('└─');
const branch = chalk.gray('├─');
const arrow = chalk.cyan('→');
const check = chalk.green(figures.tick);
const cross = chalk.red(figures.cross);
const pointer = chalk.cyan(figures.pointer);
const info = chalk.cyan(figures.info);
const bullet = chalk.cyan(figures.bullet);

interface EmailConfig {
    EMAIL_USER: string;
    EMAIL_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    IMAP_HOST: string;
    IMAP_PORT: string;
    EMAIL_FROM?: string;
    IMAP_TLS?: string;
    SMTP_SECURE?: string;
}

/**
 * Create readline interface for user input
 */
function createInterface(): readline.Interface {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

/**
 * Ask a question and get user input
 */
function question(rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Ask for password with masked input
 */
function questionPassword(_rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const originalMode = stdin.isTTY ? (stdin as any).isRaw : false;
        
        process.stdout.write(prompt);
        
        let password = '';
        
        if (stdin.isTTY) {
            (stdin as any).setRawMode(true);
        }
        
        stdin.on('data', function onData(char: Buffer) {
            const str = char.toString('utf8');
            
            switch (str) {
                case '\n':
                case '\r':
                case '\u0004': // Ctrl+D
                    stdin.removeListener('data', onData);
                    if (stdin.isTTY) {
                        (stdin as any).setRawMode(originalMode);
                    }
                    process.stdout.write('\n');
                    resolve(password);
                    break;
                case '\u0003': // Ctrl+C
                    process.stdout.write('\n');
                    process.exit(0);
                    break;
                case '\u007f': // Backspace
                case '\b':
                    if (password.length > 0) {
                        password = password.slice(0, -1);
                        process.stdout.write('\b \b');
                    }
                    break;
                default:
                    password += str;
                    process.stdout.write('*');
                    break;
            }
        });
    });
}

/**
 * Detect provider from email address
 */
function detectProvider(email: string): { smtp: string; imap: string; smtpPort: string; imapPort: string } | null {
    const domain = email.split('@')[1]?.toLowerCase();
    
    const providers: Record<string, { smtp: string; imap: string; smtpPort: string; imapPort: string }> = {
        'gmail.com': {
            smtp: 'smtp.gmail.com',
            imap: 'imap.gmail.com',
            smtpPort: '587',
            imapPort: '993'
        },
        'outlook.com': {
            smtp: 'smtp-mail.outlook.com',
            imap: 'outlook.office365.com',
            smtpPort: '587',
            imapPort: '993'
        },
        'hotmail.com': {
            smtp: 'smtp-mail.outlook.com',
            imap: 'outlook.office365.com',
            smtpPort: '587',
            imapPort: '993'
        },
        'yahoo.com': {
            smtp: 'smtp.mail.yahoo.com',
            imap: 'imap.mail.yahoo.com',
            smtpPort: '587',
            imapPort: '993'
        },
        'icloud.com': {
            smtp: 'smtp.mail.me.com',
            imap: 'imap.mail.me.com',
            smtpPort: '587',
            imapPort: '993'
        }
    };
    
    return providers[domain] || null;
}

/**
 * Save configuration to .env file
 * @param config Email configuration
 * @param global If true, save to global config directory; if false, save to current directory
 */
function saveToEnvFile(config: EmailConfig, global: boolean = false): boolean {
    try {
        let envPath: string;
        
        if (global) {
            // Save to global configuration directory
            const configDir = getGlobalConfigDir();
            // Create directory if it doesn't exist
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            envPath = getGlobalEnvPath();
        } else {
            // Save to current working directory
            envPath = path.join(process.cwd(), '.env');
        }
        
        let content = '';
        
        // Read existing .env if it exists
        if (fs.existsSync(envPath)) {
            content = fs.readFileSync(envPath, 'utf8');
        }
        
        // Update or add each variable
        const vars = [
            ['EMAIL_USER', config.EMAIL_USER],
            ['EMAIL_PASS', config.EMAIL_PASS],
            ['SMTP_HOST', config.SMTP_HOST],
            ['SMTP_PORT', config.SMTP_PORT],
            ['IMAP_HOST', config.IMAP_HOST],
            ['IMAP_PORT', config.IMAP_PORT],
            ['EMAIL_FROM', config.EMAIL_FROM || config.EMAIL_USER],
            ['IMAP_TLS', config.IMAP_TLS || 'true'],
            ['SMTP_SECURE', config.SMTP_SECURE || 'false']
        ];
        
        for (const [key, value] of vars) {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            const line = `${key}=${value}`;
            
            if (regex.test(content)) {
                content = content.replace(regex, line);
            } else {
                content += `\n${line}`;
            }
        }
        
        fs.writeFileSync(envPath, content.trim() + '\n', 'utf8');
        
        return true;
    } catch (error) {
        console.error(chalk.red('Error saving to .env file:'), error);
        return false;
    }
}

/**
 * Main setup function
 */
export async function setup(): Promise<void> {
    console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║     📧 Email CLI Configuration Setup      ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════════════╝\n'));
    
    const rl = createInterface();
    const config: EmailConfig = {} as EmailConfig;
    
    try {
        // Step 1: Email Credentials
        console.log(pipe);
        console.log(chalk.bold.white('Step 1/3: Email Credentials'));
        console.log(pipe);
        
        config.EMAIL_USER = await question(
            rl,
            `${pipe}   ${chalk.cyan('Email address:')} `
        );
        
        if (!config.EMAIL_USER || !config.EMAIL_USER.includes('@')) {
            console.log(pipe);
            console.log(end, cross, chalk.red('Invalid email address!'));
            console.log('');
            rl.close();
            return;
        }
        
        console.log(pipe);
        // Ask for password
        config.EMAIL_PASS = await questionPassword(
            rl,
            `${pipe}   ${chalk.cyan('Password/App Password:')} `
        );
        
        if (!config.EMAIL_PASS) {
            console.log(pipe);
            console.log(end, cross, chalk.red('Password is required!'));
            console.log('');
            rl.close();
            return;
        }
        
        console.log(pipe);
        console.log(chalk.blue(bullet), chalk.green('Credentials saved!'));
        console.log(pipe);
        
        // Step 2: Server Configuration
        console.log(chalk.bold.white('Step 2/3: Server Configuration'));
        console.log(pipe);
        
        // Auto-detect provider
        const detected = detectProvider(config.EMAIL_USER);
        
        if (detected) {
            const provider = config.EMAIL_USER.split('@')[1];
            console.log(pipe, '  ', chalk.gray(`Detected: ${provider}`));
            console.log(pipe, '  ', chalk.gray(`SMTP: ${detected.smtp}:${detected.smtpPort}`));
            console.log(pipe, '  ', chalk.gray(`IMAP: ${detected.imap}:${detected.imapPort}`));
            console.log(pipe);
            
            const useDetected = await question(
                rl,
                `${pipe}   ${chalk.cyan('Use detected settings? [Y/n]:')} `
            );
            
            if (!useDetected || useDetected.toLowerCase() !== 'n') {
                config.SMTP_HOST = detected.smtp;
                config.SMTP_PORT = detected.smtpPort;
                config.IMAP_HOST = detected.imap;
                config.IMAP_PORT = detected.imapPort;
                console.log(pipe);
                console.log(chalk.blue(bullet), chalk.green('Using auto-detected settings'));
                console.log(pipe);
            } else {
                // Manual configuration
                console.log(pipe);
                console.log(chalk.blue(bullet), chalk.yellow('Manual Configuration'));
                console.log(pipe);
                await manualConfiguration(rl, config);
            }
        } else {
            console.log(pipe, '  ', chalk.yellow(`Could not auto-detect settings for ${config.EMAIL_USER.split('@')[1]}`));
            console.log(pipe);
            await manualConfiguration(rl, config);
        }
        
        // Set additional config
        config.EMAIL_FROM = config.EMAIL_USER;
        config.IMAP_TLS = 'true';
        config.SMTP_SECURE = 'false';
        
        // Step 3: Save Configuration
        console.log(chalk.bold.white('Step 3/3: Save Configuration'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(pipe);
        console.log(`${branch} ${chalk.gray('Choose where to save your configuration:')}`);
        console.log(pipe);
        
        console.log(`${branch} ${chalk.white('[1] 📁 Local (.env file)')}`);
        console.log(`${pipe}   ${arrow} ${chalk.gray('Current directory only')}`);
        console.log(`${pipe}   ${arrow} ${chalk.gray('Best for: Development, testing, project-specific config')}`);
        console.log(pipe);
        
        console.log(`${branch} ${chalk.white('[2] 🌍 Global (~/.email directory)')}`);        console.log(`${pipe}   ${arrow} ${chalk.gray(getGlobalEnvPath())}`);  
        console.log(`${pipe}   ${arrow} ${chalk.gray('Best for: Production, permanent installation')}`);
        console.log(pipe);
        
        console.log(`${end} ${chalk.white('[3] 📁 + 🌍 Both locations')}`);
        console.log(`    ${arrow} ${chalk.gray('Maximum compatibility')}`);
        console.log('');
        
        const saveChoice = await question(
            rl,
            `${pointer} ${chalk.cyan('Select option [1-3]:')} `
        );
        
        console.log(''); // Empty line
        let success = false;
        
        if (saveChoice === '1' || saveChoice === '3') {
            process.stdout.write(`${pipe} ${chalk.gray('Saving to local .env file...')} `);
            if (saveToEnvFile(config, false)) {
                console.log(check);
                success = true;
            } else {
                console.log(cross);
            }
        }
        
        if (saveChoice === '2' || saveChoice === '3') {
            const globalEnvPath = getGlobalEnvPath();
            process.stdout.write(`${pipe} ${chalk.gray(`Saving to global config (${globalEnvPath})...`)} `);
            if (saveToEnvFile(config, true)) {
                console.log(check);
                success = true;
            } else {
                console.log(cross);
            }
        }
        
        if (!['1', '2', '3'].includes(saveChoice)) {
            console.log(`${end} ${cross} ${chalk.red('Invalid option selected')}\n`);
            rl.close();
            return;
        }
        
        if (success) {
            console.log(chalk.bold.green('\n╔════════════════════════════════════════════╗'));
            console.log(chalk.bold.green('║          ✓ Setup Completed!                ║'));
            console.log(chalk.bold.green('╚════════════════════════════════════════════╝\n'));
            
            if (saveChoice === '2') {
                console.log(`${info} ${chalk.cyan('Configuration saved to:')}`);
                console.log(`${pipe}   ${arrow} ${chalk.white(getGlobalEnvPath())}\n`);
            } else if (saveChoice === '3') {
                console.log(`${info} ${chalk.cyan('Configuration saved to:')}`);
                console.log(`${pipe}   ${arrow} ${chalk.white(getGlobalEnvPath())} ${chalk.gray('(global)')}`);                console.log(`${pipe}   ${arrow} ${chalk.white(path.join(process.cwd(), '.env'))} ${chalk.gray('(local)')}\n`);
            }
            
            console.log(chalk.bold.white('📋 Next Steps:\n'));
            console.log(pipe);
            console.log(`${branch} ${chalk.gray('Test your configuration:')}`);
            console.log(`${pipe}   ${chalk.cyan('$ email-cli send recipient@example.com "Test" "Hello!"')}`);
            console.log(pipe);
            console.log(`${branch} ${chalk.gray('View all commands:')}`);
            console.log(`${pipe}   ${chalk.cyan('$ email-cli --help')}`);
            console.log(pipe);
            console.log(`${branch} ${chalk.gray('Read recent emails:')}`);
            console.log(`${pipe}   ${chalk.cyan('$ email-cli read 10')}`);
            console.log(pipe);
            console.log(`${end} ${chalk.gray('For more information:')}`);
            console.log(`    ${chalk.cyan('$ email-cli <command> --help')}\n`);
        } else {
            console.log(chalk.bold.red('\n╔════════════════════════════════════════════╗'));
            console.log(chalk.bold.red('║          ✗ Setup Failed                    ║'));
            console.log(chalk.bold.red('╚════════════════════════════════════════════╝\n'));
            console.log(chalk.yellow('Please check the errors above and try again.\n'));
        }
        
    } catch (error) {
        console.error(chalk.red('\n✗ Setup error:'), error);
    } finally {
        rl.close();
    }
}

/**
 * Manual SMTP/IMAP configuration
 */
async function manualConfiguration(rl: readline.Interface, config: EmailConfig): Promise<void> {
    console.log(`${pipe} ${info} ${chalk.gray('Common providers:')}`);
    console.log(`${pipe}   ${branch} Gmail: ${chalk.white('smtp.gmail.com / imap.gmail.com')}`);
    console.log(`${pipe}   ${branch} Outlook: ${chalk.white('smtp-mail.outlook.com / outlook.office365.com')}`);
    console.log(`${pipe}   ${end} Yahoo: ${chalk.white('smtp.mail.yahoo.com / imap.mail.yahoo.com')}`);
    console.log(pipe);
    
    config.SMTP_HOST = await question(
        rl,
        `${branch} ${chalk.cyan('SMTP Host:')} `
    );
    
    if (!config.SMTP_HOST) {
        throw new Error('SMTP Host is required');
    }
    
    let smtpPort = await question(
        rl,
        `${pipe}   ${chalk.cyan('SMTP Port [587]:')} `
    );
    config.SMTP_PORT = smtpPort || '587';
    console.log(pipe);
    
    config.IMAP_HOST = await question(
        rl,
        `${branch} ${chalk.cyan('IMAP Host:')} `
    );
    
    if (!config.IMAP_HOST) {
        throw new Error('IMAP Host is required');
    }
    
    let imapPort = await question(
        rl,
        `${end}   ${chalk.cyan('IMAP Port [993]:')} `
    );
    config.IMAP_PORT = imapPort || '993';
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setup().catch(console.error);
}
