import { get, set } from 'idb-keyval';
import { browser } from '$app/environment';
import type { Topic, Grade } from './types';

/**
 * Progress data for a single topic.
 */
export interface TopicProgress {
	topic: Topic;
	grade: Grade;
	currentSubLevel: number;
	/** Rolling window of last 10 answers at current sub-level */
	recentAnswers: AnswerRecord[];
	/** Number of failed advancement attempts (3 = trigger review) */
	failedAttempts: number;
	/** Whether a review session is pending */
	needsReview: boolean;
	/** Highest sub-level ever reached */
	highestSubLevel: number;
}

export interface AnswerRecord {
	isCorrect: boolean;
	hintsUsed: number;
	timestamp: number;
}

export interface ProgressState {
	playerId: string;
	grade: Grade;
	topics: Record<string, TopicProgress>;
}

const PROGRESS_KEY_PREFIX = 'progress-';
const WINDOW_SIZE = 10;
const MIN_QUESTIONS = 8;
const ACCURACY_THRESHOLD = 0.8;
const MAX_FAILED_ATTEMPTS = 3;
const MAX_SUB_LEVEL = 10;

/**
 * Calculate weighted accuracy from a rolling window.
 * Questions with 2+ hints count at 50% weight.
 */
export function calculateWeightedAccuracy(answers: AnswerRecord[]): number {
	if (answers.length === 0) return 0;

	let weightedCorrect = 0;
	let totalWeight = 0;

	for (const answer of answers) {
		const weight = answer.hintsUsed >= 2 ? 0.5 : 1;
		totalWeight += weight;
		if (answer.isCorrect) {
			weightedCorrect += weight;
		}
	}

	return totalWeight > 0 ? weightedCorrect / totalWeight : 0;
}

/**
 * Check if a player should advance to the next sub-level.
 */
export function checkAdvancement(progress: TopicProgress): {
	shouldAdvance: boolean;
	shouldReview: boolean;
} {
	const recent = progress.recentAnswers.slice(-WINDOW_SIZE);

	// Need at least MIN_QUESTIONS
	if (recent.length < MIN_QUESTIONS) {
		return { shouldAdvance: false, shouldReview: false };
	}

	// Already at max
	if (progress.currentSubLevel >= MAX_SUB_LEVEL) {
		return { shouldAdvance: false, shouldReview: false };
	}

	const accuracy = calculateWeightedAccuracy(recent);

	if (accuracy >= ACCURACY_THRESHOLD) {
		return { shouldAdvance: true, shouldReview: false };
	}

	// Check if we should trigger a review (3 failed windows)
	if (progress.failedAttempts >= MAX_FAILED_ATTEMPTS - 1) {
		return { shouldAdvance: false, shouldReview: true };
	}

	return { shouldAdvance: false, shouldReview: false };
}

function createDefaultTopicProgress(
	topic: Topic,
	grade: Grade,
	startSubLevel: number
): TopicProgress {
	return {
		topic,
		grade,
		currentSubLevel: startSubLevel,
		recentAnswers: [],
		failedAttempts: 0,
		needsReview: false,
		highestSubLevel: startSubLevel
	};
}

/**
 * Get the starting sub-level for a topic.
 */
function getTopicStartLevel(topic: Topic): number {
	if (topic === 'subtraction') return 3;
	if (topic === 'multiplication') return 5;
	return 1;
}

/**
 * Load progress for a player from IndexedDB.
 */
export async function loadProgress(playerId: string, grade: Grade): Promise<ProgressState> {
	if (!browser) {
		return { playerId, grade, topics: {} };
	}

	try {
		const data = await get<ProgressState>(PROGRESS_KEY_PREFIX + playerId);
		if (data && data.grade === grade) return data;
	} catch {
		// Corrupted data, start fresh
	}

	return { playerId, grade, topics: {} };
}

/**
 * Save progress to IndexedDB.
 */
export async function saveProgress(progress: ProgressState): Promise<void> {
	if (!browser) return;
	await set(PROGRESS_KEY_PREFIX + progress.playerId, progress);
}

/**
 * Get or create progress for a specific topic.
 */
export function getTopicProgress(state: ProgressState, topic: Topic): TopicProgress {
	const key = topic;
	if (!state.topics[key]) {
		state.topics[key] = createDefaultTopicProgress(topic, state.grade, getTopicStartLevel(topic));
	}
	return state.topics[key];
}

/**
 * Record an answer and check for advancement.
 * Returns the new progress state and whether advancement occurred.
 */
export function recordAnswer(
	state: ProgressState,
	topic: Topic,
	answer: AnswerRecord
): { progress: ProgressState; advanced: boolean; reviewTriggered: boolean } {
	const topicProgress = getTopicProgress(state, topic);

	// Add answer to rolling window
	topicProgress.recentAnswers.push(answer);

	// Keep only the last WINDOW_SIZE answers
	if (topicProgress.recentAnswers.length > WINDOW_SIZE * 2) {
		topicProgress.recentAnswers = topicProgress.recentAnswers.slice(-WINDOW_SIZE);
	}

	// Check advancement
	const { shouldAdvance, shouldReview } = checkAdvancement(topicProgress);

	let advanced = false;
	let reviewTriggered = false;

	if (shouldAdvance) {
		topicProgress.currentSubLevel++;
		topicProgress.highestSubLevel = Math.max(
			topicProgress.highestSubLevel,
			topicProgress.currentSubLevel
		);
		topicProgress.failedAttempts = 0;
		topicProgress.recentAnswers = [];
		advanced = true;
	} else if (shouldReview) {
		topicProgress.needsReview = true;
		topicProgress.failedAttempts = 0;
		if (topicProgress.currentSubLevel > getTopicStartLevel(topic)) {
			topicProgress.currentSubLevel--;
		}
		topicProgress.recentAnswers = [];
		reviewTriggered = true;
	} else if (topicProgress.recentAnswers.length >= WINDOW_SIZE) {
		// Full window evaluated but didn't advance -- count as failed attempt
		const accuracy = calculateWeightedAccuracy(topicProgress.recentAnswers.slice(-WINDOW_SIZE));
		if (accuracy < ACCURACY_THRESHOLD) {
			topicProgress.failedAttempts++;
		}
	}

	state.topics[topic] = topicProgress;
	return { progress: state, advanced, reviewTriggered };
}

/**
 * Get the player's current sub-level for a topic.
 */
export function getCurrentSubLevel(state: ProgressState, topic: Topic): number {
	const topicProgress = state.topics[topic];
	if (!topicProgress) return getTopicStartLevel(topic);
	return topicProgress.currentSubLevel;
}
