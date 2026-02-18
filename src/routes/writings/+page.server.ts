import { getAllPosts } from '$lib/server/posts';

export async function load() {
	return { posts: getAllPosts() };
}
