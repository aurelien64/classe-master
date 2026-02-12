import type { Question, AnswerResult, SessionState, Grade, Topic } from '$lib/engine/types';
import { generateSessionQuestions } from '$lib/engine/generator';

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes
const GRACE_PERIOD = 15 * 1000; // 15 seconds

function createGameStore() {
	let session = $state<SessionState | null>(null);
	let timeRemaining = $state(SESSION_DURATION);
	let inGracePeriod = $state(false);
	let lastFeedback = $state<{ correct: boolean; correctAnswer: string } | null>(null);

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
	}

	function getCurrentQuestion(): Question | null {
		if (!session || session.currentIndex >= session.questions.length) return null;
		return session.questions[session.currentIndex];
	}

	function submitAnswer(
		playerAnswer: string,
		timeTakenMs: number,
		hintUsed: boolean = false
	): AnswerResult | null {
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
			hintUsed
		};

		session.answers.push(result);

		if (isCorrect) {
			session.comboStreak++;
			const basePoints = 10;
			const speedBonus =
				timeTakenMs < 3000 ? 5 : timeTakenMs < 5000 ? 3 : timeTakenMs < 10000 ? 1 : 0;
			const comboBonus = Math.min(session.comboStreak * 2, 10);
			const hintMultiplier = hintUsed ? 0.7 : 1;
			session.score += Math.round((basePoints + speedBonus + comboBonus) * hintMultiplier);
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

		if (session.currentIndex >= session.questions.length) {
			finishSession();
		}
	}

	function finishSession(): void {
		if (!session) return;
		session.score += 20; // completion bonus
		session.isFinished = true;
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
			comboMax: Math.max(
				...session.answers.map((_, i) => {
					let streak = 0;
					let max = 0;
					for (let j = 0; j <= i; j++) {
						if (session!.answers[j].isCorrect) {
							streak++;
							max = Math.max(max, streak);
						} else {
							streak = 0;
						}
					}
					return max;
				}),
				0
			),
			xpEarned: session.score,
			coinsEarned: correct * 2 + 10
		};
	}

	function reset(): void {
		session = null;
		timeRemaining = SESSION_DURATION;
		inGracePeriod = false;
		lastFeedback = null;
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
		getCurrentQuestion,
		startSession,
		submitAnswer,
		nextQuestion,
		finishSession,
		updateTimer,
		getResults,
		reset
	};
}

export const gameStore = createGameStore();
