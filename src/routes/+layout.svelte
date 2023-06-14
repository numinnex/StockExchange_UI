<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
	import Home from '~icons/carbon/home';

	const navLinks = [
		{ text: 'PORTFOLIO', href: '/portfolio' },
		{ text: 'TRADE', href: '/trade' },
		{ text: 'RESEARCH', href: '/research' }
	];
</script>

<div class="app bg-[#323a56]">
	<Header links={navLinks} />
	<main>
		<slot />
	</main>

	<footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
