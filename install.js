#!/usr/bin/env node

/**
 * Cross-platform installation script for Email MCP Server CLI
 * Works on Windows, macOS, and Linux
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const platform = os.platform();
const isWindows = platform === 'win32';

console.log('🚀 Installing Email MCP Server CLI...');
console.log(`📱 Platform: ${platform}`);

try {
    // Check if package.json exists
    const packagePath = join(__dirname, 'package.json');
    if (!existsSync(packagePath)) {
        throw new Error('package.json not found. Make sure you\'re in the project directory.');
    }

    // Build the project first
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });

    // Install globally using npm (works cross-platform)
    console.log('📦 Installing CLI commands globally...');
    execSync('npm install -g .', { stdio: 'inherit', cwd: __dirname });

    console.log('\n✅ Installation completed successfully!');
    console.log('\n📋 Available commands:');
    console.log('   📧 Basic: email-send, email-read, email-get, email-delete, email-list');
    console.log('   🔍 Advanced: email-search, email-attach, email-forward, email-reply');
    console.log('   📊 Stats: email-stats, email-bulk, email-draft, email-schedule');
    console.log('   👥 Contacts: contact-add, contact-list, contact-search, contact-update');
    
    console.log('\n🚀 Quick start:');
    if (isWindows) {
        console.log('   email-send recipient@example.com "Subject" "Message"');
        console.log('   email-read 10');
    } else {
        console.log('   email-send recipient@example.com \'Subject\' \'Message\'');
        console.log('   email-read 10');
    }
    
    console.log('\n💡 Tip: All commands work the same way across all platforms!');
    
} catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Node.js is installed: node --version');
    console.log('2. Make sure npm is available: npm --version');
    console.log('3. Try running with admin/sudo privileges');
    console.log('4. Check your network connection and try again.');
    console.log('5. Go to troubleshooting guide: docs/troubleshooting.md');
    
    if (isWindows) {
        console.log('6. On Windows: Run PowerShell as Administrator');
    } else {
        console.log('6. On Unix systems: Try with sudo');
    }
    
    process.exit(1);
}