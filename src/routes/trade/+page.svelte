<script lang="ts">
	import NumberInput from '../../components/NumberInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';

	const searchProps = {
		label: 'Symbol',
		placeHolder: 'Look up Symbol/Comapny Name'
	};
	const actions = ['Buy', 'Sell'];
</script>

<svelte:head>
	<title>Trade</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>

<div class="px-11">
	<p class="text-white uppercase text-xs tracking-widest mb-2">Symbol Lookup</p>
	<div class="bg-white p-4">
		<SearchInput {...searchProps}>
			<Search class="text-lg" />
		</SearchInput>

		<div class="grid grid-cols-2 w-3/4 gap-4">
			<div>
				<label for="Action" class="block text-sm mb-2">Action</label>
				<SelectInput options={actions} />
			</div>
			<div>
				<NumberInput label={'Quantity'} width="w-1/2" />
			</div>
			<div>
				<label for="element3">Element 3</label>
				<input type="text" id="element3" class="w-full mt-2 p-2 border border-gray-300 rounded" />
			</div>
			<div>
				<label for="element4">Element 4</label>
				<input type="text" id="element4" class="w-full mt-2 p-2 border border-gray-300 rounded" />
			</div>
		</div>
	</div>
</div>

<style>
</style>
