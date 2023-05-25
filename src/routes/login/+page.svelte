<script lang="ts">
	export let form;
</script>

<main class="w-full h-screen flex items-center justify-center">
	<form class="shadow-md rounded-lg w-[400px] p-8 bg-neutral-200" method="POST" action="?/login">
		<h2 class="text-center text-2xl text-neutral-950 mb-4">Sign Up</h2>
		{#if form}
			<h4 class="text-red-600 font-light text-md text-center">
				{form.errors}
			</h4>
		{/if}
		<div class="mb-2">
			<label for="email" class="block font-light text-neutral-800 ml-2">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				placeholder="email"
				class="w-full p-2 border border-neutral-800 rounded-lg"
			/>
		</div>
		<div class="mb-6">
			<label for="password" class="block font-light text-neutral-800 ml-2">Password</label>
			<input
				class="w-full p-2 border border-neutral-800 rounded-lg"
				type="password"
				id="password"
				name="password"
				placeholder="password"
			/>
		</div>
		<div class="w-full flex justify-center">
			<button
				type="submit"
				class="bg-indigo-900 hover:bg-indigo-800 text-lg text-white rounded-full py-2 px-4"
				>Submit</button
			>
		</div>
	</form>
</main>
