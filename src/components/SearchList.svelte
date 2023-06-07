<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '../utils/onClickOutside';
	import { createDebouncedSubmit } from '../utils/debouncedSubmit';

	function handleSubmit() {
		//@ts-ignore
		return async ({ update }) => {
			await update({ reset: false });
		};
	}
	const debouncedSubmit = createDebouncedSubmit(10);

	export let actionData: any;
	export let searchVal = '';

	let form: any;

	let selectedSymbol: string;

	$: currentSymbols = actionData?.data;
	$: isOpen = currentSymbols !== undefined;
</script>

<form class="relative" bind:this={form} method="POST" action="?/symbol" use:enhance={handleSubmit}>
	<input name="Symbol" type="text" hidden value={selectedSymbol} />
	{#if actionData?.errors}
		<div class="text-red-500 text-xs ml-2">{actionData.errors}</div>
	{/if}
	{#if actionData?.stockErrors}
		<div class="text-red-500 text-xs ml-2">{actionData.stockErrors[0].message}</div>
	{/if}
	{#if isOpen && currentSymbols && currentSymbols.length > 0}
		<div
			class="absolute -top-4 z-10 bg-white w-1/2 h-48 overflow-y-auto shadow-2xl"
			use:clickOutside={() => {
				isOpen = false;
				searchVal = '';
			}}
		>
			{#each currentSymbols as item}
				<div
					class="flex gap-4 p-2 py-4 hover:bg-neutral-100 cursor-pointer"
					on:click|stopPropagation={() => {
						isOpen = false;
						selectedSymbol = item.symbol;
						debouncedSubmit(form, 10);
					}}
				>
					<div class="shrink-0 w-24 inline-block text-sm font-bold">{item.symbol}</div>
					<div class="inline-block text-sm text-left">{item.description}</div>
				</div>
			{/each}
		</div>
	{/if}
</form>

<style>
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: gray;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 3px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background-color: transparent;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: gray;
	}
</style>
