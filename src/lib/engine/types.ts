export type Grade = 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2';
export type Topic =
	| 'addition'
	| 'subtraction'
	| 'counting'
	| 'ordering'
	| 'multiplication'
	| 'division';

export type QuestionType =
	| 'multiple_choice'
	| 'fill_blank'
	| 'free_input'
	| 'comparison'
	| 'true_false';

export type DistractorStrategy =
	| 'off_by_one'
	| 'wrong_operation'
	| 'forget_carry'
	| 'forget_borrow'
	| 'random_nearby'
	| 'digit_swap';

export interface OperandRange {
	min: number;
	max: number;
}

export interface TemplateConfig {
	topic: Topic;
	grade: Grade;
	subLevel: number;
	operandA: OperandRange;
	operandB: OperandRange;
	resultRange: OperandRange;
	distractorStrategies: DistractorStrategy[];
	questionTypes: QuestionType[];
	questionTypeWeights: number[];
	constraints?: string[];
}

export interface Question {
	id: string;
	type: QuestionType;
	topic: Topic;
	grade: Grade;
	subLevel: number;
	prompt: string;
	correctAnswer: string;
	choices?: string[];
	operands: { a: number; b?: number };
	timeLimit: number;
}

export interface AnswerResult {
	questionId: string;
	playerAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
	timeTakenMs: number;
	hintsUsed: number;
}

export interface SessionState {
	id: string;
	grade: Grade;
	subLevel: number;
	topic: Topic;
	questions: Question[];
	answers: AnswerResult[];
	currentIndex: number;
	startedAt: number;
	timerDuration: number;
	comboStreak: number;
	score: number;
	isFinished: boolean;
}

export interface MistakeItem {
	prompt: string;
	playerAnswer: string;
	correctAnswer: string;
}
