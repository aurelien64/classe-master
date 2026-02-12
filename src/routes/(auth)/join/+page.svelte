<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '$lib/components/Button.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
</script>

<svelte:head>
	<title>{$_('auth.joinTitle')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.joinTitle')} back="/">
	<div class="flex flex-1 flex-col items-center justify-center gap-6">
		<p class="text-center text-base text-text-muted">{$_('auth.joinSubtitle')}</p>

		<div class="flex w-full max-w-xs flex-col gap-4">
			<Button href="/join/grade">{$_('auth.playSolo')}</Button>
			<Button variant="secondary" disabled>{$_('auth.haveCode')}</Button>
		</div>
	</div>
</PageLayout>
