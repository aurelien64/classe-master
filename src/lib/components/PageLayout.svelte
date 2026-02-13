<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		back?: string;
		children: Snippet;
		header?: Snippet;
	}

	let { title, back, children, header }: Props = $props();
</script>

<div class="flex flex-1 flex-col bg-bg">
	{#if title || back || header}
		<header class="flex items-center gap-3 px-4 py-3">
			{#if back}
				<a
					href={back}
					class="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border"
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
			{/if}
			{#if title}
				<h1 class="flex-1 text-lg font-bold text-text">{title}</h1>
			{/if}
			{#if header}
				{@render header()}
			{/if}
		</header>
	{/if}
	<main class="flex flex-1 flex-col px-6 py-4">
		{@render children()}
	</main>
</div>
