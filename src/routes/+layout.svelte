<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';

	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Initialize theme from localStorage on mount
	$effect(() => {
		if (browser) {
			const savedTheme = localStorage.getItem('theme') || 'dark';
			document.documentElement.classList.toggle('dark', savedTheme === 'dark');
			document.documentElement.classList.toggle('light', savedTheme === 'light');
		}
	});
</script>

<svelte:head>
	<title>Nima - Rust Developer</title>
</svelte:head>

{@render children()}
