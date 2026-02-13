<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('app.name')}</title>
</svelte:head>

<main
	class="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary/10 via-bg to-gem-purple/5 px-6 text-center"
>
	<div class="flex flex-col items-center gap-10">
		<!-- Logo -->
		<div class="animate-bounce-in relative">
			<div
				class="flex h-32 w-32 items-center justify-center rounded-[--radius-2xl] bg-gradient-playful text-white shadow-[--shadow-elevated]"
			>
				<span class="text-4xl font-bold">CM</span>
			</div>
			<!-- Mascot -->
			<div class="absolute -right-4 -bottom-3">
				<img
					src="/avatars/avatar-1.svg"
					alt=""
					class="h-14 w-14 pixel-art rounded-full bg-white shadow-[--shadow-card]"
					draggable="false"
				/>
			</div>
		</div>

		<!-- Title -->
		<div class="animate-slide-up flex flex-col gap-3">
			<h1 class="text-4xl font-bold text-primary">{$_('app.name')}</h1>
			<p class="text-lg text-text-muted">{$_('app.tagline')}</p>
		</div>

		<!-- Actions -->
		<div class="animate-slide-up delay-200 flex w-full max-w-xs flex-col gap-4">
			<a
				href="/join"
				class="flex min-h-[64px] items-center justify-center rounded-[--radius-xl] bg-primary text-xl font-bold text-white shadow-[--shadow-card] transition-all duration-150 active:scale-[0.97] hover:shadow-[--shadow-elevated]"
			>
				&#9654;&nbsp;&nbsp;{$_('welcome.play')}
			</a>
			<button
				disabled
				class="flex min-h-[60px] items-center justify-center rounded-[--radius-xl] border-2 border-primary/30 text-xl font-bold text-primary/50 opacity-60"
			>
				{$_('welcome.join')}
			</button>
		</div>
	</div>
</main>
