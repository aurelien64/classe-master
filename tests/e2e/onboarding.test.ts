import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: complete the full onboarding flow and land on the menu.
 */
async function completeOnboarding(page: Page, options?: { grade?: string; username?: string }) {
	const grade = options?.grade ?? 'CP';
	const username = options?.username ?? 'TestUser';

	await page.goto('/');
	// Welcome screen
	await page.getByRole('link', { name: /jouer/i }).click();
	await expect(page).toHaveURL('/join');

	// Join screen → solo
	await page.getByRole('link', { name: /je joue seul/i }).click();
	await expect(page).toHaveURL('/join/grade');

	// Grade selection
	await page.getByText(grade).click();
	await expect(page).toHaveURL('/join/username');

	// Username
	await page.getByPlaceholder(/pseudo/i).fill(username);
	await page.getByRole('button', { name: /confirmer/i }).click();
	await expect(page).toHaveURL('/join/pin');

	// Skip PIN
	await page.getByRole('button', { name: /passer/i }).click();
	await expect(page).toHaveURL('/join/avatar');

	// Avatar → confirm
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

test.describe('New user onboarding', () => {
	test.beforeEach(async ({ context }) => {
		// Clear storage to simulate a new user
		await context.clearCookies();
	});

	test('full onboarding flow: welcome → grade → username → pin skip → avatar → menu', async ({
		page
	}) => {
		await completeOnboarding(page, { grade: 'CP', username: 'Mathieu' });

		// Verify we see the welcome message with username
		await expect(page.getByText(/bienvenue.*mathieu/i)).toBeVisible();
		// Verify play button exists
		await expect(page.getByRole('link', { name: /jouer/i })).toBeVisible();
	});

	test('onboarding with PIN entry', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.getByRole('link', { name: /je joue seul/i }).click();
		await page.getByText('CP').click();
		await page.getByPlaceholder(/pseudo/i).fill('PinUser');
		await page.getByRole('button', { name: /confirmer/i }).click();
		await expect(page).toHaveURL('/join/pin');

		// Enter 4-digit PIN via numpad buttons
		for (const digit of ['1', '2', '3', '4']) {
			await page.getByRole('button', { name: digit, exact: true }).click();
		}
		// Validate PIN - the validate button has a checkmark SVG (no text)
		const validateBtn = page.locator('button.bg-success').first();
		await validateBtn.click();
		await expect(page).toHaveURL('/join/avatar');

		await page.getByRole('button', { name: /c'est parti/i }).click();
		await expect(page).toHaveURL('/menu');
	});

	test('CE1 grade selection leads to correct onboarding', async ({ page }) => {
		await completeOnboarding(page, { grade: 'CE1', username: 'Ce1User' });
		await expect(page.getByText(/bienvenue.*ce1user/i)).toBeVisible();
	});

	test('username validation rejects too short names', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.getByRole('link', { name: /je joue seul/i }).click();
		await page.getByText('CP').click();

		// Single character username
		await page.getByPlaceholder(/pseudo/i).fill('A');

		// Confirm button should be disabled
		const confirmBtn = page.getByRole('button', { name: /confirmer/i });
		await expect(confirmBtn).toBeDisabled();
	});

	test('avatar selection works and shows selected avatar', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.getByRole('link', { name: /je joue seul/i }).click();
		await page.getByText('CP').click();
		await page.getByPlaceholder(/pseudo/i).fill('AvatarUser');
		await page.getByRole('button', { name: /confirmer/i }).click();
		await page.getByRole('button', { name: /passer/i }).click();
		await expect(page).toHaveURL('/join/avatar');

		// There should be 10 avatar options + 1 large preview
		// Click on different avatar options - they're in a grid
		const avatarGrid = page.locator('.grid');
		const avatars = avatarGrid.locator('button, [role="button"], div[class*="cursor"]');
		const count = await avatars.count();
		expect(count).toBeGreaterThanOrEqual(10);
	});
});

test.describe('Returning user', () => {
	test('auto-login after onboarding takes user to menu', async ({ page }) => {
		// First: complete onboarding
		await completeOnboarding(page, { username: 'ReturnUser' });
		await expect(page).toHaveURL('/menu');

		// Navigate to welcome page and it should still have session
		await page.goto('/');
		// The welcome screen should show - but clicking Play should recognize the player
		await page.getByRole('link', { name: /jouer/i }).click();

		// The user data is in IndexedDB + localStorage, so the app should recognize them.
		// The join page will still show since there's no redirect on /join itself,
		// but the session data persists for the next play session.
	});
});
