<script lang="ts">
	interface Props {
		correct: boolean;
		correctAnswer: string;
		onContinue: () => void;
	}

	let { correct, correctAnswer, onContinue }: Props = $props();

	// Auto-advance after delay
	$effect(() => {
		const timeout = setTimeout(onContinue, correct ? 1200 : 2500);
		return () => clearTimeout(timeout);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center {correct
		? 'bg-success/20'
		: 'bg-error/20'}"
	onclick={onContinue}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') onContinue();
	}}
>
	<div class="flex flex-col items-center gap-3 rounded-[--radius-lg] bg-bg-card p-8 shadow-lg">
		{#if correct}
			<span class="text-5xl">&#11088;</span>
			<p class="text-xl font-bold text-success">Bravo !</p>
		{:else}
			<p class="text-xl font-bold text-error">Essaie encore !</p>
			<p class="text-base text-text-muted">La réponse était <strong>{correctAnswer}</strong></p>
		{/if}
	</div>
</div>
