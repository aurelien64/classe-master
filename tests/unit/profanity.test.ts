import { describe, it, expect } from 'vitest';
import { containsProfanity, validateUsername } from '$lib/utils/profanity';

describe('containsProfanity', () => {
	it('detects French profanity', () => {
		expect(containsProfanity('merde')).toBe(true);
		expect(containsProfanity('putain')).toBe(true);
		expect(containsProfanity('connard')).toBe(true);
	});

	it('detects English profanity', () => {
		expect(containsProfanity('fuck')).toBe(true);
		expect(containsProfanity('shit')).toBe(true);
	});

	it('detects profanity case-insensitively', () => {
		expect(containsProfanity('MERDE')).toBe(true);
		expect(containsProfanity('Putain')).toBe(true);
	});

	it('detects profanity with accents stripped', () => {
		expect(containsProfanity('enculé')).toBe(true);
		expect(containsProfanity('bâtard')).toBe(true);
	});

	it('detects profanity embedded in strings', () => {
		expect(containsProfanity('supermerde123')).toBe(true);
		expect(containsProfanity('xxfuckxx')).toBe(true);
	});

	it('allows clean usernames', () => {
		expect(containsProfanity('MathKing')).toBe(false);
		expect(containsProfanity('SuperEleve')).toBe(false);
		expect(containsProfanity('Lucas42')).toBe(false);
		expect(containsProfanity('Emma')).toBe(false);
	});
});

describe('validateUsername', () => {
	it('returns error for short usernames', () => {
		expect(validateUsername('')).toBe('auth.usernameTooShort');
		expect(validateUsername('A')).toBe('auth.usernameTooShort');
	});

	it('returns error for long usernames', () => {
		expect(validateUsername('a'.repeat(16))).toBe('auth.usernameTooLong');
	});

	it('returns error for special characters', () => {
		expect(validateUsername('user@name')).toBe('auth.usernameInvalidChars');
		expect(validateUsername('user!name')).toBe('auth.usernameInvalidChars');
	});

	it('returns error for profanity', () => {
		expect(validateUsername('merde123')).toBe('auth.usernameProfanity');
	});

	it('returns null for valid usernames', () => {
		expect(validateUsername('Lucas')).toBeNull();
		expect(validateUsername('Emma42')).toBeNull();
		expect(validateUsername('Super Élève')).toBeNull();
		expect(validateUsername('AB')).toBeNull();
	});

	it('trims whitespace', () => {
		expect(validateUsername('  Lucas  ')).toBeNull();
	});

	it('allows accented characters', () => {
		expect(validateUsername('Éloïse')).toBeNull();
		expect(validateUsername('François')).toBeNull();
	});
});
