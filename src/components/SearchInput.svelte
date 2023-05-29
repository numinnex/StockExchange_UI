<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '../utils/onClickOutside';
	import { createDebouncedSubmit } from '../utils/debouncedSubmit';

	let changeOutlineColor: boolean = false;
	function handleSubmit() {
		//@ts-ignore
		return async ({ update }) => {
			await update({ reset: false });
		};
	}
	const debouncedSubmit = createDebouncedSubmit(400);

	let form: any;

	export let label: string;
	export let placeHolder: string;
	export let searchVal: string;
</script>

<label for={label} class="block mb-2 text-sm">{label}</label>
<div
	class="w-1/2 px-2 py-4 outline rounded-sm outline-neutral-800 outline-1 mb-1"
	class:outline-indigo-700={changeOutlineColor}
	class:outline-2={changeOutlineColor}
	use:clickOutside={() => {
		changeOutlineColor = false;
	}}
>
	<form
		class="flex items-center"
		bind:this={form}
		method="POST"
		action="?/search"
		use:enhance={handleSubmit}
	>
		<input
			type="text"
			autocomplete="off"
			id={label}
			name={label}
			bind:value={searchVal}
			placeholder={placeHolder}
			class="w-11/12 focus:outline-none"
			on:input={() => {
				debouncedSubmit(form);
			}}
			on:click={(event) => {
				changeOutlineColor = true;
				event.stopPropagation();
			}}
		/>
		<div class="ml-10" class:text-indigo-700={changeOutlineColor}>
			<slot />
		</div>
	</form>
</div>
