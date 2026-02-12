import type { Question, AnswerResult, SessionState, Grade, Topic } from '$lib/engine/types';
import { generateSessionQuestions } from '$lib/engine/generator';
import { calculateScore, calculateCoins, SESSION_COMPLETION_BONUS } from '$lib/engine/scoring';
import { getHints, type Hint } from '$lib/engine/hints';
import { queueSessionForSync } from '$lib/utils/sync';

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes
const GRACE_PERIOD = 15 * 1000; // 15 seconds

function createGameStore() {
	let session = $state<SessionState | null>(null);
	let timeRemaining = $state(SESSION_DURATION);
	let inGracePeriod = $state(false);
	let lastFeedback = $state<{ correct: boolean; correctAnswer: string } | null>(null);
	let currentHints = $state<Hint[]>([]);
	let hintsRevealed = $state(0);

	function startSession(grade: Grade, subLevel: number): void {
		const questions = generateSessionQuestions(grade, subLevel);
		session = {
			id: crypto.randomUUID(),
			grade,
			subLevel,
			topic: 'addition' as Topic,
			questions,
			answers: [],
			currentIndex: 0,
			startedAt: Date.now(),
			timerDuration: SESSION_DURATION,
			comboStreak: 0,
			score: 0,
			isFinished: false
		};
		timeRemaining = SESSION_DURATION;
		inGracePeriod = false;
		lastFeedback = null;
		hintsRevealed = 0;
		updateCurrentHints();
	}

	function getCurrentQuestion(): Question | null {
		if (!session || session.currentIndex >= session.questions.length) return null;
		return session.questions[session.currentIndex];
	}

	function updateCurrentHints(): void {
		const question = getCurrentQuestion();
		if (question) {
			currentHints = getHints(question.topic, question.operands, question.correctAnswer);
		} else {
			currentHints = [];
		}
	}

	function revealHint(): Hint | null {
		if (hintsRevealed >= currentHints.length) return null;
		hintsRevealed++;
		return currentHints[hintsRevealed - 1];
	}

	function submitAnswer(playerAnswer: string, timeTakenMs: number): AnswerResult | null {
		if (!session) return null;
		const question = getCurrentQuestion();
		if (!question) return null;

		const isCorrect = playerAnswer === question.correctAnswer;

		const result: AnswerResult = {
			questionId: question.id,
			playerAnswer,
			correctAnswer: question.correctAnswer,
			isCorrect,
			timeTakenMs,
			hintUsed: hintsRevealed > 0
		};

		session.answers.push(result);

		if (isCorrect) {
			session.comboStreak++;
			const points = calculateScore({
				isCorrect: true,
				timeTakenMs,
				hintsUsed: hintsRevealed,
				comboStreak: session.comboStreak,
				subLevel: session.subLevel
			});
			session.score += points;
		} else {
			session.comboStreak = 0;
		}

		lastFeedback = { correct: isCorrect, correctAnswer: question.correctAnswer };

		return result;
	}

	function nextQuestion(): void {
		if (!session) return;
		session.currentIndex++;
		lastFeedback = null;
		hintsRevealed = 0;

		if (session.currentIndex >= session.questions.length) {
			finishSession();
		} else {
			updateCurrentHints();
		}
	}

	function finishSession(): void {
		if (!session || session.isFinished) return;
		session.score += SESSION_COMPLETION_BONUS;
		session.isFinished = true;

		// Queue for sync
		const correct = session.answers.filter((a) => a.isCorrect).length;
		queueSessionForSync({
			sessionId: session.id,
			grade: session.grade,
			subLevel: session.subLevel,
			topic: session.topic,
			startedAt: new Date(session.startedAt).toISOString(),
			endedAt: new Date().toISOString(),
			durationSeconds: Math.round((Date.now() - session.startedAt) / 1000),
			score: session.score,
			questionsTotal: session.answers.length,
			questionsCorrect: correct,
			xpEarned: session.score,
			coinsEarned: calculateCoins(correct, session.subLevel),
			streakMax: getMaxStreak(),
			answers: session.answers.map((a) => ({
				questionType: 'answer',
				questionData: {},
				playerAnswer: a.playerAnswer,
				correctAnswer: a.correctAnswer,
				isCorrect: a.isCorrect,
				timeTakenMs: a.timeTakenMs,
				hintsUsed: a.hintUsed ? 1 : 0
			}))
		});
	}

	function getMaxStreak(): number {
		if (!session) return 0;
		let streak = 0;
		let max = 0;
		for (const answer of session.answers) {
			if (answer.isCorrect) {
				streak++;
				max = Math.max(max, streak);
			} else {
				streak = 0;
			}
		}
		return max;
	}

	function updateTimer(remaining: number): void {
		timeRemaining = remaining;
		if (remaining <= 0 && !inGracePeriod) {
			inGracePeriod = true;
			timeRemaining = GRACE_PERIOD;
		} else if (remaining <= 0 && inGracePeriod) {
			finishSession();
		}
	}

	function getResults() {
		if (!session) return null;
		const correct = session.answers.filter((a) => a.isCorrect).length;
		const total = session.answers.length;
		return {
			score: session.score,
			correct,
			total,
			accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
			comboMax: getMaxStreak(),
			xpEarned: session.score,
			coinsEarned: calculateCoins(correct, session.subLevel)
		};
	}

	function reset(): void {
		session = null;
		timeRemaining = SESSION_DURATION;
		inGracePeriod = false;
		lastFeedback = null;
		currentHints = [];
		hintsRevealed = 0;
	}

	return {
		get session() {
			return session;
		},
		get timeRemaining() {
			return timeRemaining;
		},
		get inGracePeriod() {
			return inGracePeriod;
		},
		get lastFeedback() {
			return lastFeedback;
		},
		get currentHints() {
			return currentHints;
		},
		get hintsRevealed() {
			return hintsRevealed;
		},
		getCurrentQuestion,
		startSession,
		submitAnswer,
		nextQuestion,
		finishSession,
		updateTimer,
		getResults,
		revealHint,
		reset
	};
}

export const gameStore = createGameStore();
