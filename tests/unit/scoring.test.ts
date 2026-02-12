import { describe, it, expect } from 'vitest';
import { calculateScore, calculateCoins, SESSION_COMPLETION_BONUS } from '$lib/engine/scoring';
import { getHints } from '$lib/engine/hints';

describe('calculateScore', () => {
	it('returns 0 for wrong answers', () => {
		expect(
			calculateScore({
				isCorrect: false,
				timeTakenMs: 5000,
				hintsUsed: 0,
				comboStreak: 0,
				subLevel: 1
			})
		).toBe(0);
	});

	it('returns base 10 points for slow correct answer at low level', () => {
		const score = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		// 10 base + 0 speed + 0 combo, x1 difficulty = 10
		expect(score).toBe(10);
	});

	it('includes speed bonus for fast answers', () => {
		const fast = calculateScore({
			isCorrect: true,
			timeTakenMs: 1500,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		const slow = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		expect(fast).toBeGreaterThan(slow);
	});

	it('includes combo bonus', () => {
		const noCombo = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		const withCombo = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 5,
			subLevel: 1
		});
		expect(withCombo).toBeGreaterThan(noCombo);
	});

	it('caps combo bonus at +10', () => {
		const combo5 = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 5,
			subLevel: 1
		});
		const combo10 = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 10,
			subLevel: 1
		});
		expect(combo5).toBe(combo10);
	});

	it('reduces score with hints (70% for 1 hint)', () => {
		const noHint = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		const oneHint = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 1,
			comboStreak: 0,
			subLevel: 1
		});
		expect(oneHint).toBeLessThan(noHint);
		expect(oneHint).toBe(Math.round(noHint * 0.7));
	});

	it('reduces more with 2 hints (40%)', () => {
		const twoHints = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 2,
			comboStreak: 0,
			subLevel: 1
		});
		expect(twoHints).toBe(Math.round(10 * 0.4));
	});

	it('minimum score with 3+ hints (20%, always > 0)', () => {
		const threeHints = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 3,
			comboStreak: 0,
			subLevel: 1
		});
		expect(threeHints).toBeGreaterThan(0);
	});

	it('applies difficulty multiplier for higher sub-levels', () => {
		const lowLevel = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 1
		});
		const midLevel = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 5
		});
		const highLevel = calculateScore({
			isCorrect: true,
			timeTakenMs: 15000,
			hintsUsed: 0,
			comboStreak: 0,
			subLevel: 8
		});
		expect(midLevel).toBe(lowLevel * 2);
		expect(highLevel).toBe(lowLevel * 3);
	});

	it('never returns negative', () => {
		for (let hints = 0; hints <= 5; hints++) {
			const score = calculateScore({
				isCorrect: true,
				timeTakenMs: 30000,
				hintsUsed: hints,
				comboStreak: 0,
				subLevel: 1
			});
			expect(score).toBeGreaterThanOrEqual(0);
		}
	});
});

describe('calculateCoins', () => {
	it('returns 1 coin per correct + 10 base for low levels', () => {
		expect(calculateCoins(5, 1)).toBe(5 * 1 + 10);
	});

	it('returns 2 coins per correct for mid levels', () => {
		expect(calculateCoins(5, 5)).toBe(5 * 2 + 10);
	});

	it('returns 3 coins per correct for high levels', () => {
		expect(calculateCoins(5, 8)).toBe(5 * 3 + 10);
	});

	it('includes 10 base coins for session completion', () => {
		expect(calculateCoins(0, 1)).toBe(10);
	});
});

describe('SESSION_COMPLETION_BONUS', () => {
	it('is 20', () => {
		expect(SESSION_COMPLETION_BONUS).toBe(20);
	});
});

describe('hints', () => {
	it('returns 3 hints for addition', () => {
		const hints = getHints('addition', { a: 5, b: 3 }, '8');
		expect(hints.length).toBe(3);
		expect(hints[0].tier).toBe(1);
		expect(hints[1].tier).toBe(2);
		expect(hints[2].tier).toBe(3);
	});

	it('returns 3 hints for subtraction', () => {
		const hints = getHints('subtraction', { a: 10, b: 3 }, '7');
		expect(hints.length).toBe(3);
	});

	it('returns 3 hints for counting', () => {
		const hints = getHints('counting', { a: 5 }, '5');
		expect(hints.length).toBe(3);
	});

	it('returns 3 hints for ordering', () => {
		const hints = getHints('ordering', { a: 5, b: 3 }, '>');
		expect(hints.length).toBe(3);
	});

	it('tier 3 hint contains the answer', () => {
		const hints = getHints('addition', { a: 4, b: 3 }, '7');
		expect(hints[2].text).toContain('7');
	});

	it('returns 3 hints for multiplication', () => {
		const hints = getHints('multiplication', { a: 3, b: 5 }, '15');
		expect(hints.length).toBe(3);
		expect(hints[0].tier).toBe(1);
		expect(hints[1].tier).toBe(2);
		expect(hints[2].tier).toBe(3);
		expect(hints[2].text).toContain('15');
	});
});
