/**
 * Scoring engine implementing the full formula from the spec.
 *
 * Correct answer (no hints):  10 base + speed bonus (1-5) + difficulty multiplier (x1/x2/x3)
 * Correct with 1 hint:        70% of full points
 * Correct with 2 hints:       40% of full points
 * Correct with 3+ hints:      20% of full points (minimum > 0)
 * Wrong answer:               0 points (never negative)
 * Combo streak:               +2 points per consecutive correct, capping at +10
 * Session completion bonus:   20 points flat
 */

export interface ScoreParams {
	isCorrect: boolean;
	timeTakenMs: number;
	hintsUsed: number;
	comboStreak: number;
	subLevel: number;
}

export function calculateScore(params: ScoreParams): number {
	if (!params.isCorrect) return 0;

	const basePoints = 10;
	const speedBonus = getSpeedBonus(params.timeTakenMs);
	const difficultyMultiplier = getDifficultyMultiplier(params.subLevel);
	const comboBonus = Math.min(params.comboStreak * 2, 10);

	const rawScore = (basePoints + speedBonus + comboBonus) * difficultyMultiplier;
	const hintMultiplier = getHintMultiplier(params.hintsUsed);

	return Math.max(1, Math.round(rawScore * hintMultiplier));
}

function getSpeedBonus(timeTakenMs: number): number {
	if (timeTakenMs < 2000) return 5;
	if (timeTakenMs < 4000) return 4;
	if (timeTakenMs < 6000) return 3;
	if (timeTakenMs < 8000) return 2;
	if (timeTakenMs < 10000) return 1;
	return 0;
}

function getDifficultyMultiplier(subLevel: number): number {
	if (subLevel <= 3) return 1;
	if (subLevel <= 7) return 2;
	return 3;
}

function getHintMultiplier(hintsUsed: number): number {
	if (hintsUsed === 0) return 1;
	if (hintsUsed === 1) return 0.7;
	if (hintsUsed === 2) return 0.4;
	return 0.2;
}

export const SESSION_COMPLETION_BONUS = 20;

/**
 * Calculate coins earned from a session.
 * 1-3 coins per correct answer (scaled by difficulty) + 10 for completion.
 */
export function calculateCoins(correctAnswers: number, subLevel: number): number {
	const perCorrect = subLevel <= 3 ? 1 : subLevel <= 7 ? 2 : 3;
	return correctAnswers * perCorrect + 10;
}
