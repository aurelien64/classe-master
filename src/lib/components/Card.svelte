<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children: Snippet;
		footer?: Snippet;
		onclick?: (e: MouseEvent) => void;
		selected?: boolean;
	}

	let { title, children, footer, onclick, selected = false }: Props = $props();

	const interactive = $derived(!!onclick);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="rounded-[--radius-xl] border border-border bg-bg-card p-4 shadow-[--shadow-card] {interactive
		? 'cursor-pointer transition-all duration-150 hover:shadow-[--shadow-elevated] active:scale-[0.98]'
		: ''} {selected ? 'border-primary ring-2 ring-primary/30' : ''}"
	role={interactive ? 'button' : undefined}
	tabindex={interactive ? 0 : undefined}
	{onclick}
	onkeydown={(e) => {
		if (interactive && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onclick?.(e as unknown as MouseEvent);
		}
	}}
>
	{#if title}
		<h3 class="mb-2 text-lg font-bold text-text">{title}</h3>
	{/if}
	{@render children()}
	{#if footer}
		<div class="mt-3 border-t border-border pt-3">
			{@render footer()}
		</div>
	{/if}
</div>
