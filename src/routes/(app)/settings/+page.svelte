<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { playerStore } from '$lib/stores/player.svelte';
	import { clearSession } from '$lib/utils/auth';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';

	let selectedAvatar = $state(playerStore.player?.avatar_id ?? 1);
	let avatarChanged = $derived(selectedAvatar !== (playerStore.player?.avatar_id ?? 1));

	async function saveAvatar() {
		await playerStore.updatePlayer({ avatar_id: selectedAvatar });
	}

	async function switchPlayer() {
		await clearSession();
		goto('/');
	}
</script>

<svelte:head>
	<title>{$_('menu.settings')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('menu.settings')} back="/menu">
	<div class="flex flex-col gap-8">
		<!-- Avatar section -->
		<section class="flex flex-col items-center gap-4">
			<h2 class="text-lg font-bold text-text">{$_('settings.changeAvatar')}</h2>
			<Avatar avatarId={selectedAvatar} size="lg" />
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
			{#if avatarChanged}
				<Button onclick={saveAvatar}>{$_('common.save')}</Button>
			{/if}
		</section>

		<!-- Actions -->
		<section class="flex flex-col gap-4">
			<Button variant="secondary" onclick={switchPlayer}>{$_('settings.switchPlayer')}</Button>
		</section>
	</div>
</PageLayout>
