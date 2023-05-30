<script lang="ts">
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';
	import { clickOutside } from '../../utils/onClickOutside';
	import SearchList from '../../components/SearchList.svelte';

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
	<div class="bg-white p-4">
		<div>
			<SearchInput {...searchProps} bind:searchVal>
				<Search class="text-lg" />
			</SearchInput>
			<SearchList actionData={form} bind:searchVal />
		</div>
		{#if form?.stock}
			{form.stock[0].symbol}
			{form.stock[0].name}
			{form.stock[0].price}
		{/if}
	</div>
</div>
