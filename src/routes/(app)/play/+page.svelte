<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { gameStore } from '$lib/stores/game.svelte';
	import GameTimer from '$lib/components/GameTimer.svelte';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import FeedbackOverlay from '$lib/components/FeedbackOverlay.svelte';
	import ResultsScreen from '$lib/components/ResultsScreen.svelte';

	const SESSION_DURATION = 5 * 60 * 1000;
	let questionStartTime = $state(0);
	let timerInterval: ReturnType<typeof setInterval> | undefined;
	let answerDisabled = $state(false);

	onMount(() => {
		const grade = playerStore.player?.grade ?? 'cp';
		const subLevel = 1;
		gameStore.startSession(grade, subLevel);
		questionStartTime = Date.now();
		startTimer();

		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});

	function startTimer() {
		const startTime = Date.now();
		timerInterval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const remaining = SESSION_DURATION - elapsed;
			gameStore.updateTimer(remaining);

			if (gameStore.session?.isFinished && timerInterval) {
				clearInterval(timerInterval);
			}
		}, 100);
	}

	function handleAnswer(answer: string) {
		if (answerDisabled) return;
		answerDisabled = true;
		const timeTaken = Date.now() - questionStartTime;
		gameStore.submitAnswer(answer, timeTaken);
	}

	function handleContinue() {
		gameStore.nextQuestion();
		questionStartTime = Date.now();
		answerDisabled = false;
		showHint = '';
	}

	function handlePlayAgain() {
		gameStore.reset();
		const grade = playerStore.player?.grade ?? 'cp';
		gameStore.startSession(grade, 1);
		questionStartTime = Date.now();
		answerDisabled = false;
		if (timerInterval) clearInterval(timerInterval);
		startTimer();
	}

	function handleBackToMenu() {
		gameStore.reset();
		goto('/menu');
	}

	let showHint = $state('');

	function handleHint() {
		const hint = gameStore.revealHint();
		if (hint) showHint = hint.text;
	}

	const currentQuestion = $derived(gameStore.getCurrentQuestion());
	const results = $derived(gameStore.getResults());
	const isFinished = $derived(gameStore.session?.isFinished ?? false);
	const canShowHint = $derived(gameStore.hintsRevealed < gameStore.currentHints.length);
</script>

<svelte:head>
	<title>{$_('menu.play')} - {$_('app.name')}</title>
</svelte:head>

{#if isFinished && results}
	<ResultsScreen
		score={results.score}
		correct={results.correct}
		total={results.total}
		accuracy={results.accuracy}
		xpEarned={results.xpEarned}
		coinsEarned={results.coinsEarned}
		onPlayAgain={handlePlayAgain}
		onBackToMenu={handleBackToMenu}
	/>
{:else if currentQuestion}
	<div class="flex flex-1 flex-col">
		<!-- Header with timer and score -->
		<div class="flex items-center gap-4 px-4 py-3">
			<div class="flex-1">
				<GameTimer
					duration={SESSION_DURATION}
					remaining={gameStore.timeRemaining}
					inGracePeriod={gameStore.inGracePeriod}
				/>
			</div>
			<div class="flex items-center gap-2 text-sm font-bold text-text-muted">
				<span>{$_('game.score')}: {gameStore.session?.score ?? 0}</span>
				{#if (gameStore.session?.comboStreak ?? 0) > 1}
					<span class="text-xp-gold">x{gameStore.session?.comboStreak}</span>
				{/if}
			</div>
		</div>

		<!-- Question counter -->
		<div class="px-4 text-center text-xs text-text-muted">
			{(gameStore.session?.currentIndex ?? 0) + 1} / {gameStore.session?.questions.length ?? 0}
		</div>

		<!-- Hint area -->
		{#if showHint}
			<div class="mx-4 rounded-[--radius-md] bg-warning/10 p-3 text-center text-sm text-text">
				&#128161; {showHint}
			</div>
		{/if}

		<!-- Question -->
		<div class="flex flex-1 items-center justify-center px-4 py-6">
			<QuestionCard question={currentQuestion} onAnswer={handleAnswer} disabled={answerDisabled} />
		</div>

		<!-- Hint button -->
		{#if canShowHint && !answerDisabled}
			<div class="flex justify-center pb-4">
				<button
					type="button"
					class="flex items-center gap-1 rounded-full bg-warning/20 px-4 py-2 text-sm font-medium text-text-muted transition-transform active:scale-95"
					onclick={handleHint}
				>
					&#128161; {$_('game.hint')}
				</button>
			</div>
		{/if}
	</div>

	<!-- Feedback overlay -->
	{#if gameStore.lastFeedback}
		<FeedbackOverlay
			correct={gameStore.lastFeedback.correct}
			correctAnswer={gameStore.lastFeedback.correctAnswer}
			onContinue={handleContinue}
		/>
	{/if}
{:else}
	<div class="flex flex-1 items-center justify-center">
		<p class="animate-pulse text-text-muted">{$_('common.loading')}</p>
	</div>
{/if}
