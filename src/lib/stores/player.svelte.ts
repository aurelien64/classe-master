import { get, set, del } from 'idb-keyval';
import { browser } from '$app/environment';

/**
 * Player data persisted in IndexedDB
 */
export interface PlayerData {
	id: string;
	username: string;
	avatar_id: number;
	grade: 'cp' | 'ce1';
	level: number;
	xp: number;
	gems: number;
	pin?: string;
	created_at: string;
}

/**
 * Session data persisted in localStorage
 */
interface SessionData {
	playerId: string;
	token: string;
	expiresAt: number;
}

const SESSION_KEY = 'classe-master-session';
const PLAYER_KEY_PREFIX = 'player-';

/**
 * Player store using Svelte 5 runes.
 * Manages player state with localStorage (session) + IndexedDB (player data).
 */
function createPlayerStore() {
	let player = $state<PlayerData | null>(null);
	let isAuthenticated = $state(false);
	let isLoading = $state(true);

	function getSession(): SessionData | null {
		if (!browser) return null;
		try {
			const raw = localStorage.getItem(SESSION_KEY);
			if (!raw) return null;
			const session: SessionData = JSON.parse(raw);
			if (session.expiresAt < Date.now()) {
				localStorage.removeItem(SESSION_KEY);
				return null;
			}
			return session;
		} catch {
			return null;
		}
	}

	function saveSession(playerId: string): void {
		if (!browser) return;
		const session: SessionData = {
			playerId,
			token: crypto.randomUUID(),
			expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
		};
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	}

	async function init(): Promise<void> {
		if (!browser) {
			isLoading = false;
			return;
		}

		const session = getSession();
		if (session) {
			try {
				const data = await get<PlayerData>(PLAYER_KEY_PREFIX + session.playerId);
				if (data) {
					player = data;
					isAuthenticated = true;
				}
			} catch {
				// Corrupted data, clear session
				localStorage.removeItem(SESSION_KEY);
			}
		}
		isLoading = false;
	}

	async function createPlayer(
		data: Omit<PlayerData, 'id' | 'level' | 'xp' | 'gems' | 'created_at'>
	): Promise<PlayerData> {
		const newPlayer: PlayerData = {
			...data,
			id: crypto.randomUUID(),
			level: 1,
			xp: 0,
			gems: 0,
			created_at: new Date().toISOString()
		};

		await set(PLAYER_KEY_PREFIX + newPlayer.id, newPlayer);
		saveSession(newPlayer.id);

		player = newPlayer;
		isAuthenticated = true;

		return newPlayer;
	}

	async function updatePlayer(updates: Partial<PlayerData>): Promise<void> {
		if (!player) return;
		player = { ...player, ...updates };
		await set(PLAYER_KEY_PREFIX + player.id, player);
	}

	async function logout(): Promise<void> {
		if (!browser) return;
		localStorage.removeItem(SESSION_KEY);
		player = null;
		isAuthenticated = false;
	}

	async function deletePlayer(): Promise<void> {
		if (!player || !browser) return;
		await del(PLAYER_KEY_PREFIX + player.id);
		await logout();
	}

	return {
		get player() {
			return player;
		},
		get isAuthenticated() {
			return isAuthenticated;
		},
		get isLoading() {
			return isLoading;
		},
		init,
		createPlayer,
		updatePlayer,
		logout,
		deletePlayer
	};
}

export const playerStore = createPlayerStore();
