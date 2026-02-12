import type { Question, QuestionType, TemplateConfig, Topic, Grade } from './types';
import { generateDistractors, shuffleChoices } from './distractors';
import {
	getTemplate,
	getTemplatesForTopic,
	getAvailableTopics,
	getStartingSubLevel
} from './templates';

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(types: QuestionType[], weights: number[]): QuestionType {
	const total = weights.reduce((a, b) => a + b, 0);
	let r = Math.random() * total;
	for (let i = 0; i < types.length; i++) {
		r -= weights[i];
		if (r <= 0) return types[i];
	}
	return types[0];
}

function generateId(): string {
	return Math.random().toString(36).substring(2, 10);
}

/**
 * Generate a single question from a template config.
 * Retries up to 10 times to satisfy constraints.
 */
function generateFromTemplate(
	template: TemplateConfig,
	recentQuestions: Set<string>
): Question | null {
	for (let attempt = 0; attempt < 10; attempt++) {
		const a = randomInt(template.operandA.min, template.operandA.max);
		const b = randomInt(template.operandB.min, template.operandB.max);

		let correctValue: number;
		let prompt: string;
		let operation: string | undefined;

		switch (template.topic) {
			case 'addition':
				correctValue = a + b;
				prompt = `${a} + ${b} = ?`;
				operation = 'addition';
				break;
			case 'subtraction':
				if (a < b) continue; // A must be >= B
				correctValue = a - b;
				prompt = `${a} - ${b} = ?`;
				operation = 'subtraction';
				break;
			case 'multiplication': {
				// Apply constraints for specific table sets
				const effectiveB = applyMultiplicationConstraint(b, template.constraints);
				correctValue = a * effectiveB;
				prompt = `${a} × ${effectiveB} = ?`;
				operation = 'multiplication';
				break;
			}
			case 'counting':
				correctValue = a;
				prompt = generateCountingPrompt(a, template.subLevel);
				break;
			case 'ordering':
				return generateOrderingQuestion(template, a, b, recentQuestions);
			default:
				continue;
		}

		// Check result range
		if (template.resultRange.min > 0 || template.resultRange.max > 0) {
			if (correctValue < template.resultRange.min || correctValue > template.resultRange.max) {
				continue;
			}
		}

		// Check for recent duplicates
		const fingerprint = `${template.topic}-${a}-${b}`;
		if (recentQuestions.has(fingerprint)) continue;
		recentQuestions.add(fingerprint);

		const questionType = pickWeighted(template.questionTypes, template.questionTypeWeights);
		const correctAnswer = String(correctValue);

		const question: Question = {
			id: generateId(),
			type: questionType,
			topic: template.topic,
			grade: template.grade,
			subLevel: template.subLevel,
			prompt: formatPrompt(prompt, questionType),
			correctAnswer,
			operands: { a, b },
			timeLimit: getTimeLimit(questionType, template.grade)
		};

		if (questionType === 'multiple_choice') {
			const distractorValues = generateDistractors(correctValue, template.distractorStrategies, 2, {
				a,
				b,
				operation
			});
			question.choices = shuffleChoices([correctAnswer, ...distractorValues.map(String)]);
		}

		return question;
	}

	return null;
}

function applyMultiplicationConstraint(b: number, constraints?: string[]): number {
	if (!constraints || constraints.length === 0) return b;
	if (constraints.includes('b_in_2_5')) {
		return Math.random() < 0.5 ? 2 : 5;
	}
	if (constraints.includes('b_in_3_4_10')) {
		const options = [3, 4, 10];
		return options[Math.floor(Math.random() * options.length)];
	}
	return b;
}

function formatPrompt(basePrompt: string, type: QuestionType): string {
	if (type === 'fill_blank') {
		return basePrompt.replace('= ?', '= ___');
	}
	return basePrompt;
}

function generateCountingPrompt(value: number, subLevel: number): string {
	if (subLevel <= 2) {
		return `Combien font ${value} objets ?`;
	}
	if (subLevel <= 4) {
		return `Quel nombre est représenté ?`;
	}
	if (subLevel <= 6) {
		const tens = Math.floor(value / 10);
		const units = value % 10;
		return `${tens} dizaines et ${units} unités = ?`;
	}
	return `Écris le nombre : ${numberToFrench(value)}`;
}

