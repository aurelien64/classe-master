<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { loadProgress, getTopicProgress, type ProgressState } from '$lib/engine/progression';
	import { getAvailableTopics } from '$lib/engine/templates';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import TopicProgressBar from '$lib/components/TopicProgressBar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import type { Topic } from '$lib/engine/types';

	let progressState = $state<ProgressState | null>(null);
	let loading = $state(true);

	const topicLabels: Record<string, string> = {
		addition: 'Addition',
		subtraction: 'Soustraction',
		multiplication: 'Multiplication',
		counting: 'Comptage',
		ordering: 'Comparaison'
	};

	onMount(async () => {
		const player = playerStore.player;
		if (player) {
			progressState = await loadProgress(player.id, player.grade);
		}
		loading = false;
	});

	const topics = $derived(getAvailableTopics(playerStore.player?.grade ?? 'cp'));
</script>

<svelte:head>
	<title>{$_('menu.progress')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('menu.progress')} back="/menu">
	{#if loading}
		<div class="flex flex-1 items-center justify-center">
			<p class="animate-pulse text-text-muted">{$_('common.loading')}</p>
		</div>
	{:else}
		<div class="flex flex-col gap-6 px-4 py-6">
			<!-- Player summary -->
			<div class="flex items-center gap-4">
				<Avatar avatarId={playerStore.player?.avatar_id ?? 1} size="md" />
				<div>
					<h2 class="text-lg font-bold text-text">{playerStore.player?.username ?? ''}</h2>
					<p class="text-sm text-text-muted">
						{$_('menu.level', { values: { level: playerStore.player?.level ?? 1 } })}
					</p>
				</div>
			</div>

			<!-- Topic progress bars -->
			<div class="flex flex-col gap-3">
				{#each topics as topic (topic)}
					{@const tp = progressState
						? getTopicProgress(progressState, topic as Topic)
						: { currentSubLevel: topic === 'subtraction' ? 3 : topic === 'multiplication' ? 5 : 1 }}
					<TopicProgressBar
						{topic}
						label={topicLabels[topic] ?? topic}
						currentSubLevel={tp.currentSubLevel}
					/>
				{/each}
			</div>

			<!-- Overall stats -->
			<div class="rounded-[--radius-lg] bg-surface p-4 shadow-sm">
				<h3 class="mb-2 font-semibold text-text">{$_('progress.stats')}</h3>
				<div class="grid grid-cols-2 gap-4">
					<div class="text-center">
						<p class="text-2xl font-bold text-xp-gold">{playerStore.player?.xp ?? 0}</p>
						<p class="text-xs text-text-muted">XP</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold text-gem-purple">{playerStore.player?.gems ?? 0}</p>
						<p class="text-xs text-text-muted">{$_('game.coins')}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</PageLayout>
