import { get, set } from 'idb-keyval';
import { browser } from '$app/environment';

export interface StreakData {
	currentStreak: number;
	longestStreak: number;
	lastPlayDate: string; // YYYY-MM-DD
	rewardCycleDay: number; // 1-7
	totalCoinsFromStreaks: number;
}

const STREAK_KEY_PREFIX = 'streak-';

/** Daily reward coins per cycle day (1-7) */
const REWARD_CYCLE = [5, 5, 10, 10, 10, 15, 20];

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayString(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Check if two date strings are consecutive days.
 */
export function isConsecutiveDay(dateA: string, dateB: string): boolean {
	const a = new Date(dateA + 'T00:00:00');
	const b = new Date(dateB + 'T00:00:00');
	const diffMs = Math.abs(b.getTime() - a.getTime());
	const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
	return diffDays === 1;
}

/**
 * Check if two date strings are the same day.
 */
export function isSameDay(dateA: string, dateB: string): boolean {
	return dateA === dateB;
}

/**
 * Load streak data for a player.
 */
export async function loadStreak(playerId: string): Promise<StreakData> {
	if (!browser) {
		return createDefaultStreak();
	}

	try {
		const data = await get<StreakData>(STREAK_KEY_PREFIX + playerId);
		if (data) return data;
	} catch {
		// Corrupted data
	}

	return createDefaultStreak();
}

/**
 * Save streak data.
 */
export async function saveStreak(playerId: string, data: StreakData): Promise<void> {
	if (!browser) return;
	await set(STREAK_KEY_PREFIX + playerId, data);
}

function createDefaultStreak(): StreakData {
	return {
		currentStreak: 0,
		longestStreak: 0,
		lastPlayDate: '',
		rewardCycleDay: 0,
		totalCoinsFromStreaks: 0
	};
}

/**
 * Record a daily login and calculate streak + reward.
 * Returns the coins earned from the daily reward (0 if already claimed today).
 */
export function recordDailyLogin(
	streak: StreakData,
	today: string
): { coins: number; isNew: boolean } {
	// Already played today
	if (isSameDay(streak.lastPlayDate, today)) {
		return { coins: 0, isNew: false };
	}

	// Check if consecutive
	if (isConsecutiveDay(streak.lastPlayDate, today)) {
		streak.currentStreak++;
		streak.rewardCycleDay = (streak.rewardCycleDay % 7) + 1;
	} else {
		// Streak broken - reset
		streak.currentStreak = 1;
		streak.rewardCycleDay = 1;
	}

	streak.lastPlayDate = today;
	streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

	const coins = getRewardForDay(streak.rewardCycleDay);
	streak.totalCoinsFromStreaks += coins;

	return { coins, isNew: true };
}

/**
 * Get the coin reward for a given cycle day (1-7).
 */
export function getRewardForDay(day: number): number {
	if (day < 1 || day > 7) return 5;
	return REWARD_CYCLE[day - 1];
}

/**
 * Get the full reward cycle.
 */
export function getRewardCycle(): number[] {
	return [...REWARD_CYCLE];
}
