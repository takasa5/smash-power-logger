import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		browser: {
			router: false
		},
		vite: {
			ssr: {
				noExternal: ["chart.js"]
			}
		}
	}
};

export default config;
