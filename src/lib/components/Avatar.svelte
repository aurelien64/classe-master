<script lang="ts">
	interface Props {
		avatarId: number;
		size?: 'sm' | 'md' | 'lg';
		selected?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { avatarId, size = 'md', selected = false, onclick }: Props = $props();

	const avatars: Record<number, { emoji: string; bg: string }> = {
		1: { emoji: '🦁', bg: 'bg-amber-100' },
		2: { emoji: '🐸', bg: 'bg-green-100' },
		3: { emoji: '🦊', bg: 'bg-orange-100' },
		4: { emoji: '🐼', bg: 'bg-gray-100' },
		5: { emoji: '🐱', bg: 'bg-pink-100' },
		6: { emoji: '🐶', bg: 'bg-blue-100' },
		7: { emoji: '🦄', bg: 'bg-purple-100' },
		8: { emoji: '🐰', bg: 'bg-rose-100' },
		9: { emoji: '🐢', bg: 'bg-teal-100' },
		10: { emoji: '🦉', bg: 'bg-indigo-100' }
	};

	const avatar = $derived(avatars[avatarId] ?? avatars[1]);
	const sizeClasses = $derived(
		size === 'sm'
			? 'h-12 w-12 text-2xl'
			: size === 'lg'
				? 'h-24 w-24 text-5xl'
				: 'h-16 w-16 text-3xl'
	);

	const interactive = $derived(!!onclick);
</script>

<button
	type="button"
	class="flex items-center justify-center rounded-full {avatar.bg} {sizeClasses}
		{selected ? 'ring-4 ring-primary ring-offset-2' : ''}
		{interactive ? 'cursor-pointer transition-transform active:scale-95' : 'cursor-default'}"
	{onclick}
	tabindex={interactive ? 0 : -1}
>
	<span>{avatar.emoji}</span>
</button>
