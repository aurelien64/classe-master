<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { createSoloPlayer } from '$lib/utils/auth';

	let selectedAvatar = $state(1);
	let loading = $state(false);

	onMount(() => {
		const username = sessionStorage.getItem('onboarding-username');
		if (!username) goto('/join/username');
	});

	async function finish() {
		loading = true;
		try {
			const grade = (sessionStorage.getItem('onboarding-grade') ?? 'cp') as 'cp' | 'ce1';
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
	<div class="flex flex-1 flex-col items-center justify-center gap-6">
		<!-- Selected avatar preview -->
		<Avatar avatarId={selectedAvatar} size="lg" />

		<!-- Avatar grid -->
		<div class="grid grid-cols-5 gap-3">
			{#each Array.from({ length: 10 }, (_, i) => i + 1) as id (id)}
				<Avatar
					avatarId={id}
					size="sm"
					selected={selectedAvatar === id}
					onclick={() => (selectedAvatar = id)}
				/>
			{/each}
		</div>

		<div class="w-full max-w-xs">
			<Button onclick={finish} {loading}>{$_('auth.letsGo')}</Button>
		</div>
	</div>
</PageLayout>
