import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			srcDir: 'src',
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Classe Master - Jeu de Maths',
				short_name: 'Classe Master',
				description: 'Apprends les maths en t\u2019amusant !',
				start_url: '/',
				display: 'standalone',
				orientation: 'portrait',
				theme_color: '#4F46E5',
				background_color: '#F8FAFC',
				lang: 'fr',
				dir: 'ltr',
				categories: ['education', 'games'],
				icons: [
					{
						src: '/icons/icon-192.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					},
					{
						src: '/icons/icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml'
					},
					{
						src: '/icons/icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'supabase-api',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 3600
							}
						}
					},
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'images',
							expiration: {
								maxEntries: 200,
								maxAgeSeconds: 30 * 24 * 60 * 60
							}
						}
					},
					{
						urlPattern: /\.(?:mp3|wav|ogg)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'sounds',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60
							}
						}
					},
					{
						urlPattern: /\.(?:woff|woff2|ttf|otf)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'fonts',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 365 * 24 * 60 * 60
							}
						}
					}
				]
			}
		})
	]
});
