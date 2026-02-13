<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		color?: 'primary' | 'success' | 'xp' | 'gem' | 'warning';
	}

	let { value, max = 100, color = 'primary' }: Props = $props();

	const percent = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	const colorClasses = $derived(
		color === 'success'
			? 'bg-gradient-to-r from-success to-success-light'
			: color === 'xp'
				? 'bg-gradient-to-r from-xp-gold to-warning'
				: color === 'gem'
					? 'bg-gradient-to-r from-gem-purple to-primary-light'
					: color === 'warning'
						? 'bg-gradient-to-r from-warning to-xp-gold'
						: 'bg-gradient-to-r from-primary to-primary-light'
	);
</script>

<div
	class="h-3 w-full overflow-hidden rounded-full bg-border/60"
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
>
	<div
		class="h-full rounded-full transition-all duration-500 ease-out {colorClasses}"
		style="width: {percent}%"
	></div>
</div>
