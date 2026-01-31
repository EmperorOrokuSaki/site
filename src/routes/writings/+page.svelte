<script lang="ts">
	import { ArrowLeft, Clock } from 'lucide-svelte';
	import { ThemeToggle } from '$lib/components';
	import { siteData } from '$lib/data/site';

	interface Props {
		data: {
			posts: Array<{
				slug: string;
				title: string;
				date: string;
				excerpt: string;
				tags: string[];
				readingTime: number;
			}>;
		};
	}

	let { data }: Props = $props();
	const authorName = siteData.name.toLowerCase();
</script>

<svelte:head>
	<title>Writings - {siteData.name}</title>
</svelte:head>

<div class="min-h-screen p-2 sm:p-4">
	<div class="container mx-auto max-w-4xl">
		<header class="flex items-center justify-between border-b border-theme pb-3 sm:pb-4">
			<a href="/#writings" class="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
				<ArrowLeft class="h-4 w-4" />
				<span class="text-sm sm:text-base">cd ~/{authorName}</span>
			</a>
			<ThemeToggle />
		</header>
		<main class="py-4 sm:py-8">
			<div class="border-b border-theme mb-4 sm:mb-6 pb-2">
				<h1 class="text-lg sm:text-xl">
					<span class="text-theme-secondary">~/{authorName}/writings</span>
					<span>$ ls -la</span>
				</h1>
			</div>

			{#if data.posts.length === 0}
				<div class="border border-yellow-600 bg-yellow-900/20 p-3 sm:p-4 text-yellow-400 text-sm sm:text-base">
					No blog posts found.
				</div>
			{:else}
				<div class="space-y-4 sm:space-y-6">
					{#each data.posts as post}
						<div class="border border-theme p-3 sm:p-4 hover:border-gray-500 dark:hover:border-green-500 transition-colors">
							<div class="flex items-center justify-between mb-1 sm:mb-2">
								<div class="text-xs">{post.date}</div>
								<div class="flex items-center gap-1">
									<Clock class="h-3 w-3 text-theme-muted" />
									<span class="text-xs text-theme-muted">{post.readingTime} min read</span>
								</div>
							</div>
							<h2 class="text-base sm:text-lg text-theme-secondary mb-1 sm:mb-2">
								<a href="/writings/{post.slug}" class="hover:underline">{post.title}</a>
							</h2>
							<p class="text-xs sm:text-sm mb-3 sm:mb-4">{post.excerpt}</p>
							<div class="flex flex-wrap gap-1 sm:gap-2">
								{#each post.tags as tag}
									<span class="border border-theme px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">{tag}</span>
								{/each}
							</div>
							<div class="mt-3 sm:mt-4 text-right">
								<a href="/writings/{post.slug}" class="text-theme-secondary hover:text-theme-primary text-xs sm:text-sm">
									Read more →
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-6 sm:mt-8 text-center">
				<a
					href="/"
					class="inline-block border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
				>
					cd ~/{authorName}
				</a>
			</div>
		</main>
	</div>
</div>
