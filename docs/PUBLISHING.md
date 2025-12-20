# Publishing Guide

## Package Structure

This package is published as **ONE unified package** containing:

- **CLI Tool** (40+ commands) - `dist/cli/`
- **MCP Server** - `dist/server/`
- **Shared Library** - `dist/src/lib/`

## Pre-Publishing Checklist

### 1. Update Version
```bash
# Update version in package.json
npm version patch  # 1.7.1 → 1.7.2
npm version minor  # 1.7.1 → 1.8.0
npm version major  # 1.7.1 → 2.0.0
```

### 2. Clean Build
```bash
# Clean previous builds
pnpm run clean

# Fresh build
pnpm run build

# Verify build output
ls -la dist/
```

### 3. Test Locally
```bash
# Test CLI commands
node dist/cli/index.js --help
node dist/cli/index.js send --help

# Test MCP server
node dist/server/index.js

# Test library import
node -e "import('./dist/src/lib/email.js').then(m => console.log(Object.keys(m)))"
```

### 4. Update Documentation
- [ ] Update CHANGELOG.md
- [ ] Update README.md with new features
- [ ] Check all docs/ files are up to date
- [ ] Verify CLI_REFERENCE.md is current

### 5. Check package.json

Verify these fields:
```json
{
  "name": "@0xshariq/email-mcp-server",
  "version": "X.X.X",
  "description": "A MCP Server + CLI Tool that perform email operations",
  "main": "./dist/src/lib/email.js",
  "types": "./dist/src/lib/email.d.ts",
  "bin": {
    "email-cli": "./dist/cli/index.js",
    // ... all other aliases
  },
  "files": [
    "dist/",
    "README.md",
    "LICENSE",
    "docs/"
  ]
}
```

### 6. Test Package Locally
```bash
# Pack the package
npm pack

# Install locally in a test directory
cd /tmp/test-install
npm install /path/to/email-mcp-server-X.X.X.tgz

# Test commands
email-cli --help
email-cli --version
```

## Publishing Steps

### First Time Setup
```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Publish to npm

#### Dry Run
```bash
# See what will be published
npm publish --dry-run
```

#### Publish as Public Package
```bash
# Publish to npm registry
npm publish --access public

# Or with pnpm
pnpm publish --access public
```

#### Publish Beta/Pre-release
```bash
# Update version with pre-release tag
npm version 2.0.0-beta.1

# Publish with tag
npm publish --tag beta
```

## Post-Publishing

### 1. Verify Publication
```bash
# Check on npm
npm view @0xshariq/email-mcp-server

# Install in fresh environment
npx @0xshariq/email-mcp-server@latest --version
```

### 2. Tag Git Release
```bash
# Tag the release
git tag v2.0.0
git push origin v2.0.0

# Create GitHub release
gh release create v2.0.0 --notes "Release notes here"
```

### 3. Update Documentation
- Update GitHub README
- Update npm package page
- Announce on social media/blog

## Package Distribution

Users can install via:

```bash
# Latest version
npm install -g @0xshariq/email-mcp-server

# Specific version
npm install -g @0xshariq/email-mcp-server@2.0.0

# Beta/pre-release
npm install -g @0xshariq/email-mcp-server@beta
```

## Files Included in Package

The `files` field in package.json controls what's published:

```
dist/
├── cli/
│   ├── index.js
│   ├── commands.js
│   └── utils.js
├── server/
│   └── index.js
└── src/
    └── lib/
        └── email.js
```

Plus:
- README.md
- LICENSE
- docs/
- package.json

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.7.1 → 1.7.2): Bug fixes, documentation
- **Minor** (1.7.1 → 1.8.0): New features, backward compatible
- **Major** (1.7.1 → 2.0.0): Breaking changes

## Automation (Optional)

### GitHub Actions Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm run build
      
      - name: Publish
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Permission Denied
```bash
# Check npm permissions
npm access list packages

# Update package access
npm access public @0xshariq/email-mcp-server
```

### Version Already Exists
```bash
# Increment version
npm version patch

# Or manually update package.json version
```

### Build Errors
```bash
# Clean and rebuild
pnpm run clean
pnpm run build

# Check TypeScript errors
npx tsc --noEmit
```

### CLI Commands Not Working After Install
```bash
# Check bin field in package.json
# Ensure shebang in dist/cli/index.js: #!/usr/bin/env node
# Verify file permissions: chmod +x dist/cli/index.js
```

## Support

For publishing issues:
- npm support: https://www.npmjs.com/support
- GitHub Issues: https://github.com/0xshariq/email-mcp-server/issues

---

**Current Package:** `@0xshariq/email-mcp-server`  
**Registry:** https://www.npmjs.com/package/@0xshariq/email-mcp-server
