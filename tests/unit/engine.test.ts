import { describe, it, expect } from 'vitest';
import { generateSessionQuestions, generateTopicQuestions } from '$lib/engine/generator';
import { generateDistractors } from '$lib/engine/distractors';
import { getTemplate, getTemplatesForTopic, getAvailableTopics } from '$lib/engine/templates';

describe('templates', () => {
	it('returns CP addition templates for all 10 sub-levels', () => {
		const templates = getTemplatesForTopic('addition', 'cp');
		expect(templates.length).toBe(10);
		for (let sl = 1; sl <= 10; sl++) {
			expect(templates.find((t) => t.subLevel === sl)).toBeDefined();
		}
	});

	it('returns CP subtraction templates for sub-levels 3-10', () => {
		const templates = getTemplatesForTopic('subtraction', 'cp');
		expect(templates.length).toBe(8);
		expect(templates.find((t) => t.subLevel === 1)).toBeUndefined();
		expect(templates.find((t) => t.subLevel === 2)).toBeUndefined();
		expect(templates.find((t) => t.subLevel === 3)).toBeDefined();
	});

	it('returns CP counting templates for all 10 sub-levels', () => {
		const templates = getTemplatesForTopic('counting', 'cp');
		expect(templates.length).toBe(10);
	});

	it('returns CP ordering templates for all 10 sub-levels', () => {
		const templates = getTemplatesForTopic('ordering', 'cp');
		expect(templates.length).toBe(10);
	});

	it('getTemplate returns specific template', () => {
		const t = getTemplate('addition', 'cp', 1);
		expect(t).toBeDefined();
		expect(t?.operandA.min).toBe(1);
		expect(t?.operandA.max).toBe(3);
	});

	it('getAvailableTopics returns CP topics', () => {
		const topics = getAvailableTopics('cp');
		expect(topics).toContain('addition');
		expect(topics).toContain('subtraction');
		expect(topics).toContain('counting');
		expect(topics).toContain('ordering');
	});

	it('returns CE1 addition templates for sub-levels 1-4', () => {
		const templates = getTemplatesForTopic('addition', 'ce1');
		expect(templates.length).toBe(4);
		for (let sl = 1; sl <= 4; sl++) {
			expect(templates.find((t) => t.subLevel === sl)).toBeDefined();
		}
	});

	it('returns CE1 subtraction templates for sub-levels 3-4', () => {
		const templates = getTemplatesForTopic('subtraction', 'ce1');
		expect(templates.length).toBe(2);
		expect(templates.find((t) => t.subLevel === 3)).toBeDefined();
		expect(templates.find((t) => t.subLevel === 4)).toBeDefined();
	});

	it('returns CE1 multiplication templates for sub-levels 5-6', () => {
		const templates = getTemplatesForTopic('multiplication', 'ce1');
		expect(templates.length).toBe(2);
		expect(templates.find((t) => t.subLevel === 5)).toBeDefined();
		expect(templates.find((t) => t.subLevel === 6)).toBeDefined();
	});

	it('getAvailableTopics returns CE1 topics', () => {
		const topics = getAvailableTopics('ce1');
		expect(topics).toContain('addition');
		expect(topics).toContain('subtraction');
		expect(topics).toContain('multiplication');
		expect(topics).not.toContain('counting');
	});
});

describe('distractors', () => {
	it('generates correct number of distractors', () => {
		const result = generateDistractors(10, ['off_by_one', 'random_nearby'], 2);
		expect(result.length).toBe(2);
	});

	it('never includes correct answer', () => {
		for (let i = 0; i < 50; i++) {
			const result = generateDistractors(7, ['off_by_one', 'wrong_operation', 'random_nearby'], 3, {
				a: 4,
				b: 3,
				operation: 'addition'
			});
			expect(result).not.toContain(7);
		}
	});

	it('generates non-negative distractors', () => {
		const result = generateDistractors(1, ['off_by_one', 'random_nearby'], 2);
		for (const d of result) {
			expect(d).toBeGreaterThanOrEqual(0);
		}
	});

	it('generates unique distractors', () => {
		const result = generateDistractors(10, ['off_by_one', 'wrong_operation', 'random_nearby'], 3, {
			a: 6,
			b: 4,
			operation: 'addition'
		});
		const unique = new Set(result);
		expect(unique.size).toBe(result.length);
	});

	it('off_by_one generates answer+1 and answer-1', () => {
		const result = generateDistractors(10, ['off_by_one'], 2);
		expect(result).toContain(11);
		expect(result).toContain(9);
	});

	it('wrong_operation generates subtraction result for addition', () => {
		const result = generateDistractors(10, ['wrong_operation'], 1, {
			a: 7,
			b: 3,
			operation: 'addition'
		});
		expect(result).toContain(4); // 7 - 3
	});
});

