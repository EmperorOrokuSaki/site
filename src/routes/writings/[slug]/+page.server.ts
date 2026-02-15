import { error } from '@sveltejs/kit';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
}

// Create highlighter once
let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['github-dark', 'github-light'],
			langs: [
				'javascript',
				'typescript',
				'rust',
				'python',
				'bash',
				'json',
				'html',
				'css',
				'markdown',
				'solidity',
				'toml',
				'yaml'
			]
		});
	}
	return highlighter;
}

export function entries() {
	try {
		const postsDir = 'src/posts';
		const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));
		return files.map((file) => ({ slug: file.replace('.md', '') }));
	} catch {
		return [];
	}
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function extractToc(content: string): Array<{ id: string; text: string; level: number }> {
	const toc: Array<{ id: string; text: string; level: number }> = [];
	const headingRegex = /^(#{2,3})\s+(.+)$/gm;
	let match;

	while ((match = headingRegex.exec(content)) !== null) {
		const level = match[1].length;
		const text = match[2].trim();
		const id = text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
		toc.push({ id, text, level });
	}

	return toc;
}

function getAllPosts(): PostMeta[] {
	const posts: PostMeta[] = [];
	try {
		const postsDir = 'src/posts';
		const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));

		for (const file of files) {
			const content = readFileSync(join(postsDir, file), 'utf-8');
			const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

			if (frontmatterMatch) {
				const frontmatter = frontmatterMatch[1];
				const meta: Partial<PostMeta> = { slug: file.replace('.md', '') };

				const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
				const dateMatch = frontmatter.match(/date:\s*["']?(.+?)["']?\s*$/m);
				const excerptMatch =
					frontmatter.match(/excerpt:\s*["']?(.+?)["']?\s*$/m) ||
					frontmatter.match(/description:\s*["']?(.+?)["']?\s*$/m);
				const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
				const tagMatch = frontmatter.match(/tag:\s*["']?(.+?)["']?\s*$/m);

				if (titleMatch) meta.title = titleMatch[1];
				if (dateMatch) meta.date = dateMatch[1];
				if (excerptMatch) meta.excerpt = excerptMatch[1];
				if (tagsMatch) {
					meta.tags = tagsMatch[1]
						.split(',')
						.map((t) => t.trim().replace(/["']/g, ''))
						.filter(Boolean);
				} else if (tagMatch) {
					meta.tags = tagMatch[1]
						.split(',')
						.map((t) => t.trim().replace(/["']/g, ''))
						.filter(Boolean);
				} else {
					meta.tags = [];
				}

				posts.push(meta as PostMeta);
			}
		}

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	} catch {
		// Ignore errors
	}

	return posts;
}

export async function load({ params }) {
	const { slug } = params;

	try {
		// Read the raw file
		const rawContent = readFileSync(`src/posts/${slug}.md`, 'utf-8');
		const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);

		let title = '';
		let date = '';
		let excerpt = '';
		let tags: string[] = [];

		if (frontmatterMatch) {
			const frontmatter = frontmatterMatch[1];
			const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
			const dateMatch = frontmatter.match(/date:\s*["']?(.+?)["']?\s*$/m);
			const excerptMatch =
				frontmatter.match(/excerpt:\s*["']?(.+?)["']?\s*$/m) ||
				frontmatter.match(/description:\s*["']?(.+?)["']?\s*$/m);
			const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
			const tagMatch = frontmatter.match(/tag:\s*["']?(.+?)["']?\s*$/m);

			if (titleMatch) title = titleMatch[1];
			if (dateMatch) date = dateMatch[1];
			if (excerptMatch) excerpt = excerptMatch[1];
			if (tagsMatch) {
				tags = tagsMatch[1]
					.split(',')
					.map((t) => t.trim().replace(/["']/g, ''))
					.filter(Boolean);
			} else if (tagMatch) {
				tags = tagMatch[1]
					.split(',')
					.map((t) => t.trim().replace(/["']/g, ''))
					.filter(Boolean);
			}
		}

		const bodyContent = rawContent.slice(frontmatterMatch?.[0].length || 0);
		const readingTime = calculateReadingTime(bodyContent);
		const toc = extractToc(bodyContent);

		// Get shiki highlighter
		const hl = await getHighlighter();

		// Configure marked with syntax highlighting
		const renderer = new marked.Renderer();

		renderer.code = function ({ text, lang }) {
			const language = lang || 'text';
			try {
				const html = hl.codeToHtml(text, {
					lang: language,
					themes: { dark: 'github-dark', light: 'github-light' }
				});
				return `<div class="code-block">${html}</div>`;
			} catch {
				return `<pre><code class="language-${language}">${text}</code></pre>`;
			}
		};

		renderer.heading = function ({ text, depth }) {
			const id = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/\s+/g, '-');
			return `<h${depth} id="${id}">${text}</h${depth}>`;
		};

		marked.setOptions({ renderer });

		// Parse markdown to HTML
		const contentHtml = await marked.parse(bodyContent);

		// Get prev/next posts
		const allPosts = getAllPosts();
		const currentIndex = allPosts.findIndex((p) => p.slug === slug);
		const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
		const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			readingTime,
			toc,
			contentHtml,
			prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
			nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null
		};
	} catch (e) {
		console.error('Error loading post:', e);
		throw error(404, `Post not found: ${slug}`);
	}
}
