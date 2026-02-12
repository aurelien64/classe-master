<script lang="ts">
	import type { Question } from '$lib/engine/types';
	import NumPad from './NumPad.svelte';

	interface Props {
		question: Question;
		onAnswer: (answer: string) => void;
		disabled?: boolean;
	}

	let { question, onAnswer, disabled = false }: Props = $props();

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
</script>

<div class="flex flex-col items-center gap-6">
	<!-- Question prompt -->
	<div class="rounded-[--radius-md] bg-bg-card p-6 text-center shadow-sm">
		<p class="text-2xl font-bold text-text">{question.prompt}</p>
	</div>

	<!-- Answer area -->
	{#if question.type === 'multiple_choice' && question.choices}
		<div class="grid w-full max-w-xs grid-cols-2 gap-3">
			{#each question.choices as choice (choice)}
				<button
					type="button"
					class="flex min-h-[--size-touch-primary] items-center justify-center rounded-[--radius-md] border-2 border-border bg-bg-card text-xl font-bold text-text transition-transform active:scale-95"
					{disabled}
					onclick={() => handleChoice(choice)}
				>
					{choice}
				</button>
			{/each}
		</div>
	{:else if question.type === 'comparison' && question.choices}
		<div class="flex w-full max-w-xs justify-center gap-4">
			{#each question.choices as symbol (symbol)}
				<button
					type="button"
					class="flex h-16 w-16 items-center justify-center rounded-[--radius-md] border-2 border-border bg-bg-card text-2xl font-bold text-primary transition-transform active:scale-95"
					{disabled}
					onclick={() => handleChoice(symbol)}
				>
					{symbol}
				</button>
			{/each}
		</div>
	{:else}
		<!-- Free input / fill blank -->
		<div class="flex w-full max-w-xs flex-col items-center gap-4">
			<div
				class="flex min-h-[--size-touch-primary] w-full items-center justify-center rounded-[--radius-md] border-2 border-border bg-bg-card text-2xl font-bold text-text"
			>
				{freeInputValue || '...'}
			</div>
			<NumPad
				ondigit={(d) => {
					if (freeInputValue.length < 4) freeInputValue += d;
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
