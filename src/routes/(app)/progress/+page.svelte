<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import { loadProgress, getTopicProgress } from '$lib/engine/progression';
	import { getAvailableTopics, getStartingSubLevel, getMaxSubLevelForTopic } from '$lib/engine/templates';
	import { loadActivityLog, getActivityForDays } from '$lib/utils/activity';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import TopicProgressBar from '$lib/components/TopicProgressBar.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ActivityGraph from '$lib/components/ActivityGraph.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import type { Topic } from '$lib/engine/types';
	import type { DailyActivity } from '$lib/utils/activity';

	interface TopicInfo {
		topic: string;
		label: string;
		currentSubLevel: number;
		startSubLevel: number;
		maxSubLevel: number;
	}

	let topicInfos = $state<TopicInfo[]>([]);
	let activityData = $state<DailyActivity[]>([]);
	let overallPercent = $state(0);
	let loading = $state(true);

	const topicI18nKeys: Record<string, string> = {
		addition: 'progress.addition',
		subtraction: 'progress.subtraction',
		multiplication: 'progress.multiplication',
		division: 'progress.division',
		counting: 'progress.counting',
		ordering: 'progress.ordering'
	};

	onMount(async () => {
		const player = playerStore.player;
		if (player) {
			const topics = getAvailableTopics(player.grade);
			const state = await loadProgress(player.id, player.grade);
			topicInfos = topics.map((topic) => {
				const tp = getTopicProgress(state, topic as Topic);
				return {
					topic,
					label: topicI18nKeys[topic] ?? topic,
					currentSubLevel: tp.currentSubLevel,
					startSubLevel: getStartingSubLevel(topic),
					maxSubLevel: getMaxSubLevelForTopic(topic, player.grade)
				};
			});

			// Compute overall grade completion
			if (topicInfos.length > 0) {
				const sum = topicInfos.reduce((acc, info) => {
					const total = info.maxSubLevel - info.startSubLevel + 1;
					const done = Math.max(0, info.currentSubLevel - info.startSubLevel);
					return acc + done / total;
				}, 0);
				overallPercent = Math.round((sum / topicInfos.length) * 100);
			}

			const log = await loadActivityLog(player.id);
			activityData = getActivityForDays(log, 30);
		}
		loading = false;
	});
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
		<div class="flex flex-col gap-5 px-4 py-4">
			<!-- Player summary -->
			<div class="flex items-center gap-4">
				<Avatar avatarId={playerStore.player?.avatar_id ?? 1} size="md" />
				<div class="flex-1">
					<h2 class="text-lg font-bold text-text">{playerStore.player?.username ?? ''}</h2>
					<p class="text-sm text-text-muted">
						{$_('menu.level', { values: { level: playerStore.player?.level ?? 1 } })}
					</p>
				</div>
				<div class="flex flex-col items-end gap-1">
					<span class="text-sm font-bold text-xp-gold"
						>&#9733; {playerStore.player?.xp ?? 0} XP</span
					>
					<span class="text-sm font-bold text-text">&#129689; {playerStore.player?.gems ?? 0}</span>
				</div>
			</div>

			<!-- Overall grade progress -->
			<div class="rounded-[--radius-xl] bg-surface p-4 shadow-[--shadow-card]">
				<div class="mb-2 flex items-baseline justify-between">
					<h3 class="text-base font-bold text-text">
						{$_('progress.overallProgress', {
							values: { grade: (playerStore.player?.grade ?? 'cp').toUpperCase() }
						})}
					</h3>
					<span class="text-sm font-bold text-primary">
						{$_('progress.overallPercent', { values: { percent: overallPercent } })}
					</span>
				</div>
				<ProgressBar value={overallPercent} max={100} color="primary" />
			</div>

			<!-- Topic progress bars -->
			<div class="flex flex-col gap-3">
				{#each topicInfos as info (info.topic)}
					<TopicProgressBar
						topic={info.topic}
						label={$_(info.label)}
						currentSubLevel={info.currentSubLevel}
						startSubLevel={info.startSubLevel}
						maxSubLevel={info.maxSubLevel}
					/>
				{/each}
			</div>

			<!-- Activity time graph -->
			<ActivityGraph data={activityData} />
		</div>
	{/if}
</PageLayout>
