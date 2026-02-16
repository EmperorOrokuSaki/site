import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://nimara.xyz';

export const prerender = true;

export function GET() {
	const pages = [
		{ url: '', priority: '1.0', changefreq: 'weekly' },
		{ url: '/writings', priority: '0.8', changefreq: 'weekly' }
	];

	// Add blog posts
	try {
		const postsDir = 'src/posts';
		const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));

		for (const file of files) {
			const content = readFileSync(join(postsDir, file), 'utf-8');
			const dateMatch = content.match(/date:\s*["']?(.+?)["']?\s*$/m);
			const slug = file.replace('.md', '');
			pages.push({
				url: `/writings/${slug}`,
				priority: '0.6',
				changefreq: 'monthly'
			});
		}
	} catch {
		// Ignore errors
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
