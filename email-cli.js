#!/usr/bin/env node

import { spawn, execSync, spawnSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import nodemailer from 'nodemailer';
import dns from 'dns/promises';
import fs from 'fs';
import os from 'os';
import readline from 'readline';

// Basic mapping of command name -> relative path under /bin
const commands = {
  // basic
  'email-delete': 'basic/email-delete.js',
  'email-get': 'basic/email-get.js',
  'email-mark-read': 'basic/email-mark-read.js',
  'email-read': 'basic/email-read.js',
  'email-send': 'basic/email-send.js',
  'list': 'basic/list.js',
  // advanced
  'email-attach': 'advanced/email-attach.js',
  'email-bulk': 'advanced/email-bulk.js',
  'email-draft': 'advanced/email-draft.js',
  'email-forward': 'advanced/email-forward.js',
  'email-reply': 'advanced/email-reply.js',
  'email-schedule': 'advanced/email-schedule.js',
  'email-search': 'advanced/email-search.js',
  'email-stats': 'advanced/email-stats.js',
  // contacts
  'contact-add': 'contacts/contact-add.js',
  'contact-delete': 'contacts/contact-delete.js',
  'contact-group': 'contacts/contact-group.js',
  'contact-list': 'contacts/contact-list.js',
  'contact-search': 'contacts/contact-search.js',
  'contact-update': 'contacts/contact-update.js'
};

// basic stdin/stdout helpers used by setup
const input = process.stdin;
const output = process.stdout;
async function main() {
  const args = process.argv.slice(2);
  const invoked = path.basename(process.argv[1] || '');
  const invokedName = invoked.replace(/\.js$/, '');

  // Helper to spawn a bin script
  function runScript(relPath, scriptArgs = []) {
    const scriptPath = path.join(__dirname, 'bin', relPath);
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red.bold(`❌ Script not found: ${scriptPath}`));
      process.exit(1);
    }
    process.chdir(__dirname);
    const nodeExecutable = process.platform === 'win32' ? 'node.exe' : 'node';
    const child = spawn(nodeExecutable, [scriptPath, ...scriptArgs], {
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, NODE_PATH: __dirname },
      shell: process.platform === 'win32'
    });
    child.on('close', (code) => process.exit(code || 0));
    child.on('error', (err) => { console.error(chalk.red.bold('❌ Error:'), err.message); process.exit(1); });
  }

  // If invoked directly as a command alias (email-send, esend, etc.)
  if (commands[invokedName] && commands[invokedName] !== null) {
    // run the mapped bin script with args
    runScript(commands[invokedName], args);
    return;
  }

  // If invoked as the top-level CLI (email-cli), handle subcommands
  if (invokedName === 'email-cli' || invokedName === 'email-cli.js') {
    const sub = args[0];
    const subArgs = args.slice(1);

    if (!sub || sub === '--help' || sub === '-h' || sub === 'help') {
      showUsage();
      return;
    }

    if (sub === '--version' || sub === '-v') {
      showVersion();
      return;
    }

    if (sub === 'setup') {
      await handleSetup(subArgs);
      return;
    }

    if (sub === 'update') {
      await handleUpdate();
      return;
    }

    // allow delegating to any command name after email-cli, e.g. `email-cli email-send ...`
    if (commands[sub]) {
      runScript(commands[sub], subArgs);
      return;
    }

    // default: show usage
    console.error(chalk.red.bold(`❌ Unknown subcommand: ${sub}`));
    console.log(chalk.yellow('💡 Run `email-cli --help` to see available commands'));
    showUsage();
    process.exit(1);
  }

  // If none matched, check if first arg is a command (node email-cli.js email-send ...)
  if (args[0] && commands[args[0]]) {
    runScript(commands[args[0]], args.slice(1));
    return;
  }

  // Fallback: show usage
  showUsage();
}


