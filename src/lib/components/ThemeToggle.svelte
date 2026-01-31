<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let isDark = $state(true);

	$effect(() => {
		if (browser) {
			isDark = document.documentElement.classList.contains('dark');
		}
	});

	function toggle() {
		isDark = !isDark;
		if (browser) {
			document.documentElement.classList.toggle('dark', isDark);
			document.documentElement.classList.toggle('light', !isDark);
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		}
	}
</script>

<button
	onclick={toggle}
	class="border border-theme p-2 rounded-md"
	style="border-color: var(--border-color);"
	aria-label="Toggle theme"
>
	{#if isDark}
		<Sun class="h-4 w-4" />
	{:else}
		<Moon class="h-4 w-4" />
	{/if}
</button>
