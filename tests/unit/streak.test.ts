import { describe, it, expect } from 'vitest';
import {
	recordDailyLogin,
	isConsecutiveDay,
	isSameDay,
	getRewardForDay,
	getRewardCycle,
	type StreakData
} from '$lib/utils/streak';

function makeStreak(overrides: Partial<StreakData> = {}): StreakData {
	return {
		currentStreak: 0,
		longestStreak: 0,
		lastPlayDate: '',
		rewardCycleDay: 0,
		totalCoinsFromStreaks: 0,
		...overrides
	};
}

describe('isConsecutiveDay', () => {
	it('returns true for consecutive days', () => {
		expect(isConsecutiveDay('2026-02-12', '2026-02-13')).toBe(true);
		expect(isConsecutiveDay('2026-02-13', '2026-02-12')).toBe(true);
	});

	it('returns false for same day', () => {
		expect(isConsecutiveDay('2026-02-12', '2026-02-12')).toBe(false);
	});

	it('returns false for non-consecutive days', () => {
		expect(isConsecutiveDay('2026-02-12', '2026-02-14')).toBe(false);
	});

	it('handles month boundaries', () => {
		expect(isConsecutiveDay('2026-01-31', '2026-02-01')).toBe(true);
	});
});

describe('isSameDay', () => {
	it('returns true for same day', () => {
		expect(isSameDay('2026-02-12', '2026-02-12')).toBe(true);
	});

	it('returns false for different days', () => {
		expect(isSameDay('2026-02-12', '2026-02-13')).toBe(false);
	});
});

describe('getRewardForDay', () => {
	it('returns correct rewards for 7-day cycle', () => {
		expect(getRewardForDay(1)).toBe(5);
		expect(getRewardForDay(2)).toBe(5);
		expect(getRewardForDay(3)).toBe(10);
		expect(getRewardForDay(4)).toBe(10);
		expect(getRewardForDay(5)).toBe(10);
		expect(getRewardForDay(6)).toBe(15);
		expect(getRewardForDay(7)).toBe(20);
	});

	it('returns 5 for invalid day', () => {
		expect(getRewardForDay(0)).toBe(5);
		expect(getRewardForDay(8)).toBe(5);
	});
});

describe('getRewardCycle', () => {
	it('returns 7 rewards', () => {
		expect(getRewardCycle()).toEqual([5, 5, 10, 10, 10, 15, 20]);
	});
});

describe('recordDailyLogin', () => {
	it('starts a new streak on first login', () => {
		const streak = makeStreak();
		const result = recordDailyLogin(streak, '2026-02-13');
		expect(result.isNew).toBe(true);
		expect(result.coins).toBe(5);
		expect(streak.currentStreak).toBe(1);
		expect(streak.rewardCycleDay).toBe(1);
		expect(streak.lastPlayDate).toBe('2026-02-13');
	});

	it('returns isNew=false for same day', () => {
		const streak = makeStreak({
			currentStreak: 1,
			lastPlayDate: '2026-02-13',
			rewardCycleDay: 1
		});
		const result = recordDailyLogin(streak, '2026-02-13');
		expect(result.isNew).toBe(false);
		expect(result.coins).toBe(0);
	});

	it('increments streak for consecutive day', () => {
		const streak = makeStreak({
			currentStreak: 3,
			lastPlayDate: '2026-02-12',
			rewardCycleDay: 3
		});
		const result = recordDailyLogin(streak, '2026-02-13');
		expect(result.isNew).toBe(true);
		expect(streak.currentStreak).toBe(4);
		expect(streak.rewardCycleDay).toBe(4);
	});

	it('resets streak after missing a day', () => {
		const streak = makeStreak({
			currentStreak: 5,
			lastPlayDate: '2026-02-10',
			rewardCycleDay: 5
		});
		const result = recordDailyLogin(streak, '2026-02-13');
		expect(result.isNew).toBe(true);
		expect(streak.currentStreak).toBe(1);
		expect(streak.rewardCycleDay).toBe(1);
	});

	it('wraps reward cycle after day 7', () => {
		const streak = makeStreak({
			currentStreak: 7,
			lastPlayDate: '2026-02-12',
			rewardCycleDay: 7
		});
		const result = recordDailyLogin(streak, '2026-02-13');
		expect(streak.rewardCycleDay).toBe(1);
		expect(result.coins).toBe(5);
	});

	it('tracks longest streak', () => {
		const streak = makeStreak({
			currentStreak: 5,
			longestStreak: 3,
			lastPlayDate: '2026-02-12',
			rewardCycleDay: 5
		});
		recordDailyLogin(streak, '2026-02-13');
		expect(streak.longestStreak).toBe(6);
	});

	it('accumulates total coins', () => {
		const streak = makeStreak({ totalCoinsFromStreaks: 30 });
		recordDailyLogin(streak, '2026-02-13');
		expect(streak.totalCoinsFromStreaks).toBe(35); // 30 + 5 (day 1)
	});
});
