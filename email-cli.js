#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import nodemailer from 'nodemailer';
import dns from 'dns/promises';
import os from 'os';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Function to display current user email at the start of commands
function displayCurrentUser() {
  try {
    // Try to get email from environment variables first
    if (process.env.EMAIL_USER) {
      console.log(chalk.blue(`📧 Account: ${chalk.cyan(process.env.EMAIL_USER)}`));
      console.log(); // Add spacing
      return;
    }
    
    // Fallback to .env file
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const emailUserMatch = envContent.match(/^EMAIL_USER=(.+)$/m);
      if (emailUserMatch) {
        const userEmail = emailUserMatch[1].trim().replace(/['"]/g, '');
        console.log(chalk.blue(`📧 Account: ${chalk.cyan(userEmail)}`));
        console.log(); // Add spacing
      }
    }
  } catch (error) {
    // Silently ignore errors - env file might not exist yet
  }
}

// Function to clean and format email body text
function cleanEmailBody(body) {
  if (!body) return '(No content)';
  
  let cleaned = body;
  
  // Remove quoted-printable encoding
  cleaned = cleaned.replace(/=([0-9A-F]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  // Remove soft line breaks (= at end of line)
  cleaned = cleaned.replace(/=\r?\n/g, '');
  
  // Clean up HTML tags but preserve some structure
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&#39;/g, "'");
  
  // Clean up URLs and make them more readable
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, (url) => {
    if (url.length > 60) {
      return url.substring(0, 50) + '...';
    }
    return url;
  });
  
  // Remove excessive whitespace but preserve paragraph breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.trim();
  
  // Remove email headers and MIME boundaries
  cleaned = cleaned.replace(/^--[a-zA-Z0-9_]+.*$/gm, '');
  cleaned = cleaned.replace(/^Content-[^:]+:.*$/gm, '');
  cleaned = cleaned.replace(/^MIME-Version:.*$/gm, '');
  
  return cleaned || '(No readable content)';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the command name from the actual command used to invoke this script
const fullPath = process.argv[1];
let commandName = path.basename(fullPath);

// For pnpm-generated wrappers, detect the actual command
if (commandName === 'email-cli.js') {
  let detectedCommand = null;
  
  // Try to detect from parent process (Unix-like systems)
  if (process.platform !== 'win32') {
    try {
      const ppid = process.ppid;
      if (ppid) {
        const psOutput = execSync(`ps -p ${ppid} -o args= 2>/dev/null || echo ""`, { encoding: 'utf8' }).trim();
        const wrapperMatch = psOutput.match(/(?:bash|sh|dash)\s+.*?\/([e][a-z-]+)(?:\s|$)/);
        if (wrapperMatch && wrapperMatch[1]) {
          detectedCommand = wrapperMatch[1];
        }
      }
    } catch (e) {
      // Ignore errors - common on Windows or restricted environments
    }
  }
  
  // Fallback to environment variable (works on all platforms)
  if (!detectedCommand && process.env._) {
    const envCommand = path.basename(process.env._);
    if (envCommand.startsWith('e') && envCommand !== 'email-mcp-server') {
      detectedCommand = envCommand;
    }
  }
  
  // Windows pnpm detection - check process.argv[1] path for command name
  if (!detectedCommand && process.platform === 'win32') {
    const scriptPath = process.argv[1];
    if (scriptPath) {
      const pathMatch = scriptPath.match(/([e][a-z-]+)(?:\.cmd|\.bat)?$/);
      if (pathMatch && pathMatch[1] && pathMatch[1] !== 'email-cli') {
        detectedCommand = pathMatch[1];
      }
    }
  }
  
  if (detectedCommand) {
    commandName = detectedCommand;
  }
}

// Available commands mapping
const commands = {
  // Basic Email Operations
  'email-send': 'basic/email-send.js',
  'esend': 'basic/email-send.js',
  'email-read': 'basic/email-read.js',
  'eread': 'basic/email-read.js',
  'email-get': 'basic/email-get.js',
  'eget': 'basic/email-get.js',
  'email-delete': 'basic/email-delete.js',
  'edelete': 'basic/email-delete.js',
  'email-mark-read': 'basic/email-mark-read.js',
  'emarkread': 'basic/email-mark-read.js',

  // Advanced Email Operations  
  'email-search': 'advanced/email-search.js',
  'esearch': 'advanced/email-search.js',
  'email-forward': 'advanced/email-forward.js',
  'eforward': 'advanced/email-forward.js',
  'email-reply': 'advanced/email-reply.js',
  'ereply': 'advanced/email-reply.js',
  'email-stats': 'advanced/email-stats.js',
  'estats': 'advanced/email-stats.js',
  'email-draft': 'advanced/email-draft.js',
  'edraft': 'advanced/email-draft.js',
  'email-schedule': 'advanced/email-schedule.js',
  'eschedule': 'advanced/email-schedule.js',
  'email-bulk': 'advanced/email-bulk.js',
  'ebulk': 'advanced/email-bulk.js',
  'email-attach': 'advanced/email-attach.js',
  'eattach': 'advanced/email-attach.js',

  // Contact Management
  'contact-add': 'contacts/contact-add.js',
  'cadd': 'contacts/contact-add.js',
  'contact-list': 'contacts/contact-list.js',
  'clist': 'contacts/contact-list.js',
  'contact-search': 'contacts/contact-search.js',
  'csearch': 'contacts/contact-search.js',
  'contact-group': 'contacts/contact-group.js',
  'cgroup': 'contacts/contact-group.js',
  'contact-update': 'contacts/contact-update.js',
  'cupdate': 'contacts/contact-update.js',
  'contact-delete': 'contacts/contact-delete.js',
  'cdelete': 'contacts/contact-delete.js',
  
  // Utility Commands  
  'list': 'basic/list.js',
  'email-cli': null // Special case - handled in main function, includes setup-env and export-env subcommands
};

async function main() {
  const args = process.argv.slice(2);
  let command = commandName;
  let commandArgs = args;
  
  // If called as email-cli.js, get command from arguments
  if (commandName === 'email-cli.js' || commandName === 'email-cli') {
    // Handle version flag
    if (args.includes('--version') || args.includes('-v')) {
      showVersion();
      return;
    }
    
    if (args.length === 0 || (args.includes('--help') || args.includes('-h')) && args.length === 1) {
      showUsage();
      return;
    }
    
    // Handle update command directly here
    if (args[0] === 'update') {
      await handleUpdate();
      return;
    }
    
    command = args[0];
    commandArgs = args.slice(1);
  }

  // Handle special email-cli command
  if (command === 'email-cli') {
    if (commandArgs.includes('--version') || commandArgs.includes('-v')) {
      showVersion();
      return;
    } else if (commandArgs.includes('--help') || commandArgs.includes('-h')) {
      showUsage();
      return;
    } else if (commandArgs[0] === 'setup') {
      // Interactive setup: prompts for EMAIL_USER and EMAIL_PASS and attempts autodetect
      await handleSetup(commandArgs.slice(1));
      return;
      } else if (commandArgs[0] === 'diagnose') {
        await handleDiagnose(commandArgs.slice(1));
        return;
    } else if (commandArgs[0] === 'update') {
      await handleUpdate();
      return;
    } else if (commandArgs.length === 0) {
      // Default behavior: show recent emails (like list command)
      displayCurrentUser();
      const scriptPath = path.join(__dirname, 'bin', 'basic/list.js');
      
      if (!fs.existsSync(scriptPath)) {
        console.error(chalk.red.bold(`❌ Script not found: ${scriptPath}`));
        showUsage();
        process.exit(1);
      }
      
      // Execute the list script
      process.chdir(__dirname);
      const nodeExecutable = process.platform === 'win32' ? 'node.exe' : 'node';
      const childProcess = spawn(nodeExecutable, [scriptPath], {
        stdio: 'inherit',
        cwd: __dirname,
        env: { 
          ...process.env,
          NODE_PATH: __dirname
        },
        shell: process.platform === 'win32' // Use shell on Windows for better compatibility
      });

      childProcess.on('close', (code) => {
        process.exit(code || 0);
      });

      childProcess.on('error', (err) => {
        console.error(chalk.red.bold('❌ Error executing list script:'), err.message);
        process.exit(1);
      });
      return;
    } else {
      console.error(chalk.red.bold(`❌ Unknown argument for email-cli: ${commandArgs[0]}`));
      console.log(chalk.yellow('💡 Use --help or --version, or run without arguments to see emails'));
      process.exit(1);
    }
  }

  // Handle direct command execution (when called as the command itself)
  if (commands[command] && commands[command] !== null) {
    // Display current user email (except for help commands)
    if (!commandArgs.includes('--help') && !commandArgs.includes('-h')) {
      displayCurrentUser();
    }
    
    const scriptPath = path.join(__dirname, 'bin', commands[command]);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red.bold(`❌ Script not found: ${scriptPath}`));
      console.error(chalk.gray(`Looked for: ${scriptPath}`));
      console.error(chalk.gray(`Current directory: ${process.cwd()}`));
      console.error(chalk.gray(`CLI directory: ${__dirname}`));
      console.log(chalk.yellow('Available commands:'));
      Object.keys(commands).forEach(cmd => {
        console.log(chalk.cyan(`  ${cmd}`));
      });
      process.exit(1);
    }
    
    // Change to the project directory to ensure relative imports work
    process.chdir(__dirname);
    
    // Execute the script with proper environment
    const nodeExecutable = process.platform === 'win32' ? 'node.exe' : 'node';
    const childProcess = spawn(nodeExecutable, [scriptPath, ...commandArgs], {
      stdio: 'inherit',
      cwd: __dirname,
      env: { 
        ...process.env,
        NODE_PATH: __dirname
      },
      shell: process.platform === 'win32' // Use shell on Windows for better compatibility
    });

    childProcess.on('close', (code) => {
      process.exit(code || 0);
    });

    childProcess.on('error', (err) => {
      console.error(chalk.red.bold('❌ Error executing script:'), err.message);
      process.exit(1);
    });
  } else if (command === 'update') {
    // Handle update command that wasn't caught earlier
    await handleUpdate();
  } else {
    console.error(chalk.red.bold(`❌ Unknown command: ${command}`));
    console.log(chalk.yellow('\n💡 Run with --help to see available commands'));
    showUsage();
    process.exit(1);
  }
}

function showVersion() {
  // Read version from package.json
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(chalk.bold.cyan('📧 Email MCP Server CLI'));
    console.log(chalk.gray(`Version: ${chalk.white(packageJson.version)}`));
    console.log(chalk.gray(`Package: ${chalk.white(packageJson.name)}`));
    console.log(chalk.gray(`Platform: ${chalk.white(process.platform)}`));
    console.log(chalk.gray(`Node: ${chalk.white(process.version)}`));
    console.log(chalk.gray(`CLI Path: ${chalk.white(__dirname)}`));
    console.log();
    console.log(chalk.dim('A powerful command-line interface for email operations'));
    console.log(chalk.dim('Use --help to see available commands'));
    
    // Show environment setup status
    if (process.env.EMAIL_USER) {
      console.log(chalk.green(`✅ Environment configured for: ${process.env.EMAIL_USER}`));
    } else {
      console.log(chalk.yellow('⚠️  Environment not configured - set EMAIL_USER and other variables'));
    }
  } catch (error) {
    console.log(chalk.bold.cyan('📧 Email MCP Server CLI'));
    console.log(chalk.red('Version information not available'));
    console.log(chalk.red(`Error: ${error.message}`));
  }
}



