<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';

	const grades = [
		{ id: 'cp', label: 'CP', description: 'auth.gradeCpDesc' },
		{ id: 'ce1', label: 'CE1', description: 'auth.gradeCe1Desc' }
	] as const;

	function selectGrade(grade: 'cp' | 'ce1') {
		// Store grade choice in sessionStorage for the onboarding flow
		sessionStorage.setItem('onboarding-grade', grade);
		goto('/join/username');
	}
</script>

<svelte:head>
	<title>{$_('auth.chooseGrade')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.chooseGrade')} back="/join">
	<div class="flex flex-1 flex-col items-center justify-center gap-6">
		<p class="text-center text-base text-text-muted">{$_('auth.gradeSubtitle')}</p>

		<div class="flex w-full max-w-xs flex-col gap-4">
			{#each grades as grade (grade.id)}
				<Card onclick={() => selectGrade(grade.id)}>
					<div class="flex flex-col items-center gap-2 py-4">
						<span class="text-2xl font-bold text-primary">{grade.label}</span>
						<span class="text-sm text-text-muted">{$_(grade.description)}</span>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</PageLayout>
