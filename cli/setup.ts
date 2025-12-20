#!/usr/bin/env node

/**
 * Email CLI Setup Command
 * Interactive configuration for email credentials and SMTP/IMAP settings
 * Stores configuration permanently across platforms (Linux/macOS/Windows)
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';

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
function questionPassword(rl: readline.Interface, prompt: string): Promise<string> {
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
 * Get shell config file path based on platform
 */
function getShellConfigPath(): string | null {
    const platform = os.platform();
    const homeDir = os.homedir();
    
    if (platform === 'win32') {
        return null; // Windows uses registry/system env vars
    }
    
    // Check for shell type
    const shell = process.env.SHELL || '';
    
    if (shell.includes('zsh')) {
        return path.join(homeDir, '.zshrc');
    } else if (shell.includes('bash')) {
        return path.join(homeDir, '.bashrc');
    } else if (fs.existsSync(path.join(homeDir, '.zshrc'))) {
        return path.join(homeDir, '.zshrc');
    } else if (fs.existsSync(path.join(homeDir, '.bashrc'))) {
        return path.join(homeDir, '.bashrc');
    } else {
        return path.join(homeDir, '.profile');
    }
}

/**
 * Save configuration to shell profile (Linux/macOS)
 */
function saveToShellProfile(config: EmailConfig): boolean {
    const configPath = getShellConfigPath();
    
    if (!configPath) {
        return false;
    }
    
    try {
        let content = '';
        
        // Read existing content
        if (fs.existsSync(configPath)) {
            content = fs.readFileSync(configPath, 'utf8');
        }
        
        // Remove old email config if exists
        const emailConfigRegex = /# Email MCP Server Configuration - Start[\s\S]*?# Email MCP Server Configuration - End\n/g;
        content = content.replace(emailConfigRegex, '');
        
        // Add new configuration
        const configBlock = `
# Email MCP Server Configuration - Start
export EMAIL_USER="${config.EMAIL_USER}"
export EMAIL_PASS="${config.EMAIL_PASS}"
export SMTP_HOST="${config.SMTP_HOST}"
export SMTP_PORT="${config.SMTP_PORT}"
export IMAP_HOST="${config.IMAP_HOST}"
export IMAP_PORT="${config.IMAP_PORT}"
export EMAIL_FROM="${config.EMAIL_FROM || config.EMAIL_USER}"
export IMAP_TLS="${config.IMAP_TLS || 'true'}"
export SMTP_SECURE="${config.SMTP_SECURE || 'false'}"
# Email MCP Server Configuration - End
`;
        
        content += configBlock;
        
        // Write back to file
        fs.writeFileSync(configPath, content, 'utf8');
        
        return true;
    } catch (error) {
        console.error(chalk.red('Error saving to shell profile:'), error);
        return false;
    }
}

/**
 * Save configuration to Windows registry/PowerShell profile
 */
function saveToWindows(config: EmailConfig): boolean {
    try {
        const { execSync } = require('child_process');
        
        // Set user environment variables using setx
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
            try {
                execSync(`setx ${key} "${value}"`, { encoding: 'utf8', stdio: 'pipe' });
            } catch (err) {
                console.error(chalk.yellow(`Warning: Failed to set ${key}`));
            }
        }
        
        return true;
    } catch (error) {
        console.error(chalk.red('Error saving to Windows registry:'), error);
        return false;
    }
}

/**
 * Save configuration to .env file (local development)
 */
