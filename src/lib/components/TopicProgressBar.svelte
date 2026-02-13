<script lang="ts">
	interface Props {
		topic: string;
		label: string;
		currentSubLevel: number;
		startSubLevel?: number;
		maxSubLevel?: number;
	}

	let { topic, label, currentSubLevel, startSubLevel = 1, maxSubLevel = 10 }: Props = $props();

	const totalSteps = $derived(maxSubLevel - startSubLevel + 1);
	const currentStep = $derived(currentSubLevel - startSubLevel + 1);

	const dots = $derived(
		Array.from({ length: totalSteps }, (_, i) => ({
			level: i + 1,
			status:
				i + 1 < currentStep
					? 'completed'
					: i + 1 === currentStep
						? 'current'
						: ('locked' as 'completed' | 'current' | 'locked')
		}))
	);

	const topicIcons: Record<string, string> = {
		addition: '+',
		subtraction: '-',
		multiplication: '\u00D7',
		division: '\u00F7',
		counting: '#',
		ordering: '<>'
	};

	const topicColors: Record<string, string> = {
		addition: 'bg-success',
		subtraction: 'bg-error',
		multiplication: 'bg-xp-gold',
		division: 'bg-primary',
		counting: 'bg-gem-purple',
		ordering: 'bg-warning'
	};
</script>

<div class="rounded-[--radius-xl] bg-surface p-4 shadow-[--shadow-card]">
	<div class="mb-3 flex items-center gap-2">
		<span
			class="flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-sm font-bold text-white {topicColors[
				topic
			] ?? 'bg-primary'}"
		>
			{topicIcons[topic] ?? '?'}
		</span>
		<span class="font-semibold text-text">{label}</span>
		<span class="ml-auto text-xs font-bold text-text-muted">
			{currentStep} / {totalSteps}
		</span>
	</div>

	<div class="flex gap-1.5">
		{#each dots as dot (dot.level)}
			<div
				class="h-3.5 flex-1 rounded-full transition-all duration-300
					{dot.status === 'completed'
					? (topicColors[topic] ?? 'bg-primary')
					: dot.status === 'current'
						? (topicColors[topic] ?? 'bg-primary') + ' animate-pulse'
						: 'bg-border/40'}"
			></div>
		{/each}
	</div>
</div>
