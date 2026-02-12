<script lang="ts">
	import { page } from '$app/state';
	import { _ } from 'svelte-i18n';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>{$_('common.error')} - {$_('app.name')}</title>
</svelte:head>

<main class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
	<div class="flex flex-col items-center gap-6">
		<span class="text-6xl">&#128533;</span>
		<h1 class="text-2xl font-bold text-text">{$_('common.error')}</h1>
		<p class="text-base text-text-muted">
			{page.error?.message ?? $_('error.unknown')}
		</p>
		<div class="flex w-full max-w-xs flex-col gap-3">
			<Button href="/">{$_('error.backHome')}</Button>
		</div>
	</div>
</main>
