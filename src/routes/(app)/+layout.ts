import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (browser) {
		const session = localStorage.getItem('classe-master-session');
		if (!session) {
			redirect(302, '/join');
		}
		try {
			const parsed = JSON.parse(session);
			if (!parsed.playerId || parsed.expiresAt < Date.now()) {
				localStorage.removeItem('classe-master-session');
				redirect(302, '/join');
			}
		} catch {
			localStorage.removeItem('classe-master-session');
			redirect(302, '/join');
		}
	}
}
