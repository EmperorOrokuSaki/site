import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readingTime: number;
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function load() {
	const posts: PostMeta[] = [];

	try {
		const postsDir = 'content/posts';
		const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));

		for (const file of files) {
			const content = readFileSync(join(postsDir, file), 'utf-8');
			const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

			if (frontmatterMatch) {
				const frontmatter = frontmatterMatch[1];
				const bodyContent = content.slice(frontmatterMatch[0].length);
				const meta: Partial<PostMeta> = { slug: file.replace('.md', '') };

				const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
				const dateMatch = frontmatter.match(/date:\s*["']?(.+?)["']?\s*$/m);
				const excerptMatch = frontmatter.match(/excerpt:\s*["']?(.+?)["']?\s*$/m);
				const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);

				if (titleMatch) meta.title = titleMatch[1];
				if (dateMatch) meta.date = dateMatch[1];
				if (excerptMatch) meta.excerpt = excerptMatch[1];
				if (tagsMatch) {
					meta.tags = tagsMatch[1]
						.split(',')
						.map((t) => t.trim().replace(/["']/g, ''))
						.filter(Boolean);
				} else {
					meta.tags = [];
				}

				meta.readingTime = calculateReadingTime(bodyContent);
				posts.push(meta as PostMeta);
			}
		}

		// Sort by date descending
		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	} catch {
		console.warn('Could not load blog posts');
	}

	return { posts };
}
