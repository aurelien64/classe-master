<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { playerStore } from '$lib/stores/player.svelte';

	let { children } = $props();
</script>

{#if playerStore.isLoading}
	<div class="flex min-h-dvh items-center justify-center">
		<p class="animate-pulse text-base text-text-muted">{$_('common.loading')}</p>
	</div>
{:else}
	<div class="flex min-h-dvh flex-col">
		{@render children()}
	</div>
{/if}
