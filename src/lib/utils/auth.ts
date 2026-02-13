import { playerStore } from '$lib/stores/player.svelte';
import type { PlayerData } from '$lib/stores/player.svelte';

/**
 * Creates a solo player (offline, no Supabase required).
 */
export async function createSoloPlayer(
	data: Omit<PlayerData, 'id' | 'level' | 'xp' | 'gems' | 'unlocked_avatars' | 'created_at'>
): Promise<PlayerData> {
	return playerStore.createPlayer(data);
}

/**
 * Checks if there's a valid session and loads the player.
 * Should be called on app load.
 */
export async function checkSession(): Promise<boolean> {
	await playerStore.init();
	return playerStore.isAuthenticated;
}

/**
 * Clears the current session (logout / switch player).
 */
export async function clearSession(): Promise<void> {
	await playerStore.logout();
}
