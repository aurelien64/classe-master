<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		duration: number;
		remaining: number;
		inGracePeriod?: boolean;
	}

	let { duration, remaining, inGracePeriod = false }: Props = $props();

	// Use time-based thresholds per spec: green > 60s, yellow > 30s, orange <= 30s
	const remainingSeconds = $derived(Math.max(0, Math.ceil(remaining / 1000)));
	const color = $derived(
		inGracePeriod
			? 'primary'
			: remainingSeconds > 60
				? 'success'
				: remainingSeconds > 30
					? 'xp'
					: 'warning'
	);
</script>

<div class="w-full">
	<ProgressBar value={remaining} max={duration} {color} />
</div>
