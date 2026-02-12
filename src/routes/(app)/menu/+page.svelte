<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { loadStreak, saveStreak, recordDailyLogin, getTodayString } from '$lib/utils/streak';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

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
			// Auto-dismiss after 3 seconds
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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="mx-4 animate-bounce rounded-[--radius-lg] bg-surface p-6 text-center shadow-lg">
			<p class="text-3xl">&#128293;</p>
			<p class="mt-2 text-lg font-bold text-text">{$_('streak.dailyReward')}</p>
			<p class="mt-1 text-2xl font-bold text-xp-gold">+{dailyReward} {$_('game.coins')}</p>
			<p class="mt-1 text-sm text-text-muted">
				{$_('streak.day', { values: { count: streakCount } })}
			</p>
		</div>
	</div>
{/if}

<main class="flex flex-1 flex-col items-center px-6 py-8">
	<!-- Player header -->
	<div class="flex flex-col items-center gap-3">
		<Avatar avatarId={playerStore.player?.avatar_id ?? 1} size="lg" />
		<h1 class="text-2xl font-bold text-text">
			{$_('menu.welcome', { values: { username: playerStore.player?.username ?? '' } })}
		</h1>
		<p class="text-sm text-text-muted">
			{$_('menu.level', { values: { level: playerStore.player?.level ?? 1 } })}
		</p>
	</div>

	<!-- Streak display -->
	{#if streakCount > 0}
		<div class="mt-3 flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1">
			<span class="text-lg">&#128293;</span>
			<span class="text-sm font-bold text-text">
				{$_('streak.count', { values: { count: streakCount } })}
			</span>
		</div>
	{/if}

	<!-- XP progress -->
	<div class="mt-4 w-full max-w-xs">
		<div class="mb-1 flex justify-between text-xs text-text-muted">
			<span>{$_('menu.xp')}</span>
			<span>{playerStore.player?.xp ?? 0} / 100</span>
		</div>
		<ProgressBar value={playerStore.player?.xp ?? 0} max={100} color="xp" />
	</div>

	<!-- Stats row -->
	<div class="mt-6 flex gap-6">
		<div class="flex items-center gap-1">
			<span class="text-xp-gold">&#9733;</span>
			<span class="font-bold text-text">{playerStore.player?.xp ?? 0} XP</span>
		</div>
		<div class="flex items-center gap-1">
			<span class="text-gem-purple">&#9830;</span>
			<span class="font-bold text-text">{playerStore.player?.gems ?? 0}</span>
		</div>
	</div>

	<!-- Main actions -->
	<div class="mt-8 flex w-full max-w-xs flex-col gap-4">
		<Button href="/play">{$_('menu.play')}</Button>
		<Button variant="secondary" href="/progress">{$_('menu.progress')}</Button>
		<Button variant="ghost" href="/settings">{$_('menu.settings')}</Button>
	</div>
</main>
