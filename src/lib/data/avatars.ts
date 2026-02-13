/**
 * Avatar catalog with categories, rarity, and unlock costs.
 */

export type AvatarRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface AvatarMeta {
	id: number;
	name: string;
	nameKey: string; // i18n key
	category: string;
	rarity: AvatarRarity;
	cost: number; // gems to unlock, 0 = free
}

export const RARITY_COLORS: Record<AvatarRarity, string> = {
	common: 'text-rarity-common',
	rare: 'text-rarity-rare',
	epic: 'text-rarity-epic',
	legendary: 'text-rarity-legendary',
	mythic: 'text-rarity-mythic'
};

export const RARITY_BG: Record<AvatarRarity, string> = {
	common: 'bg-rarity-common/10',
	rare: 'bg-rarity-rare/10',
	epic: 'bg-rarity-epic/10',
	legendary: 'bg-rarity-legendary/10',
	mythic: 'bg-rarity-mythic/10'
};

export const RARITY_BORDER: Record<AvatarRarity, string> = {
	common: 'border-rarity-common/30',
	rare: 'border-rarity-rare/30',
	epic: 'border-rarity-epic/30',
	legendary: 'border-rarity-legendary/40',
	mythic: 'border-rarity-mythic/50'
};

export const RARITY_LABELS: Record<AvatarRarity, string> = {
	common: 'avatars.common',
	rare: 'avatars.rare',
	epic: 'avatars.epic',
	legendary: 'avatars.legendary',
	mythic: 'avatars.mythic'
};

export const CATEGORY_LABELS: Record<string, string> = {
	basic: 'avatars.catBasic',
	gaming: 'avatars.catGaming',
	memes: 'avatars.catMemes',
	fantasy: 'avatars.catFantasy'
};

/**
 * Full avatar catalog.
 * IDs 1-10: basic (free)
 * IDs 11-18: gaming-inspired (rare/epic)
 * IDs 19-26: memes/brainrot (rare/epic/legendary)
 * IDs 27-34: fantasy/cool (epic/legendary/mythic)
 */