function showUsage() {
  console.log();
  console.log(chalk.bold.cyan('📧 Email MCP CLI') + chalk.gray(' - ') + chalk.bold.white('Email Operations Suite'));
  console.log(chalk.dim('═'.repeat(60)));
  console.log();
  
  console.log(chalk.bold.yellow('Basic Email Operations:'));
  console.log(chalk.green('  email-send, esend          Send an email'));
  console.log(chalk.green('  email-read, eread          Read recent emails'));
  console.log(chalk.green('  email-get, eget            Get specific email by ID'));
  console.log(chalk.green('  email-delete, edelete      Delete an email'));
  console.log(chalk.green('  email-mark-read, emarkread Mark email as read/unread'));
  console.log(chalk.green('  email-attach, eattach      Send email with attachment'));
  console.log();
  
  console.log(chalk.bold.yellow('Advanced Email Operations:'));
  console.log(chalk.cyan('  email-search, esearch      Search emails with filters'));
  console.log(chalk.cyan('  email-forward, eforward    Forward an email'));
  console.log(chalk.cyan('  email-reply, ereply        Reply to an email'));
  console.log(chalk.cyan('  email-stats, estats        Get email statistics'));
  console.log(chalk.cyan('  email-draft, edraft        Create email draft'));
  console.log(chalk.cyan('  email-schedule, eschedule  Schedule email for later'));
  console.log(chalk.cyan('  email-bulk, ebulk          Send bulk emails'));
  console.log();
  
  console.log(chalk.bold.yellow('Contact Management:'));
  console.log(chalk.magenta('  contact-add, cadd          Add a new contact'));
  console.log(chalk.magenta('  contact-list, clist        List all contacts'));
  console.log(chalk.magenta('  contact-search, csearch    Search contacts'));
  console.log(chalk.magenta('  contact-group, cgroup      Get contacts by group'));
  console.log(chalk.magenta('  contact-update, cupdate    Update contact info'));
  console.log(chalk.magenta('  contact-delete, cdelete    Delete a contact'));
  console.log();
  
  console.log(chalk.bold.blue('Utility Commands:'));
  console.log(chalk.cyan('  list                       Show recent emails'));
  console.log(chalk.cyan('  email-cli                  Show recent emails (main command)'));
  console.log(chalk.cyan('  email-cli update           Update CLI to latest version'));
  console.log();
  
  console.log(chalk.bold.yellow('Usage:'));
  console.log(chalk.blue('  email-cli') + chalk.gray('                   Show recent emails'));
  console.log(chalk.blue('  email-cli update') + chalk.gray('           Update to latest version'));
  console.log(chalk.blue('  email-cli --version') + chalk.gray('        Show version information'));
  console.log(chalk.blue('  email-cli --help') + chalk.gray('           Show this help message'));
  console.log(chalk.blue('  <command> --help') + chalk.gray('           Show help for specific command'));
  console.log();
  
  console.log(chalk.bold.yellow('Quick Start:'));
  console.log(chalk.gray('1. Set up environment variables (see documentation)'));
  console.log(chalk.gray('2. Run: ') + chalk.blue('email-cli --version') + chalk.gray(' to view version'));
  console.log(chalk.gray('3. Use specific commands like: ') + chalk.blue('esend "user@example.com" "Subject" "Body"'));
  console.log();
  
  if (process.platform === 'win32') {
    console.log(chalk.bold.red('🪟 Windows Troubleshooting:'));
    console.log(chalk.yellow('If commands show "path not found":'));
    console.log(chalk.cyan('  npm list -g @0xshariq/email-mcp-server') + chalk.gray('  # Check installation'));
    console.log(chalk.cyan('  where email-send') + chalk.gray('                      # Find command location'));
    console.log(chalk.cyan('  refreshenv') + chalk.gray('                          # Refresh PATH (Chocolatey users)'));
    console.log(chalk.cyan('  npm config get prefix') + chalk.gray('              # Check npm global path'));
    console.log();
  }
}

