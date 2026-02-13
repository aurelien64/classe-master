import type { DistractorStrategy } from './types';

/**
 * Generate distractors for a given correct answer using specified strategies.
 * Returns exactly `count` unique distractors, all different from the correct answer.
 */
export function generateDistractors(
	correctAnswer: number,
	strategies: DistractorStrategy[],
	count: number,
	operands?: { a: number; b: number; operation?: string }
): number[] {
	const distractors = new Set<number>();

	for (const strategy of strategies) {
		if (distractors.size >= count) break;

		const candidates = getStrategyDistractors(correctAnswer, strategy, operands);
		for (const c of candidates) {
			if (c !== correctAnswer && c >= 0 && !distractors.has(c)) {
				distractors.add(c);
				if (distractors.size >= count) break;
			}
		}
	}

	// Fill remaining with random nearby if needed
	let offset = 1;
	while (distractors.size < count) {
		const above = correctAnswer + offset;
		const below = correctAnswer - offset;
		if (above !== correctAnswer && above >= 0 && !distractors.has(above)) {
			distractors.add(above);
		}
		if (
			distractors.size < count &&
			below !== correctAnswer &&
			below >= 0 &&
			!distractors.has(below)
		) {
			distractors.add(below);
		}
		offset++;
		if (offset > 100) break; // safety
	}

	return [...distractors].slice(0, count);
}

function getStrategyDistractors(
	correct: number,
	strategy: DistractorStrategy,
	operands?: { a: number; b: number; operation?: string }
): number[] {
	switch (strategy) {
		case 'off_by_one':
			return [correct + 1, correct - 1];

		case 'wrong_operation':
			if (!operands) return [correct + 2, correct - 2];
			if (operands.operation === 'addition') {
				return [Math.abs(operands.a - operands.b)];
			}
			if (operands.operation === 'subtraction') {
				return [operands.a + operands.b];
			}
			if (operands.operation === 'multiplication') {
				return [operands.a + operands.b, Math.abs(operands.a - operands.b)];
			}
			if (operands.operation === 'division') {
				return [operands.b, operands.a + operands.b];
			}
			return [correct + 2];

		case 'forget_carry': {
			// Simulates forgetting to carry: e.g., 17+15=22 instead of 32
			if (!operands) return [];
			const unitSum = (operands.a % 10) + (operands.b % 10);
			if (unitSum >= 10) {
				return [correct - 10];
			}
			// No carry to forget — strategy doesn't apply
			return [];
		}

		case 'forget_borrow': {
			if (!operands) return [];
			const unitDiff = (operands.a % 10) - (operands.b % 10);
			if (unitDiff < 0) {
				// Borrow was needed — forgetting it gives +10
				return [correct + 10];
			}
			// No borrow to forget — strategy doesn't apply
			return [];
		}

		case 'random_nearby': {
			const range = Math.max(3, Math.ceil(correct * 0.2));
			const r1 = correct + Math.floor(Math.random() * range) + 1;
			const r2 = correct - Math.floor(Math.random() * range) - 1;
			return [r1, r2];
		}

		case 'digit_swap': {
			if (correct >= 10) {
				const digits = String(correct).split('');
				// Swap first two digits (adjacent swap, not full reversal)
				[digits[0], digits[1]] = [digits[1], digits[0]];
				const swapped = parseInt(digits.join(''), 10);
				if (swapped !== correct) return [swapped];
			}
			return [correct + 2, correct - 2];
		}

		default:
			return [correct + 1, correct - 1];
	}
}

/**
 * Shuffle choices array and return the shuffled array.
 */
export function shuffleChoices(choices: string[]): string[] {
	const arr = [...choices];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
