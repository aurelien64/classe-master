<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-dvh flex-col">
	{@render children()}
</div>
