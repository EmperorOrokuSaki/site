import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = 'src/posts';

function slugify(filename: string): string {
	return filename
		.replace(/^\d{4}-\d{2}-\d{2}\s+/, '') // strip leading date
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readingTime: number;
}

function parseTags(frontmatter: string): string[] {
	const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
	const tagMatch = frontmatter.match(/tag:\s*["']?(.+?)["']?\s*$/m);

	const raw = tagsMatch?.[1] ?? tagMatch?.[1];
	if (!raw) return [];

	return raw
		.split(',')
		.map((t) => t.trim().replace(/["']/g, ''))
		.filter(Boolean);
}

export function calculateReadingTime(content: string): number {
	const wordCount = content.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(wordCount / 200));
}

export function parseFrontmatter(content: string, slug: string): { meta: PostMeta; body: string } | null {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;

	const fm = match[1];
	const body = content.slice(match[0].length);

	const title = fm.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? '';
	const date = fm.match(/date:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? '';
	const excerpt =
		(fm.match(/excerpt:\s*["']?(.+?)["']?\s*$/m) ??
			fm.match(/description:\s*["']?(.+?)["']?\s*$/m))?.[1] ?? '';

	return {
		meta: {
			slug,
			title,
			date,
			excerpt,
			tags: parseTags(fm),
			readingTime: calculateReadingTime(body)
		},
		body
	};
}

export function getAllPosts(): PostMeta[] {
	try {
		const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
		const posts: PostMeta[] = [];

		for (const file of files) {
			const content = readFileSync(join(POSTS_DIR, file), 'utf-8');
			const parsed = parseFrontmatter(content, slugify(file.replace('.md', '')));
			if (parsed) posts.push(parsed.meta);
		}

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		return posts;
	} catch {
		return [];
	}
}

export function getPost(slug: string) {
	// Try exact filename first, then search by slugified name
	try {
		const content = readFileSync(join(POSTS_DIR, `${slug}.md`), 'utf-8');
		return parseFrontmatter(content, slug);
	} catch {
		const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
		const file = files.find((f) => slugify(f.replace('.md', '')) === slug);
		if (!file) return null;
		const content = readFileSync(join(POSTS_DIR, file), 'utf-8');
		return parseFrontmatter(content, slug);
	}
}

export function getPostSlugs(): string[] {
	try {
		return readdirSync(POSTS_DIR)
			.filter((f) => f.endsWith('.md'))
			.map((f) => slugify(f.replace('.md', '')));
	} catch {
		return [];
	}
}
