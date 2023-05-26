<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	// export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>

<div>
	{#if $page.data.user}
		<p />
	{:else if !$page.data.user}
		<div class="text-center text-white mt-12">
			<h2 class="text-5xl">STOCK EXCHANGE</h2>
		</div>
		<div class="text-center text-neutral-300 mt-6 text-2xl tracking-widest">
			<a href="/register" class="rounded-lg py-3 px-4 bg-slate-800 hover:bg-slate-700"
				>START TRADING</a
			>
		</div>
	{/if}
</div>
