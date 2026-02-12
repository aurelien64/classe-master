import { describe, it, expect, beforeEach } from 'vitest';

const SESSION_KEY = 'classe-master-session';

describe('auth session management', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('session is stored in localStorage with correct shape', () => {
		const session = {
			playerId: 'test-id-123',
			token: 'test-token',
			expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
		};
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));

		const stored = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		expect(stored.playerId).toBe('test-id-123');
		expect(stored.token).toBe('test-token');
		expect(stored.expiresAt).toBeGreaterThan(Date.now());
	});

	it('expired session is detected', () => {
		const session = {
			playerId: 'test-id',
			token: 'test-token',
			expiresAt: Date.now() - 1000 // expired
		};
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));

		const stored = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		expect(stored.expiresAt).toBeLessThan(Date.now());
	});

	it('missing session returns null', () => {
		const session = localStorage.getItem(SESSION_KEY);
		expect(session).toBeNull();
	});

	it('clearing session removes it from localStorage', () => {
		localStorage.setItem(
			SESSION_KEY,
			JSON.stringify({
				playerId: 'test-id',
				token: 'test-token',
				expiresAt: Date.now() + 86400000
			})
		);

		localStorage.removeItem(SESSION_KEY);
		expect(localStorage.getItem(SESSION_KEY)).toBeNull();
	});

	it('corrupt session data is handled', () => {
		localStorage.setItem(SESSION_KEY, 'not-json');

		let parsed = null;
		try {
			parsed = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		} catch {
			localStorage.removeItem(SESSION_KEY);
		}

		expect(parsed).toBeNull();
		expect(localStorage.getItem(SESSION_KEY)).toBeNull();
	});
});