function generateOrderingQuestion(
	template: TemplateConfig,
	a: number,
	b: number,
	recentQuestions: Set<string>
): Question | null {
	// Ensure a and b are different
	if (a === b) return null;

	const fingerprint = `ordering-${Math.min(a, b)}-${Math.max(a, b)}`;
	if (recentQuestions.has(fingerprint)) return null;
	recentQuestions.add(fingerprint);

	const questionType = pickWeighted(template.questionTypes, template.questionTypeWeights);

	if (questionType === 'comparison') {
		const correctAnswer = a > b ? '>' : a < b ? '<' : '=';
		return {
			id: generateId(),
			type: 'comparison',
			topic: 'ordering',
			grade: template.grade,
			subLevel: template.subLevel,
			prompt: `${a} ___ ${b}`,
			correctAnswer,
			choices: ['<', '>', '='],
			operands: { a, b },
			timeLimit: getTimeLimit('comparison', template.grade)
		};
	}

	// Multiple choice: "which is bigger?"
	const correctAnswer = String(Math.max(a, b));
	return {
		id: generateId(),
		type: 'multiple_choice',
		topic: 'ordering',
		grade: template.grade,
		subLevel: template.subLevel,
		prompt: `Quel est le plus grand nombre ?`,
		correctAnswer,
		choices: shuffleChoices([String(a), String(b)]),
		operands: { a, b },
		timeLimit: getTimeLimit('multiple_choice', template.grade)
	};
}

function getTimeLimit(type: QuestionType, grade: Grade): number {
	const timeLimits: Record<QuestionType, Record<Grade, number>> = {
		multiple_choice: { cp: 15, ce1: 12 },
		fill_blank: { cp: 20, ce1: 18 },
		free_input: { cp: 25, ce1: 20 },
		comparison: { cp: 12, ce1: 10 },
		true_false: { cp: 8, ce1: 7 }
	};
	return timeLimits[type]?.[grade] ?? 15;
}

function numberToFrench(n: number): string {
	const units = [
		'zéro',
		'un',
		'deux',
		'trois',
		'quatre',
		'cinq',
		'six',
		'sept',
		'huit',
		'neuf',
		'dix',
		'onze',
		'douze',
		'treize',
		'quatorze',
		'quinze',
		'seize'
	];
	if (n <= 16) return units[n];
	if (n < 20) return `dix-${units[n - 10]}`;
	if (n < 70) {
		const tens = Math.floor(n / 10);
		const u = n % 10;
		const tensWords = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
		if (u === 0) return tensWords[tens];
		if (u === 1) return `${tensWords[tens]} et un`;
		return `${tensWords[tens]}-${units[u]}`;
	}
	if (n < 80) {
		const u = n - 60;
		if (u === 0) return 'soixante';
		return `soixante-${numberToFrench(u)}`;
	}
	if (n < 100) {
		const u = n - 80;
		if (u === 0) return 'quatre-vingts';
		return `quatre-vingt-${numberToFrench(u)}`;
	}
	if (n === 100) return 'cent';
	return String(n);
}

/**
 * Generate a batch of questions for a game session.
 */
export function generateSessionQuestions(
	grade: Grade,
	subLevel: number,
	count: number = 15
): Question[] {
	const topics = getAvailableTopics(grade);
	const recentQuestions = new Set<string>();
	const questions: Question[] = [];

	for (let i = 0; i < count; i++) {
		// Rotate through available topics
		const topic = topics[i % topics.length] as Topic;
		const effectiveSubLevel = Math.min(subLevel, getMaxSubLevel(topic, grade, subLevel));

		const template = getTemplate(topic, grade, effectiveSubLevel);
		if (!template) continue;

		const question = generateFromTemplate(template, recentQuestions);
		if (question) {
			questions.push(question);
		}
	}

	return questions;
}

function getMaxSubLevel(topic: string, grade: string, requestedLevel: number): number {
	const startLevel = getStartingSubLevel(topic);
	if (requestedLevel < startLevel) return startLevel;

	// Find the highest available template for this topic/grade
	const templates = getTemplatesForTopic(topic, grade);
	if (templates.length === 0) return requestedLevel;

	const maxAvailable = Math.max(...templates.map((t) => t.subLevel));
	return Math.min(requestedLevel, maxAvailable);
}

/**
 * Generate questions for a specific topic.
 */
export function generateTopicQuestions(
	topic: Topic,
	grade: Grade,
	subLevel: number,
	count: number = 10
): Question[] {
	const template = getTemplate(topic, grade, subLevel);
	if (!template) return [];

	const recentQuestions = new Set<string>();
	const questions: Question[] = [];

	for (let i = 0; i < count * 2 && questions.length < count; i++) {
		const question = generateFromTemplate(template, recentQuestions);
		if (question) questions.push(question);
	}

	return questions;
}
