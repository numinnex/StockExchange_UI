<script lang="ts">
	import NumberInput from '../../components/NumberInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';

	export let form;

	let selectedOrderType = 'Market';
	let selectedAction = 'Buy';
	let searchVal = '';

	$: currentSymbols = form?.data;

	$: currentOrderType = selectedOrderType;
	$: currentAction = selectedAction;
	$: {
		//todo trigger searching for symbol
		//console.log(searchVal);
	}

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

{#if currentSymbols}
	{#each currentSymbols as symbol}
		<p>{symbol.symbol}</p>
	{/each}
{/if}

<div class="px-11">
	<p class="text-white uppercase text-xs tracking-widest mb-2">Symbol Lookup</p>
	<div class="bg-white p-4">
		<SearchInput {...searchProps} bind:searchVal>
			<Search class="text-lg" />
		</SearchInput>

		<div class="grid grid-cols-2 w-3/4 gap-4">
			<div>
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

<style>
</style>
