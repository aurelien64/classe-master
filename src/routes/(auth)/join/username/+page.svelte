<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { validateUsername } from '$lib/utils/profanity';

	let username = $state('');
	let error = $state('');

	onMount(() => {
		const grade = sessionStorage.getItem('onboarding-grade');
		if (!grade) goto('/join/grade');
	});

	function handleSubmit() {
		const validationError = validateUsername(username);
		if (validationError) {
			error = $_(validationError);
			return;
		}
		sessionStorage.setItem('onboarding-username', username.trim());
		goto('/join/pin');
	}
</script>

<svelte:head>
	<title>{$_('auth.chooseUsername')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.chooseUsername')} back="/join/grade">
	<div class="flex flex-1 flex-col items-center justify-center gap-6">
		<p class="text-center text-base text-text-muted">{$_('auth.usernameHint')}</p>

		<div class="flex w-full max-w-xs flex-col gap-4">
			<TextInput
				bind:value={username}
				placeholder={$_('auth.usernamePlaceholder')}
				maxlength={15}
				{error}
				oninput={() => (error = '')}
			/>

			<Button onclick={handleSubmit} disabled={username.trim().length < 2}>
				{$_('common.confirm')}
			</Button>
		</div>
	</div>
</PageLayout>
