import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';
import { getPost, getAllPosts, getPostSlugs } from '$lib/server/posts';

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
	return getPostSlugs().map((slug) => ({ slug }));
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

export async function load({ params }) {
	const { slug } = params;

	try {
		const parsed = getPost(slug);
		if (!parsed) throw new Error('No frontmatter');

		const { meta, body } = parsed;
		const toc = extractToc(body);

		const hl = await getHighlighter();
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
		const contentHtml = await marked.parse(body);

		const allPosts = getAllPosts();
		const currentIndex = allPosts.findIndex((p) => p.slug === slug);
		const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
		const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

		return {
			...meta,
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
