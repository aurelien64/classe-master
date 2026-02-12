import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: complete onboarding quickly for a given grade.
 */
async function quickOnboard(page: Page, grade: 'CP' | 'CE1' = 'CP') {
	await page.goto('/');
	await page.getByRole('link', { name: /jouer/i }).click();
	await page.getByRole('link', { name: /je joue seul/i }).click();
	await page.getByText(grade).click();
	await page.getByPlaceholder(/pseudo/i).fill('Player' + Math.random().toString(36).slice(2, 6));
	await page.getByRole('button', { name: /confirmer/i }).click();
	await page.getByRole('button', { name: /passer/i }).click();
	await page.getByRole('button', { name: /c'est parti/i }).click();
	await expect(page).toHaveURL('/menu');
}

/**
 * Helper: answer one question in a game session.
 * Tries MC buttons first, then comparison buttons, then numpad.
 */
async function answerOneQuestion(page: Page): Promise<boolean> {
	// Wait for question card to be visible
	const questionPrompt = page.locator('.text-2xl.font-bold.text-text');
	try {
		await questionPrompt.first().waitFor({ timeout: 5000 });
	} catch {
		return false;
	}

	// Check for MC choice buttons (grid-cols-2 has the answer choices)
	const mcGrid = page.locator('.grid-cols-2');
	const mcButtons = mcGrid.locator('button');
	if ((await mcButtons.count()) >= 2) {
		await mcButtons.first().click();
		return true;
	}

	// Check for comparison buttons (< > =)
	const compButtons = page.locator(
		'button:has-text("<"), button:has-text(">"), button:has-text("=")'
	);
	if ((await compButtons.count()) >= 2) {
		await compButtons.first().click();
		return true;
	}

	// Free input with numpad - type a number and validate
	const numpadGrid = page.locator('.grid-cols-3');
	if ((await numpadGrid.count()) > 0) {
		await page.getByRole('button', { name: '5', exact: true }).click();
		const validateBtn = page.locator('button.bg-success');
		if ((await validateBtn.count()) > 0) {
			await validateBtn.first().click();
		}
		return true;
	}

	return false;
}

/**
 * Helper: wait for feedback overlay to appear and dismiss it.
 */
async function dismissFeedback(page: Page): Promise<void> {
	const overlay = page.locator('.fixed.inset-0.z-50');
	try {
		await overlay.waitFor({ timeout: 3000 });
		// Click to dismiss (auto-dismisses after 1.2-2.5s too)
		await overlay.click();
	} catch {
		// Overlay may have already auto-dismissed
	}
	// Wait briefly for next question to load
	await page.waitForTimeout(600);
}

/**
 * Helper: answer all questions until results screen appears.
 */
async function playUntilResults(page: Page, maxAttempts = 20): Promise<void> {
	for (let i = 0; i < maxAttempts; i++) {
		// Check if results screen appeared
		const resultsVisible = await page
			.getByText(/résultats/i)
			.isVisible()
			.catch(() => false);
		if (resultsVisible) return;

		const answered = await answerOneQuestion(page);
		if (!answered) {
			// Maybe the session already ended
			await page.waitForTimeout(1000);
			continue;
		}
		await dismissFeedback(page);
	}
}

test.describe('CP game session', () => {
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies();
		await quickOnboard(page, 'CP');
	});

	test('can start a game session from menu', async ({ page }) => {
		await page.getByRole('link', { name: /jouer/i }).click();
		await expect(page).toHaveURL('/play');

		// Wait for question prompt to appear
		const questionPrompt = page.locator('.text-2xl.font-bold.text-text');
		await expect(questionPrompt.first()).toBeVisible({ timeout: 10000 });

		// Should see score display
		await expect(page.getByText(/score/i)).toBeVisible();
	});

	test('can answer questions and see feedback', async ({ page }) => {
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.waitForTimeout(2000);

		const answered = await answerOneQuestion(page);
		expect(answered).toBe(true);

		// Should see feedback overlay (correct or incorrect)
		const feedback = page.locator('.fixed.inset-0.z-50');
		await expect(feedback).toBeVisible({ timeout: 3000 });
	});

	test('can complete multiple questions in a session', async ({ page }) => {
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.waitForTimeout(2000);

		// Answer 3 questions
		for (let i = 0; i < 3; i++) {
			const answered = await answerOneQuestion(page);
			if (!answered) break;
			await dismissFeedback(page);
		}

		// Should still be on play page or show results
		expect(page.url()).toContain('/play');
	});

	test('shows results screen when session ends', async ({ page }) => {
		test.setTimeout(60000);
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.waitForTimeout(2000);

		await playUntilResults(page);

		// Should see results screen
		await expect(page.getByText(/résultats/i)).toBeVisible({ timeout: 10000 });
		await expect(page.getByText(/score/i)).toBeVisible();
		await expect(page.getByText(/bonnes réponses/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /retour/i })).toBeVisible();
	});

	test('play again returns to a new session', async ({ page }) => {
		test.setTimeout(60000);
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.waitForTimeout(2000);

		await playUntilResults(page);
		await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible({ timeout: 10000 });

		// Click play again
		await page.getByRole('button', { name: /rejouer/i }).click();

		// Should see a new question prompt
		const questionPrompt = page.locator('.text-2xl.font-bold.text-text');
		await expect(questionPrompt.first()).toBeVisible({ timeout: 10000 });
	});

	test('back to menu from results', async ({ page }) => {
		test.setTimeout(60000);
		await page.getByRole('link', { name: /jouer/i }).click();
		await page.waitForTimeout(2000);

		await playUntilResults(page);
		await expect(page.getByRole('button', { name: /retour/i })).toBeVisible({ timeout: 10000 });

		// Click back to menu
		await page.getByRole('button', { name: /retour/i }).click();
		await expect(page).toHaveURL('/menu');
	});
});

test.describe('CE1 game session', () => {
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies();
		await quickOnboard(page, 'CE1');
	});

	test('CE1 player can play a session', async ({ page }) => {
		await page.getByRole('link', { name: /jouer/i }).click();
		await expect(page).toHaveURL('/play');

		// Wait for question prompt
		const questionPrompt = page.locator('.text-2xl.font-bold.text-text');
		await expect(questionPrompt.first()).toBeVisible({ timeout: 10000 });

		// Answer a question
		const answered = await answerOneQuestion(page);
		expect(answered).toBe(true);
	});
});
