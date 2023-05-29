<script lang="ts">
	import Search from '~icons/mdi/search';
	import SelectInput from '../../components/SelectInput.svelte';
	import SearchInput from '../../components/SearchInput.svelte';

	let searchVal = '';
	$: {
		//todo search for symbol
	}

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
		</div>
	</div>
</div>
