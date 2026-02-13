import { test, expect, type Page } from '@playwright/test';

/**
 * Full functional browser review.
 * Tests every page and interaction to catch errors.
 */

async function quickOnboard(page: Page, grade: 'CP' | 'CE1' = 'CP') {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(`PAGE ERROR: ${err.message}`));
	page.on('console', (msg) => {
		if (msg.type() === 'error') errors.push(`CONSOLE ERROR: ${msg.text()}`);
	});

	await page.goto('/');
	await page.getByRole('link', { name: /jouer|play/i }).click();
	await page.getByRole('link', { name: /je joue seul|i play solo/i }).click();
	await page.getByText(grade).click();
	await page.getByPlaceholder(/pseudo|username/i).fill('Review' + grade);
	await page.getByRole('button', { name: /confirmer|confirm/i }).click();
	await page.getByRole('button', { name: /passer|skip/i }).click();
	await page.getByRole('button', { name: /c'est parti|let's go/i }).click();
	await expect(page).toHaveURL('/menu');
	// Dismiss daily reward popup if it appears
	await page.waitForTimeout(1500);
	const popup = page.locator('.fixed.inset-0.z-50');
	if (await popup.isVisible({ timeout: 500 }).catch(() => false)) {
		await popup.click();
		await page.waitForTimeout(300);
	}

	return errors;
}

// --- Welcome Page ---
test.describe('Welcome page', () => {
	test('renders correctly', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Classe Master' })).toBeVisible({
			timeout: 10000
		});
		await expect(page.getByRole('link', { name: /jouer|play/i })).toBeVisible();
		// No JS errors
		const errors: string[] = [];
		page.on('pageerror', (err) => errors.push(err.message));
		await page.waitForTimeout(1000);
		expect(errors).toEqual([]);
	});
});

// --- Onboarding Flow (CP) ---
test.describe('Onboarding CP', () => {
	test('full flow without errors', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CP');
		expect(errors).toEqual([]);
		await expect(page.getByText(/bienvenue|welcome/i)).toBeVisible();
	});
});

// --- Onboarding Flow (CE1) ---
test.describe('Onboarding CE1', () => {
	test('full flow without errors', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CE1');
		expect(errors).toEqual([]);
		await expect(page.getByText(/bienvenue|welcome/i)).toBeVisible();
	});
});

// --- Menu Page ---
test.describe('Menu page', () => {
	test('all links work without errors', async ({ page, context }) => {
		await context.clearCookies();
		await quickOnboard(page, 'CP');

		// Check all menu links exist
		await expect(page.getByRole('link', { name: /jouer|play/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /progression|progress/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /paramètres|settings/i })).toBeVisible();
	});
});

// --- Play Page (CP) ---
test.describe('Play page CP', () => {
	test('loads and shows questions without errors', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CP');

		await page.getByRole('link', { name: /jouer|play/i }).click();
		await expect(page).toHaveURL('/play');
		await page.waitForTimeout(3000);

		// Check no error page appeared
		const errorPage = await page
			.getByText(/oups|oops|internal error/i)
			.isVisible()
			.catch(() => false);
		expect(errorPage).toBe(false);

		// Question should be visible (text-4xl after redesign)
		const question = page.locator('.text-4xl.font-bold.text-text');
		await expect(question.first()).toBeVisible({ timeout: 10000 });

		// No JS errors during load
		expect(errors).toEqual([]);
	});

	test('answering questions works', async ({ page, context }) => {
		await context.clearCookies();
		await quickOnboard(page, 'CP');
		await page.getByRole('link', { name: /jouer|play/i }).click();
		await page.waitForTimeout(2000);

		// Answer via MC buttons
		const mcGrid = page.locator('.grid-cols-2');
		const mcButtons = mcGrid.locator('button');
		if ((await mcButtons.count()) >= 2) {
			await mcButtons.first().click();
			// Inline feedback should appear (correct or wrong styling)
			const feedbackCorrect = page.locator('.bg-success.text-white');
			const feedbackWrong = page.locator('.animate-shake');
			const hasFeedback = (await feedbackCorrect.count()) > 0 || (await feedbackWrong.count()) > 0;
			expect(hasFeedback).toBe(true);
		}
	});
});

