<script lang="ts">
	import { page } from '$app/stores';
	import { ThemeToggle } from '$lib/components';
</script>

<svelte:head>
	<title>404 — Nima Rasooli</title>
</svelte:head>

<div class="min-h-screen p-4 flex items-center justify-center">
	<div class="max-w-lg w-full">
		<div class="border border-theme p-6">
			<div class="flex items-center justify-between mb-6">
				<span class="text-theme-secondary text-sm">~/nima$</span>
				<ThemeToggle />
			</div>

			<div class="space-y-3 text-sm">
				<p>
					<span class="text-theme-secondary">$</span> cd {$page.url.pathname}
				</p>
				<p class="text-red-400">
					bash: cd: {$page.url.pathname}: No such file or directory
				</p>
				<p class="text-theme-muted mt-4">
					<span class="text-theme-secondary">$</span> echo $?
				</p>
				<p class="text-red-400">{$page.status}</p>
			</div>

			<div class="border-t border-theme mt-6 pt-4 flex gap-4">
				<a
					href="/"
					class="border border-theme px-4 py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
				>
					cd ~/nima
				</a>
				<a
					href="/writings"
					class="border border-theme px-4 py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
				>
					cd ~/nima/writings
				</a>
			</div>
		</div>
	</div>
</div>
