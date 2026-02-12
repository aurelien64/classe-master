import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		locale: 'fr-FR'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Pixel 7'],
				viewport: { width: 390, height: 844 },
				locale: 'fr-FR'
			}
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				viewport: { width: 390, height: 844 },
				locale: 'fr-FR'
			}
		}
	],
	webServer: {
		command: 'pnpm preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	}
});
