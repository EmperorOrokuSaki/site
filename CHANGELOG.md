# Changelog — SEO, Performance & Content Upgrade

## X/Twitter Icon

The footer used lucide's `X` component — which renders a **cross/close mark**, not the Twitter/X logo. Replaced it with a custom `XIcon.svelte` using the actual X brand SVG path.

**Files:** `src/lib/components/XIcon.svelte` (new), `src/routes/+page.svelte`

---

## Whoami Section

Added **"Nima Rasooli."** (bold, highlighted) before the tagline so the `$ whoami` output now reads:

> **Nima Rasooli.** Rust programmer. Low-level compute enthusiast. A curious George living in Berlin.

**File:** `src/routes/+page.svelte`

---

## Azoth Project

Added [Azoth](https://github.com/mirageprivacy/azoth) to the **top** of the projects list.

> *A deterministic EVM bytecode obfuscator written in Rust.*
> Tags: `rust`, `evm`, `privacy`

**File:** `src/lib/data/site.ts`

---

## SEO Overhaul

The site had almost zero SEO before — just a generic meta description in `app.html` and per-page `<title>` tags. Here's what was added:

### Open Graph Tags (every page)
`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:locale`

### Twitter Cards (every page)
`twitter:card` (summary), `twitter:site` and `twitter:creator` (`@0xNimaRa`)

### JSON-LD Structured Data
- **Home page:** `Person` schema — name, job title, employer, skills, social profiles
- **Blog posts:** `BlogPosting` schema — headline, date, author, keywords

### Sitemap
Auto-generated at `/sitemap.xml` during build. Includes all pages and blog posts with priorities and change frequencies.

**File:** `src/routes/sitemap.xml/+server.ts` (new)

### robots.txt
Allows all crawlers, points to the sitemap.

**File:** `static/robots.txt` (new)

### llms.txt
Structured plain-text summary of the site for AI crawlers following the `llms.txt` standard.

**File:** `static/llms.txt` (new)

### Canonical URLs
Every page now has a `<link rel="canonical">` pointing to its `nimara.xyz` URL.

### Meta Descriptions
Each page has a unique, descriptive meta tag instead of sharing one generic global description.

### Semantic HTML
- Hidden `<h1>` on the home page (was missing entirely — bad for crawlers)
- Blog post dates wrapped in `<time datetime="...">`
- Blog post cards wrapped in `<article>`
- Footer social links wrapped in `<nav aria-label="Social links">`
- Main nav has `aria-label="Main navigation"`
- Every icon-only link has an `aria-label` (GitHub, X, LinkedIn, Email, Letterboxd, Telegram)

### Other
- `<meta name="author">` added globally
- `<meta name="theme-color">` for dark/light mode
- `favicon.svg` linked alongside `favicon.ico`
- `<link rel="sitemap">` in head

**Files:** `src/app.html`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/routes/writings/+page.svelte`, `src/routes/writings/[slug]/+page.svelte`

---

## Performance Upgrades

### Precompression
Enabled `precompress: true` in the static adapter. Every built asset now gets `.br` (brotli) and `.gz` (gzip) variants — 30-50% smaller on the wire when the hosting supports it. GitHub Pages serves these automatically.

**File:** `svelte.config.js`

### Canvas Animation Idle Detection
The site has 3 components with `requestAnimationFrame` loops for particle effects:
- `AsciiArt.svelte`
- `InteractiveSection.svelte`
- `ScratchReveal.svelte`

**Before:** All 3 ran their animation loops at 60fps continuously from page load, even when nothing was happening.

**After:** Loops start on hover/interaction and automatically stop when there are no active particles and the user isn't hovering. This eliminates unnecessary CPU/GPU work and saves battery on mobile.

### Cached Style Lookups
`getComputedStyle(document.documentElement).getPropertyValue('--ascii-color')` was called every single frame in each animation loop. Now cached and only refreshed once per second.

### CSS Content-Visibility
Added `content-visibility: auto` to all `section[id]` elements. The browser skips layout and paint for below-fold sections until the user scrolls near them — faster initial render.

### Text Rendering
Added `text-rendering: optimizeSpeed` on body — better for the monospace-heavy terminal aesthetic.

### Unused Assets Removed
Deleted the entire `public/` directory containing ~2.6MB of unused placeholder images that were never referenced anywhere in the codebase.

**Files:** `src/app.css`, `src/lib/components/AsciiArt.svelte`, `src/lib/components/InteractiveSection.svelte`, `src/lib/components/ScratchReveal.svelte`, `svelte.config.js`

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/lib/components/XIcon.svelte` | **New** — Real X/Twitter SVG logo |
| `src/lib/components/index.ts` | Export `XIcon` |
| `src/lib/data/site.ts` | Added Azoth project |
| `src/app.html` | SEO meta tags, favicon.svg, theme-color |
| `src/app.css` | `content-visibility`, `text-rendering` |
| `src/routes/+layout.svelte` | OG tags, Twitter cards, JSON-LD |
| `src/routes/+page.svelte` | Whoami update, X icon, h1, aria-labels, semantic HTML |
| `src/routes/writings/+page.svelte` | Per-page SEO meta tags |
| `src/routes/writings/[slug]/+page.svelte` | Article OG/Twitter/JSON-LD, canonical |
| `src/routes/sitemap.xml/+server.ts` | **New** — Auto-generated sitemap |
| `src/lib/components/AsciiArt.svelte` | Idle animation loop, cached styles |
| `src/lib/components/InteractiveSection.svelte` | Idle animation loop, cached styles |
| `src/lib/components/ScratchReveal.svelte` | Idle animation loop |
| `svelte.config.js` | `precompress: true` |
| `static/robots.txt` | **New** |
| `static/llms.txt` | **New** |
| `public/*` | **Deleted** — ~2.6MB unused images |