export const AVATARS: AvatarMeta[] = [
	// Basic - free
	{ id: 1, name: 'Lion', nameKey: 'avatars.lion', category: 'basic', rarity: 'common', cost: 0 },
	{
		id: 2,
		name: 'Grenouille',
		nameKey: 'avatars.frog',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 3,
		name: 'Renard',
		nameKey: 'avatars.fox',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 4,
		name: 'Hibou',
		nameKey: 'avatars.owl',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{ id: 5, name: 'Chat', nameKey: 'avatars.cat', category: 'basic', rarity: 'common', cost: 0 },
	{
		id: 6,
		name: 'Dragon',
		nameKey: 'avatars.dragon',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 7,
		name: 'Licorne',
		nameKey: 'avatars.unicorn',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 8,
		name: 'Robot',
		nameKey: 'avatars.robot',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 9,
		name: 'Panda',
		nameKey: 'avatars.panda',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},
	{
		id: 10,
		name: 'Astronaute',
		nameKey: 'avatars.astronaut',
		category: 'basic',
		rarity: 'common',
		cost: 0
	},

	// Gaming-inspired (Brawl Stars / Minecraft style)
	{
		id: 11,
		name: 'Chevalier Pixel',
		nameKey: 'avatars.pixelKnight',
		category: 'gaming',
		rarity: 'rare',
		cost: 15
	},
	{
		id: 12,
		name: 'Creeper',
		nameKey: 'avatars.creeper',
		category: 'gaming',
		rarity: 'rare',
		cost: 15
	},
	{
		id: 13,
		name: 'Guerrier',
		nameKey: 'avatars.warrior',
		category: 'gaming',
		rarity: 'rare',
		cost: 20
	},
	{
		id: 14,
		name: 'Mage',
		nameKey: 'avatars.mage',
		category: 'gaming',
		rarity: 'epic',
		cost: 35
	},
	{
		id: 15,
		name: 'Ninja',
		nameKey: 'avatars.ninja',
		category: 'gaming',
		rarity: 'epic',
		cost: 35
	},
	{
		id: 16,
		name: 'Pirate',
		nameKey: 'avatars.pirate',
		category: 'gaming',
		rarity: 'rare',
		cost: 20
	},
	{
		id: 17,
		name: 'Archer',
		nameKey: 'avatars.archer',
		category: 'gaming',
		rarity: 'epic',
		cost: 40
	},
	{
		id: 18,
		name: 'Slime King',
		nameKey: 'avatars.slimeKing',
		category: 'gaming',
		rarity: 'epic',
		cost: 40
	},

	// Memes / Brainrot
	{
		id: 19,
		name: 'Skibidi',
		nameKey: 'avatars.skibidi',
		category: 'memes',
		rarity: 'rare',
		cost: 20
	},
	{
		id: 20,
		name: 'Sigma',
		nameKey: 'avatars.sigma',
		category: 'memes',
		rarity: 'epic',
		cost: 50
	},
	{
		id: 21,
		name: 'Rizz Cat',
		nameKey: 'avatars.rizzCat',
		category: 'memes',
		rarity: 'epic',
		cost: 45
	},
	{
		id: 22,
		name: 'Ohio Boss',
		nameKey: 'avatars.ohioBoss',
		category: 'memes',
		rarity: 'legendary',
		cost: 75
	},
	{
		id: 23,
		name: 'Gyatt',
		nameKey: 'avatars.gyatt',
		category: 'memes',
		rarity: 'rare',
		cost: 25
	},
	{
		id: 24,
		name: 'Fanum Tax',
		nameKey: 'avatars.fanumTax',
		category: 'memes',
		rarity: 'epic',
		cost: 50
	},
	{
		id: 25,
		name: 'Baby Gronk',
		nameKey: 'avatars.babyGronk',
		category: 'memes',
		rarity: 'legendary',
		cost: 80
	},
	{
		id: 26,
		name: 'Mewing',
		nameKey: 'avatars.mewing',
		category: 'memes',
		rarity: 'epic',
		cost: 45
	},

	// Fantasy / Cool
	{
		id: 27,
		name: 'Phoenix',
		nameKey: 'avatars.phoenix',
		category: 'fantasy',
		rarity: 'epic',
		cost: 50
	},
	{
		id: 28,
		name: 'Dark Knight',
		nameKey: 'avatars.darkKnight',
		category: 'fantasy',
		rarity: 'legendary',
		cost: 80
	},
	{
		id: 29,
		name: 'Ice Queen',
		nameKey: 'avatars.iceQueen',
		category: 'fantasy',
		rarity: 'legendary',
		cost: 80
	},
	{
		id: 30,
		name: 'Demon King',
		nameKey: 'avatars.demonKing',
		category: 'fantasy',
		rarity: 'mythic',
		cost: 150
	},
	{
		id: 31,
		name: 'Galaxy Wolf',
		nameKey: 'avatars.galaxyWolf',
		category: 'fantasy',
		rarity: 'legendary',
		cost: 100
	},
	{
		id: 32,
		name: 'Neon Tiger',
		nameKey: 'avatars.neonTiger',
		category: 'fantasy',
		rarity: 'legendary',
		cost: 100
	},
	{
		id: 33,
		name: 'Crystal Dragon',
		nameKey: 'avatars.crystalDragon',
		category: 'fantasy',
		rarity: 'mythic',
		cost: 200
	},
	{
		id: 34,
		name: 'Shadow Reaper',
		nameKey: 'avatars.shadowReaper',
		category: 'fantasy',
		rarity: 'mythic',
		cost: 200
	}
];

export function getAvatarMeta(id: number): AvatarMeta {
	return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function getAvatarsByCategory(category: string): AvatarMeta[] {
	return AVATARS.filter((a) => a.category === category);
}

export function getCategories(): string[] {
	return [...new Set(AVATARS.map((a) => a.category))];
}
