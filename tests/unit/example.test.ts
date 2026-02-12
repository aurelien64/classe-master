import { describe, it, expect } from 'vitest';

/**
 * Example math utility tests as a template for future game engine tests.
 */
describe('math utilities', () => {
	it('should add two numbers correctly', () => {
		const add = (a: number, b: number) => a + b;
		expect(add(3, 4)).toBe(7);
		expect(add(-1, 1)).toBe(0);
		expect(add(0, 0)).toBe(0);
	});

	it('should check if an answer is correct', () => {
		const isCorrect = (answer: number, expected: number) => answer === expected;
		expect(isCorrect(5, 5)).toBe(true);
		expect(isCorrect(3, 5)).toBe(false);
	});

	it('should calculate accuracy percentage', () => {
		const accuracy = (correct: number, total: number) =>
			total > 0 ? Math.round((correct / total) * 100) : 0;

		expect(accuracy(8, 10)).toBe(80);
		expect(accuracy(0, 10)).toBe(0);
		expect(accuracy(0, 0)).toBe(0);
		expect(accuracy(10, 10)).toBe(100);
	});
});
