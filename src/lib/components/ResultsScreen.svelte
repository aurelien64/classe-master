<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from './Button.svelte';

	interface Props {
		score: number;
		correct: number;
		total: number;
		accuracy: number;
		xpEarned: number;
		coinsEarned: number;
		onPlayAgain: () => void;
		onBackToMenu: () => void;
	}

	let { score, correct, total, accuracy, xpEarned, coinsEarned, onPlayAgain, onBackToMenu }: Props =
		$props();
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-6 px-6">
	<h2 class="text-2xl font-bold text-text">{$_('game.results')}</h2>

	<!-- Score -->
	<div class="flex flex-col items-center gap-1">
		<span class="text-4xl font-bold text-primary">{score}</span>
		<span class="text-sm text-text-muted">{$_('game.score')}</span>
	</div>

	<!-- Stats grid -->
	<div class="grid w-full max-w-xs grid-cols-2 gap-4">
		<div class="flex flex-col items-center rounded-[--radius-md] bg-bg-card p-3 shadow-sm">
			<span class="text-lg font-bold text-success">{correct}/{total}</span>
			<span class="text-xs text-text-muted">{$_('game.correctCount')}</span>
		</div>
		<div class="flex flex-col items-center rounded-[--radius-md] bg-bg-card p-3 shadow-sm">
			<span class="text-lg font-bold text-primary">{accuracy}%</span>
			<span class="text-xs text-text-muted">{$_('game.accuracy')}</span>
		</div>
		<div class="flex flex-col items-center rounded-[--radius-md] bg-bg-card p-3 shadow-sm">
			<span class="text-lg font-bold text-xp-gold">+{xpEarned}</span>
			<span class="text-xs text-text-muted">XP</span>
		</div>
		<div class="flex flex-col items-center rounded-[--radius-md] bg-bg-card p-3 shadow-sm">
			<span class="text-lg font-bold text-gem-purple">+{coinsEarned}</span>
			<span class="text-xs text-text-muted">{$_('game.coins')}</span>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex w-full max-w-xs flex-col gap-3">
		<Button onclick={onPlayAgain}>{$_('game.playAgain')}</Button>
		<Button variant="secondary" onclick={onBackToMenu}>{$_('common.back')}</Button>
	</div>
</div>
