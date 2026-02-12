<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { playerStore } from '$lib/stores/player.svelte';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
</script>

<svelte:head>
	<title>{$_('menu.play')} - {$_('app.name')}</title>
</svelte:head>

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
