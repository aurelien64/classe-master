<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { gameStore } from '$lib/stores/game.svelte';
	import { SESSION_DURATION } from '$lib/stores/game.svelte';
	import GameTimer from '$lib/components/GameTimer.svelte';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ResultsScreen from '$lib/components/ResultsScreen.svelte';

	const BREAK_AFTER_SESSIONS = 3;
	let questionStartTime = $state(0);
	let answerDisabled = $state(false);
	let sessionCount = $state(0);
	let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
	let rewardsPersisted = $state(false);

	async function persistSessionRewards() {
		if (rewardsPersisted) return;
		rewardsPersisted = true;

		const res = gameStore.getResults();
		const p = playerStore.player;
		if (!res || !p) return;

		const totalXp = (p.xp ?? 0) + res.xpEarned;
		const levelsGained = Math.floor(totalXp / 100);
		const newLevel = (p.level ?? 1) + levelsGained;
		const remainderXp = totalXp % 100;
		const newGems = (p.gems ?? 0) + res.coinsEarned;

		await playerStore.updatePlayer({ xp: remainderXp, level: newLevel, gems: newGems });
	}

	$effect(() => {
		if (isFinished) {
			untrack(() => persistSessionRewards());
		}
	});

	onMount(() => {
		const player = playerStore.player;
		const grade = player?.grade ?? 'cp';
		const playerId = player?.id ?? 'anonymous';

		// Init progression from IndexedDB, then start session
		gameStore.initProgress(playerId, grade).then(() => {
			const subLevel = gameStore.getSubLevelForTopic('addition');
			gameStore.startSession(grade, subLevel);
			questionStartTime = Date.now();
			gameStore.startTimer();
		});

		return () => {
			gameStore.stopTimer();
			if (feedbackTimer) clearTimeout(feedbackTimer);
		};
	});

	function handleAnswer(answer: string) {
		if (answerDisabled) return;
		answerDisabled = true;
		const timeTaken = Date.now() - questionStartTime;
		gameStore.submitAnswer(answer, timeTaken);

		// Auto-advance after delay
		const delay = gameStore.lastFeedback?.correct ? 800 : 2000;
		feedbackTimer = setTimeout(handleContinue, delay);
	}

	function handleContinue() {
		if (feedbackTimer) clearTimeout(feedbackTimer);
		gameStore.nextQuestion();
		questionStartTime = Date.now();
		answerDisabled = false;
		showHint = '';
	}

	async function handlePlayAgain() {
		await persistSessionRewards();
		sessionCount++;
		rewardsPersisted = false;
		gameStore.reset();
		const grade = playerStore.player?.grade ?? 'cp';
		const subLevel = gameStore.getSubLevelForTopic('addition');
		gameStore.startSession(grade, subLevel);
		questionStartTime = Date.now();
		answerDisabled = false;
		gameStore.startTimer();
	}

	async function handleBackToMenu() {
		await persistSessionRewards();
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
	const mistakes = $derived(gameStore.getMistakes());
	const isFinished = $derived(gameStore.session?.isFinished ?? false);
	const canShowHint = $derived(gameStore.hintsRevealed < gameStore.currentHints.length);
	const showBreakReminder = $derived(sessionCount > 0 && sessionCount % BREAK_AFTER_SESSIONS === 0);
</script>

<svelte:head>
	<title>{$_('menu.play')} - {$_('app.name')}</title>
</svelte:head>

{#if isFinished && results}
	<ResultsScreen
		score={results.score}
		correct={results.correct}
		total={results.total}
		xpEarned={results.xpEarned}
		coinsEarned={results.coinsEarned}
		advancements={results.advancements}
		{mistakes}
		{showBreakReminder}
		onPlayAgain={handlePlayAgain}
		onBackToMenu={handleBackToMenu}
	/>
{:else if currentQuestion}
	<div class="flex h-full flex-1 flex-col overflow-hidden">
		<!-- Compact top bar -->
		<div class="flex items-center gap-3 px-4 py-2">
			<div class="flex-1">
				<GameTimer
					duration={SESSION_DURATION}
					remaining={gameStore.timeRemaining}
					inGracePeriod={gameStore.inGracePeriod}
				/>
			</div>
			<div class="flex items-center gap-2 text-xs font-bold">
				<span class="text-text-muted"
					>{(gameStore.session?.currentIndex ?? 0) + 1}/{gameStore.session?.questions.length ??
						0}</span
				>
				<span class="rounded-full bg-primary/10 px-2 py-0.5 text-primary"
					>{gameStore.session?.score ?? 0}</span
				>
				{#if (gameStore.session?.comboStreak ?? 0) > 1}
					<span class="rounded-full bg-xp-gold/15 px-2 py-0.5 text-xp-gold"
						>x{gameStore.session?.comboStreak}</span
					>
				{/if}
			</div>
		</div>

		<!-- Hint area -->
		{#if showHint}
			<div class="mx-4 rounded-[--radius-md] bg-warning/10 p-2 text-center text-sm text-text">
				&#128161; {showHint}
			</div>
		{/if}

		<!-- Question + Answers (fills remaining space) -->
		<QuestionCard
			question={currentQuestion}
			onAnswer={handleAnswer}
			disabled={answerDisabled}
			feedback={gameStore.lastFeedback}
		/>

		<!-- Hint button -->
		{#if canShowHint && !answerDisabled}
			<div class="flex justify-center pb-3">
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
{:else}
	<div class="flex flex-1 items-center justify-center">
		<p class="animate-pulse text-text-muted">{$_('common.loading')}</p>
	</div>
{/if}