function showVersion() {
  // Read version from package.json
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
  console.log(chalk.bold.cyan('📧 Email MCP CLI') + chalk.gray(' - ') + chalk.bold.white('Email Operations'));
  console.log();

  // Concise subcommands list (no long descriptions or examples)
  console.log(chalk.bold.yellow('Subcommands:'));
  console.log(chalk.green('  setup') + chalk.gray('                Configure EMAIL_USER / EMAIL_PASS and SMTP settings'));
  console.log(chalk.green('  update') + chalk.gray('               Update CLI to latest version'));
  console.log(chalk.green('  --version, -v') + chalk.gray('         Show version information'));
  console.log(chalk.green('  --help, -h') + chalk.gray('            Show this help message'));
  console.log();

  console.log(chalk.bold.yellow('Global flags:'));
  console.log(chalk.cyan('  --profile <name>') + chalk.gray('    Use named profile (optional)'));
  console.log(chalk.cyan('  --ci, --non-interactive') + chalk.gray(' Run in non-interactive (CI) mode'));
  console.log(chalk.cyan('  --email-user <user>') + chalk.gray('  Provide EMAIL_USER for non-interactive setup'));
  console.log(chalk.cyan('  --email-pass <pass>') + chalk.gray('  Provide EMAIL_PASS for non-interactive setup'));
  console.log();

  console.log(chalk.bold.yellow('Usage:'));
  console.log(chalk.blue('  email-cli setup') + chalk.gray('         Run interactive setup to configure credentials'));
  console.log(chalk.blue('  email-cli update') + chalk.gray('        Update to latest version'));
  console.log(chalk.blue('  email-cli --version') + chalk.gray('     Show version info'));
  console.log(chalk.blue('  email-cli --help') + chalk.gray('        Show this help'));
  console.log(chalk.blue('  email-cli <command> --help') + chalk.gray('  Show help for a specific command'));
  console.log();
}

