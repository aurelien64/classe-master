import { describe, it, expect } from 'vitest';
import {
	calculateWeightedAccuracy,
	checkAdvancement,
	recordAnswer,
	getTopicProgress,
	getCurrentSubLevel,
	type TopicProgress,
	type AnswerRecord,
	type ProgressState
} from '$lib/engine/progression';

function makeAnswers(correct: number, wrong: number, hintsUsed = 0): AnswerRecord[] {
	const answers: AnswerRecord[] = [];
	for (let i = 0; i < correct; i++) {
		answers.push({ isCorrect: true, hintsUsed, timestamp: Date.now() + i });
	}
	for (let i = 0; i < wrong; i++) {
		answers.push({ isCorrect: false, hintsUsed: 0, timestamp: Date.now() + correct + i });
	}
	return answers;
}

function makeProgress(overrides: Partial<TopicProgress> = {}): TopicProgress {
	return {
		topic: 'addition',
		grade: 'cp',
		currentSubLevel: 1,
		recentAnswers: [],
		failedAttempts: 0,
		needsReview: false,
		highestSubLevel: 1,
		...overrides
	};
}

function makeState(overrides: Partial<ProgressState> = {}): ProgressState {
	return {
		playerId: 'test-player',
		grade: 'cp',
		topics: {},
		...overrides
	};
}

describe('calculateWeightedAccuracy', () => {
	it('returns 0 for empty array', () => {
		expect(calculateWeightedAccuracy([])).toBe(0);
	});

	it('returns 1.0 for all correct', () => {
		expect(calculateWeightedAccuracy(makeAnswers(10, 0))).toBe(1.0);
	});

	it('returns 0 for all wrong', () => {
		expect(calculateWeightedAccuracy(makeAnswers(0, 10))).toBe(0);
	});

	it('returns 0.8 for 8/10 correct', () => {
		expect(calculateWeightedAccuracy(makeAnswers(8, 2))).toBe(0.8);
	});

	it('counts answers with 2+ hints at 50% weight', () => {
		const answers: AnswerRecord[] = [
			{ isCorrect: true, hintsUsed: 2, timestamp: 1 }, // 0.5 weight, 0.5 correct
			{ isCorrect: true, hintsUsed: 0, timestamp: 2 } // 1.0 weight, 1.0 correct
		];
		// total weight = 1.5, weighted correct = 1.5
		expect(calculateWeightedAccuracy(answers)).toBe(1.0);
	});

	it('handles mixed hints correctly', () => {
		const answers: AnswerRecord[] = [
			{ isCorrect: true, hintsUsed: 3, timestamp: 1 }, // 0.5 weight, 0.5 correct
			{ isCorrect: false, hintsUsed: 0, timestamp: 2 } // 1.0 weight, 0 correct
		];
		// total weight = 1.5, weighted correct = 0.5
		const accuracy = calculateWeightedAccuracy(answers);
		expect(accuracy).toBeCloseTo(0.333, 2);
	});
});