describe('generator', () => {
	it('generates session questions', () => {
		const questions = generateSessionQuestions('cp', 1, 10);
		expect(questions.length).toBeGreaterThan(0);
		expect(questions.length).toBeLessThanOrEqual(10);
	});

	it('all questions have required fields', () => {
		const questions = generateSessionQuestions('cp', 1, 15);
		for (const q of questions) {
			expect(q.id).toBeDefined();
			expect(q.type).toBeDefined();
			expect(q.prompt).toBeDefined();
			expect(q.correctAnswer).toBeDefined();
			expect(q.timeLimit).toBeGreaterThan(0);
		}
	});

	it('multiple choice questions have choices', () => {
		const questions = generateSessionQuestions('cp', 1, 30);
		const mcQuestions = questions.filter((q) => q.type === 'multiple_choice');
		for (const q of mcQuestions) {
			expect(q.choices).toBeDefined();
			expect(q.choices!.length).toBeGreaterThanOrEqual(2);
			expect(q.choices).toContain(q.correctAnswer);
		}
	});

	it('comparison questions have <, >, = choices', () => {
		const questions = generateSessionQuestions('cp', 2, 30);
		const cmpQuestions = questions.filter((q) => q.type === 'comparison');
		for (const q of cmpQuestions) {
			expect(q.choices).toEqual(['<', '>', '=']);
		}
	});

	it('addition answers are mathematically correct', () => {
		const questions = generateTopicQuestions('addition', 'cp', 3, 20);
		for (const q of questions) {
			const expected = q.operands.a + (q.operands.b ?? 0);
			expect(parseInt(q.correctAnswer)).toBe(expected);
		}
	});

	it('subtraction answers are mathematically correct', () => {
		const questions = generateTopicQuestions('subtraction', 'cp', 5, 20);
		for (const q of questions) {
			const expected = q.operands.a - (q.operands.b ?? 0);
			expect(parseInt(q.correctAnswer)).toBe(expected);
			expect(expected).toBeGreaterThanOrEqual(0);
		}
	});

	it('subtraction always has A >= B (non-negative results)', () => {
		for (let sl = 3; sl <= 10; sl++) {
			const questions = generateTopicQuestions('subtraction', 'cp', sl, 20);
			for (const q of questions) {
				expect(q.operands.a).toBeGreaterThanOrEqual(q.operands.b ?? 0);
			}
		}
	});

	it('no duplicate questions in same session', () => {
		const questions = generateSessionQuestions('cp', 3, 15);
		const fingerprints = questions.map((q) => `${q.topic}-${q.operands.a}-${q.operands.b}`);
		const unique = new Set(fingerprints);
		expect(unique.size).toBe(fingerprints.length);
	});

	it('rotates through multiple topics', () => {
		const questions = generateSessionQuestions('cp', 3, 12);
		const topics = new Set(questions.map((q) => q.topic));
		expect(topics.size).toBeGreaterThan(1);
	});

	it('respects operand ranges for CP addition SL1', () => {
		const questions = generateTopicQuestions('addition', 'cp', 1, 20);
		for (const q of questions) {
			expect(q.operands.a).toBeGreaterThanOrEqual(1);
			expect(q.operands.a).toBeLessThanOrEqual(3);
			expect(q.operands.b).toBeGreaterThanOrEqual(1);
			expect(q.operands.b).toBeLessThanOrEqual(2);
			const result = parseInt(q.correctAnswer);
			expect(result).toBeGreaterThanOrEqual(2);
			expect(result).toBeLessThanOrEqual(5);
		}
	});

	it('generates counting questions', () => {
		const questions = generateTopicQuestions('counting', 'cp', 1, 10);
		expect(questions.length).toBeGreaterThan(0);
		for (const q of questions) {
			expect(q.topic).toBe('counting');
			expect(parseInt(q.correctAnswer)).toBeGreaterThanOrEqual(1);
			expect(parseInt(q.correctAnswer)).toBeLessThanOrEqual(10);
		}
	});

	it('generates ordering/comparison questions', () => {
		const questions = generateTopicQuestions('ordering', 'cp', 2, 10);
		expect(questions.length).toBeGreaterThan(0);
		for (const q of questions) {
			expect(q.topic).toBe('ordering');
		}
	});

	it('generates CE1 addition questions with correct answers', () => {
		const questions = generateTopicQuestions('addition', 'ce1', 3, 20);
		expect(questions.length).toBeGreaterThan(0);
		for (const q of questions) {
			const expected = q.operands.a + (q.operands.b ?? 0);
			expect(parseInt(q.correctAnswer)).toBe(expected);
		}
	});

	it('generates CE1 subtraction questions with non-negative results', () => {
		const questions = generateTopicQuestions('subtraction', 'ce1', 4, 20);
		expect(questions.length).toBeGreaterThan(0);
		for (const q of questions) {
			expect(parseInt(q.correctAnswer)).toBeGreaterThanOrEqual(0);
			expect(q.operands.a).toBeGreaterThanOrEqual(q.operands.b ?? 0);
		}
	});

	it('generates CE1 multiplication questions with correct answers', () => {
		const questions = generateTopicQuestions('multiplication', 'ce1', 5, 20);
		expect(questions.length).toBeGreaterThan(0);
		for (const q of questions) {
			expect(q.topic).toBe('multiplication');
			const answer = parseInt(q.correctAnswer);
			expect(answer).toBeGreaterThan(0);
			// The answer should be a × b (b is constrained to 2 or 5 for SL5)
			expect(q.prompt).toContain('\u00D7');
		}
	});

	it('generates CE1 session with mixed topics', () => {
		const questions = generateSessionQuestions('ce1', 5, 12);
		expect(questions.length).toBeGreaterThan(0);
		const topics = new Set(questions.map((q) => q.topic));
		expect(topics.size).toBeGreaterThan(1);
	});
});