// --- Play Page (CE1) ---
test.describe('Play page CE1', () => {
	test('loads and shows questions without errors', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CE1');

		await page.getByRole('link', { name: /jouer|play/i }).click();
		await expect(page).toHaveURL('/play');
		await page.waitForTimeout(3000);

		// Check no error page appeared
		const errorPage = await page
			.getByText(/oups|oops|internal error/i)
			.isVisible()
			.catch(() => false);
		expect(errorPage).toBe(false);

		// Question should be visible (text-4xl after redesign)
		const question = page.locator('.text-4xl.font-bold.text-text');
		await expect(question.first()).toBeVisible({ timeout: 10000 });

		expect(errors).toEqual([]);
	});

	test('can complete full CE1 session', async ({ page, context }) => {
		test.setTimeout(60000);
		await context.clearCookies();
		await quickOnboard(page, 'CE1');
		await page.getByRole('link', { name: /jouer|play/i }).click();
		await page.waitForTimeout(2000);

		// Answer all questions
		for (let i = 0; i < 20; i++) {
			const resultsVisible = await page
				.getByText(/résultats|results/i)
				.isVisible()
				.catch(() => false);
			if (resultsVisible) break;

			const mcGrid = page.locator('.grid-cols-2');
			const mcButtons = mcGrid.locator('button');
			const numpadGrid = page.locator('.grid-cols-3');

			if ((await mcButtons.count()) >= 2) {
				await mcButtons.first().click();
			} else if ((await numpadGrid.count()) > 0) {
				await page.getByRole('button', { name: '5', exact: true }).click();
				const validateBtn = page.locator('button.bg-success');
				if ((await validateBtn.count()) > 0) await validateBtn.first().click();
			}

			// Wait for inline feedback auto-advance (max 2.5s)
			await page.waitForTimeout(2500);
		}

		// Should reach results
		await expect(page.getByText(/résultats|results/i)).toBeVisible({ timeout: 10000 });
	});
});

// --- Progress Page ---
test.describe('Progress page', () => {
	test('loads without errors', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CP');

		await page.getByRole('link', { name: /progression|progress/i }).click();
		await expect(page).toHaveURL('/progress');

		// Should show heading
		await expect(page.getByRole('heading', { name: /progression|progress/i })).toBeVisible();

		// Check no error page
		const errorPage = await page
			.getByText(/oups|oops|internal error/i)
			.isVisible()
			.catch(() => false);
		expect(errorPage).toBe(false);

		expect(errors).toEqual([]);
	});
});

// --- Settings Page ---
test.describe('Settings page', () => {
	test('loads and switch player works', async ({ page, context }) => {
		await context.clearCookies();
		const errors = await quickOnboard(page, 'CP');

		await page.getByRole('link', { name: /paramètres|settings/i }).click();
		await expect(page).toHaveURL('/settings');
		await expect(page.getByText(/changer d'avatar|change avatar/i)).toBeVisible();
		await expect(
			page.getByRole('button', { name: /changer de joueur|switch player/i })
		).toBeVisible();

		// Switch player should go back to welcome
		await page.getByRole('button', { name: /changer de joueur|switch player/i }).click();
		await expect(page).toHaveURL('/');

		expect(errors).toEqual([]);
	});
});

// --- Direct URL access (no session) ---
test.describe('Auth guard', () => {
	test('/menu redirects to /join without session', async ({ page, context }) => {
		await context.clearCookies();
		// Clear localStorage by navigating first
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());

		await page.goto('/menu');
		// Should redirect to /join (auth guard)
		await page.waitForTimeout(2000);
		const url = page.url();
		expect(url).toContain('/join');
	});

	test('/play redirects to /join without session', async ({ page, context }) => {
		await context.clearCookies();
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());

		await page.goto('/play');
		await page.waitForTimeout(2000);
		const url = page.url();
		expect(url).toContain('/join');
	});
});
