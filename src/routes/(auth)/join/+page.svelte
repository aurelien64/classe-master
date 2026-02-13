<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('auth.joinTitle')} - {$_('app.name')}</title>
</svelte:head>

<main
	class="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-bg to-bg px-6"
>
	<!-- Back link -->
	<a
		href="/"
		class="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border"
		aria-label="Retour"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	</a>

	<div class="flex w-full max-w-sm flex-col items-center gap-8">
		<!-- Icon -->
		<div
			class="animate-bounce-in flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
		>
			<span class="text-4xl">&#127918;</span>
		</div>

		<!-- Title -->
		<div class="animate-slide-up flex flex-col gap-2 text-center">
			<h1 class="text-2xl font-bold text-text">{$_('auth.joinTitle')}</h1>
			<p class="text-base text-text-muted">{$_('auth.joinSubtitle')}</p>
		</div>

		<!-- Big action cards -->
		<div class="animate-slide-up delay-100 flex w-full flex-col gap-4">
			<a
				href="/join/grade"
				class="flex items-center gap-4 rounded-[--radius-xl] bg-primary p-5 text-white shadow-[--shadow-card] transition-all duration-150 active:scale-[0.97] hover:shadow-[--shadow-elevated]"
			>
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[--radius-lg] bg-white/20 text-2xl"
				>
					&#9654;
				</div>
				<div class="flex flex-col">
					<span class="text-xl font-bold">{$_('auth.playSolo')}</span>
					<span class="text-sm text-white/70">{$_('auth.gradeSubtitle')}</span>
				</div>
			</a>

			<button
				disabled
				class="flex items-center gap-4 rounded-[--radius-xl] border-2 border-border bg-surface p-5 opacity-50 shadow-[--shadow-soft]"
			>
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[--radius-lg] bg-border/30 text-2xl"
				>
					&#128101;
				</div>
				<div class="flex flex-col text-left">
					<span class="text-xl font-bold text-text">{$_('auth.haveCode')}</span>
					<span class="text-sm text-text-muted">Bientôt disponible</span>
				</div>
			</button>
		</div>
	</div>
</main>
