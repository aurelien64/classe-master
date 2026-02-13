import type { TemplateConfig } from './types';

/**
 * CP Addition templates by sub-level.
 */
const cpAddition: TemplateConfig[] = [
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 1,
		operandA: { min: 1, max: 3 },
		operandB: { min: 1, max: 2 },
		resultRange: { min: 2, max: 5 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [80, 20]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 2,
		operandA: { min: 1, max: 9 },
		operandB: { min: 1, max: 2 },
		resultRange: { min: 2, max: 10 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [70, 30]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 3,
		operandA: { min: 1, max: 9 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 2, max: 10 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [60, 25, 15]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 4,
		operandA: { min: 1, max: 9 },
		operandB: { min: 1, max: 6 },
		resultRange: { min: 2, max: 15 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [55, 25, 20]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 5,
		operandA: { min: 1, max: 10 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 2, max: 20 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'wrong_operation'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 30, 20]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 6,
		operandA: { min: 6, max: 9 },
		operandB: { min: 2, max: 5 },
		resultRange: { min: 8, max: 20 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 25, 25]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 7,
		operandA: { min: 10, max: 29 },
		operandB: { min: 1, max: 5 },
		resultRange: { min: 11, max: 34 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'digit_swap'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [45, 30, 25]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 8,
		operandA: { min: 10, max: 40 },
		operandB: { min: 10, max: 30 },
		resultRange: { min: 20, max: 70 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'digit_swap'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 9,
		operandA: { min: 10, max: 50 },
		operandB: { min: 10, max: 40 },
		resultRange: { min: 20, max: 100 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [35, 30, 35]
	},
	{
		topic: 'addition',
		grade: 'cp',
		subLevel: 10,
		operandA: { min: 1, max: 99 },
		operandB: { min: 1, max: 60 },
		resultRange: { min: 2, max: 100 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	}
];

/**
 * CP Subtraction templates by sub-level (starts at SL3).
 */
const cpSubtraction: TemplateConfig[] = [
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 3,
		operandA: { min: 2, max: 5 },
		operandB: { min: 1, max: 2 },
		resultRange: { min: 1, max: 4 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [75, 25]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 4,
		operandA: { min: 3, max: 10 },
		operandB: { min: 1, max: 4 },
		resultRange: { min: 1, max: 9 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [70, 30]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 5,
		operandA: { min: 5, max: 12 },
		operandB: { min: 1, max: 4 },
		resultRange: { min: 1, max: 11 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [60, 25, 15]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 6,
		operandA: { min: 11, max: 15 },
		operandB: { min: 1, max: 4 },
		resultRange: { min: 7, max: 14 },
		distractorStrategies: ['off_by_one', 'forget_borrow', 'wrong_operation'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [55, 25, 20]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 7,
		operandA: { min: 10, max: 20 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 1, max: 19 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'wrong_operation'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 25, 25]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 8,
		operandA: { min: 20, max: 35 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 11, max: 34 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [45, 30, 25]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 9,
		operandA: { min: 30, max: 60 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 21, max: 59 },
		distractorStrategies: ['off_by_one', 'forget_borrow', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'subtraction',
		grade: 'cp',
		subLevel: 10,
		operandA: { min: 20, max: 100 },
		operandB: { min: 1, max: 90 },
		resultRange: { min: 10, max: 99 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	}
];

/**
 * CP Counting templates by sub-level.
 */
const cpCounting: TemplateConfig[] = [
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 1,
		operandA: { min: 1, max: 10 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 1, max: 10 },
		distractorStrategies: ['off_by_one', 'random_nearby'],
		questionTypes: ['multiple_choice'],
		questionTypeWeights: [100]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 2,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 20 },
		distractorStrategies: ['off_by_one', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [70, 30]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 3,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 20 },
		distractorStrategies: ['off_by_one', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 4,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 20 },
		distractorStrategies: ['off_by_one', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 30, 20]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 5,
		operandA: { min: 0, max: 59 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 59 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'digit_swap'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [45, 30, 25]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 6,
		operandA: { min: 0, max: 59 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 59 },
		distractorStrategies: ['off_by_one', 'digit_swap', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 7,
		operandA: { min: 0, max: 79 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 79 },
		distractorStrategies: ['off_by_one', 'digit_swap', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 8,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 100 },
		distractorStrategies: ['off_by_one', 'digit_swap', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [30, 40, 30]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 9,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 100 },
		distractorStrategies: ['off_by_one', 'digit_swap', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'counting',
		grade: 'cp',
		subLevel: 10,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 0 },
		resultRange: { min: 0, max: 100 },
		distractorStrategies: ['off_by_one', 'digit_swap', 'random_nearby'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	}
];

/**
 * CP Ordering templates by sub-level.
 */
const cpOrdering: TemplateConfig[] = [
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 1,
		operandA: { min: 1, max: 10 },
		operandB: { min: 1, max: 10 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one'],
		questionTypes: ['multiple_choice'],
		questionTypeWeights: [100]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 2,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 20 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one'],
		questionTypes: ['multiple_choice', 'comparison'],
		questionTypeWeights: [50, 50]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 3,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 20 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one'],
		questionTypes: ['comparison', 'multiple_choice'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 4,
		operandA: { min: 0, max: 20 },
		operandB: { min: 0, max: 20 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one'],
		questionTypes: ['comparison', 'multiple_choice'],
		questionTypeWeights: [70, 30]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 5,
		operandA: { min: 0, max: 59 },
		operandB: { min: 0, max: 59 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison', 'multiple_choice'],
		questionTypeWeights: [65, 35]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 6,
		operandA: { min: 0, max: 59 },
		operandB: { min: 0, max: 59 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison'],
		questionTypeWeights: [100]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 7,
		operandA: { min: 0, max: 79 },
		operandB: { min: 0, max: 79 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison'],
		questionTypeWeights: [100]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 8,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 100 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison'],
		questionTypeWeights: [100]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 9,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 100 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison'],
		questionTypeWeights: [100]
	},
	{
		topic: 'ordering',
		grade: 'cp',
		subLevel: 10,
		operandA: { min: 0, max: 100 },
		operandB: { min: 0, max: 100 },
		resultRange: { min: 0, max: 0 },
		distractorStrategies: ['off_by_one', 'digit_swap'],
		questionTypes: ['comparison'],
		questionTypeWeights: [100]
	}
];

/**
 * CE1 Addition templates by sub-level.
 * SL1-2: Review CP, mental strategies
 * SL3: Addition with carrying (2-digit + 2-digit)
 * SL4: Addition with carrying (3-digit + 3-digit)
 */
const ce1Addition: TemplateConfig[] = [
	{
		topic: 'addition',
		grade: 'ce1',
		subLevel: 1,
		operandA: { min: 1, max: 20 },
		operandB: { min: 1, max: 10 },
		resultRange: { min: 2, max: 30 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 30, 20]
	},
	{
		topic: 'addition',
		grade: 'ce1',
		subLevel: 2,
		operandA: { min: 10, max: 50 },
		operandB: { min: 10, max: 49 },
		resultRange: { min: 20, max: 99 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30]
	},
	{
		topic: 'addition',
		grade: 'ce1',
		subLevel: 3,
		operandA: { min: 10, max: 99 },
		operandB: { min: 10, max: 99 },
		resultRange: { min: 20, max: 199 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'addition',
		grade: 'ce1',
		subLevel: 4,
		operandA: { min: 100, max: 499 },
		operandB: { min: 100, max: 499 },
		resultRange: { min: 200, max: 999 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	}
];

/**
 * CE1 Subtraction templates by sub-level.
 * SL3: Subtraction review (2-digit - 1-digit, no borrowing)
 * SL4: Subtraction with borrowing (2-digit - 2-digit)
 */
const ce1Subtraction: TemplateConfig[] = [
	{
		topic: 'subtraction',
		grade: 'ce1',
		subLevel: 3,
		operandA: { min: 20, max: 99 },
		operandB: { min: 1, max: 9 },
		resultRange: { min: 11, max: 98 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30]
	},
	{
		topic: 'subtraction',
		grade: 'ce1',
		subLevel: 4,
		operandA: { min: 20, max: 199 },
		operandB: { min: 10, max: 99 },
		resultRange: { min: 1, max: 189 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	}
];

/**
 * CE1 Multiplication templates by sub-level.
 * SL5: x2, x5 tables
 * SL6: x3, x4, x10 tables
 */
const ce1Multiplication: TemplateConfig[] = [
	{
		topic: 'multiplication',
		grade: 'ce1',
		subLevel: 5,
		operandA: { min: 1, max: 10 },
		operandB: { min: 2, max: 5 },
		resultRange: { min: 2, max: 50 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [50, 30, 20],
		constraints: ['b_in_2_5']
	},
	{
		topic: 'multiplication',
		grade: 'ce1',
		subLevel: 6,
		operandA: { min: 1, max: 10 },
		operandB: { min: 3, max: 10 },
		resultRange: { min: 3, max: 100 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30],
		constraints: ['b_in_3_4_10']
	}
];

/**
 * CE2 Addition templates (3-4 digit operations).
 */
const ce2Addition: TemplateConfig[] = [
	{
		topic: 'addition',
		grade: 'ce2',
		subLevel: 1,
		operandA: { min: 100, max: 499 },
		operandB: { min: 100, max: 499 },
		resultRange: { min: 200, max: 999 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'addition',
		grade: 'ce2',
		subLevel: 2,
		operandA: { min: 100, max: 999 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 200, max: 1998 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'addition',
		grade: 'ce2',
		subLevel: 3,
		operandA: { min: 1000, max: 4999 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1100, max: 5998 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'addition',
		grade: 'ce2',
		subLevel: 4,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 1000, max: 3000 },
		resultRange: { min: 2000, max: 8000 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	}
];

/**
 * CE2 Subtraction templates (3-4 digit with borrowing).
 */
const ce2Subtraction: TemplateConfig[] = [
	{
		topic: 'subtraction',
		grade: 'ce2',
		subLevel: 3,
		operandA: { min: 100, max: 500 },
		operandB: { min: 10, max: 99 },
		resultRange: { min: 1, max: 490 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'subtraction',
		grade: 'ce2',
		subLevel: 4,
		operandA: { min: 200, max: 999 },
		operandB: { min: 100, max: 499 },
		resultRange: { min: 1, max: 899 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'subtraction',
		grade: 'ce2',
		subLevel: 5,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1, max: 4900 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'subtraction',
		grade: 'ce2',
		subLevel: 6,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 1000, max: 2500 },
		resultRange: { min: 1, max: 4000 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	}
];

/**
 * CE2 Multiplication templates (all tables, then 2-digit × 1-digit).
 */
const ce2Multiplication: TemplateConfig[] = [
	{
		topic: 'multiplication',
		grade: 'ce2',
		subLevel: 5,
		operandA: { min: 1, max: 10 },
		operandB: { min: 6, max: 7 },
		resultRange: { min: 6, max: 70 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30],
		constraints: ['b_in_6_7']
	},
	{
		topic: 'multiplication',
		grade: 'ce2',
		subLevel: 6,
		operandA: { min: 1, max: 10 },
		operandB: { min: 8, max: 9 },
		resultRange: { min: 8, max: 90 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [35, 30, 35],
		constraints: ['b_in_8_9']
	},
	{
		topic: 'multiplication',
		grade: 'ce2',
		subLevel: 7,
		operandA: { min: 1, max: 10 },
		operandB: { min: 2, max: 10 },
		resultRange: { min: 2, max: 100 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [30, 40, 30]
	},
	{
		topic: 'multiplication',
		grade: 'ce2',
		subLevel: 8,
		operandA: { min: 10, max: 99 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 20, max: 891 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	}
];

/**
 * CE2 Division templates (intro: exact divisions).
 * operandA = quotient range, operandB = divisor range.
 */
const ce2Division: TemplateConfig[] = [
	{
		topic: 'division',
		grade: 'ce2',
		subLevel: 7,
		operandA: { min: 1, max: 10 },
		operandB: { min: 2, max: 5 },
		resultRange: { min: 1, max: 10 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'division',
		grade: 'ce2',
		subLevel: 8,
		operandA: { min: 2, max: 12 },
		operandB: { min: 3, max: 9 },
		resultRange: { min: 2, max: 12 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [40, 30, 30]
	}
];

/**
 * CM1 Addition templates (mental math: 3-4 digit operations).
 */
const cm1Addition: TemplateConfig[] = [
	{
		topic: 'addition',
		grade: 'cm1',
		subLevel: 1,
		operandA: { min: 100, max: 500 },
		operandB: { min: 100, max: 500 },
		resultRange: { min: 200, max: 1000 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'addition',
		grade: 'cm1',
		subLevel: 2,
		operandA: { min: 100, max: 999 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 200, max: 1998 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'addition',
		grade: 'cm1',
		subLevel: 3,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1100, max: 5999 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'addition',
		grade: 'cm1',
		subLevel: 4,
		operandA: { min: 1000, max: 9999 },
		operandB: { min: 1000, max: 5000 },
		resultRange: { min: 2000, max: 14999 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM1 Subtraction templates (mental math: 3-4 digit with borrowing).
 */
const cm1Subtraction: TemplateConfig[] = [
	{
		topic: 'subtraction',
		grade: 'cm1',
		subLevel: 3,
		operandA: { min: 100, max: 999 },
		operandB: { min: 10, max: 99 },
		resultRange: { min: 1, max: 989 },
		distractorStrategies: ['forget_borrow', 'off_by_one', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'subtraction',
		grade: 'cm1',
		subLevel: 4,
		operandA: { min: 200, max: 999 },
		operandB: { min: 100, max: 499 },
		resultRange: { min: 1, max: 899 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'subtraction',
		grade: 'cm1',
		subLevel: 5,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1, max: 4900 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'subtraction',
		grade: 'cm1',
		subLevel: 6,
		operandA: { min: 1000, max: 9999 },
		operandB: { min: 1000, max: 4999 },
		resultRange: { min: 1, max: 8999 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM1 Multiplication templates (mental math: up to 2-digit × 2-digit).
 */
const cm1Multiplication: TemplateConfig[] = [
	{
		topic: 'multiplication',
		grade: 'cm1',
		subLevel: 5,
		operandA: { min: 10, max: 99 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 20, max: 891 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [30, 40, 30]
	},
	{
		topic: 'multiplication',
		grade: 'cm1',
		subLevel: 6,
		operandA: { min: 10, max: 30 },
		operandB: { min: 10, max: 25 },
		resultRange: { min: 100, max: 750 },
		distractorStrategies: ['off_by_one', 'forget_carry', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'multiplication',
		grade: 'cm1',
		subLevel: 7,
		operandA: { min: 100, max: 500 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 200, max: 4500 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'multiplication',
		grade: 'cm1',
		subLevel: 8,
		operandA: { min: 10, max: 50 },
		operandB: { min: 10, max: 50 },
		resultRange: { min: 100, max: 2500 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'digit_swap'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM1 Division templates (Euclidean division, exact).
 * operandA = quotient range, operandB = divisor range.
 */
const cm1Division: TemplateConfig[] = [
	{
		topic: 'division',
		grade: 'cm1',
		subLevel: 7,
		operandA: { min: 2, max: 20 },
		operandB: { min: 2, max: 5 },
		resultRange: { min: 2, max: 20 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['multiple_choice', 'fill_blank', 'free_input'],
		questionTypeWeights: [35, 35, 30]
	},
	{
		topic: 'division',
		grade: 'cm1',
		subLevel: 8,
		operandA: { min: 2, max: 50 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 2, max: 50 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [30, 40, 30]
	},
	{
		topic: 'division',
		grade: 'cm1',
		subLevel: 9,
		operandA: { min: 10, max: 99 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 10, max: 99 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'division',
		grade: 'cm1',
		subLevel: 10,
		operandA: { min: 10, max: 99 },
		operandB: { min: 10, max: 25 },
		resultRange: { min: 2, max: 9 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'wrong_operation'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	}
];

/**
 * CM2 Addition templates (mental math: 3-5 digit operations).
 */
const cm2Addition: TemplateConfig[] = [
	{
		topic: 'addition',
		grade: 'cm2',
		subLevel: 1,
		operandA: { min: 100, max: 999 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 200, max: 1998 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'addition',
		grade: 'cm2',
		subLevel: 2,
		operandA: { min: 1000, max: 5000 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1100, max: 5999 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'addition',
		grade: 'cm2',
		subLevel: 3,
		operandA: { min: 1000, max: 9999 },
		operandB: { min: 1000, max: 9999 },
		resultRange: { min: 2000, max: 19998 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	},
	{
		topic: 'addition',
		grade: 'cm2',
		subLevel: 4,
		operandA: { min: 10000, max: 50000 },
		operandB: { min: 1000, max: 9999 },
		resultRange: { min: 11000, max: 59999 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM2 Subtraction templates (mental math: 3-5 digit with borrowing).
 */
const cm2Subtraction: TemplateConfig[] = [
	{
		topic: 'subtraction',
		grade: 'cm2',
		subLevel: 3,
		operandA: { min: 500, max: 999 },
		operandB: { min: 100, max: 499 },
		resultRange: { min: 1, max: 899 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'subtraction',
		grade: 'cm2',
		subLevel: 4,
		operandA: { min: 1000, max: 9999 },
		operandB: { min: 100, max: 999 },
		resultRange: { min: 1, max: 9899 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input', 'fill_blank'],
		questionTypeWeights: [60, 40]
	},
	{
		topic: 'subtraction',
		grade: 'cm2',
		subLevel: 5,
		operandA: { min: 1000, max: 9999 },
		operandB: { min: 1000, max: 4999 },
		resultRange: { min: 1, max: 8999 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	},
	{
		topic: 'subtraction',
		grade: 'cm2',
		subLevel: 6,
		operandA: { min: 10000, max: 50000 },
		operandB: { min: 1000, max: 9999 },
		resultRange: { min: 1, max: 49000 },
		distractorStrategies: ['forget_borrow', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM2 Multiplication templates (mental math: up to 2-digit × 2-digit).
 */
const cm2Multiplication: TemplateConfig[] = [
	{
		topic: 'multiplication',
		grade: 'cm2',
		subLevel: 5,
		operandA: { min: 10, max: 99 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 20, max: 891 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'multiplication',
		grade: 'cm2',
		subLevel: 6,
		operandA: { min: 100, max: 999 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 200, max: 8991 },
		distractorStrategies: ['forget_carry', 'off_by_one', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'multiplication',
		grade: 'cm2',
		subLevel: 7,
		operandA: { min: 10, max: 99 },
		operandB: { min: 10, max: 25 },
		resultRange: { min: 100, max: 2475 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	},
	{
		topic: 'multiplication',
		grade: 'cm2',
		subLevel: 8,
		operandA: { min: 20, max: 99 },
		operandB: { min: 10, max: 50 },
		resultRange: { min: 200, max: 4950 },
		distractorStrategies: ['forget_carry', 'digit_swap', 'off_by_one'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

/**
 * CM2 Division templates (multi-digit divisions).
 * operandA = quotient range, operandB = divisor range.
 */
const cm2Division: TemplateConfig[] = [
	{
		topic: 'division',
		grade: 'cm2',
		subLevel: 7,
		operandA: { min: 10, max: 99 },
		operandB: { min: 2, max: 9 },
		resultRange: { min: 10, max: 99 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input', 'multiple_choice'],
		questionTypeWeights: [30, 40, 30]
	},
	{
		topic: 'division',
		grade: 'cm2',
		subLevel: 8,
		operandA: { min: 10, max: 99 },
		operandB: { min: 10, max: 25 },
		resultRange: { min: 2, max: 9 },
		distractorStrategies: ['off_by_one', 'wrong_operation', 'random_nearby'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [40, 60]
	},
	{
		topic: 'division',
		grade: 'cm2',
		subLevel: 9,
		operandA: { min: 10, max: 50 },
		operandB: { min: 10, max: 50 },
		resultRange: { min: 2, max: 50 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'digit_swap'],
		questionTypes: ['fill_blank', 'free_input'],
		questionTypeWeights: [35, 65]
	},
	{
		topic: 'division',
		grade: 'cm2',
		subLevel: 10,
		operandA: { min: 20, max: 99 },
		operandB: { min: 10, max: 50 },
		resultRange: { min: 2, max: 99 },
		distractorStrategies: ['off_by_one', 'random_nearby', 'digit_swap'],
		questionTypes: ['free_input'],
		questionTypeWeights: [100]
	}
];

function getAllTemplates(): TemplateConfig[] {
	return [
		...cpAddition,
		...cpSubtraction,
		...cpCounting,
		...cpOrdering,
		...ce1Addition,
		...ce1Subtraction,
		...ce1Multiplication,
		...ce2Addition,
		...ce2Subtraction,
		...ce2Multiplication,
		...ce2Division,
		...cm1Addition,
		...cm1Subtraction,
		...cm1Multiplication,
		...cm1Division,
		...cm2Addition,
		...cm2Subtraction,
		...cm2Multiplication,
		...cm2Division
	];
}

export function getTemplate(
	topic: string,
	grade: string,
	subLevel: number
): TemplateConfig | undefined {
	return getAllTemplates().find(
		(t) => t.topic === topic && t.grade === grade && t.subLevel === subLevel
	);
}

export function getTemplatesForTopic(topic: string, grade: string): TemplateConfig[] {
	return getAllTemplates().filter((t) => t.topic === topic && t.grade === grade);
}

export function getAvailableTopics(grade: string): string[] {
	if (grade === 'cp') return ['counting', 'ordering', 'addition', 'subtraction'];
	if (grade === 'ce1') return ['addition', 'subtraction', 'multiplication'];
	if (grade === 'ce2') return ['addition', 'subtraction', 'multiplication', 'division'];
	if (grade === 'cm1') return ['addition', 'subtraction', 'multiplication', 'division'];
	if (grade === 'cm2') return ['addition', 'subtraction', 'multiplication', 'division'];
	return ['addition', 'subtraction'];
}

export function getStartingSubLevel(topic: string): number {
	if (topic === 'subtraction') return 3;
	if (topic === 'multiplication') return 5;
	if (topic === 'division') return 7;
	return 1;
}
