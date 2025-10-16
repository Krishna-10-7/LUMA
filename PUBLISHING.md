# Publishing LumaJS to NPM

## Prerequisites

1. **NPM Account**: Create account at https://npmjs.com
2. **NPM Login**: Run `npm login` in terminal
3. **GitHub Repository** (optional but recommended): Create repo at https://github.com/lumajs/core

## Pre-Publish Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Version bumped in `package.json`
- [ ] `README.md` is up to date
- [ ] `CHANGELOG.md` created with version notes
- [ ] License file exists (MIT)
- [ ] No sensitive files in package (check with `npm pack --dry-run`)

## Version Management

LumaJS follows Semantic Versioning (SemVer):

- **0.1.0** - Initial release (Step 1: Core Reactivity)
- **0.2.0** - Step 2: Animation Engine
- **0.3.0** - Step 3: 3D Integration
- **1.0.0** - Step 4: Production ready with full features

### Bump version:

```bash
# Patch (0.1.0 → 0.1.1) - Bug fixes
npm version patch

# Minor (0.1.0 → 0.2.0) - New features
npm version minor

# Major (0.1.0 → 1.0.0) - Breaking changes
npm version major
```

## Publishing Steps

### 1. Build the package

```bash
npm run build
```

This creates:
- `dist/luma.esm.js` - ES Module
- `dist/luma.cjs.js` - CommonJS
- `dist/luma.umd.js` - UMD (browser)
- Minified versions of all above

### 2. Test the package locally

```bash
# Pack without publishing
npm pack

# This creates @lumajs-core-0.1.0.tgz
# Test installation in another project:
npm install /path/to/@lumajs-core-0.1.0.tgz
```

### 3. Publish to NPM

```bash
# For scoped packages (@lumajs/core), first publish needs --access public
npm publish --access public

# Future updates (after first publish)
npm publish
```

### 4. Verify publication

```bash
# Check on npm
npm info @lumajs/core

# Install in test project
npm install @lumajs/core
```

## Post-Publish

1. **Tag release on GitHub**:
```bash
git tag v0.1.0
git push origin v0.1.0
```

2. **Create GitHub Release**: Add release notes at https://github.com/lumajs/core/releases

3. **Announce**:
   - Twitter/X
   - Reddit (r/javascript, r/webdev)
   - Dev.to
   - Hacker News (Show HN)

## Package Structure

What gets published (as defined in `package.json` "files"):

```
@lumajs/core/
├── dist/               # Built files (ESM, CJS, UMD)
├── src/                # Source code
├── README.md           # Documentation
├── LICENSE             # MIT License
└── package.json        # Package metadata
```

What gets excluded (via `.npmignore`):
- examples/
- tests/
- rollup.config.js
- Development configs

## Installation for Users

After publishing, users can install via:

```bash
# NPM
npm install @lumajs/core

# Yarn
yarn add @lumajs/core

# PNPM
pnpm add @lumajs/core
```

### Usage Examples

**ES Modules (Vite, Webpack, etc.)**:
```javascript
import Luma from '@lumajs/core';

Luma.mount('#app', {
  state: { count: 0 }
});
```

**CommonJS (Node.js)**:
```javascript
const Luma = require('@lumajs/core');
```

**Browser (CDN)**:
```html
<script src="https://unpkg.com/@lumajs/core"></script>
<script>
  Luma.mount('#app', { state: { count: 0 } });
</script>
```

## Unpublishing

**Warning**: Unpublishing is permanent and breaks dependents!

```bash
# Unpublish specific version (within 72 hours)
npm unpublish @lumajs/core@0.1.0

# Deprecate instead (preferred)
npm deprecate @lumajs/core@0.1.0 "Please upgrade to 0.2.0"
```

## Troubleshooting

### "Package name already exists"

- Change name in `package.json`
- Use scoped name: `@yourname/lumajs`

### "You must verify your email"

- Check NPM account email
- Verify before publishing

### "403 Forbidden"

- Not logged in: `npm login`
- No access to scope: Use `--access public` for first publish

### Build fails

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Continuous Deployment (Future)

Set up GitHub Actions for automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to NPM
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
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Support

- **Issues**: https://github.com/lumajs/core/issues
- **Discussions**: https://github.com/lumajs/core/discussions
- **Email**: support@lumajs.dev (set up if needed)

---

**Ready to publish?**

```bash
npm run build && npm publish --access public
```

🎉 Welcome to the npm registry!
