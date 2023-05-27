<script lang="ts">
	import { clickOutside } from '../utils/onClickOutside';
	let changeOutlineColor: boolean = false;

	export let label: string;
	export let placeHolder: string;
</script>

<label for="search" class="block mb-2 text-sm">{label}</label>
<div
	class="w-1/2 px-2 py-4 outline rounded-sm outline-neutral-800 outline-1 flex items-center mb-4"
	class:outline-indigo-800={changeOutlineColor}
	class:outline-2={changeOutlineColor}
	use:clickOutside={() => {
		changeOutlineColor = false;
	}}
>
	<input
		type="text"
		id="search"
		name="search"
		placeholder={placeHolder}
		class="w-11/12 focus:outline-none"
		on:click={(event) => {
			changeOutlineColor = true;
			event.stopPropagation();
		}}
	/>
	<div class="ml-10" class:text-indigo-800={changeOutlineColor}>
		<slot />
	</div>
</div>
