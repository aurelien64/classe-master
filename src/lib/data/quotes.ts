/**
 * Motivational quotes for children.
 * Short, encouraging, easy to understand.
 */

export interface Quote {
	fr: string;
	en: string;
}

export const QUOTES: Quote[] = [
	{ fr: 'Chaque erreur te rend plus fort !', en: 'Every mistake makes you stronger!' },
	{ fr: 'Tu es capable de grandes choses !', en: "You're capable of great things!" },
	{ fr: "Continue comme ça, c'est super !", en: "Keep going, you're doing great!" },
	{ fr: "Les maths, c'est ton super pouvoir !", en: 'Math is your superpower!' },
	{ fr: 'Un pas de plus vers le succès !', en: 'One more step towards success!' },
	{ fr: 'Bravo pour tes efforts !', en: 'Great job on your efforts!' },
	{ fr: "N'abandonne jamais !", en: 'Never give up!' },
	{ fr: 'Tu progresses chaque jour !', en: "You're getting better every day!" },
	{ fr: 'Crois en toi, tu peux y arriver !', en: 'Believe in yourself, you can do it!' },
	{ fr: 'La pratique mène à la perfection !', en: 'Practice makes perfect!' },
	{ fr: 'Ton cerveau est un muscle : entraîne-le !', en: 'Your brain is a muscle: train it!' },
	{ fr: "C'est en s'entraînant qu'on devient champion !", en: 'Practice makes champions!' },
	{ fr: 'Chaque calcul te rend plus malin !', en: 'Every calculation makes you smarter!' },
	{ fr: 'Les erreurs sont des leçons déguisées !', en: 'Mistakes are lessons in disguise!' },
	{ fr: 'Tu es sur la bonne voie !', en: "You're on the right track!" },
	{ fr: "Rien ne peut t'arrêter !", en: 'Nothing can stop you!' },
	{ fr: 'Les champions aussi ont commencé petit !', en: 'Champions started small too!' },
	{ fr: "Aujourd'hui est un bon jour pour apprendre !", en: 'Today is a great day to learn!' },
	{ fr: 'Ta persévérance est admirable !', en: 'Your perseverance is admirable!' },
	{ fr: 'Chaque jour est une nouvelle chance !', en: 'Every day is a new chance!' },
	{ fr: 'Tu es plus fort que tu ne le penses !', en: "You're stronger than you think!" },
	{
		fr: 'Les petits efforts font les grandes victoires !',
		en: 'Small efforts make big victories!'
	},
	{
		fr: 'Continue, tu es presque au niveau suivant !',
		en: "Keep going, you're almost at the next level!"
	},
	{ fr: 'Ton courage est inspirant !', en: 'Your courage is inspiring!' },
	{ fr: "Apprendre, c'est grandir !", en: 'To learn is to grow!' },
	{ fr: 'Tu fais des progrès incroyables !', en: "You're making incredible progress!" },
	{ fr: 'Le savoir est un trésor !', en: 'Knowledge is a treasure!' },
	{ fr: 'Chaque défi te rend plus courageux !', en: 'Every challenge makes you braver!' },
	{ fr: 'Tu as un talent pour les maths !', en: 'You have a talent for math!' },
	{ fr: "Fais de ton mieux, c'est suffisant !", en: "Do your best, that's enough!" }
];

/**
 * Get a random quote. Uses date-based seed so the quote changes daily
 * but stays consistent throughout the day.
 */
export function getDailyQuote(): Quote {
	const today = new Date();
	const dayIndex = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
	return QUOTES[dayIndex % QUOTES.length];
}

/**
 * Get a random quote (truly random, changes each call).
 */
export function getRandomQuote(): Quote {
	return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
