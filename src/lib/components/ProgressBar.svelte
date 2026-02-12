<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		color?: 'primary' | 'success' | 'xp' | 'gem';
	}

	let { value, max = 100, color = 'primary' }: Props = $props();

	const percent = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	const colorClasses = $derived(
		color === 'success'
			? 'bg-success'
			: color === 'xp'
				? 'bg-xp-gold'
				: color === 'gem'
					? 'bg-gem-purple'
					: 'bg-primary'
	);
</script>

<div class="h-3 w-full overflow-hidden rounded-full bg-border">
	<div
		class="h-full rounded-full transition-all duration-500 ease-out {colorClasses}"
		style="width: {percent}%"
	></div>
</div>
