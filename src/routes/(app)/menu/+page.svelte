<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { loadStreak, saveStreak, recordDailyLogin, getTodayString } from '$lib/utils/streak';
	import { getDailyQuote } from '$lib/data/quotes';
	import Avatar from '$lib/components/Avatar.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	const quote = getDailyQuote();
	const quoteText = $derived($locale?.startsWith('en') ? quote.en : quote.fr);

	let streakCount = $state(0);
	let dailyReward = $state(0);
	let showReward = $state(false);

	onMount(async () => {
		const player = playerStore.player;
		if (!player) return;

		const streak = await loadStreak(player.id);
		const today = getTodayString();
		const { coins, isNew } = recordDailyLogin(streak, today);

		streakCount = streak.currentStreak;

		if (isNew && coins > 0) {
			dailyReward = coins;
			showReward = true;
			await playerStore.updatePlayer({ gems: (player.gems ?? 0) + coins });
			setTimeout(() => {
				showReward = false;
			}, 3000);
		}

		await saveStreak(player.id, streak);
	});
</script>

<svelte:head>
	<title>{$_('menu.play')} - {$_('app.name')}</title>
</svelte:head>

<!-- Daily reward popup -->
{#if showReward}
	<button
		type="button"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
		onclick={() => (showReward = false)}
	>
		<div
			class="animate-bounce-in mx-4 rounded-[--radius-2xl] bg-surface p-8 text-center shadow-[--shadow-elevated]"
		>
			<p class="text-4xl">&#128293;</p>
			<p class="mt-3 text-xl font-bold text-text">{$_('streak.dailyReward')}</p>
			<p class="mt-2 text-3xl font-bold text-xp-gold">+{dailyReward} &#129689;</p>
			<p class="mt-2 text-sm text-text-muted">
				{$_('streak.day', { values: { count: streakCount } })}
			</p>
		</div>
	</button>
{/if}

<main class="flex flex-1 flex-col items-center px-6 py-8">
	<!-- Player header -->
	<div class="animate-scale-in flex flex-col items-center gap-3">
		<div class="relative">
			<Avatar avatarId={playerStore.player?.avatar_id ?? 1} size="lg" />
			<!-- Level badge -->
			<div
				class="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-[--shadow-card]"
			>
				{playerStore.player?.level ?? 1}
			</div>
		</div>
		<h1 class="text-2xl font-bold text-text">
			{$_('menu.welcome', { values: { username: playerStore.player?.username ?? '' } })}
		</h1>
	</div>

	<!-- Motivational quote -->
	<p class="animate-fade-in mt-2 max-w-xs text-center text-sm italic text-text-muted">
		&ldquo;{quoteText}&rdquo;
	</p>

	<!-- Streak display -->
	{#if streakCount > 0}
		<div
			class="animate-slide-up mt-3 flex items-center gap-2 rounded-full bg-warning/15 px-5 py-2 shadow-[--shadow-soft]"
		>
			<span class="text-xl">&#128293;</span>
			<span class="text-base font-bold text-text">
				{$_('streak.count', { values: { count: streakCount } })}
			</span>
		</div>
	{/if}

	<!-- XP progress -->
	<div class="mt-5 w-full max-w-sm">
		<div class="mb-1.5 flex justify-between text-sm font-medium text-text-muted">
			<span>{$_('menu.xp')}</span>
			<span>{playerStore.player?.xp ?? 0} / 100</span>
		</div>
		<ProgressBar value={playerStore.player?.xp ?? 0} max={100} color="xp" />
	</div>

	<!-- Stats row -->
	<div class="mt-4 flex gap-8">
		<div class="flex items-center gap-2">
			<span class="text-xl text-xp-gold">&#9733;</span>
			<span class="text-lg font-bold text-text">{playerStore.player?.xp ?? 0} XP</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xl">&#129689;</span>
			<span class="text-lg font-bold text-text">{playerStore.player?.gems ?? 0}</span>
		</div>
	</div>

	<!-- Main actions -->
	<div class="mt-8 flex w-full max-w-sm flex-col gap-3">
		<a
			href="/play"
			class="flex items-center gap-4 rounded-[--radius-xl] bg-primary p-5 text-white shadow-[--shadow-card] transition-all duration-150 active:scale-[0.97] hover:shadow-[--shadow-elevated]"
		>
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[--radius-lg] bg-white/20 text-2xl"
			>
				&#9654;
			</div>
			<span class="text-xl font-bold">{$_('menu.play')}</span>
		</a>

		<a
			href="/progress"
			class="flex items-center gap-4 rounded-[--radius-xl] border-2 border-primary/20 bg-surface p-4 shadow-[--shadow-soft] transition-all duration-150 active:scale-[0.97] hover:shadow-[--shadow-card]"
		>
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[--radius-lg] bg-primary/10 text-2xl"
			>
				&#128200;
			</div>
			<span class="text-lg font-bold text-text">{$_('menu.progress')}</span>
		</a>

		<a
			href="/settings"
			class="flex items-center gap-4 rounded-[--radius-xl] bg-surface p-4 transition-all duration-150 active:scale-[0.97] hover:bg-border/20"
		>
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[--radius-lg] bg-border/20 text-2xl"
			>
				&#9881;
			</div>
			<span class="text-lg font-bold text-text-muted">{$_('menu.settings')}</span>
		</a>
	</div>
</main>
