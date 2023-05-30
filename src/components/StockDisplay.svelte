<script lang="ts">
	import type { StockResponse } from '../contracts/stockContracts';
	import * as signalR from '@microsoft/signalr';
	export let stockResponse: StockResponse[] | undefined;
	import USFlag from '~icons/circle-flags/us';
	import { baseUrl } from '../routes/baseUrl';
	import { onDestroy, onMount } from 'svelte';

	let connection = new signalR.HubConnectionBuilder().withUrl('/price').build();
	connection.baseUrl = baseUrl.replace('/api/v1', '') + 'price';
	let intervalId: number;

	let realtimePrice: number;

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
	const pooling = () => {
		if (connection.state === signalR.HubConnectionState.Connected) {
			intervalId = setInterval(() => {
				connection.invoke('RealTimePrice', stockResponse?.at(0)?.symbol).then((result) => {
					realtimePrice = result;
				});
			}, 4000);
		}
	};
</script>

{#if stockResponse}
	<div class="grid grid-cols-2 gap-6">
		<div class="">
			<div class="flex mt-8 mb-6">
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
			<div class="flex mb-6">
				<p>PLACEHOLDER</p>
			</div>
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

			<!-- <div class="grid grid-cols-2">
				<div class="w-full">
					<p>COLUIMN1</p>
				</div>
				<div class="w-full">
					<p>COLUIMN2</p>
				</div>
			</div> -->
		</div>
		<div>
			<p>PLACEHOLDER</p>
		</div>
	</div>
{/if}
