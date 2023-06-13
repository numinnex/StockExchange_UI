<script lang="ts">
	import { page } from '$app/stores';
	import Ripple from '../ripple/index';
	import { onMount } from 'svelte';

	interface NavLink {
		text: string;
		href: string;
	}
	$: activeTab = $page.url.pathname;

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
		{#if !$page.data.user}
			<a
				href="/login"
				class={activeTab === '/login'
					? 'active-link text-white text-xl px-9 py-3'
					: 'text-white hover:bg-[#3a425d] text-xl px-9 py-3'}
				on:click={() => handleClick('/login')}
				use:Ripple={{
					centerd: false,
					color: '#fff',
					spreadingduration: '.3s',
					opacity: 0.2
				}}
			>
				LOGIN
			</a>
			<a
				href="/register"
				class={activeTab === '/register'
					? 'active-link text-white text-xl px-9 py-3'
					: 'text-white hover:bg-[#3a425d] text-xl px-9 py-3'}
				on:click={() => handleClick('/register')}
				use:Ripple={{
					centerd: false,
					color: '#fff',
					spreadingduration: '.3s',
					opacity: 0.2
				}}
			>
				REGISTER
			</a>
		{:else if $page.data.user}
			<p class="text-white text-xl px-9 py-3">
				Welcome, {$page.data.user.username.split('@')[0]}
			</p>
		{/if}
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
