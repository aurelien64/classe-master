<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from './Button.svelte';
	import type { MistakeItem } from '$lib/engine/types';

	interface Props {
		score: number;
		correct: number;
		total: number;
		xpEarned: number;
		coinsEarned: number;
		advancements?: string[];
		mistakes?: MistakeItem[];
		showBreakReminder?: boolean;
		onPlayAgain: () => void;
		onBackToMenu: () => void;
	}

	let {
		score,
		correct,
		total,
		xpEarned,
		coinsEarned,
		advancements = [],
		mistakes = [],
		showBreakReminder = false,
		onPlayAgain,
		onBackToMenu
	}: Props = $props();

	let showingReview = $state(false);
	let reviewAttempts = $state<Record<number, string>>({});
	let revealedAnswers = $state<Set<number>>(new Set());
	let correctRetries = $state<Set<number>>(new Set());

	function handleRetry(index: number) {
		const attempt = (reviewAttempts[index] ?? '').trim();
		if (attempt === mistakes[index].correctAnswer) {
			correctRetries = new Set([...correctRetries, index]);
		}
	}

	function handleReveal(index: number) {
		revealedAnswers = new Set([...revealedAnswers, index]);
	}

	function isResolved(index: number): boolean {
		return correctRetries.has(index) || revealedAnswers.has(index);
	}
</script>

<div class="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-6 py-6">
	<h2 class="animate-fade-in text-2xl font-bold text-text">{$_('game.results')}</h2>

	<!-- Score -->
	<div class="animate-bounce-in flex flex-col items-center gap-1">
		<span class="text-5xl font-bold text-primary">{score}</span>
		<span class="text-sm text-text-muted">{$_('game.score')}</span>
	</div>

	<!-- Advancements -->
	{#if advancements.length > 0}
		<div
			class="animate-slide-up delay-100 w-full max-w-xs rounded-[--radius-xl] bg-success/10 p-4 text-center shadow-[--shadow-soft]"
		>
			<p class="text-base font-bold text-success">&#127881; {$_('progress.levelUp')}</p>
			{#each advancements as topic (topic)}
				<p class="text-sm text-text-muted">{$_(`progress.${topic}`)}</p>
			{/each}
		</div>
	{/if}

	<!-- Stats grid -->
	<div class="grid w-full max-w-xs grid-cols-2 gap-3">
		<div
			class="animate-slide-up delay-100 flex flex-col items-center rounded-[--radius-xl] bg-bg-card p-4 shadow-[--shadow-card]"
		>
			<span class="text-2xl font-bold text-success">{correct}/{total}</span>
			<span class="text-xs text-text-muted">{$_('game.correctCount')}</span>
		</div>
		<div
			class="animate-slide-up delay-200 flex flex-col items-center rounded-[--radius-xl] bg-bg-card p-4 shadow-[--shadow-card]"
		>
			<span class="text-2xl font-bold text-primary">{correct} / {total}</span>
			<span class="text-xs text-text-muted">{$_('game.accuracy')}</span>
		</div>
		<div
			class="animate-slide-up delay-300 flex flex-col items-center rounded-[--radius-xl] bg-bg-card p-4 shadow-[--shadow-card]"
		>
			<span class="text-2xl font-bold text-xp-gold">+{xpEarned}</span>
			<span class="text-xs text-text-muted">{$_('menu.xp')}</span>
		</div>
		<div
			class="animate-slide-up delay-400 flex flex-col items-center rounded-[--radius-xl] bg-bg-card p-4 shadow-[--shadow-card]"
		>
			<span class="text-2xl font-bold text-gem-purple">+{coinsEarned}</span>
			<span class="text-xs text-text-muted">{$_('game.coins')}</span>
		</div>
	</div>

	<!-- Review mistakes -->
	{#if mistakes.length > 0}
		<div class="w-full max-w-xs">
			<button
				type="button"
				class="flex w-full items-center justify-center gap-2 rounded-[--radius-xl] bg-error/10 px-4 py-3 text-sm font-semibold text-error transition-transform active:scale-95"
				onclick={() => (showingReview = !showingReview)}
			>
				<span>&#9888;</span>
				{$_('game.reviewMistakes')} ({$_('game.mistakeCount', {
					values: { count: mistakes.length }
				})})
				<span class="ml-auto text-xs">{showingReview ? '▲' : '▼'}</span>
			</button>

			{#if showingReview}
				<div class="mt-3 flex flex-col gap-3">
					{#each mistakes as mistake, i (i)}
						<div class="rounded-[--radius-xl] bg-bg-card p-4 shadow-[--shadow-card]">
							<p class="mb-2 text-center text-base font-bold text-text">{mistake.prompt}</p>
							<p class="text-center text-sm">
								<span class="text-text-muted">{$_('game.yourAnswer')} : </span>
								<span class="font-semibold text-error">{mistake.playerAnswer}</span>
							</p>

							{#if isResolved(i)}
								<p class="mt-2 text-center text-sm">
									<span class="font-semibold text-success">&#10003; {mistake.correctAnswer}</span>
								</p>
							{:else}
								<div class="mt-3 flex items-center gap-2">
									<input
										type="text"
										inputmode="numeric"
										class="flex-1 rounded-[--radius-md] border border-border bg-bg px-3 py-2 text-center text-sm text-text outline-none focus:border-primary"
										placeholder="?"
										bind:value={reviewAttempts[i]}
										onkeydown={(e) => {
											if (e.key === 'Enter') handleRetry(i);
										}}
									/>
									<button
										type="button"
										class="rounded-[--radius-md] bg-primary px-3 py-2 text-sm font-semibold text-white active:scale-95"
										onclick={() => handleRetry(i)}
									>
										{$_('game.validate')}
									</button>
								</div>
								<button
									type="button"
									class="mt-2 w-full text-center text-xs text-text-muted underline"
									onclick={() => handleReveal(i)}
								>
									{$_('game.revealAnswer')}
								</button>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Break reminder -->
	{#if showBreakReminder}
		<div class="w-full max-w-xs rounded-[--radius-xl] bg-warning/10 p-4 text-center">
			<p class="text-sm text-text">&#9749; {$_('game.breakReminder')}</p>
		</div>
	{/if}

	<!-- Actions -->
	<div class="flex w-full max-w-xs flex-col gap-3">
		<Button onclick={onPlayAgain}>{$_('game.playAgain')}</Button>
		<Button variant="secondary" onclick={onBackToMenu}>{$_('common.back')}</Button>
	</div>
</div>
