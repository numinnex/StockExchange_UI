<script lang="ts">
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';
	import { clickOutside } from '../../utils/onClickOutside';
	import SearchList from '../../components/SearchList.svelte';
	import StockDisplay from '../../components/StockDisplay.svelte';

	let searchVal = '';

	export let form;

	$: currentSymbols = form?.data;

	$: isOpen = currentSymbols !== undefined;

	const searchProps = {
		label: 'Symbol',
		placeHolder: 'Look up Symbol/Comapny Name'
	};
</script>

<svelte:head>
	<title>Research</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>

<div class="px-11">
	<p class="text-white uppercase text-xs tracking-widest mb-2">Symbol Lookup</p>
	<div class="bg-white p-4">
		<div class="mb-6">
			<SearchInput {...searchProps} bind:searchVal>
				<Search class="text-lg" />
			</SearchInput>
			<SearchList actionData={form} bind:searchVal />
		</div>
		{#if form?.stock}
			<StockDisplay stockResponse={form.stock} />
		{/if}
	</div>
</div>
