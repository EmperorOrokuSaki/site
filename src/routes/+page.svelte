<script lang="ts">
	import { Github, Linkedin, Mail, Film, Menu, X } from 'lucide-svelte';
	import {
		ThemeToggle,
		GlitchText,
		AsciiArt,
		InteractiveSection,
		TelegramIcon,
		XIcon
	} from '$lib/components';
	import { siteData } from '$lib/data/site';

	declare const __COMMIT_HASH__: string;

	interface Props {
		data: {
			asciiArt: string;
			posts: Array<{ slug: string; title: string; date: string; excerpt: string; tags: string[] }>;
		};
	}

	let { data }: Props = $props();
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: '#about', label: './about' },
		{ href: '#writings', label: './writings' },
		{ href: '#projects', label: './projects' },
		{ href: '#work', label: './work' }
	];
</script>

<svelte:head>
	<title>Nima Rasooli — Rust Developer & Low-Level Engineer</title>
	<meta name="description" content="Nima Rasooli — Rust programmer, low-level compute enthusiast, and founder of Mirage. Building privacy tools, blockchain infrastructure, and systems software from Berlin." />
	<link rel="canonical" href="https://nimara.xyz" />
</svelte:head>

<a href="#main-content" class="skip-link">Skip to content</a>

<div class="min-h-screen p-4">
	<div class="container mx-auto">
		<h1 class="sr-only">Nima Rasooli — Rust Developer & Low-Level Engineer</h1>
		<header class="flex justify-between items-center border-b border-theme pb-4">
			<div class="text-lg">
				<span>~/{siteData.name.toLowerCase()}</span>
				<span class="text-theme-secondary">$</span>
			</div>
			<div class="flex items-center gap-4">
				<ThemeToggle />
				<nav class="hidden md:flex gap-6" aria-label="Main navigation">
					{#each navLinks as link}
						<a href={link.href} class="text-theme-primary hover:text-theme-secondary transition-colors">{link.label}</a>
					{/each}
				</nav>
				<button
					class="md:hidden border border-theme p-2"
					style="border-color: var(--border-color);"
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<X class="h-4 w-4" />
					{:else}
						<Menu class="h-4 w-4" />
					{/if}
				</button>
			</div>
		</header>

		{#if mobileMenuOpen}
			<nav class="md:hidden border-b border-theme py-3 flex flex-col gap-3" aria-label="Mobile navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-theme-primary hover:text-theme-secondary transition-colors text-sm px-2"
						onclick={() => mobileMenuOpen = false}
					>{link.label}</a>
				{/each}
			</nav>
		{/if}

		<main id="main-content" class="py-8">
			<InteractiveSection class="mb-16 border border-theme p-4">
				{#snippet children()}
					<div class="text-center mb-4">
						<GlitchText text="Explo(it/r)ing the world!" class="text-theme-secondary text-lg" />
					</div>
					{#if data.asciiArt}
						<div class="flex justify-center">
							<AsciiArt art={data.asciiArt} />
						</div>
					{/if}
					<div class="mt-4 border-t border-theme pt-4">
						<p class="text-theme-secondary mb-2">$ whoami</p>
						<p class="text-sm"><span class="text-theme-secondary font-bold">Nima Rasooli.</span> {siteData.tagline}</p>
					</div>
				{/snippet}
			</InteractiveSection>

			<section id="about" class="mb-16">
				<div class="border-b border-theme mb-4 pb-2 flex items-center">
					<h2 class="text-xl">
						<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
						<span>$ cat</span>
						<span class="text-theme-secondary">about.txt</span>
					</h2>
				</div>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						{#each siteData.about as paragraph}
							<p class="mb-4 text-sm">{paragraph}</p>
						{/each}
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="border border-theme p-4">
							<h3 class="text-theme-secondary mb-2 text-sm">$ ls favorite_films/</h3>
							<ul class="space-y-1 text-xs">
								{#each siteData.favoriteFilms as film}
									<li>
										{film.title}
										{#if film.director}
											<span class="text-theme-muted">// {film.director}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
						<div class="border border-theme p-4">
							<h3 class="text-theme-secondary mb-2 text-sm">$ ls interests/</h3>
							<ul class="space-y-1 text-xs">
								{#each siteData.interests as interest}
									<li>{interest}</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section id="writings" class="mb-16">
				<div class="border-b border-theme mb-4 pb-2 flex items-center">
					<h2 class="text-xl">
						<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
						<span>$ ls -la</span>
						<span class="text-theme-secondary">writings/</span>
					</h2>
				</div>
				<div class="space-y-4">
					{#each data.posts as post}
						<article class="border border-theme p-4">
							<div class="text-xs mb-2">
								<time datetime={post.date}>{post.date}</time>
							</div>
							<h3 class="text-theme-secondary mb-2">
								<a href="/writings/{post.slug}" class="hover:underline">{post.title}</a>
							</h3>
							<p class="text-xs mb-4">{post.excerpt}</p>
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag}
									<span class="border border-theme px-2 py-1 text-xs">{tag}</span>
								{/each}
							</div>
						</article>
					{/each}
				</div>
				<div class="mt-4 text-center">
					<a
						href="/writings"
						class="inline-block border border-theme px-4 py-2 hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
					>
						ls --all
					</a>
				</div>
			</section>

			<section id="projects" class="mb-16">
				<div class="border-b border-theme mb-4 pb-2 flex items-center">
					<h2 class="text-xl">
						<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
						<span>$ ls -la</span>
						<span class="text-theme-secondary">projects/</span>
					</h2>
				</div>
				<div class="space-y-4">
					{#each siteData.projects as project}
						<div class="border border-theme">
							<div
								class="border-b border-theme bg-gray-300/20 dark:bg-green-900/20 p-2 flex justify-between items-center"
							>
								<h3 class="text-theme-secondary">
									{#if project.githubUrl}
										<a
											href={project.githubUrl}
											class="hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											{project.title}
										</a>
									{:else}
										{project.title}
									{/if}
								</h3>
								{#if project.githubUrl}
									<a
										href={project.githubUrl}
										class="text-theme-primary hover:text-theme-secondary"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="{project.title} on GitHub"
									>
										<Github class="h-4 w-4" />
									</a>
								{/if}
							</div>
							<div class="p-4">
								<p class="text-xs mb-4">{project.description}</p>
								<div class="flex flex-wrap gap-2">
									{#each project.tags as tag}
										<span class="border border-theme px-2 py-1 text-xs">{tag}</span>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section id="work" class="mb-16">
				<div class="border-b border-theme mb-4 pb-2 flex items-center">
					<h2 class="text-xl">
						<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
						<span>$ cat</span>
						<span class="text-theme-secondary">work_history.log</span>
					</h2>
				</div>
				<div class="space-y-4">
					{#each siteData.workExperience as work}
						<div class="border-l-2 border-theme pl-4">
							<div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
								<h3 class="text-theme-secondary">{work.title}</h3>
								<div class="text-xs">
									<span>{work.company}</span>
									<span class="mx-2">|</span>
									<span>{work.period}</span>
								</div>
							</div>
							<p class="text-xs mb-4">{work.description}</p>
							<div class="flex flex-wrap gap-2">
								{#each work.tags as tag}
									<span class="border border-theme px-2 py-1 text-xs">{tag}</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section id="contact" class="mb-16">
				<div class="border-b border-theme mb-4 pb-2 flex items-center">
					<h2 class="text-xl">
						<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
						<span>$ ./contact</span>
					</h2>
				</div>
				<div>
					<p class="text-sm mb-6">
						I'm always up for conversations about new opportunities, peculiarities, or questioning
						if androids dream of electric sheep.
					</p>
					<div class="text-sm">
						<p>
							Find me on social media or send me an email at
							<a
								href={siteData.socialLinks.email}
								class="text-theme-secondary hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteData.socialLinks.email?.replace('mailto:', '')}
							</a>
						</p>
					</div>
				</div>
			</section>
		</main>

		<footer class="border-t border-theme py-4">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-4 md:mb-0 text-xs">
					<span class="text-theme-secondary">~/{siteData.name.toLowerCase()}</span>
					<span>$ echo</span>
					<span class="text-theme-secondary">"© {new Date().getFullYear()}"</span>
					<span class="text-theme-muted ml-2">({__COMMIT_HASH__.slice(0, 7)})</span>
				</div>
				<nav class="flex gap-6" aria-label="Social links">
					{#if siteData.socialLinks.github}
						<a
							href={siteData.socialLinks.github}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
						>
							<Github class="h-4 w-4" />
						</a>
					{/if}
					{#if siteData.socialLinks.twitter}
						<a
							href={siteData.socialLinks.twitter}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="X (Twitter)"
						>
							<XIcon class="h-4 w-4" />
						</a>
					{/if}
					{#if siteData.socialLinks.linkedin}
						<a
							href={siteData.socialLinks.linkedin}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
						>
							<Linkedin class="h-4 w-4" />
						</a>
					{/if}
					{#if siteData.socialLinks.email}
						<a
							href={siteData.socialLinks.email}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Email"
						>
							<Mail class="h-4 w-4" />
						</a>
					{/if}
					{#if siteData.socialLinks.letterboxd}
						<a
							href={siteData.socialLinks.letterboxd}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Letterboxd"
						>
							<Film class="h-4 w-4" />
						</a>
					{/if}
					{#if siteData.socialLinks.telegram}
						<a
							href={siteData.socialLinks.telegram}
							class="text-theme-primary hover:text-theme-secondary transition-colors"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Telegram"
						>
							<TelegramIcon class="h-4 w-4" />
						</a>
					{/if}
				</nav>
			</div>
		</footer>
	</div>
</div>
