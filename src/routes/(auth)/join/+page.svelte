<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('welcome.join')} - {$_('app.name')}</title>
</svelte:head>

<main class="flex min-h-dvh items-center justify-center px-6 text-center">
	<p class="text-lg text-text-muted">{$_('auth.enterCode')} (Sprint 2)</p>
</main>
