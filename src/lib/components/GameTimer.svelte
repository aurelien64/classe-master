<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		duration: number;
		remaining: number;
		inGracePeriod?: boolean;
	}

	let { duration, remaining, inGracePeriod = false }: Props = $props();

	const percent = $derived(Math.max(0, (remaining / duration) * 100));
	const color = $derived(
		inGracePeriod ? 'primary' : percent > 50 ? 'success' : percent > 20 ? 'xp' : 'gem'
	);
</script>

<div class="w-full">
	<ProgressBar value={remaining} max={duration} {color} />
</div>
