<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		disabled?: boolean;
		loading?: boolean;
		href?: string;
		type?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		disabled = false,
		loading = false,
		href,
		type = 'button',
		onclick,
		children
	}: Props = $props();

	const baseClasses =
		'flex items-center justify-center rounded-[--radius-md] font-bold transition-transform active:scale-95 min-h-[--size-touch-primary] w-full text-lg';

	const variantClasses = $derived(
		variant === 'primary'
			? 'bg-primary text-white shadow-md'
			: variant === 'secondary'
				? 'border-2 border-primary text-primary bg-transparent'
				: 'text-text-muted bg-transparent'
	);

	const stateClasses = $derived(disabled || loading ? 'opacity-50 pointer-events-none' : '');
</script>

{#if href && !disabled}
	<a {href} class="{baseClasses} {variantClasses} {stateClasses}">
		{#if loading}
			<span
				class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
			></span>
		{:else}
			{@render children()}
		{/if}
	</a>
{:else}
	<button {type} {disabled} {onclick} class="{baseClasses} {variantClasses} {stateClasses}">
		{#if loading}
			<span
				class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
			></span>
		{:else}
			{@render children()}
		{/if}
	</button>
{/if}