// Show styled help by invoking each command's own --help in the bin folder.
function showStyledCommandsHelp() {
  console.log();
  console.log(chalk.bold.cyan('📚 Commands (short list)'));
  console.log(chalk.dim('Run any command with --help for detailed usage.'));
  console.log();

  // Group commands by their mapped path prefix
  const groups = {
    'basic': [],
    'advanced': [],
    'contacts': [],
    'utility': []
  };

  Object.entries(commands).forEach(([name, rel]) => {
    if (!rel) return;
    if (rel.startsWith('basic/')) groups.basic.push(name);
    else if (rel.startsWith('advanced/')) groups.advanced.push(name);
    else if (rel.startsWith('contacts/')) groups.contacts.push(name);
    else groups.utility.push(name);
  });

  if (groups.basic.length) {
    console.log(chalk.bold.yellow('Basic:'));
    console.log('  ' + groups.basic.join(', '));
    console.log();
  }
  if (groups.advanced.length) {
    console.log(chalk.bold.yellow('Advanced:'));
    console.log('  ' + groups.advanced.join(', '));
    console.log();
  }
  if (groups.contacts.length) {
    console.log(chalk.bold.yellow('Contacts:'));
    console.log('  ' + groups.contacts.join(', '));
    console.log();
  }
  if (groups.utility.length) {
    console.log(chalk.bold.yellow('Utility:'));
    console.log('  ' + groups.utility.join(', '));
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

async function removePasswordFromFiles(emailUser) {
  // Remove EMAIL_PASS entries from ~/.email-mcp-env and local .env
  const home = os.homedir();
  const userFile = path.join(home, '.email-mcp-env');
  try {
    if (fs.existsSync(userFile)) {
      const content = fs.readFileSync(userFile, 'utf8');
      const lines = content.split(/\r?\n/).filter(Boolean).map(line => {
        if (line.startsWith('EMAIL_PASS=')) return null;
        return line;
      }).filter(Boolean);
      const tmp = userFile + '.tmp';
      fs.writeFileSync(tmp, lines.join('\n') + '\n', { encoding: 'utf8', mode: 0o600 });
      fs.renameSync(tmp, userFile);
    }

    const localEnv = path.join(__dirname, '.env');
    if (fs.existsSync(localEnv)) {
      const content = fs.readFileSync(localEnv, 'utf8');
      const lines = content.split(/\r?\n/).filter(Boolean).map(line => {
        if (line.startsWith('EMAIL_PASS=')) return null;
        return line;
      }).filter(Boolean);
      const tmpLocal = localEnv + '.tmp';
      fs.writeFileSync(tmpLocal, lines.join('\n') + '\n', { encoding: 'utf8', mode: 0o600 });
      fs.renameSync(tmpLocal, localEnv);
    }

    return true;
  } catch (e) {
    throw e;
  }
}

async function handleSetup(args) {
  const rl = readline.createInterface({ input, output });
  try {
    // Parse flags
    const force = args.includes('--force') || args.includes('-f');
    const useKeychain = args.includes('--use-keychain');
    const testSendFlag = args.includes('--test-send');
    const maskFlag = args.includes('--mask');
    const nonInteractive = args.includes('--ci') || args.includes('--non-interactive');
    // parse profile
    let profile = null;
    const pIndex = args.indexOf('--profile');
    if (pIndex !== -1 && args[pIndex+1]) profile = args[pIndex+1];

    // allow passing credentials directly for CI/non-interactive
    let emailUserArg = null;
    let emailPassArg = null;
    const euIndex = args.indexOf('--email-user');
    if (euIndex !== -1 && args[euIndex+1]) emailUserArg = args[euIndex+1];
    const epIndex = args.indexOf('--email-pass');
    if (epIndex !== -1 && args[epIndex+1]) emailPassArg = args[epIndex+1];

    console.log(chalk.bold.cyan('\n🔧 Email CLI - Setup'));

    let emailUser;
    let emailPass;

    if (nonInteractive) {
      // In CI mode, prefer explicit args then env vars
      emailUser = emailUserArg || process.env.EMAIL_USER;
      emailPass = emailPassArg || process.env.EMAIL_PASS;
      if (!emailUser || !emailPass) {
        console.error(chalk.red('❌ Non-interactive mode requires --email-user and --email-pass or corresponding environment variables'));
        return;
      }
    } else {
      // Interactive flow
      emailUser = emailUserArg || await rl.question('Email address (EMAIL_USER): ');
      emailPass = emailPassArg || (maskFlag ? await readPassword('Password / App Password (EMAIL_PASS): ') : await rl.question('Password / App Password (EMAIL_PASS): '));
    }

  console.log(chalk.gray('🔍 Attempting to auto-detect SMTP settings...'));
  const detected = await detectAndVerifySMTP(emailUser, emailPass);

    if (detected.ok) {
      console.log(chalk.green('✅ SMTP verified'));
      console.log(chalk.cyan(`Host: ${detected.host} Port: ${detected.port} Secure: ${detected.secure}`));

      // If user requests keychain storage, attempt to store password in OS keychain first.
      let passwordStoredInKeychain = false;
      let keytarModule = null;
      if (useKeychain) {
        try {
          keytarModule = await import('keytar').then(m => m.default || m).catch(() => null);
          if (keytarModule && keytarModule.setPassword) {
            await keytarModule.setPassword('email-mcp-server', emailUser, emailPass);
            passwordStoredInKeychain = true;
            console.log(chalk.green('🔐 Password stored in OS keychain (keytar)'));
          } else {
            console.log(chalk.yellow('⚠️  keytar not available - password not stored in keychain'));
          }
        } catch (e) {
          console.log(chalk.yellow('⚠️  Could not store password in keychain:'), e.message);
        }
      }

      // Prepare envs to persist. If password stored in keychain, do not write EMAIL_PASS to disk.
      const envs = {
        EMAIL_USER: emailUser,
        SMTP_HOST: detected.host,
        SMTP_PORT: String(detected.port),
        SMTP_SECURE: String(detected.secure)
      };
      if (!passwordStoredInKeychain) envs.EMAIL_PASS = emailPass;

      const persisted = persistEnvLocally(envs);
      if (persisted) {
        console.log(chalk.green('✅ Environment saved to ~/.email-mcp-env and local .env (if missing)'));
      } else {
        console.log(chalk.yellow('⚠️  Could not persist environment automatically. Please add the following to your shell or .env:'));
        Object.entries(envs).forEach(([k, v]) => console.log(`${k}=${v}`));
      }

      // If we stored the password in keychain, try to scrub any existing EMAIL_PASS entries from disk.
      if (passwordStoredInKeychain) {
        try {
          await removePasswordFromFiles(emailUser);
          console.log(chalk.green('🧹 Removed plaintext EMAIL_PASS from local config files'));
        } catch (e) {
          console.log(chalk.yellow('⚠️  Could not fully scrub EMAIL_PASS from disk:'), e.message);
        }
      }

      // Optionally send a tiny test email if requested
      if (testSendFlag) {
        const to = nonInteractive ? process.env.TEST_SEND_TO : await rl.question('Send test email to (recipient): ');
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
        // If keychain requested, try storing password there and persist without EMAIL_PASS
        let stored = false;
        if (useKeychain) {
          try {
            const keytarModule = await import('keytar').then(m => m.default || m).catch(() => null);
            if (keytarModule && keytarModule.setPassword) {
              await keytarModule.setPassword('email-mcp-server', emailUser, emailPass);
              stored = true;
              console.log(chalk.green('🔐 Password stored in OS keychain (keytar)'));
            }
          } catch (e) {
            // ignore
          }
        }

        const envs = { EMAIL_USER: emailUser };
        if (!stored) envs.EMAIL_PASS = emailPass;
        const persisted = persistEnvLocally(envs);
        if (persisted) console.log(chalk.green('✅ EMAIL_USER saved to ~/.email-mcp-env'));
        else console.log(chalk.red('❌ Could not persist credentials automatically. Please create a .env file manually.'));
    }

  } finally {
    rl.close();
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