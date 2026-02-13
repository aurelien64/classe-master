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
		'flex items-center justify-center rounded-[--radius-xl] font-bold transition-all duration-150 active:scale-[0.97] min-h-[60px] w-full text-xl px-6';

	const variantClasses = $derived(
		variant === 'primary'
			? 'bg-primary text-white shadow-[--shadow-card] hover:shadow-[--shadow-elevated] active:shadow-[--shadow-soft]'
			: variant === 'secondary'
				? 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5'
				: 'text-text-muted bg-transparent hover:bg-bg-card'
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
