<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { playerStore } from '$lib/stores/player.svelte';
	import { clearSession } from '$lib/utils/auth';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import {
		getCategories,
		getAvatarsByCategory,
		CATEGORY_LABELS,
		type AvatarMeta
	} from '$lib/data/avatars';

	let selectedAvatar = $state(playerStore.player?.avatar_id ?? 1);
	let activeCategory = $state('basic');
	let unlockMessage = $state('');
	let unlockMessageType = $state<'success' | 'error'>('success');

	const avatarChanged = $derived(selectedAvatar !== (playerStore.player?.avatar_id ?? 1));
	const categories = getCategories();

	function isUnlocked(id: number): boolean {
		return playerStore.isAvatarUnlocked(id);
	}

	async function handleAvatarClick(avatar: AvatarMeta) {
		if (isUnlocked(avatar.id)) {
			selectedAvatar = avatar.id;
			return;
		}

		// Try to unlock
		const success = await playerStore.unlockAvatar(avatar.id, avatar.cost);
		if (success) {
			selectedAvatar = avatar.id;
			unlockMessage = $_('avatars.unlocked');
			unlockMessageType = 'success';
		} else {
			unlockMessage = $_('avatars.notEnoughGems');
			unlockMessageType = 'error';
		}
		setTimeout(() => (unlockMessage = ''), 2500);
	}

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
	<div class="flex flex-col gap-5 overflow-y-auto">
		<!-- Player profile card -->
		<div
			class="flex items-center gap-4 rounded-[--radius-xl] bg-surface p-4 shadow-[--shadow-card]"
		>
			<Avatar avatarId={playerStore.player?.avatar_id ?? 1} size="md" />
			<div class="flex-1">
				<h2 class="text-lg font-bold text-text">{playerStore.player?.username ?? ''}</h2>
				<p class="text-sm text-text-muted">
					{$_('menu.level', { values: { level: playerStore.player?.level ?? 1 } })}
				</p>
			</div>
			<div class="flex flex-col items-end gap-1">
				<div class="flex items-center gap-1.5">
					<span class="text-base text-xp-gold">&#9733;</span>
					<span class="text-sm font-bold text-text">{playerStore.player?.xp ?? 0}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<span class="text-base">&#129689;</span>
					<span class="text-sm font-bold text-text">{playerStore.player?.gems ?? 0}</span>
				</div>
			</div>
		</div>

		<!-- Avatar section -->
		<section class="flex flex-col gap-4">
			<h2 class="text-lg font-bold text-text">{$_('settings.changeAvatar')}</h2>

			<!-- Selected avatar preview -->
			<div class="flex justify-center">
				<Avatar avatarId={selectedAvatar} size="lg" />
			</div>

			<!-- Unlock message -->
			{#if unlockMessage}
				<p
					class="animate-fade-in text-center text-sm font-bold {unlockMessageType === 'success'
						? 'text-success'
						: 'text-error'}"
				>
					{unlockMessage}
				</p>
			{/if}

			<!-- Category tabs -->
			<div class="flex gap-2 overflow-x-auto pb-1">
				{#each categories as cat (cat)}
					<button
						type="button"
						class="shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all
							{activeCategory === cat
							? 'bg-primary text-white shadow-[--shadow-soft]'
							: 'bg-border/20 text-text-muted'}"
						onclick={() => (activeCategory = cat)}
					>
						{$_(CATEGORY_LABELS[cat] ?? cat)}
					</button>
				{/each}
			</div>

			<!-- Avatar grid for active category -->
			<div class="grid grid-cols-5 gap-3">
				{#each getAvatarsByCategory(activeCategory) as avatar (avatar.id)}
					{@const unlocked = isUnlocked(avatar.id)}
					<div class="relative">
						<Avatar
							avatarId={avatar.id}
							size="sm"
							selected={selectedAvatar === avatar.id}
							onclick={() => handleAvatarClick(avatar)}
						/>
						{#if !unlocked}
							<!-- Lock overlay -->
							<div
								class="pointer-events-none absolute inset-0 flex items-end justify-center rounded-full bg-black/40"
							>
								<span
									class="mb-0.5 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white"
								>
									&#129689;{avatar.cost}
								</span>
							</div>
						{/if}
						{#if avatar.rarity !== 'common'}
							<!-- Rarity indicator -->
							<div
								class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white {avatar.rarity ===
								'rare'
									? 'bg-rarity-rare'
									: avatar.rarity === 'epic'
										? 'bg-rarity-epic'
										: avatar.rarity === 'legendary'
											? 'bg-rarity-legendary'
											: 'bg-rarity-mythic'}"
							></div>
						{/if}
					</div>
				{/each}
			</div>

			{#if avatarChanged}
				<Button onclick={saveAvatar}>{$_('common.save')}</Button>
			{/if}
		</section>

		<!-- Actions -->
		<section class="flex flex-col gap-4 pb-4">
			<Button variant="secondary" onclick={switchPlayer}>{$_('settings.switchPlayer')}</Button>
		</section>
	</div>
</PageLayout>
