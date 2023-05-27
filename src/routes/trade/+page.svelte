<script lang="ts">
	import TextInput from '../../components/TextInput.svelte';
	import { clickOutside } from '../../utils/onClickOutside';
	import Search from '~icons/mdi/search';

	let changeOutlineColor: boolean = false;
</script>

<svelte:head>
	<title>Trade</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>

<div class="px-11">
	<p class="text-white uppercase text-xs tracking-widest mb-2">Symbol Lookup</p>
	<div class="bg-white p-4">
		<TextInput label="Symbol" placeHolder="Look up Symbol/Comapny Name">
			<Search class="text-lg" />
		</TextInput>

		<div class="grid grid-cols-2 w-3/4 gap-4">
			<div>
				<label for="Action" class="text-sm">Action</label>
				<input
					type="text"
					id="Action"
					class="w-full mt-2 px-2 py-3 outline outline-neutral-800 outline-1 rounded-sm"
				/>
			</div>
			<div>
				<label for="element2">Element 2</label>
				<input type="text" id="element2" class="w-full mt-2 p-2 border border-gray-300 rounded" />
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
