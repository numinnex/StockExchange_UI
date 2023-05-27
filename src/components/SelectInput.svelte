<script lang="ts">
	import { fade } from 'svelte/transition';

	let isOpen = false;
	let selectedOption = '';
	export let options: string[] = [];

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(option: string) {
		selectedOption = option;
		isOpen = false;
	}
</script>

<div class="relative">
	<div class="w-full">
		<div
			class="bg-white outline outline-1 outline-neutral-700 rounded-sm px-2 py-3 cursor-pointer flex items-center justify-between"
			on:click={toggleDropdown}
		>
			<span>{selectedOption || 'Select an option'}</span>
			<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M6 8l4 4 4-4H6z" />
			</svg>
		</div>

		{#if isOpen}
			<div
				class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg text-base text-neutral-700"
				in:fade={{ duration: 100 }}
				out:fade={{ duration: 150 }}
			>
				{#each options as option}
					{#if option === selectedOption}
						<div
							class="p-3 cursor-pointer bg-indigo-200 text-indigo-700"
							on:click={() => selectOption(option)}
						>
							{option}
						</div>
					{:else}
						<div class="p-3 cursor-pointer hover:bg-gray-100" on:click={() => selectOption(option)}>
							{option}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