function saveToEnvFile(config: EmailConfig): boolean {
    try {
        const envPath = path.join(process.cwd(), '.env');
        
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
    console.log(chalk.bold.cyan('\n📧 Email CLI Setup\n'));
    console.log(chalk.gray('Configure your email credentials and SMTP/IMAP settings\n'));
    
    const rl = createInterface();
    const config: EmailConfig = {} as EmailConfig;
    
    try {
        // Ask for email
        config.EMAIL_USER = await question(
            rl,
            chalk.cyan('Email address: ')
        );
        
        if (!config.EMAIL_USER) {
            console.log(chalk.red('Email address is required!'));
            rl.close();
            return;
        }
        
        // Ask for password
        config.EMAIL_PASS = await questionPassword(
            rl,
            chalk.cyan('Password/App Password: ')
        );
        
        if (!config.EMAIL_PASS) {
            console.log(chalk.red('\nPassword is required!'));
            rl.close();
            return;
        }
        
        // Auto-detect provider
        const detected = detectProvider(config.EMAIL_USER);
        
        if (detected) {
            console.log(chalk.green(`\n✓ Detected provider settings for ${config.EMAIL_USER.split('@')[1]}`));
            
            const useDetected = await question(
                rl,
                chalk.cyan(`Use detected settings? (Y/n): `)
            );
            
            if (!useDetected || useDetected.toLowerCase() !== 'n') {
                config.SMTP_HOST = detected.smtp;
                config.SMTP_PORT = detected.smtpPort;
                config.IMAP_HOST = detected.imap;
                config.IMAP_PORT = detected.imapPort;
                
                console.log(chalk.gray(`SMTP: ${config.SMTP_HOST}:${config.SMTP_PORT}`));
                console.log(chalk.gray(`IMAP: ${config.IMAP_HOST}:${config.IMAP_PORT}\n`));
            } else {
                // Manual configuration
                await manualConfiguration(rl, config);
            }
        } else {
            console.log(chalk.yellow('\n⚠ Provider not auto-detected, please enter manually:\n'));
            await manualConfiguration(rl, config);
        }
        
        // Set additional config
        config.EMAIL_FROM = config.EMAIL_USER;
        config.IMAP_TLS = 'true';
        config.SMTP_SECURE = 'false';
        
        // Ask where to save
        console.log(chalk.bold.cyan('\n💾 Save Configuration\n'));
        console.log(chalk.gray('Where do you want to save the configuration?\n'));
        console.log(chalk.white('1. Local (.env file in current directory) - Recommended for development'));
        console.log(chalk.white('2. Global (System environment variables) - Recommended for production'));
        console.log(chalk.white('3. Both\n'));
        
        const saveChoice = await question(
            rl,
            chalk.cyan('Choose option (1/2/3): ')
        );
        
        let success = false;
        
        if (saveChoice === '1' || saveChoice === '3') {
            if (saveToEnvFile(config)) {
                console.log(chalk.green('✓ Configuration saved to .env file'));
                success = true;
            }
        }
        
        if (saveChoice === '2' || saveChoice === '3') {
            const platform = os.platform();
            
            if (platform === 'win32') {
                if (saveToWindows(config)) {
                    console.log(chalk.green('✓ Configuration saved to Windows environment variables'));
                    console.log(chalk.yellow('⚠ Please restart your terminal for changes to take effect'));
                    success = true;
                }
            } else {
                const configPath = getShellConfigPath();
                if (saveToShellProfile(config)) {
                    console.log(chalk.green(`✓ Configuration saved to ${configPath}`));
                    console.log(chalk.yellow(`⚠ Run: source ${configPath} or restart your terminal`));
                    success = true;
                }
            }
        }
        
        if (success) {
            console.log(chalk.bold.green('\n✓ Setup completed successfully!\n'));
            console.log(chalk.gray('Test your configuration with:'));
            console.log(chalk.white('  email-cli send <recipient> "Test" "Hello from email-cli"\n'));
        } else {
            console.log(chalk.red('\n✗ Setup failed. Please try again.\n'));
        }
        
    } catch (error) {
        console.error(chalk.red('\nSetup error:'), error);
    } finally {
        rl.close();
    }
}

/**
 * Manual SMTP/IMAP configuration
 */
async function manualConfiguration(rl: readline.Interface, config: EmailConfig): Promise<void> {
    config.SMTP_HOST = await question(
        rl,
        chalk.cyan('SMTP Host (e.g., smtp.gmail.com): ')
    );
    
    config.SMTP_PORT = await question(
        rl,
        chalk.cyan('SMTP Port (default: 587): ')
    ) || '587';
    
    config.IMAP_HOST = await question(
        rl,
        chalk.cyan('IMAP Host (e.g., imap.gmail.com): ')
    );
    
    config.IMAP_PORT = await question(
        rl,
        chalk.cyan('IMAP Port (default: 993): ')
    ) || '993';
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setup().catch(console.error);
}
