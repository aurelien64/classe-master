import type { Topic } from './types';

export interface Hint {
	tier: 1 | 2 | 3;
	text: string;
}

/**
 * Get hints for a question based on topic and operands.
 * Returns up to 3 tiers of increasingly specific hints.
 */
export function getHints(
	topic: Topic,
	operands: { a: number; b?: number },
	correctAnswer: string
): Hint[] {
	switch (topic) {
		case 'addition':
			return getAdditionHints(operands.a, operands.b ?? 0, parseInt(correctAnswer));
		case 'subtraction':
			return getSubtractionHints(operands.a, operands.b ?? 0, parseInt(correctAnswer));
		case 'multiplication':
			return getMultiplicationHints(operands.a, operands.b ?? 0, parseInt(correctAnswer));
		case 'counting':
			return getCountingHints(parseInt(correctAnswer));
		case 'ordering':
			return getOrderingHints(operands.a, operands.b ?? 0, correctAnswer);
		default:
			return getGenericHints();
	}
}

function getAdditionHints(a: number, b: number, result: number): Hint[] {
	const hints: Hint[] = [
		{ tier: 1, text: `Pense à compter à partir du plus grand nombre.` },
		{ tier: 2, text: `Commence à ${Math.max(a, b)} et ajoute ${Math.min(a, b)}.` },
		{
			tier: 3,
			text: `${Math.max(a, b)} + ${Math.min(a, b)} = ${result}. Compte : ${generateCountingSequence(Math.max(a, b), Math.min(a, b))}`
		}
	];
	return hints;
}

function getSubtractionHints(a: number, b: number, result: number): Hint[] {
	return [
		{ tier: 1, text: `Pense à reculer sur la ligne des nombres.` },
		{ tier: 2, text: `Commence à ${a} et recule de ${b}.` },
		{
			tier: 3,
			text: `${a} - ${b} = ${result}. En partant de ${a}, recule de ${b} pour arriver à ${result}.`
		}
	];
}

function getMultiplicationHints(a: number, b: number, result: number): Hint[] {
	const repeatedAddition = Array(Math.min(b, 5)).fill(a).join(' + ');
	return [
		{ tier: 1, text: `Multiplier, c'est comme additionner plusieurs fois le même nombre.` },
		{
			tier: 2,
			text: `${a} × ${b}, c'est ${a} ajouté ${b} fois : ${repeatedAddition}${b > 5 ? '...' : ''}.`
		},
		{ tier: 3, text: `${a} × ${b} = ${result}.` }
	];
}

function getCountingHints(answer: number): Hint[] {
	return [
		{ tier: 1, text: `Compte chaque objet un par un.` },
		{ tier: 2, text: `Le nombre est entre ${Math.max(0, answer - 2)} et ${answer + 2}.` },
		{ tier: 3, text: `La réponse est ${answer}.` }
	];
}

function getOrderingHints(a: number, b: number, correctAnswer: string): Hint[] {
	return [
		{ tier: 1, text: `Imagine les nombres sur une ligne. Le plus grand est à droite.` },
		{ tier: 2, text: `Compare ${a} et ${b}. Lequel est le plus grand ?` },
		{
			tier: 3,
			text: `${a} ${correctAnswer} ${b}. ${a > b ? `${a} est plus grand` : a < b ? `${b} est plus grand` : `Ils sont égaux`}.`
		}
	];
}

function getGenericHints(): Hint[] {
	return [
		{ tier: 1, text: `Prends ton temps et réfléchis bien.` },
		{ tier: 2, text: `Essaie de vérifier ta réponse.` },
		{ tier: 3, text: `Regarde bien les nombres dans la question.` }
	];
}

function generateCountingSequence(start: number, count: number): string {
	const steps = [];
	for (let i = 1; i <= Math.min(count, 5); i++) {
		steps.push(String(start + i));
	}
	return steps.join(', ');
}
