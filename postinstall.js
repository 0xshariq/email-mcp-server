#!/usr/bin/env node

/**
 * Post-install script for Email MCP Server
 * Detects global vs local installation and runs appropriate setup
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function colorize(color, text) {
    return colors[color] + text + colors.reset;
}

function isGlobalInstall() {
    // Multiple robust checks for global installation detection
    
    // 1. Primary npm indicator
    if (process.env.npm_config_global === 'true') {
        return true;
    }
    
    // 2. Command line arguments
    const args = process.argv.slice(2);
    if (args.includes('-g') || args.includes('--global')) {
        return true;
    }
    
    // 3. npm command context
    if (process.env.npm_command === 'install' && process.env.npm_config_argv) {
        try {
            const npmArgv = JSON.parse(process.env.npm_config_argv);
            if (npmArgv.original && (npmArgv.original.includes('-g') || npmArgv.original.includes('--global'))) {
                return true;
            }
        } catch (e) {
            // Continue with other checks
        }
    }
    
    // 4. Path-based detection (cross-platform)
    const cwd = process.cwd();
    const packageName = '@0xshariq/email-mcp-server';
    
    // Common global paths across platforms
    const globalPathPatterns = [
        // npm global paths
        '/usr/local/lib/node_modules',
        '/usr/lib/node_modules', 
        'AppData/Roaming/npm/node_modules',  // Windows npm
        'AppData\\Roaming\\npm\\node_modules',  // Windows npm (backslash)
        
        // pnpm global paths
        'AppData/Local/pnpm/global',  // Windows pnpm
        'AppData\\Local\\pnpm\\global',  // Windows pnpm (backslash)
        '.pnpm/global',
        'pnpm/global',
        
        // Homebrew paths (macOS/Linux)
        '/opt/homebrew/lib/node_modules',  // macOS Apple Silicon
        '/usr/local/Cellar',  // macOS Intel Homebrew
        '/home/linuxbrew/.linuxbrew/lib/node_modules',  // Linux Homebrew
        
        // Yarn global
        '.yarn/global',
        
        // Node Version Managers
        '.nvm/versions/node',
        '.nvs/node',
        
        // System-wide locations
        'Program Files/nodejs/node_modules',  // Windows system
        'Program Files (x86)/nodejs/node_modules'  // Windows system x86
    ];
    
    // Check if current path matches global installation pattern
    const isInGlobalPath = globalPathPatterns.some(pattern => {
        // Normalize path separators for cross-platform comparison
        const normalizedCwd = cwd.replace(/\\/g, '/');
        const normalizedPattern = pattern.replace(/\\/g, '/');
        return normalizedCwd.includes(normalizedPattern);
    });
    
    // 5. pnpm specific checks
    if (process.env.PNPM_HOME || process.env.npm_config_user_config?.includes('pnpm')) {
        if (cwd.includes('pnpm') && (cwd.includes('global') || cwd.includes('.pnpm'))) {
            return true;
        }
    }
    
    // 6. Yarn specific checks  
    if (process.env.npm_execpath && process.env.npm_execpath.includes('yarn')) {
        if (cwd.includes('yarn') && cwd.includes('global')) {
            return true;
        }
    }
    
    // 7. Final verification: must be in node_modules with our package name
    const isInNodeModules = cwd.includes('node_modules') && cwd.includes(packageName);
    
    return isInGlobalPath && isInNodeModules;
}

async function createEnvTemplate() {
    try {
        const envPath = path.join(__dirname, '.env');
        const envExamplePath = path.join(__dirname, '.env.example');
        
        // Check if .env already exists
        try {
            await fs.access(envPath);
            console.log(colorize('blue', '📄 .env file already exists'));
            return;
        } catch {
            // .env doesn't exist, create from template
        }
        
        // Create .env from .env.example if it exists
        try {
            const exampleContent = await fs.readFile(envExamplePath, 'utf8');
            await fs.writeFile(envPath, exampleContent);
            console.log(colorize('green', '✅ Created .env file from template'));
            console.log(colorize('yellow', '💡 Please edit .env file with your email credentials'));
        } catch {
            // Create basic .env template
            const basicEnv = `# Email MCP Server Configuration
# Gmail Settings (recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true

# Connection Settings
IMAP_CONN_TIMEOUT=60000

# Optional: Other Email Providers
# Outlook/Hotmail:
# SMTP_HOST=smtp-mail.outlook.com
# IMAP_HOST=outlook.office365.com

# Custom SMTP:
# SMTP_HOST=mail.yourprovider.com
# IMAP_HOST=mail.yourprovider.com
`;
            
            await fs.writeFile(envPath, basicEnv);
            console.log(colorize('green', '✅ Created .env configuration file'));
            console.log(colorize('yellow', '💡 Please edit .env with your email credentials'));
        }
        
        // Show configuration instructions
        console.log(colorize('cyan', '\n📋 Configuration Steps:'));
        console.log('1. Edit .env file with your email credentials');
        console.log('2. For Gmail: Generate App Password (not regular password)');
        console.log('3. Test with: email-cli --version');
        console.log(colorize('gray', '\nDocumentation: https://github.com/0xshariq/email-mcp-server'));
        
    } catch (error) {
        console.log(colorize('red', '❌ Could not create .env file: ' + error.message));
    }
}

async function runGlobalSetup() {
    console.log(colorize('cyan', '\n🚀 Email MCP Server global installation complete!'));
    console.log(colorize('green', '✅ All CLI commands are now available globally'));
    
    console.log(colorize('yellow', '\n🎯 Quick Start:'));
    console.log(colorize('cyan', '1. Set email credentials:') + ' email-cli --help');
    console.log(colorize('cyan', '2. Send your first email:') + ' email-send "user@example.com" "Hello" "Test message"');
    console.log(colorize('cyan', '3. Read emails:') + ' email-read 5');
    console.log(colorize('cyan', '4. List all commands:') + ' email-cli --help');
    
    console.log(colorize('yellow', '\n📋 Available Commands:'));
    console.log('• Basic: email-send, email-read, email-get, email-delete, list');
    console.log('• Advanced: email-search, email-attach, email-forward, email-reply');
    console.log('• Stats: email-stats, email-bulk, email-draft, email-schedule');
    console.log('• Contacts: contact-add, contact-list, contact-search, contact-update');
    
    console.log(colorize('blue', '\n� Documentation: https://github.com/0xshariq/email-mcp-server'));
    console.log(colorize('gray', '💡 All commands work identically across Windows, macOS, and Linux!'));
}

async function main() {
    console.log(colorize('bright', '\n📦 Email MCP Server - Post-Install Setup'));
    
    // Debug information (can be removed in production)
    const debugInfo = {
        cwd: process.cwd(),
        npm_config_global: process.env.npm_config_global,
        npm_command: process.env.npm_command,
        argv: process.argv.slice(2),
        pnpm_home: process.env.PNPM_HOME
    };
    
    // Only show debug in verbose mode
    if (process.env.npm_config_loglevel === 'verbose' || process.env.DEBUG) {
        console.log(colorize('gray', '🔍 Debug info:'), debugInfo);
    }
    
    const isGlobal = isGlobalInstall();
    
    if (isGlobal) {
        console.log(colorize('blue', '🌐 Global installation detected (-g flag used)'));
        console.log(colorize('gray', '   Running automated setup for system-wide CLI access...'));
        await runGlobalSetup();
    } else {
        console.log(colorize('blue', '📁 Local installation detected (no -g flag)'));
        console.log(colorize('gray', '   Setting up for local development with .env configuration...'));
        await createEnvTemplate();
        
        console.log(colorize('yellow', '\n🔧 Local Installation - Next Steps:'));
        console.log(colorize('cyan', '1. Edit .env file:') + ' Add your email credentials');
        console.log(colorize('cyan', '2. Test locally:') + ' node email-cli.js --version');
        console.log(colorize('cyan', '3. Run commands:') + ' node bin/basic/email-send.js "test@example.com" "Subject" "Body"');
        console.log(colorize('gray', '4. For global CLI: npm install -g @0xshariq/email-mcp-server'));
        
        console.log(colorize('yellow', '\n📚 Local Development:'));
        console.log('• All commands work via: node bin/[folder]/[command].js');
        console.log('• Configuration: Edit .env file (created automatically)');
        console.log('• Build project: npm run build');
    }
    
    console.log(colorize('green', '\n✅ Setup completed!'));
}

// Only run if called directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error(colorize('red', '❌ Post-install error: ' + error.message));
    });
}

export { isGlobalInstall, createEnvTemplate, runGlobalSetup };