async function handleUpdate() {
  console.log(chalk.bold.cyan('🔄 Email MCP CLI Updater'));
  console.log(chalk.dim('═'.repeat(40)));
  console.log();
  
  try {
    // Get current version from package.json
    const packagePath = path.join(__dirname, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const currentVersion = packageData.version;
    const packageName = packageData.name;
    
    console.log(chalk.blue('📦 Current version:'), chalk.yellow(currentVersion));
    console.log(chalk.blue('📍 Package name:'), chalk.cyan(packageName));
    console.log();
    
    // Check if globally installed
    console.log(chalk.gray('🔍 Checking installation status...'));
    
    try {
      const npmListOutput = execSync(`npm list -g ${packageName} --depth=0`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      if (npmListOutput.includes(packageName)) {
        console.log(chalk.green('✅ Package is globally installed'));
      } else {
        console.log(chalk.yellow('⚠️  Package might not be globally installed'));
      }
    } catch (listError) {
      console.log(chalk.yellow('⚠️  Could not verify global installation status'));
    }
    
    console.log();
    console.log(chalk.gray('� Fetching latest version from npm...'));
    
    // Fetch latest version from npm
    let latestVersion;
    try {
      const npmViewOutput = execSync(`npm view ${packageName} version`, {
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
      latestVersion = npmViewOutput;
      console.log(chalk.blue('📦 Latest version:'), chalk.yellow(latestVersion));
    } catch (viewError) {
      console.log(chalk.red('❌ Could not fetch latest version from npm'));
      console.log(chalk.yellow('💡 Proceeding with update anyway...'));
      latestVersion = null;
    }
    
    // Check for version differences and potential breaking changes
    if (latestVersion && latestVersion !== currentVersion) {
      console.log();
      const currentMajor = parseInt(currentVersion.split('.')[0]);
      const latestMajor = parseInt(latestVersion.split('.')[0]);
      
      if (latestMajor > currentMajor) {
        // Major version change - show warning
        console.log(chalk.red.bold('⚠️  MAJOR VERSION UPDATE DETECTED!'));
        console.log(chalk.yellow('━'.repeat(50)));
        console.log(chalk.red(`   Current: v${currentVersion} → Latest: v${latestVersion}`));
        console.log(chalk.yellow('   Major version updates may contain breaking changes!'));
        console.log();
        console.log(chalk.bold.yellow('🚨 Potential breaking changes may include:'));
        console.log(chalk.cyan('   • Command syntax changes'));
        console.log(chalk.cyan('   • Environment variable requirements'));
        console.log(chalk.cyan('   • Configuration file format changes'));
        console.log(chalk.cyan('   • Removed or renamed commands'));
        console.log();
        console.log(chalk.bold.blue('📚 It\'s recommended to check the changelog at:'));
        console.log(chalk.cyan(`   https://github.com/0xshariq/email-mcp-server/releases`));
        console.log();
        
        // Ask for user confirmation
        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise((resolve) => {
          rl.question(chalk.yellow('❓ Do you want to continue with the major update? (y/N): '), resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
          console.log(chalk.blue('ℹ️  Update cancelled by user'));
          console.log(chalk.gray('💡 You can update manually when ready:'));
          console.log(chalk.cyan(`   npm install -g ${packageName}@latest`));
          return;
        }
        
        console.log(chalk.green('✅ Proceeding with major version update...'));
        
      } else if (latestMajor === currentMajor) {
        const currentMinor = parseInt(currentVersion.split('.')[1]);
        const latestMinor = parseInt(latestVersion.split('.')[1]);
        
        if (latestMinor > currentMinor) {
          console.log(chalk.blue('ℹ️  Minor version update available'));
          console.log(chalk.gray('   Minor updates typically include new features and improvements'));
        } else {
          console.log(chalk.blue('ℹ️  Patch version update available'));
          console.log(chalk.gray('   Patch updates typically include bug fixes and improvements'));
        }
      }
      
    } else if (latestVersion === currentVersion) {
      console.log(chalk.green('✅ You already have the latest version!'));
      console.log(chalk.gray('💡 No update needed'));
      return;
    }
    
    console.log();
    console.log(chalk.gray('�🚀 Updating to latest version...'));
    console.log();
    
    // Update the package
    const updateCommand = `npm install -g ${packageName}@latest`;
    console.log(chalk.blue('Running:'), chalk.cyan(updateCommand));
    console.log();
    
    const updateProcess = spawn('npm', ['install', '-g', `${packageName}@latest`], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    
    updateProcess.on('close', (code) => {
      console.log();
      if (code === 0) {
        console.log(chalk.green.bold('✅ Update completed successfully!'));
        console.log();
        console.log(chalk.blue('🔍 Verifying installation...'));
        
        try {
          // Get the new version
          const newPackageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          const newVersion = newPackageData.version;
          
          console.log(chalk.blue('📦 Updated version:'), chalk.yellow(newVersion));
          
          if (newVersion !== currentVersion) {
            console.log(chalk.green('🎉 Successfully updated from'), chalk.yellow(currentVersion), chalk.green('to'), chalk.yellow(newVersion));
          } else {
            console.log(chalk.blue('ℹ️  You already have the latest version'));
          }
          
        } catch (err) {
          console.log(chalk.yellow('⚠️  Could not verify new version'));
        }
        
        console.log();
        console.log(chalk.gray('💡 Try running:'), chalk.cyan('email-cli --version'), chalk.gray('to confirm the update'));
        
      } else {
        console.log(chalk.red.bold('❌ Update failed with exit code:'), code);
        console.log();
        console.log(chalk.yellow('💡 Troubleshooting tips:'));
        console.log(chalk.cyan('  • Try running as Administrator/sudo'));
        console.log(chalk.cyan('  • Check your internet connection'));
        console.log(chalk.cyan('  • Verify npm is properly installed'));
        
        if (process.platform === 'win32') {
          console.log(chalk.cyan('  • On Windows: Run PowerShell as Administrator'));
          console.log(chalk.cyan('  • Add npm to PATH: [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + (npm config get prefix), "Machine")'));
          console.log(chalk.cyan('  • Restart computer after PATH changes'));
        } else {
          console.log(chalk.cyan('  • On Unix: Try with sudo npm install -g'));
        }
      }
    });
    
    updateProcess.on('error', (error) => {
      console.log();
      console.error(chalk.red.bold('❌ Update error:'), error.message);
      console.log();
      console.log(chalk.yellow('💡 Manual update instructions:'));
      console.log(chalk.cyan(`  npm install -g ${packageName}@latest`));
    });
    
  } catch (error) {
    console.error(chalk.red.bold('❌ Update failed:'), error.message);
    console.log();
    console.log(chalk.yellow('💡 Try manual update:'));
    console.log(chalk.cyan(`  npm install -g @0xshariq/email-mcp-server@latest`));
  }
}

// Always run main
main().catch((error) => {
  console.error(chalk.red.bold('❌ Fatal error:'), error.message);
  process.exit(1);
});

// --------------------- Setup helper functions ---------------------

async function detectAndVerifySMTP(emailUser, emailPass) {
  // Simple heuristic: try MX lookup for domain, then common smtp hosts
  try {
    const domain = emailUser.split('@')[1];
    const mxRecords = await dns.resolveMx(domain).catch(() => []);

    const candidates = [];
    // From MX
    for (const mx of mxRecords) {
      candidates.push({ host: mx.exchange, port: 587, secure: false });
      candidates.push({ host: mx.exchange, port: 465, secure: true });
    }

    // Common providers
    candidates.push({ host: `smtp.${domain}`, port: 587, secure: false });
    candidates.push({ host: `mail.${domain}`, port: 587, secure: false });
    candidates.push({ host: `smtp.${domain}`, port: 465, secure: true });
    candidates.push({ host: 'smtp.gmail.com', port: 587, secure: false });
    candidates.push({ host: 'smtp.gmail.com', port: 465, secure: true });

    // Try candidates sequentially with quick timeout
    for (const c of candidates) {
      try {
        const transport = nodemailer.createTransport({
          host: c.host,
          port: c.port,
          secure: c.secure,
          auth: { user: emailUser, pass: emailPass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
          greetingTimeout: 5000
        });

        // verify
        const ok = await transport.verify().catch(() => false);
        if (ok) {
          return { ok: true, host: c.host, port: c.port, secure: c.secure };
        }
      } catch (e) {
        // try next
      }
    }

    return { ok: false };
  } catch (err) {
    return { ok: false };
  }
}

function persistEnvLocally(envObj) {
  // Write to ~/.email-mcp-env (user-scoped) and .env in project dir if available
  try {
    const home = os.homedir();
    const userFile = path.join(home, '.email-mcp-env');
    // Read existing and merge
    let existing = '';
    if (fs.existsSync(userFile)) existing = fs.readFileSync(userFile, 'utf8');
    const current = existing.split(/\r?\n/).filter(Boolean);
    const map = {};
    current.forEach(line => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) map[m[1]] = m[2];
    });
    Object.entries(envObj).forEach(([k, v]) => map[k] = v);
    const lines = Object.entries(map).map(([k, v]) => `${k}=${v}`);
    const tmp = userFile + '.tmp';
    fs.writeFileSync(tmp, lines.join('\n') + '\n', { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(tmp, userFile);

    // Also write local .env if present in package dir
    const localEnv = path.join(__dirname, '.env');
    if (!fs.existsSync(localEnv)) {
      fs.writeFileSync(localEnv, lines.join('\n') + '\n', { encoding: 'utf8', mode: 0o600 });
    } else {
      // merge keys into local .env
      const existingLocal = fs.readFileSync(localEnv, 'utf8');
      const localLines = existingLocal.split(/\r?\n/).filter(Boolean);
      const localMap = {};
      localLines.forEach(line => {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m) localMap[m[1]] = m[2];
      });
      Object.entries(envObj).forEach(([k, v]) => localMap[k] = v);
      const updated = Object.entries(localMap).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
      const tmpLocal = localEnv + '.tmp';
      fs.writeFileSync(tmpLocal, updated, { encoding: 'utf8', mode: 0o600 });
      fs.renameSync(tmpLocal, localEnv);
    }

    return true;
  } catch (e) {
    return false;
  }
}

async function handleSetup(args) {
  const rl = readline.createInterface({ input, output });
  try {
    // Parse flags
    const force = args.includes('--force') || args.includes('-f');
    const useKeychain = args.includes('--use-keychain');
    const testSendFlag = args.includes('--test-send');
  // Default: visible password (user requested unmasked by default). Only mask when --mask is provided.
  const maskFlag = args.includes('--mask');

    console.log(chalk.bold.cyan('\n🔧 Email CLI - Interactive Setup'));

  const emailUser = await rl.question('Email address (EMAIL_USER): ');
  const emailPass = maskFlag ? await readPassword('Password / App Password (EMAIL_PASS): ') : await rl.question('Password / App Password (EMAIL_PASS): ');

    console.log(chalk.gray('🔍 Attempting to auto-detect SMTP settings...'));
    const detected = await detectAndVerifySMTP(emailUser, emailPass);

    if (detected.ok) {
      console.log(chalk.green('✅ SMTP verified'));
      console.log(chalk.cyan(`Host: ${detected.host} Port: ${detected.port} Secure: ${detected.secure}`));

      const envs = {
        EMAIL_USER: emailUser,
        EMAIL_PASS: emailPass,
        SMTP_HOST: detected.host,
        SMTP_PORT: String(detected.port),
        SMTP_SECURE: String(detected.secure)
      };

      const persisted = persistEnvLocally(envs);
      if (persisted) {
        console.log(chalk.green('✅ Environment saved to ~/.email-mcp-env and local .env (if missing)'));
      } else {
        console.log(chalk.yellow('⚠️  Could not persist environment automatically. Please add the following to your shell or .env:'));
        Object.entries(envs).forEach(([k, v]) => console.log(`${k}=${v}`));
      }

      // Offer keychain storage if requested and available
      if (useKeychain) {
        try {
          const keytar = await import('keytar').then(m => m.default || m).catch(() => null);
          if (keytar && keytar.setPassword) {
            await keytar.setPassword('email-mcp-server', emailUser, emailPass);
            console.log(chalk.green('🔐 Password stored in OS keychain (keytar)'));
            // Remove plain text from local files if we wrote them
          } else {
            console.log(chalk.yellow('⚠️  keytar not available - password not stored in keychain'));
          }
        } catch (e) {
          console.log(chalk.yellow('⚠️  Could not store password in keychain:'), e.message);
        }
      }

      // Optionally send a tiny test email if requested
      if (testSendFlag) {
        const to = await rl.question('Send test email to (recipient): ');
        try {
          await sendTestEmail(envs, to);
          console.log(chalk.green('✅ Test email sent successfully'));
        } catch (e) {
          console.log(chalk.red('❌ Test email failed:'), e.message);
        }
      }
    } else {
      console.log(chalk.yellow('⚠️  Auto-detection failed.')); 
      console.log(chalk.yellow('Saving EMAIL_USER and EMAIL_PASS locally; rerun setup with --force after manual config.'));

      const envs = { EMAIL_USER: emailUser, EMAIL_PASS: emailPass };
      const persisted = persistEnvLocally(envs);
      if (persisted) console.log(chalk.green('✅ EMAIL_USER and EMAIL_PASS saved to ~/.email-mcp-env'));
      else console.log(chalk.red('❌ Could not persist credentials automatically. Please create a .env file manually.'));
    }

  } finally {
    rl.close();
  }
}

async function handleDiagnose(args) {
  // Usage: email-cli diagnose user@example.com
  const target = args[0];
  if (!target || !target.includes('@')) {
    console.log(chalk.yellow('Usage: email-cli diagnose user@example.com'));
    return;
  }
  const domain = target.split('@')[1];
  console.log(chalk.bold.cyan(`\n🔎 Diagnosing ${domain}`));
  try {
    const mx = await dns.resolveMx(domain).catch(() => []);
    if (mx.length === 0) {
      console.log(chalk.yellow('No MX records found for domain')); 
    } else {
      console.log(chalk.green(`MX records (${mx.length}):`));
      mx.forEach(m => console.log(`  ${m.exchange} (priority ${m.priority})`));
    }

    const ports = [25, 587, 465, 2525];
    for (const hostEntry of (mx.length ? mx.map(m=>m.exchange) : ["smtp."+domain, "mail."+domain])) {
      console.log(chalk.dim(`\nProbing ${hostEntry}...`));
      for (const p of ports) {
        const ok = await probePort(hostEntry, p, 4000).catch(()=>false);
        console.log(ok ? chalk.green(`  Port ${p}: open`) : chalk.red(`  Port ${p}: closed/filtered`));
      }
    }
    console.log();
  } catch (e) {
    console.log(chalk.red('Diagnosis error:'), e.message);
  }
}

async function probePort(host, port, timeout = 3000) {
  try {
    const netModule = await import('net').then(m => m.default || m);
    return await new Promise((resolve) => {
      const socket = netModule.createConnection({ host, port, timeout }, () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('error', () => { try { socket.destroy(); } catch(_){}; resolve(false); });
      socket.on('timeout', () => { try { socket.destroy(); } catch(_){}; resolve(false); });
    });
  } catch (e) {
    return false;
  }
}

async function readPassword(prompt) {
  // Minimal masked password entry for interactive terminals
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let password = '';
    function onData(ch) {
      ch = String(ch);
      switch (ch) {
        case '\r':
        case '\n':
          stdout.write('\n');
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          resolve(password);
          break;
        case '\u0003':
          // Ctrl-C
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          resolve('');
          break;
        case '\u0008':
        case '\u007f':
          // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write('\b \b');
          }
          break;
        default:
          password += ch;
          stdout.write('*');
          break;
      }
    }
    stdin.on('data', onData);
  });
}

async function sendTestEmail(envs, to) {
  if (!to || !to.includes('@')) throw new Error('Invalid recipient for test email');
  const transport = nodemailer.createTransport({
    host: envs.SMTP_HOST || process.env.SMTP_HOST,
    port: Number(envs.SMTP_PORT || process.env.SMTP_PORT || 587),
    secure: (envs.SMTP_SECURE === 'true') || (process.env.SMTP_SECURE === 'true') || false,
    auth: { user: envs.EMAIL_USER || process.env.EMAIL_USER, pass: envs.EMAIL_PASS || process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false }
  });

  return new Promise((resolve, reject) => {
    transport.sendMail({
      from: envs.EMAIL_USER || process.env.EMAIL_USER,
      to,
      subject: 'Email MCP Server - Test Message',
      text: 'This is a test message generated by email-cli setup'
    }, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}


// =============================================================================
// BASIC EMAIL OPERATIONS
// =============================================================================

// Send Email - send an email to recipients
// Aliases: esend.js, send-email.js, send.js

// Read Emails - read recent emails from inbox  
// Aliases: eread.js, read-emails.js, read.js

// Get Email - get specific email by ID
// Aliases: eget.js, get-email.js, get.js

// Delete Email - delete an email permanently
// Aliases: edelete.js, delete-email.js, delete.js

// Mark Read - mark email as read/unread
// Aliases: emarkread.js, mark-read.js, mark.js

// Send with Attachment - send email with file attachments
// Aliases: eattach.js, attach-email.js, attach.js

// =============================================================================
// ADVANCED EMAIL OPERATIONS  
// =============================================================================

// Search Emails - search emails with advanced filters
// Aliases: esearch.js, search-emails.js, search.js

// Forward Email - forward an existing email
// Aliases: eforward.js, forward-email.js, forward.js

// Reply Email - reply to an existing email  
// Aliases: ereply.js, reply-email.js, reply.js

// Email Statistics - get account statistics
// Aliases: estats.js, email-stats.js, stats.js

// Draft Email - create email draft
// Aliases: edraft.js, draft-email.js, draft.js

// Schedule Email - schedule email for later sending
// Aliases: eschedule.js, schedule-email.js, schedule.js

// Bulk Send - send multiple emails at once
// Aliases: ebulk.js, bulk-send.js, bulk.js

// =============================================================================
// CONTACT MANAGEMENT
// =============================================================================

// Add Contact - add new contact to address book
// Aliases: cadd.js, add-contact.js

// List Contacts - list all contacts
// Aliases: clist.js, list-contacts.js, contacts.js

// Search Contacts - search contacts by name/email
// Aliases: csearch.js, search-contacts.js

// Contact Group - get contacts by group
// Aliases: cgroup.js, contact-group.js, group.js

// Update Contact - update existing contact
// Aliases: cupdate.js, update-contact.js

// Delete Contact - delete a contact
// Aliases: cdelete.js, delete-contact.js

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
Basic Email Operations:
  esend.js "user@example.com" "Hello" "Test message"
  eread.js 5
  eget.js 12345
  edelete.js 12345
  emarkread.js 12345 true
  eattach.js "user@example.com" "Report" "See attached" "/path/to/file.pdf"

Advanced Operations:
  esearch.js --from "boss@company.com" --seen false
  eforward.js 12345 "colleague@company.com" "Please review"
  ereply.js 12345 "Thank you for the update"
  estats.js
  edraft.js "client@example.com" "Proposal" "Draft content"
  eschedule.js "team@company.com" "Reminder" "Meeting tomorrow" "2024-12-31T09:00:00Z"
  ebulk.js emails.json

Contact Management:
  cadd.js "John Doe" "john@company.com" "Work"
  clist.js
  csearch.js "john"
  cgroup.js "Work"
  cupdate.js contact_123 --name "John Smith"
  cdelete.js contact_123

Environment Setup:
  1. cp .env.example .env
  2. Configure your email settings in .env
  3. pnpm run build
  4. Use any command above

Help:
  Any command supports --help flag for detailed usage
  Example: esend.js --help
*/