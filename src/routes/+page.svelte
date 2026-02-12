<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('app.name')}</title>
</svelte:head>

<main class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
	<div class="flex flex-col items-center gap-8">
		<!-- Logo -->
		<div
			class="flex h-28 w-28 items-center justify-center rounded-[--radius-lg] bg-primary text-white shadow-lg"
		>
			<span class="text-3xl font-bold">CM</span>
		</div>

		<!-- Title -->
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold text-primary">{$_('app.name')}</h1>
			<p class="text-base text-text-muted">{$_('app.tagline')}</p>
		</div>

		<!-- Actions -->
		<div class="flex w-full max-w-xs flex-col gap-4">
			<a
				href="/play"
				class="flex min-h-[--size-touch-primary] items-center justify-center rounded-[--radius-md] bg-primary text-xl font-bold text-white shadow-md transition-transform active:scale-95"
			>
				{$_('welcome.play')}
			</a>
			<a
				href="/join"
				class="flex min-h-[--size-touch-min] items-center justify-center rounded-[--radius-md] border-2 border-primary text-lg font-semibold text-primary transition-transform active:scale-95"
			>
				{$_('welcome.join')}
			</a>
		</div>
	</div>
</main>
