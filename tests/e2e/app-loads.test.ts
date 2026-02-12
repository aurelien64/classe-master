import { test, expect } from '@playwright/test';

test('app loads and shows welcome screen', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Classe Master' })).toBeVisible();
	await expect(page.getByRole('link', { name: /jouer/i })).toBeVisible();
});

test('play link navigates to play page', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: /jouer/i }).click();
	await expect(page).toHaveURL('/play');
});
