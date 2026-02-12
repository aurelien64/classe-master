<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { isLoading } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { checkSession } from '$lib/utils/auth';

	let { children } = $props();

	onMount(() => {
		checkSession();
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#4F46E5" />
</svelte:head>

{#if $isLoading}
	<div class="flex min-h-dvh items-center justify-center">
		<p class="text-text-muted text-base animate-pulse">Chargement...</p>
	</div>
{:else}
	{@render children()}
{/if}
