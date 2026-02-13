import { test, expect } from '@playwright/test';

test.describe('App loads', () => {
	test('shows welcome screen with app name', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Classe Master' })).toBeVisible({
			timeout: 10000
		});
	});

	test('shows play button on welcome screen', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: /jouer/i })).toBeVisible({ timeout: 10000 });
	});

	test('shows tagline on welcome screen', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText(/maths/i)).toBeVisible({ timeout: 10000 });
	});

	test('play link navigates to join page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /jouer/i }).click();
		await expect(page).toHaveURL('/join');
	});
});
