<script lang="ts">
	import { page } from '$app/stores';
	import Ripple from '../ripple/index';
	import { onMount } from 'svelte';
	interface NavLink {
		text: string;
		href: string;
	}
	let activeTab: string;
	onMount(() => {
		activeTab = $page.url.pathname;
	});

	export let links: NavLink[] = [];

	const handleClick = (href: string) => {
		activeTab = href;
	};
</script>

<nav class="flex items-center justify-between px-14 border-b">
	<div class="flex items-center">
		{#each links as link}
			<a
				href={link.href}
				class={activeTab === link.href
					? 'active-link text-white text-xl px-9 py-3'
					: 'text-white hover:bg-[#3A425D] text-xl px-9 py-3'}
				on:click={() => handleClick(link.href)}
				use:Ripple={{
					centerd: false,
					color: '#fff',
					spreadingDuration: '.3s',
					opacity: 0.2
				}}
			>
				{link.text}
			</a>
		{/each}
	</div>

	<div class="flex items-center space-x-4">
		<button
			class="text-white hover:text-gray-300"
			on:click={() => console.log('Clicked user profile')}
		>
			<p>User Profile</p>
		</button>
	</div>
</nav>

<style>
	.active-link {
		background-color: #697188;
	}
	a {
		position: relative;
	}
</style>
