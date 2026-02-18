import { readFileSync } from 'fs';
import { getAllPosts } from '$lib/server/posts';

export async function load() {
	let asciiArt = '';
	try {
		asciiArt = readFileSync('static/ascii.txt', 'utf-8');
	} catch {
		console.warn('Could not load ASCII art');
	}

	return {
		asciiArt,
		posts: getAllPosts()
	};
}
