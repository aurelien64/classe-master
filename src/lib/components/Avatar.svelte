<script lang="ts">
	interface Props {
		avatarId: number;
		size?: 'sm' | 'md' | 'lg';
		selected?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { avatarId, size = 'md', selected = false, onclick }: Props = $props();

	const validId = $derived(Math.max(1, Math.min(34, avatarId)));

	const sizeClasses = $derived(
		size === 'sm' ? 'h-12 w-12' : size === 'lg' ? 'h-24 w-24' : 'h-16 w-16'
	);

	const interactive = $derived(!!onclick);
</script>

<button
	type="button"
	class="flex items-center justify-center overflow-hidden rounded-full {sizeClasses}
		{selected ? 'ring-4 ring-primary ring-offset-2' : ''}
		{interactive ? 'cursor-pointer transition-transform active:scale-95' : 'cursor-default'}"
	{onclick}
	tabindex={interactive ? 0 : -1}
>
	<img
		src="/avatars/avatar-{validId}.svg"
		alt="Avatar"
		class="h-full w-full pixel-art"
		draggable="false"
	/>
</button>
