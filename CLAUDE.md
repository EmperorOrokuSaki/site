# CLAUDE.md

## Project Overview

Personal website for Nima Rasooli - a Rust developer's portfolio with terminal/hacker aesthetic. Built with SvelteKit, hosted on GitHub Pages.

**Live site:** https://nimara.xyz

## Tech Stack

- **Framework:** SvelteKit with Svelte 5 (runes: `$state`, `$effect`, `$props`)
- **Adapter:** `@sveltejs/adapter-static` for GitHub Pages
- **Styling:** Tailwind CSS with CSS custom properties for theming
- **Markdown:** `marked` library with Shiki syntax highlighting (dual theme support)
- **Deployment:** GitHub Actions → gh-pages branch

## Philosophy

- **Simplicity is a treasure** - no over-engineering
- **Less code = better** - delete what you don't need
- **No complexity** - avoid abstractions until absolutely necessary
- **SvelteKit is the goat** - leverage the framework, don't fight it

## Commit Conventions

Use conventional commit format for PR titles and commit messages:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code restructuring
- `chore:` maintenance tasks

Example: `feat: add dark mode toggle`

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte          # Home page
│   ├── +layout.svelte        # Root layout with theme
│   ├── writings/
│   │   ├── +page.svelte      # Blog list
│   │   └── [slug]/           # Individual posts
│   └── liquity/              # Standalone terminal page
├── lib/
│   └── components/
│       ├── AsciiArt.svelte       # Terminal ASCII art
│       ├── GlitchText.svelte     # Glitch text effect
│       ├── InteractiveSection.svelte  # Particle effects
│       └── ScratchReveal.svelte  # Scratch-to-reveal text
└── posts/                    # Markdown blog posts
```

## Blog System

Add markdown files to `src/posts/` with frontmatter:

```markdown
---
title: Post Title
date: 2026-01-31
description: Brief description
---

Content here...
```

Push to main → GitHub Actions builds and deploys automatically.

## Deployment

- **Main branch:** Deploys to gh-pages root (serves custom domain)
- **Pull requests:** Deploy previews to `/pr-{number}/` subdirectory
- **Preview URL format:** `https://emperororokusaki.github.io/site/pr-{number}/`

## Key Files

- `svelte.config.js` - SvelteKit config with static adapter
- `vite.config.ts` - Vite config with allowed hosts
- `.github/workflows/deploy.yml` - Main deployment
- `.github/workflows/preview.yml` - PR preview deployments
- `static/CNAME` - Custom domain configuration

## Theming

CSS custom properties in `app.css`:
- `--ascii-color` - Terminal text color (green/amber)
- `--theme-bg`, `--theme-text`, etc.
- Dark/light mode via `class="dark"` on html element

## Git Workflow

- **Never push directly to main** - always create a feature branch and PR
- Branch naming: `feat/description`, `fix/description`, `docs/description`
- One feature per PR

## Don'ts

- Don't push to main directly
- Don't add unnecessary abstractions
- Don't create files unless absolutely needed
- Don't over-engineer solutions
- Don't add features that weren't requested
- Don't use complex state management - Svelte's reactivity is enough
