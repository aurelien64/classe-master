<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Question } from '$lib/engine/types';
	import NumPad from './NumPad.svelte';

	interface Props {
		question: Question;
		onAnswer: (answer: string) => void;
		disabled?: boolean;
		feedback?: { correct: boolean; correctAnswer: string } | null;
	}

	let { question, onAnswer, disabled = false, feedback = null }: Props = $props();

	let freeInputValue = $state('');

	function handleChoice(choice: string) {
		if (disabled) return;
		onAnswer(choice);
	}

	function handleFreeInputValidate() {
		if (disabled || !freeInputValue) return;
		onAnswer(freeInputValue);
		freeInputValue = '';
	}

	// Reset free input when question changes
	$effect(() => {
		if (question.id) {
			freeInputValue = '';
		}
	});

	const answerColors = ['bg-answer-a', 'bg-answer-b', 'bg-answer-c', 'bg-answer-d'];

	function getChoiceState(choice: string) {
		if (!feedback) return 'idle';
		if (feedback.correct && choice === feedback.correctAnswer) return 'correct';
		if (!feedback.correct && choice === feedback.correctAnswer) return 'reveal-correct';
		if (!feedback.correct && choice !== feedback.correctAnswer) return 'wrong';
		return 'idle';
	}

	function getChoiceClasses(choice: string, index: number): string {
		const state = getChoiceState(choice);
		const base =
			'flex min-h-16 items-center justify-center rounded-[--radius-lg] text-xl font-bold transition-all duration-200';

		switch (state) {
			case 'correct':
				return `${base} bg-success text-white animate-pulse-success`;
			case 'reveal-correct':
				return `${base} bg-success/20 text-success border-2 border-success`;
			case 'wrong':
				return `${base} bg-error/10 text-error/60 border-2 border-error/30 animate-shake`;
			default:
				return `${base} ${answerColors[index] ?? 'bg-bg-card'} text-text border-2 border-transparent active:scale-95`;
		}
	}

	function getComparisonClasses(symbol: string): string {
		const state = getChoiceState(symbol);
		const base =
			'flex h-16 flex-1 items-center justify-center rounded-[--radius-lg] text-2xl font-bold transition-all duration-200';

		switch (state) {
			case 'correct':
				return `${base} bg-success text-white animate-pulse-success`;
			case 'reveal-correct':
				return `${base} bg-success/20 text-success border-2 border-success`;
			case 'wrong':
				return `${base} bg-error/10 text-error/60 border-2 border-error/30 animate-shake`;
			default:
				return `${base} bg-primary/10 text-primary border-2 border-primary/20 active:scale-95`;
		}
	}

	const freeInputCorrect = $derived(feedback?.correct ?? false);
	const freeInputWrong = $derived(feedback !== null && !feedback.correct);
</script>

<div class="flex w-full flex-1 flex-col overflow-hidden">
	<!-- Question prompt (takes remaining space, centered) -->
	<div class="flex min-h-0 flex-1 items-center justify-center px-4">
		<p class="text-center text-4xl font-bold text-text">{question.prompt}</p>
	</div>

	<!-- Answer area (fixed at bottom, never pushed out) -->
	<div class="shrink-0 px-4 pb-4">
		{#if question.type === 'multiple_choice' && question.choices}
			<div class="grid w-full grid-cols-2 gap-3">
				{#each question.choices as choice, i (choice)}
					<button
						type="button"
						class={getChoiceClasses(choice, i)}
						{disabled}
						onclick={() => handleChoice(choice)}
					>
						{#if getChoiceState(choice) === 'correct'}
							<span class="mr-2">&#10003;</span>
						{/if}
						{choice}
					</button>
				{/each}
			</div>

			<!-- Inline feedback hint for wrong answers -->
			{#if feedback && !feedback.correct}
				<p class="mt-3 animate-fade-in text-center text-sm text-text-muted">
					{$_('game.correctAnswerWas')}
					<strong class="text-success">{feedback.correctAnswer}</strong>
				</p>
			{/if}
		{:else if question.type === 'comparison' && question.choices}
			<div class="flex w-full gap-3">
				{#each question.choices as symbol (symbol)}
					<button
						type="button"
						class={getComparisonClasses(symbol)}
						{disabled}
						onclick={() => handleChoice(symbol)}
					>
						{#if getChoiceState(symbol) === 'correct'}
							<span class="mr-2">&#10003;</span>
						{/if}
						{symbol}
					</button>
				{/each}
			</div>

			{#if feedback && !feedback.correct}
				<p class="mt-3 animate-fade-in text-center text-sm text-text-muted">
					{$_('game.correctAnswerWas')}
					<strong class="text-success">{feedback.correctAnswer}</strong>
				</p>
			{/if}
		{:else}
			<!-- Free input / fill blank -->
			<div class="flex w-full flex-col gap-3">
				<div
					class="flex min-h-16 w-full items-center justify-center rounded-[--radius-lg] text-3xl font-bold transition-all duration-200
						{freeInputCorrect
						? 'bg-success text-white animate-pulse-success'
						: freeInputWrong
							? 'bg-error/10 text-error border-2 border-error/30 animate-shake'
							: 'border-2 border-border bg-bg-card text-text'}"
				>
					{freeInputValue || '...'}
				</div>

				{#if freeInputWrong}
					<p class="animate-fade-in text-center text-sm text-text-muted">
						{$_('game.correctAnswerWas')}
						<strong class="text-success">{feedback?.correctAnswer}</strong>
					</p>
				{/if}

				<NumPad
					ondigit={(d) => {
						if (freeInputValue.length < 6) freeInputValue += d;
					}}
					onbackspace={() => {
						freeInputValue = freeInputValue.slice(0, -1);
					}}
					onvalidate={handleFreeInputValidate}
					validateDisabled={!freeInputValue || disabled}
				/>
			</div>
		{/if}
	</div>
</div>
