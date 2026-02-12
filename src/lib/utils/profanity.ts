/**
 * French profanity filter for username validation.
 * Blocklist of inappropriate words for a children's app.
 */
const BLOCKED_WORDS: string[] = [
	'merde',
	'putain',
	'connard',
	'connasse',
	'salaud',
	'salope',
	'enculé',
	'encule',
	'nique',
	'ntm',
	'fdp',
	'pd',
	'pute',
	'bite',
	'couille',
	'cul',
	'chier',
	'bordel',
	'batard',
	'bâtard',
	'foutre',
	'branleur',
	'nazi',
	'hitler',
	'fuck',
	'shit',
	'ass',
	'dick',
	'bitch',
	'damn',
	'cunt',
	'whore',
	'nigger',
	'nigga',
	'porn',
	'sex',
	'penis',
	'vagina',
	'anal',
	'rape',
	'kill',
	'pedo',
	'pédo',
	'zob',
	'tg',
	'ta gueule',
	'ferme ta gueule',
	'bouffon',
	'tapette'
];

/**
 * Checks if a username contains profanity.
 * Normalizes input (lowercase, remove accents/special chars) before checking.
 */
export function containsProfanity(username: string): boolean {
	const normalized = username
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // remove accents
		.replace(/[^a-z0-9\s]/g, ''); // keep only alphanumeric + spaces

	return BLOCKED_WORDS.some((word) => {
		const normalizedWord = word
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9\s]/g, '');
		return normalizedWord.length > 0 && normalized.includes(normalizedWord);
	});
}

/**
 * Validates a username: length, characters, and profanity.
 * Returns null if valid, or an error key for i18n.
 */
export function validateUsername(username: string): string | null {
	const trimmed = username.trim();

	if (trimmed.length < 2) {
		return 'auth.usernameTooShort';
	}

	if (trimmed.length > 15) {
		return 'auth.usernameTooLong';
	}

	if (!/^[a-zA-ZÀ-ÿ0-9\s]+$/.test(trimmed)) {
		return 'auth.usernameInvalidChars';
	}

	if (containsProfanity(trimmed)) {
		return 'auth.usernameProfanity';
	}

	return null;
}
