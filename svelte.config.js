import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		browser: {
			router: false
		},
		vite: {
			optimizeDeps: {
				exclude: ["canvas"]
			}
		}
	}
};

export default config;
