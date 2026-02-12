<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import NumPad from '$lib/components/NumPad.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';

	let pin = $state('');

	onMount(() => {
		const username = sessionStorage.getItem('onboarding-username');
		if (!username) goto('/join/username');
	});

	function addDigit(digit: string) {
		if (pin.length < 4) pin += digit;
	}

	function removeDigit() {
		pin = pin.slice(0, -1);
	}

	function confirmPin() {
		sessionStorage.setItem('onboarding-pin', pin);
		goto('/join/avatar');
	}

	function skip() {
		sessionStorage.removeItem('onboarding-pin');
		goto('/join/avatar');
	}

	const dots = $derived(Array.from({ length: 4 }, (_, i) => i < pin.length));
</script>

<svelte:head>
	<title>{$_('auth.enterPin')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.createPin')} back="/join/username">
	<div class="flex flex-1 flex-col items-center justify-center gap-6">
		<p class="text-center text-base text-text-muted">{$_('auth.pinHint')}</p>

		<!-- PIN dots -->
		<div class="flex gap-3">
			{#each dots as filled, i (i)}
				<div
					class="h-4 w-4 rounded-full transition-colors {filled
						? 'bg-primary'
						: 'border-2 border-border bg-transparent'}"
				></div>
			{/each}
		</div>

		<div class="w-full max-w-xs">
			<NumPad
				ondigit={addDigit}
				onbackspace={removeDigit}
				onvalidate={confirmPin}
				validateDisabled={pin.length !== 4}
			/>
		</div>

		<Button variant="ghost" onclick={skip}>{$_('auth.skipPin')}</Button>
	</div>
</PageLayout>
