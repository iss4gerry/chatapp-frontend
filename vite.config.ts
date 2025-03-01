import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [vue()],
	server: {
		proxy: {
			'/api': {
				target: 'https://api.multiavatar.com/',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
