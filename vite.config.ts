import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__COMMIT_HASH__: JSON.stringify(process.env.COMMIT_SHA || 'dev')
	},
	preview: {
		allowedHosts: ['n.nimara.xyz', 'nimara.xyz']
	}
});
