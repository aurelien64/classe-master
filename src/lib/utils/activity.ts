import { get, set } from 'idb-keyval';
import { browser } from '$app/environment';

/**
 * A single day's activity summary.
 */
export interface DailyActivity {
	date: string; // YYYY-MM-DD
	sessionsPlayed: number;
	questionsAnswered: number;
	questionsCorrect: number;
	xpEarned: number;
}

const ACTIVITY_KEY_PREFIX = 'activity-';

function formatDate(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayString(): string {
	return formatDate(new Date());
}

/**
 * Record a completed session into the daily activity log.
 */
export async function recordSessionActivity(
	playerId: string,
	questionsTotal: number,
	questionsCorrect: number,
	xpEarned: number
): Promise<void> {
	if (!browser) return;

	const today = getTodayString();
	const log = await loadActivityLog(playerId);
	const existing = log.find((d) => d.date === today);

	if (existing) {
		existing.sessionsPlayed++;
		existing.questionsAnswered += questionsTotal;
		existing.questionsCorrect += questionsCorrect;
		existing.xpEarned += xpEarned;
	} else {
		log.push({
			date: today,
			sessionsPlayed: 1,
			questionsAnswered: questionsTotal,
			questionsCorrect: questionsCorrect,
			xpEarned
		});
	}

	// Keep only last 90 days
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 90);
	const cutoffStr = formatDate(cutoff);
	const trimmed = log.filter((d) => d.date >= cutoffStr);

	await set(ACTIVITY_KEY_PREFIX + playerId, trimmed);
}

/**
 * Load the full activity log for a player.
 */
export async function loadActivityLog(playerId: string): Promise<DailyActivity[]> {
	if (!browser) return [];
	try {
		const data = await get<DailyActivity[]>(ACTIVITY_KEY_PREFIX + playerId);
		return data ?? [];
	} catch {
		return [];
	}
}

/**
 * Get activity data for the last N days, filling gaps with zeros.
 */
export function getActivityForDays(log: DailyActivity[], days: number): DailyActivity[] {
	const result: DailyActivity[] = [];
	const today = new Date();

	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const dateStr = formatDate(d);
		const existing = log.find((a) => a.date === dateStr);
		result.push(
			existing ?? {
				date: dateStr,
				sessionsPlayed: 0,
				questionsAnswered: 0,
				questionsCorrect: 0,
				xpEarned: 0
			}
		);
	}

	return result;
}
