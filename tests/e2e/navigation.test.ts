import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: complete onboarding quickly.
 */
async function quickOnboard(page: Page) {
	await page.goto('/');
	await page.getByRole('link', { name: /jouer/i }).click();
	await page.getByRole('link', { name: /je joue seul/i }).click();
	await page.getByText('CP').click();
	await page.getByPlaceholder(/pseudo/i).fill('NavUser' + Math.random().toString(36).slice(2, 6));
	await page.getByRole('button', { name: /confirmer/i }).click();
	await page.getByRole('button', { name: /passer/i }).click();
	await page.getByRole('button', { name: /c'est parti/i }).click();
	await expect(page).toHaveURL('/menu');
	// Dismiss daily reward popup if it appears
	await page.waitForTimeout(1500);
	const popup = page.locator('.fixed.inset-0.z-50');
	if (await popup.isVisible({ timeout: 500 }).catch(() => false)) {
		await popup.click();
		await page.waitForTimeout(300);
	}
}

test.describe('App navigation', () => {
	test.beforeEach(async ({ context }) => {
		await context.clearCookies();
	});

	test('welcome screen shows app name and play button', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Classe Master' })).toBeVisible({
			timeout: 10000
		});
		await expect(page.getByRole('link', { name: /jouer/i })).toBeVisible();
		// Join class button should be visible but disabled
		const joinBtn = page
			.getByRole('link', { name: /rejoindre/i })
			.or(page.getByRole('button', { name: /rejoindre/i }));
		if ((await joinBtn.count()) > 0) {
			await expect(joinBtn.first()).toBeVisible();
		}
	});

	test('menu shows all navigation options', async ({ page }) => {
		await quickOnboard(page);

		// Should see play, progress, settings links
		await expect(page.getByRole('link', { name: /jouer/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /progression/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /paramètres/i })).toBeVisible();
	});

	test('progress page loads and shows heading', async ({ page }) => {
		await quickOnboard(page);

		await page.getByRole('link', { name: /progression/i }).click();
		await expect(page).toHaveURL('/progress');

		// Should show the page heading
		await expect(page.getByRole('heading', { name: /progression/i })).toBeVisible();
	});

	test('settings page shows avatar change and switch player', async ({ page }) => {
		await quickOnboard(page);

		await page.getByRole('link', { name: /paramètres/i }).click();
		await expect(page).toHaveURL('/settings');

		// Should show change avatar section
		await expect(page.getByText(/changer d'avatar/i)).toBeVisible();
		// Should show switch player button
		await expect(page.getByRole('button', { name: /changer de joueur/i })).toBeVisible();
	});

	test('settings → switch player returns to welcome', async ({ page }) => {
		await quickOnboard(page);

		await page.getByRole('link', { name: /paramètres/i }).click();
		await page.getByRole('button', { name: /changer de joueur/i }).click();

		await expect(page).toHaveURL('/');
	});

	test('back navigation works in onboarding flow', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /jouer/i }).click();
		await expect(page).toHaveURL('/join');

		await page.getByRole('link', { name: /je joue seul/i }).click();
		await expect(page).toHaveURL('/join/grade');

		// Click back
		const backLink = page
			.getByRole('link', { name: /retour/i })
			.or(page.locator('a[href="/join"]'));
		if ((await backLink.count()) > 0) {
			await backLink.first().click();
			await expect(page).toHaveURL('/join');
		}
	});
});
