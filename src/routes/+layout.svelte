<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';

	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const siteUrl = 'https://nimara.xyz';
	const defaultTitle = 'Nima Rasooli — Rust Developer & Low-Level Engineer';
	const defaultDescription = 'Nima Rasooli — Rust programmer, low-level compute enthusiast, and founder of Mirage. Exploring systems programming, blockchain infrastructure, and privacy tech from Berlin.';

	// Initialize theme from localStorage on mount
	$effect(() => {
		if (browser) {
			const savedTheme = localStorage.getItem('theme') || 'light';
			document.documentElement.classList.toggle('dark', savedTheme === 'dark');
			document.documentElement.classList.toggle('light', savedTheme === 'light');
		}
	});
</script>

<svelte:head>
	<title>{defaultTitle}</title>
	<meta name="description" content={defaultDescription} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Nima Rasooli" />
	<meta property="og:title" content={defaultTitle} />
	<meta property="og:description" content={defaultDescription} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@0xNimaRa" />
	<meta name="twitter:creator" content="@0xNimaRa" />
	<meta name="twitter:title" content={defaultTitle} />
	<meta name="twitter:description" content={defaultDescription} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Nima Rasooli",
		"url": siteUrl,
		"jobTitle": "Rust Developer & Founder",
		"worksFor": {
			"@type": "Organization",
			"name": "Mirage"
		},
		"knowsAbout": ["Rust", "Systems Programming", "Blockchain", "Privacy", "EVM", "Low-level Computing"],
		"sameAs": [
			"https://github.com/EmperorOrokuSaki",
			"https://twitter.com/0xNimaRa",
			"https://www.linkedin.com/in/nima-rasooli/",
			"https://letterboxd.com/nimara/"
		]
	})}</script>`}
</svelte:head>

{@render children()}
