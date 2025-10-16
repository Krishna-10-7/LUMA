# Changelog

All notable changes to LumaJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned for Step 2 (v0.2.0)
- Animation engine with scroll triggers
- Hover and click micro-interactions
- Time-based animations
- Transition directives

### Planned for Step 3 (v0.3.0)
- 3D scene management API
- Declarative 3D objects
- WebGL integration
- 3D reactive bindings

## [0.1.0] - 2025-01-16

### Added (Step 1: Core Reactivity)
- **Reactive System**: Fine-grained reactivity using Proxy-based tracking
- **Core Directives**:
  - `l-text`: Bind text content to reactive state
  - `l-html`: Bind innerHTML to reactive state
  - `l-show`: Conditional rendering (show/hide)
  - `l-model`: Two-way data binding for inputs
  - `l-on:*`: Event listeners (click, input, keydown, etc.)
  - `l-bind:*`: Dynamic attribute binding
- **API Methods**:
  - `Luma.mount()`: Mount reactive apps to DOM elements
  - `Luma.reactive()`: Create reactive objects
  - `Luma.effect()`: Define reactive effects
- **Package Features**:
  - ESM, CJS, and UMD builds
  - TypeScript definitions
  - Zero dependencies
  - ~6KB minified + gzipped
- **Examples**:
  - Counter demo
  - Todo list demo
  - Form binding demo
  - Professional showcase website
- **Documentation**:
  - Comprehensive README
  - Publishing guide
  - MIT License

### Technical Details
- Built with Rollup for optimized bundles
- Supports modern browsers (Proxy support required)
- Fine-grained dependency tracking
- Minimal DOM updates
- No virtual DOM overhead

### Browser Support
- Chrome 49+
- Firefox 18+
- Safari 10+
- Edge 12+

---

## Release Schedule

- **v0.1.0** (Current): Core Reactivity ✅
- **v0.2.0** (Q1 2025): Animation Engine
- **v0.3.0** (Q2 2025): 3D Integration
- **v1.0.0** (Q3 2025): Production Release

---

[Unreleased]: https://github.com/lumajs/core/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lumajs/core/releases/tag/v0.1.0
