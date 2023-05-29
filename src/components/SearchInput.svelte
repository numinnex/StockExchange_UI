<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '../utils/onClickOutside';

	let changeOutlineColor: boolean = false;
	function handleSubmit() {
		//@ts-ignore
		return async ({ update }) => {
			await update({ reset: false });
		};
	}

	const debouncedSubmit = debounce(() => {
		// not supported in all browsers
		if (typeof HTMLFormElement.prototype.requestSubmit == 'function') {
			form.requestSubmit();
		}
	}, 400);

	function debounce(func: any, delay: any) {
		let timerId: any;

		return function (...args: any) {
			clearTimeout(timerId);

			timerId = setTimeout(() => {
				//@ts-ignore
				func.apply(this, args);
			}, delay);
		};
	}

	let form: any;

	export let label: string;
	export let placeHolder: string;
	export let searchVal: string;
</script>

<label for={label} class="block mb-2 text-sm">{label}</label>
<div
	class="w-1/2 px-2 py-4 outline rounded-sm outline-neutral-800 outline-1 mb-4"
	class:outline-indigo-600={changeOutlineColor}
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
			autofocus
			type="text"
			id={label}
			name={label}
			bind:value={searchVal}
			placeholder={placeHolder}
			class="w-11/12 focus:outline-none"
			on:input={debouncedSubmit}
			on:click={(event) => {
				changeOutlineColor = true;
				event.stopPropagation();
			}}
		/>
		<div class="ml-10" class:text-indigo-600={changeOutlineColor}>
			<slot />
		</div>
	</form>
</div>
