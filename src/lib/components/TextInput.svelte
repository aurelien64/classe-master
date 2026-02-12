<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		maxlength?: number;
		error?: string;
		success?: string;
		disabled?: boolean;
		oninput?: (e: Event) => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		maxlength,
		error,
		success,
		disabled = false,
		oninput
	}: Props = $props();

	const borderColor = $derived(
		error
			? 'border-error focus:ring-error/30'
			: success
				? 'border-success focus:ring-success/30'
				: 'border-border focus:ring-primary/30'
	);
</script>

<div class="flex w-full flex-col gap-1">
	<input
		type="text"
		bind:value
		{placeholder}
		{maxlength}
		{disabled}
		{oninput}
		class="min-h-[--size-touch-primary] w-full rounded-[--radius-md] border-2 bg-bg-card px-4 text-center text-xl font-semibold text-text outline-none transition-colors focus:ring-2 {borderColor} {disabled
			? 'opacity-50'
			: ''}"
	/>
	{#if error}
		<p class="text-center text-sm text-error">{error}</p>
	{/if}
	{#if success}
		<p class="text-center text-sm text-success">{success}</p>
	{/if}
</div>
