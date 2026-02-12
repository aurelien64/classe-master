import { get, set, keys, del } from 'idb-keyval';
import { browser } from '$app/environment';

const SYNC_QUEUE_PREFIX = 'sync-session-';

export interface SessionSyncData {
	sessionId: string;
	grade: string;
	subLevel: number;
	topic: string;
	startedAt: string;
	endedAt: string;
	durationSeconds: number;
	score: number;
	questionsTotal: number;
	questionsCorrect: number;
	xpEarned: number;
	coinsEarned: number;
	streakMax: number;
	answers: SessionAnswerData[];
}

export interface SessionAnswerData {
	questionType: string;
	questionData: Record<string, unknown>;
	playerAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
	timeTakenMs: number;
	hintsUsed: number;
}

/**
 * Queue a session for sync. Stored in IndexedDB until synced.
 */
export async function queueSessionForSync(data: SessionSyncData): Promise<void> {
	if (!browser) return;
	await set(SYNC_QUEUE_PREFIX + data.sessionId, {
		...data,
		queuedAt: new Date().toISOString()
	});
}

/**
 * Get all queued sessions waiting for sync.
 */
export async function getPendingSessions(): Promise<SessionSyncData[]> {
	if (!browser) return [];
	const allKeys = await keys();
	const syncKeys = allKeys.filter((k) => String(k).startsWith(SYNC_QUEUE_PREFIX));
	const sessions: SessionSyncData[] = [];
	for (const key of syncKeys) {
		const data = await get<SessionSyncData>(key);
		if (data) sessions.push(data);
	}
	return sessions;
}

/**
 * Remove a synced session from the queue.
 */
export async function removeSyncedSession(sessionId: string): Promise<void> {
	if (!browser) return;
	await del(SYNC_QUEUE_PREFIX + sessionId);
}

/**
 * Attempt to sync all pending sessions.
 * In MVP, this stores locally. Server sync will be added later.
 */
export async function syncPendingSessions(): Promise<number> {
	const pending = await getPendingSessions();
	// MVP: sessions are stored offline. Server sync deferred.
	return pending.length;
}
