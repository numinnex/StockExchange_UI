<script lang="ts">
	import NumberInput from '../../components/NumberInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';
	import SearchList from '../../components/SearchList.svelte';
	import StockDisplay from '../../components/StockDisplay.svelte';

	export let form;

	let selectedOrderType = 'Market';
	let selectedAction = 'Buy';
	let searchVal = '';

	$: currentSymbols = form?.data;

	$: currentOrderType = selectedOrderType;
	$: currentAction = selectedAction;

	const searchProps = {
		label: 'Symbol',
		placeHolder: 'Look up Symbol/Comapny Name'
	};
	const actions = ['Buy', 'Sell'];
	const orderTypes = ['Market', 'Stop'];
</script>

<svelte:head>
	<title>Trade</title>
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

		<div class="grid grid-cols-2 w-3/4 gap-4 mt-6">
			<div class="mb-4">
				<SelectInput options={actions} label="Action" bind:selectedOption={selectedAction} />
			</div>
			<div>
				<NumberInput label={'Quantity'} width="w-1/2" />
			</div>
			<div>
				<SelectInput
					options={orderTypes}
					label="Order Type"
					bind:selectedOption={selectedOrderType}
				/>
			</div>
			{#if currentOrderType === 'Stop'}
				<div>
					<NumberInput label={'Stop Price'} width="w-1/2" />
				</div>
			{/if}
		</div>
	</div>
</div>
