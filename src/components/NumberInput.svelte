<script lang="ts">
	function handleInput(event: any) {
		const sanitizedValue = event.target.value < 0 ? 0 : event.target.value;
		initValue = sanitizedValue;
	}
	import { clickOutside } from '../utils/onClickOutside';
	let changeOutlineColor: boolean = false;

	export let label: string;
	export let initValue: number = 0;
	export let width: string = 'w-full';
</script>

<label for={label} class="block text-sm">{label}</label>
<input
	type="number"
	step="0.1"
	id={label}
	name={label.toLowerCase()}
	min="0"
	bind:value={initValue}
	inputmode="decimal"
	class="{width} mt-2 px-2 py-3 outline outline-neutral-800 outline-1 rounded-sm"
	class:outline-indigo-600={changeOutlineColor}
	class:outline-2={changeOutlineColor}
	on:input={handleInput}
	use:clickOutside={() => {
		changeOutlineColor = false;
	}}
	on:click={(event) => {
		changeOutlineColor = true;
		event.stopPropagation();
	}}
/>
