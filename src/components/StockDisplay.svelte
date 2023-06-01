<script lang="ts">
	import type { StockResponse, StockValuesResponse } from '../contracts/stockContracts';
	import * as signalR from '@microsoft/signalr';
	import USFlag from '~icons/circle-flags/us';
	import { baseUrl } from '../routes/baseUrl';
	import { onDestroy, onMount } from 'svelte';
	import StockGraph from './StockGraph.svelte';

	export let stockResponse: StockResponse[] | undefined;

	let stockResponseTimeSeries = stockResponse?.at(0)?.timeSeries.stockValues;

	let connection = new signalR.HubConnectionBuilder().withUrl('/price').build();
	connection.baseUrl = baseUrl.replace('/api/v1', '') + 'price';
	let intervalId: number;

	let realtimePrice: number = 125.01;

	onMount(() => {
		connection
			.start()
			.then(() => {})
			.then(initialInvoke)
			.then(pooling);
	});
	onDestroy(() => {
		connection.stop().then(() => {
			clearInterval(intervalId);
		});
	});

	const initialInvoke = () => {
		if (connection.state === signalR.HubConnectionState.Connected) {
			connection.invoke('RealTimePrice', stockResponse?.at(0)?.symbol).then((result) => {
				realtimePrice = result;
			});
		}
	};

	let hasDecreased = false;
	let hasIncreased = false;

	const pooling = () => {
		if (connection.state === signalR.HubConnectionState.Connected) {
			intervalId = setInterval(() => {
				connection.invoke('RealTimePrice', stockResponse?.at(0)?.symbol).then((result) => {
					let oldValue = realtimePrice;
					realtimePrice = result;

					if (oldValue < realtimePrice) {
						console.log('Price decreased by', realtimePrice - oldValue);
						hasDecreased = true;
						setTimeout(() => {
							hasDecreased = false;
						}, 650);
					} else if (oldValue > realtimePrice) {
						console.log('Price increased by ', oldValue - realtimePrice);
						hasIncreased = true;
						setTimeout(() => {
							hasIncreased = false;
						}, 650);
					}
				});
			}, 4000);
		}
	};
</script>

{#if stockResponse}
	<div class="grid grid-cols-2 gap-6">
		<div class="">
			<div class="flex mb-6">
				<div>
					<h3 class="font-bold text-4xl uppercase mb-1 tracking-tighter">
						{stockResponse[0].name}
					</h3>
					<div class="flex gap-2 items-center">
						<h6 class="text-neutral-500 text-md tracking-tight">{stockResponse[0].symbol}</h6>
						<USFlag class="text-lg" />
						<h6 class="text-neutral-500 text-md tracking-tight">NASDAQ</h6>
					</div>
				</div>
			</div>
			{#if realtimePrice}
				<div class="flex mb-6 items-baseline">
					<p class="text-4xl font-bold">
						{#each realtimePrice.toString() as digit, i}
							{#if i === realtimePrice.toString().length - 1}
								<span class:text-rose-600={hasIncreased} class:text-lime-600={hasDecreased}>
									{digit}
								</span>
							{:else}
								{digit}
							{/if}
						{/each}
					</p>
					<div>
						<p class="text-sm font-bold">USD</p>
					</div>
				</div>
			{/if}
			<div class="grid grid-cols-2 gap-x-6">
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Volume (current)</div>
						<div class="text-xs text-neutral-700">{stockResponse[0].volume}m</div>
					</div>
				</div>
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Month High ($)</div>
						<div class="text-xs text-neutral-700">{stockResponse[0].highMonth}</div>
					</div>
				</div>
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Day's High ($)</div>
						<div class="text-xs text-neutral-700">
							{Math.round(stockResponse[0].timeSeries.stockValues[0].high * 100) / 100}
						</div>
					</div>
				</div>
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Price ($)</div>
						<div class="text-xs text-neutral-700">
							{Math.round(stockResponse[0].price * 100) / 100}
						</div>
					</div>
				</div>
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Day's Low ($)</div>
						<div class="text-xs text-neutral-700">
							{Math.round(stockResponse[0].timeSeries.stockValues[0].low * 100) / 100}
						</div>
					</div>
				</div>
				<div class="hover:bg-neutral-200 p-4 border-b border-neutral-300">
					<div class="flex justify-between">
						<div class="text-xs font-bold">Month Low ($)</div>
						<div class="text-xs text-neutral-700">{stockResponse[0].lowMonth}</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<StockGraph
				widthInput={850}
				heightInput={313}
				timeSeriesStockResponse={stockResponseTimeSeries}
			/>
		</div>
	</div>
{/if}

<style>
</style>