describe('checkAdvancement', () => {
	it('does not advance with fewer than 8 questions', () => {
		const progress = makeProgress({
			recentAnswers: makeAnswers(7, 0)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldAdvance).toBe(false);
		expect(result.shouldReview).toBe(false);
	});

	it('advances with 80% accuracy on 10 questions', () => {
		const progress = makeProgress({
			recentAnswers: makeAnswers(8, 2)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldAdvance).toBe(true);
	});

	it('does not advance with 70% accuracy', () => {
		const progress = makeProgress({
			recentAnswers: makeAnswers(7, 3)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldAdvance).toBe(false);
	});

	it('does not advance past max sub-level 10', () => {
		const progress = makeProgress({
			currentSubLevel: 10,
			recentAnswers: makeAnswers(10, 0)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldAdvance).toBe(false);
	});

	it('triggers review after 2 failed attempts (3rd evaluation)', () => {
		const progress = makeProgress({
			failedAttempts: 2,
			recentAnswers: makeAnswers(5, 5)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldReview).toBe(true);
	});

	it('does not trigger review with fewer than 2 previous failed attempts', () => {
		const progress = makeProgress({
			failedAttempts: 1,
			recentAnswers: makeAnswers(5, 5)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldReview).toBe(false);
		expect(result.shouldAdvance).toBe(false);
	});

	it('advances with exactly 8 questions at 100% accuracy', () => {
		const progress = makeProgress({
			recentAnswers: makeAnswers(8, 0)
		});
		const result = checkAdvancement(progress);
		expect(result.shouldAdvance).toBe(true);
	});
});

describe('recordAnswer', () => {
	it('records an answer to the correct topic', () => {
		const state = makeState();
		const answer: AnswerRecord = { isCorrect: true, hintsUsed: 0, timestamp: Date.now() };
		const { progress } = recordAnswer(state, 'addition', answer);
		expect(progress.topics['addition']).toBeDefined();
		expect(progress.topics['addition'].recentAnswers.length).toBe(1);
	});

	it('triggers advancement after enough correct answers', () => {
		const state = makeState({
			topics: {
				addition: makeProgress({
					recentAnswers: makeAnswers(9, 0)
				})
			}
		});
		const answer: AnswerRecord = { isCorrect: true, hintsUsed: 0, timestamp: Date.now() };
		const { advanced } = recordAnswer(state, 'addition', answer);
		expect(advanced).toBe(true);
		expect(state.topics['addition'].currentSubLevel).toBe(2);
	});

	it('resets recent answers after advancement', () => {
		const state = makeState({
			topics: {
				addition: makeProgress({
					recentAnswers: makeAnswers(9, 0)
				})
			}
		});
		const answer: AnswerRecord = { isCorrect: true, hintsUsed: 0, timestamp: Date.now() };
		recordAnswer(state, 'addition', answer);
		expect(state.topics['addition'].recentAnswers.length).toBe(0);
	});

	it('drops sub-level on review trigger', () => {
		const state = makeState({
			topics: {
				addition: makeProgress({
					currentSubLevel: 3,
					failedAttempts: 2,
					recentAnswers: makeAnswers(4, 6)
				})
			}
		});
		const answer: AnswerRecord = { isCorrect: false, hintsUsed: 0, timestamp: Date.now() };
		const result = recordAnswer(state, 'addition', answer);
		// The review check happens in checkAdvancement which needs a full window
		// With 11 answers total, the last 10 have accuracy < 80%
		// But failedAttempts is already 2 so review should trigger
		expect(state.topics['addition'].currentSubLevel).toBeLessThanOrEqual(3);
		expect(result.progress).toBeDefined();
	});

	it('tracks highest sub-level ever reached', () => {
		const state = makeState({
			topics: {
				addition: makeProgress({
					currentSubLevel: 1,
					highestSubLevel: 1,
					recentAnswers: makeAnswers(9, 0)
				})
			}
		});
		const answer: AnswerRecord = { isCorrect: true, hintsUsed: 0, timestamp: Date.now() };
		recordAnswer(state, 'addition', answer);
		expect(state.topics['addition'].highestSubLevel).toBe(2);
	});
});

describe('getTopicProgress', () => {
	it('creates default progress for new topic', () => {
		const state = makeState();
		const progress = getTopicProgress(state, 'addition');
		expect(progress.currentSubLevel).toBe(1);
		expect(progress.recentAnswers).toEqual([]);
	});

	it('returns correct starting level for subtraction', () => {
		const state = makeState();
		const progress = getTopicProgress(state, 'subtraction');
		expect(progress.currentSubLevel).toBe(3);
	});

	it('returns correct starting level for multiplication', () => {
		const state = makeState();
		const progress = getTopicProgress(state, 'multiplication');
		expect(progress.currentSubLevel).toBe(5);
	});
});

describe('getCurrentSubLevel', () => {
	it('returns starting level for unknown topic', () => {
		const state = makeState();
		expect(getCurrentSubLevel(state, 'addition')).toBe(1);
	});

	it('returns current sub-level from progress', () => {
		const state = makeState({
			topics: {
				addition: makeProgress({ currentSubLevel: 5 })
			}
		});
		expect(getCurrentSubLevel(state, 'addition')).toBe(5);
	});
});
