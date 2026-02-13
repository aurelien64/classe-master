<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { playerStore } from '$lib/stores/player.svelte';

	let { children } = $props();

	$effect(() => {
		if (!playerStore.isLoading && !playerStore.isAuthenticated) {
			goto('/join');
		}
	});
</script>

{#if playerStore.isLoading || !playerStore.isAuthenticated}
	<div class="flex min-h-dvh items-center justify-center">
		<p class="animate-pulse text-base text-text-muted">{$_('common.loading')}</p>
	</div>
{:else}
	<div class="flex flex-1 flex-col">
		{@render children()}
	</div>
{/if}
