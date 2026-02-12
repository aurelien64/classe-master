<script lang="ts">
	interface Props {
		ondigit: (digit: string) => void;
		onbackspace: () => void;
		onvalidate: () => void;
		validateDisabled?: boolean;
	}

	let { ondigit, onbackspace, onvalidate, validateDisabled = false }: Props = $props();

	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'backspace', '0', 'validate'];

	function handleKey(key: string) {
		if (key === 'backspace') onbackspace();
		else if (key === 'validate') {
			if (!validateDisabled) onvalidate();
		} else ondigit(key);
	}
</script>

<div class="grid grid-cols-3 gap-[--spacing-numpad-gap]">
	{#each keys as key (key)}
		<button
			type="button"
			class="flex h-14 w-full items-center justify-center rounded-[--radius-sm] text-2xl font-bold transition-transform active:scale-95
				{key === 'validate'
				? validateDisabled
					? 'bg-success/50 text-white pointer-events-none'
					: 'bg-success text-white'
				: key === 'backspace'
					? 'bg-bg text-text-muted'
					: 'bg-bg-card border border-border text-text'}"
			onclick={() => handleKey(key)}
			disabled={key === 'validate' && validateDisabled}
		>
			{#if key === 'backspace'}
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
					<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
					<line x1="18" y1="9" x2="12" y2="15" />
					<line x1="12" y1="9" x2="18" y2="15" />
				</svg>
			{:else if key === 'validate'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			{:else}
				{key}
			{/if}
		</button>
	{/each}
</div>
