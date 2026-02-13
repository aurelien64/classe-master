<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { DailyActivity } from '$lib/utils/activity';

	interface Props {
		data: DailyActivity[];
	}

	let { data }: Props = $props();

	const WIDTH = 320;
	const HEIGHT = 120;
	const PADDING_LEFT = 30;
	const PADDING_RIGHT = 8;
	const PADDING_TOP = 12;
	const PADDING_BOTTOM = 20;

	const chartW = WIDTH - PADDING_LEFT - PADDING_RIGHT;
	const chartH = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

	const maxQuestions = $derived(Math.max(5, ...data.map((d) => d.questionsAnswered)));

	function x(i: number): number {
		return PADDING_LEFT + (i / Math.max(1, data.length - 1)) * chartW;
	}

	function y(value: number): number {
		return PADDING_TOP + chartH - (value / maxQuestions) * chartH;
	}

	const linePath = $derived.by(() => {
		if (data.length === 0) return '';
		return data
			.map(
				(d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.questionsAnswered).toFixed(1)}`
			)
			.join(' ');
	});

	const areaPath = $derived.by(() => {
		if (data.length === 0) return '';
		const line = data
			.map(
				(d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.questionsAnswered).toFixed(1)}`
			)
			.join(' ');
		return `${line} L${x(data.length - 1).toFixed(1)},${(PADDING_TOP + chartH).toFixed(1)} L${PADDING_LEFT},${(PADDING_TOP + chartH).toFixed(1)} Z`;
	});

	const correctPath = $derived.by(() => {
		if (data.length === 0) return '';
		return data
			.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.questionsCorrect).toFixed(1)}`)
			.join(' ');
	});

	// Y-axis labels
	const yLabels = $derived.by(() => {
		const step = maxQuestions <= 10 ? 5 : Math.ceil(maxQuestions / 3 / 5) * 5;
		const labels: number[] = [0];
		let v = step;
		while (v <= maxQuestions) {
			labels.push(v);
			v += step;
		}
		return labels;
	});

	// X-axis date labels (show ~4 labels)
	const xLabels = $derived.by(() => {
		if (data.length === 0) return [];
		const step = Math.max(1, Math.floor(data.length / 4));
		const labels: { i: number; label: string }[] = [];
		for (let i = 0; i < data.length; i += step) {
			const d = data[i].date;
			const parts = d.split('-');
			labels.push({ i, label: `${parseInt(parts[2])}/${parseInt(parts[1])}` });
		}
		// Always include last day
		const last = data.length - 1;
		if (!labels.find((l) => l.i === last)) {
			const d = data[last].date;
			const parts = d.split('-');
			labels.push({ i: last, label: `${parseInt(parts[2])}/${parseInt(parts[1])}` });
		}
		return labels;
	});

	const totalAnswered = $derived(data.reduce((s, d) => s + d.questionsAnswered, 0));
	const totalCorrect = $derived(data.reduce((s, d) => s + d.questionsCorrect, 0));
	const activeDays = $derived(data.filter((d) => d.questionsAnswered > 0).length);
</script>

<div class="rounded-[--radius-xl] bg-surface p-4 shadow-[--shadow-card]">
	<h3 class="mb-1 text-sm font-bold text-text-muted">{$_('progress.activity')}</h3>

	<!-- Mini stats -->
	<div class="mb-3 flex gap-4 text-xs text-text-muted">
		<span>{activeDays} {$_('progress.activeDays')}</span>
		<span>{totalAnswered} {$_('progress.answered')}</span>
		{#if totalAnswered > 0}
			<span>{Math.round((totalCorrect / totalAnswered) * 100)}% {$_('progress.accuracy')}</span>
		{/if}
	</div>

	<!-- SVG chart -->
	<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full" style="height: auto;">
		<!-- Grid lines -->
		{#each yLabels as val (val)}
			<line
				x1={PADDING_LEFT}
				y1={y(val)}
				x2={WIDTH - PADDING_RIGHT}
				y2={y(val)}
				stroke="#e2e8f0"
				stroke-width="0.5"
			/>
			<text x={PADDING_LEFT - 4} y={y(val) + 3} text-anchor="end" fill="#94a3b8" font-size="7">
				{val}
			</text>
		{/each}

		<!-- Area fill -->
		<path d={areaPath} fill="url(#activityGradient)" />

		<!-- Correct answers line -->
		<path
			d={correctPath}
			fill="none"
			stroke="#22c55e"
			stroke-width="1.5"
			stroke-dasharray="3,2"
			stroke-linecap="round"
		/>

		<!-- Total answers line -->
		<path d={linePath} fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" />

		<!-- Data points (only if few enough to not clutter) -->
		{#if data.length <= 30}
			{#each data as d, i (d.date)}
				{#if d.questionsAnswered > 0}
					<circle cx={x(i)} cy={y(d.questionsAnswered)} r="2.5" fill="#4f46e5" />
				{/if}
			{/each}
		{/if}

		<!-- X-axis labels -->
		{#each xLabels as lbl (lbl.i)}
			<text x={x(lbl.i)} y={HEIGHT - 4} text-anchor="middle" fill="#94a3b8" font-size="7">
				{lbl.label}
			</text>
		{/each}

		<!-- Gradient definition -->
		<defs>
			<linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#4f46e5" stop-opacity="0.2" />
				<stop offset="100%" stop-color="#4f46e5" stop-opacity="0.02" />
			</linearGradient>
		</defs>
	</svg>

	<!-- Legend -->
	<div class="mt-2 flex justify-center gap-4 text-[10px] text-text-muted">
		<span class="flex items-center gap-1">
			<span class="inline-block h-0.5 w-3 rounded bg-primary"></span>
			{$_('progress.totalQuestions')}
		</span>
		<span class="flex items-center gap-1">
			<span class="inline-block h-0.5 w-3 rounded border-t border-dashed border-success"></span>
			{$_('progress.correctAnswers')}
		</span>
	</div>
</div>
