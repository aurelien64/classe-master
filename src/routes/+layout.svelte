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

<div
	class="app-shell mx-auto flex h-dvh w-full max-w-md flex-col overflow-y-auto bg-bg shadow-none sm:my-auto sm:h-[812px] sm:max-h-[90vh] sm:rounded-[--radius-2xl] sm:shadow-xl"
>
	{#if $isLoading}
		<div class="flex flex-1 items-center justify-center">
			<p class="text-text-muted text-base animate-pulse">Chargement...</p>
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
