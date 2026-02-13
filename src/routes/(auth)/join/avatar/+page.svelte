<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { createSoloPlayer } from '$lib/utils/auth';
	import { AVATARS } from '$lib/data/avatars';

	let selectedAvatar = $state(1);
	let loading = $state(false);

	const freeAvatars = AVATARS.filter((a) => a.cost === 0);
	const lockedAvatars = AVATARS.filter((a) => a.cost > 0);

	onMount(() => {
		const username = sessionStorage.getItem('onboarding-username');
		if (!username) goto('/join/username');
	});

	async function finish() {
		loading = true;
		try {
			const grade = (sessionStorage.getItem('onboarding-grade') ?? 'cp') as
				| 'cp'
				| 'ce1'
				| 'ce2'
				| 'cm1'
				| 'cm2';
			const username = sessionStorage.getItem('onboarding-username') ?? 'Joueur';
			const pin = sessionStorage.getItem('onboarding-pin') || undefined;

			await createSoloPlayer({
				username,
				avatar_id: selectedAvatar,
				grade,
				pin
			});

			// Clean up onboarding data
			sessionStorage.removeItem('onboarding-grade');
			sessionStorage.removeItem('onboarding-username');
			sessionStorage.removeItem('onboarding-pin');

			goto('/menu');
		} catch {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{$_('auth.chooseAvatar')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.chooseAvatar')} back="/join/pin">
	<div class="flex flex-1 flex-col items-center gap-6 overflow-y-auto py-2">
		<!-- Selected avatar preview -->
		<Avatar avatarId={selectedAvatar} size="lg" />

		<!-- Free avatar grid -->
		<div class="grid grid-cols-5 gap-3">
			{#each freeAvatars as avatar (avatar.id)}
				<Avatar
					avatarId={avatar.id}
					size="sm"
					selected={selectedAvatar === avatar.id}
					onclick={() => (selectedAvatar = avatar.id)}
				/>
			{/each}
		</div>

		<!-- Locked avatars (visible but not selectable) -->
		{#if lockedAvatars.length > 0}
			<div class="flex w-full flex-col gap-2">
				<p class="text-center text-xs font-bold text-text-muted">
					{$_('avatars.locked')} ({lockedAvatars.length})
				</p>
				<div class="grid grid-cols-5 gap-3">
					{#each lockedAvatars as avatar (avatar.id)}
						<div class="relative">
							<div class="opacity-50 grayscale">
								<Avatar avatarId={avatar.id} size="sm" />
							</div>
							<div
								class="pointer-events-none absolute inset-0 flex items-end justify-center rounded-full"
							>
								<span
									class="mb-0.5 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white"
								>
									&#129689;{avatar.cost}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="w-full max-w-xs">
			<button
				type="button"
				onclick={finish}
				disabled={loading}
				class="flex min-h-[60px] w-full items-center justify-center rounded-[--radius-xl] bg-primary text-xl font-bold text-white shadow-[--shadow-card] transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
			>
				{#if loading}
					<span
						class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
					></span>
				{:else}
					{$_('auth.letsGo')}
				{/if}
			</button>
		</div>
	</div>
</PageLayout>
