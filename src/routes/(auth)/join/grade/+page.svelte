<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import type { Grade } from '$lib/engine/types';
	import PageLayout from '$lib/components/PageLayout.svelte';

	const grades: { id: Grade; label: string; description: string; emoji: string; color: string }[] =
		[
			{
				id: 'cp',
				label: 'CP',
				description: 'auth.gradeCpDesc',
				emoji: '\u{1F331}',
				color: 'bg-success'
			},
			{
				id: 'ce1',
				label: 'CE1',
				description: 'auth.gradeCe1Desc',
				emoji: '\u{1F334}',
				color: 'bg-primary-light'
			},
			{
				id: 'ce2',
				label: 'CE2',
				description: 'auth.gradeCe2Desc',
				emoji: '\u{1F333}',
				color: 'bg-xp-gold'
			},
			{
				id: 'cm1',
				label: 'CM1',
				description: 'auth.gradeCm1Desc',
				emoji: '\u{1F30B}',
				color: 'bg-primary'
			},
			{
				id: 'cm2',
				label: 'CM2',
				description: 'auth.gradeCm2Desc',
				emoji: '\u{1F525}',
				color: 'bg-error'
			}
		];

	function selectGrade(grade: Grade) {
		sessionStorage.setItem('onboarding-grade', grade);
		goto('/join/username');
	}
</script>

<svelte:head>
	<title>{$_('auth.chooseGrade')} - {$_('app.name')}</title>
</svelte:head>

<PageLayout title={$_('auth.chooseGrade')} back="/join">
	<div class="flex flex-1 flex-col items-center justify-center gap-5">
		<p class="text-center text-base text-text-muted">{$_('auth.gradeSubtitle')}</p>

		<div class="flex w-full max-w-sm flex-col gap-3">
			{#each grades as grade, i (grade.id)}
				<button
					type="button"
					onclick={() => selectGrade(grade.id)}
					class="animate-slide-up flex items-center gap-4 rounded-[--radius-xl] bg-surface p-4 shadow-[--shadow-card] transition-all duration-150 active:scale-[0.97] hover:shadow-[--shadow-elevated]"
					style="animation-delay: {i * 60}ms"
				>
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[--radius-lg] {grade.color} text-xl text-white"
					>
						{grade.emoji}
					</div>
					<div class="flex flex-1 flex-col text-left">
						<span class="text-lg font-bold text-text">{grade.label}</span>
						<span class="text-sm text-text-muted">{$_(grade.description)}</span>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-text-muted"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			{/each}
		</div>
	</div>
</PageLayout>
