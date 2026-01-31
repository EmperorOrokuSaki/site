<script lang="ts">
	import { ArrowLeft, ArrowRight, Clock } from 'lucide-svelte';
	import { ThemeToggle } from '$lib/components';
	import { siteData } from '$lib/data/site';

	interface Props {
		data: {
			slug: string;
			title: string;
			date: string;
			excerpt: string;
			tags: string[];
			readingTime: number;
			toc: Array<{ id: string; text: string; level: number }>;
			contentHtml: string;
			prevPost: { slug: string; title: string } | null;
			nextPost: { slug: string; title: string } | null;
		};
	}

	let { data }: Props = $props();
	const authorName = siteData.name.toLowerCase();
</script>

<svelte:head>
	<title>{data.title} - {siteData.name}</title>
	<meta name="description" content={data.excerpt} />
</svelte:head>

<div class="min-h-screen p-2 sm:p-4">
	<div class="container mx-auto max-w-4xl">
		<header class="flex items-center justify-between border-b border-theme pb-3 sm:pb-4">
			<a href="/writings" class="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
				<ArrowLeft class="h-4 w-4" />
				<span class="text-sm sm:text-base">cd ~/{authorName}/writings</span>
			</a>
			<ThemeToggle />
		</header>
		<main class="py-4 sm:py-8">
			<article class="border border-theme">
				<div class="border-b border-theme bg-gray-300/20 dark:bg-green-900/20 p-3 sm:p-4">
					<div class="flex items-center justify-between mb-1 sm:mb-2">
						<div class="text-xs">{data.date}</div>
						<div class="flex items-center gap-1">
							<Clock class="h-3 w-3 text-theme-muted" />
							<span class="text-xs text-theme-muted">{data.readingTime} min read</span>
						</div>
					</div>
					<h1 class="text-lg sm:text-xl text-theme-secondary">{data.title}</h1>
					<div class="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-4">
						{#each data.tags as tag}
							<span class="border border-theme px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">{tag}</span>
						{/each}
					</div>
				</div>

				{#if data.toc.length > 0}
					<div class="border-b border-theme p-3 sm:p-4 toc">
						<h2 class="text-sm text-theme-secondary mb-2">Table of Contents</h2>
						<ul class="space-y-1">
							{#each data.toc as item}
								<li style="margin-left: {(item.level - 2) * 16}px">
									<a href="#{item.id}" class="text-xs hover:text-theme-secondary">{item.text}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="p-3 sm:p-4 prose">
					{@html data.contentHtml}
				</div>
			</article>

			{#if data.prevPost || data.nextPost}
				<div class="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 border-t border-theme pt-4 gap-4 sm:gap-0">
					{#if data.prevPost}
						<a href="/writings/{data.prevPost.slug}" class="flex items-center gap-2 text-theme-secondary hover:text-theme-primary">
							<ArrowLeft class="h-4 w-4 flex-shrink-0" />
							<div class="overflow-hidden">
								<div class="text-xs text-theme-muted">Older</div>
								<div class="text-sm truncate">{data.prevPost.title}</div>
							</div>
						</a>
					{:else}
						<div></div>
					{/if}

					{#if data.nextPost}
						<a href="/writings/{data.nextPost.slug}" class="flex items-center gap-2 text-theme-secondary hover:text-theme-primary self-end sm:self-auto">
							<div class="text-right overflow-hidden">
								<div class="text-xs text-theme-muted">Newer</div>
								<div class="text-sm truncate">{data.nextPost.title}</div>
							</div>
							<ArrowRight class="h-4 w-4 flex-shrink-0" />
						</a>
					{:else}
						<div></div>
					{/if}
				</div>
			{/if}

			<div class="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4">
				<a
					href="/writings"
					class="inline-block border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
				>
					cd ~/{authorName}/writings
				</a>
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
