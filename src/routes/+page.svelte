<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import USFlag from '~icons/circle-flags/us';
	import SortTag from '~icons/bx/sort';

	export let data: PageData;

	interface Trade {
		symbol: string;
		timestamp: Date;
		isBuy: boolean;
		openQuantity: number;
		orderAmount: number;
		price: number;
	}
	let trades: Trade[];
	if (data.trades) {
		trades = data.trades.data;
	}
	let currentSortColumn: keyof Trade = 'symbol';
	let sortAscending = false;

	function sortBy(property: keyof Trade) {
		if (currentSortColumn === property) {
			sortAscending = !sortAscending;
		} else {
			currentSortColumn = property;
			if (!sortAscending) {
				sortAscending = !sortAscending;
			}
			sortAscending = false;
		}
		console.log(currentSortColumn, sortAscending);

		trades.sort((a: Trade, b: Trade) => {
			const aValue: any = a[property];
			const bValue: any = b[property];
			const sortOrder = sortAscending ? 1 : -1;
			return sortOrder * (bValue > aValue ? 1 : -1);
		});
		trades = trades;
	}
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>
<div>
	{#if $page.data.user}
		<div class="px-11">
			<div class="bg-white">
				{#if trades}
					<table class="w-full table-auto">
						<thead>
							<tr class="text-neutral-500 uppercase">
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('symbol')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>Symbol</span>
										<SortTag
											class={currentSortColumn === 'symbol'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('isBuy')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>ACTION</span>
										<SortTag
											class={currentSortColumn === 'isBuy'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('timestamp')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>Timestamp</span>
										<SortTag
											class={currentSortColumn === 'timestamp'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('openQuantity')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>Open Quantity</span>
										<SortTag
											class={currentSortColumn === 'openQuantity'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('orderAmount')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>Order Amount</span>
										<SortTag
											class={currentSortColumn === 'orderAmount'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
								<th
									class="cursor-pointer hover:bg-neutral-100 text-sm font-thin p-4 border"
									on:click={() => sortBy('price')}
								>
									<div class="flex justify-center items-center gap-1">
										<span>Price</span>
										<SortTag
											class={currentSortColumn === 'price'
												? 'text-sm text-lime-500'
												: 'text-sm text-indigo-400'}
										/>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each trades as trade}
								<tr class="">
									<td class="font-bold text-indigo-600 border-b text-sm p-3 flex gap-2">
										<USFlag class="text-lg" />
										{trade.symbol}
									</td>
									<td class="border-b text-center">{trade.isBuy ? 'Buy' : 'Sell'}</td>
									<td class="border-b text-center"
										>{new Date(trade.timestamp).toLocaleDateString('en-US', options)}</td
									>
									<td class="border-b text-center">{trade.openQuantity}</td>
									<td class="border-b text-center">{trade.orderAmount}</td>
									<td class="border-b text-center">
										{trade.price}
										<span class="text-xs text-neutral-500">USD</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	{:else if !$page.data.user}
		<div class="text-center text-white mt-12">
			<h2 class="text-5xl">STOCK EXCHANGE</h2>
		</div>
		<div class="text-center text-neutral-300 mt-6 text-2xl tracking-widest">
			<a href="/register" class="rounded-lg py-3 px-4 bg-slate-800 hover:bg-slate-700"
				>START TRADING</a
			>
		</div>
	{/if}
</div>
