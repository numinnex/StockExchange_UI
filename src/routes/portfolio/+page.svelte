<script lang="ts">
	import {
		scaleLinear,
		line,
		extent,
		max,
		select,
		axisBottom,
		axisLeft,
		utcFormat,
		scaleUtc,
		curveMonotoneX,
		map,
		min,
		type RatioSquarifyTilingFactory
	} from 'd3';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	type valueSnapshot = {
		timestamp: Date;
		value: number;
	};
	type portfolio = {
		valueSnapshots: valueSnapshot[];
		securities: security[];
		totalValue: number;
	};
	type security = {
		symbol: string;
		quantity: number;
		timeStamp: Date;
		currentPrice: number;
		purchasedPrice: number;
		totalValue: number;
	};

	type trade = {
		symbol: string;
		quantity: number;
		price: number;
		timestamp: Date;
		orderAmount: number;
		isBuy: boolean;
		type: string;
	};
	export let data: PageData;
	const portfolioData: portfolio = data.portfolio;
	const securities: security[] = data.portfolio.securities;
	const trades: trade[] = data.trades;

	const margin = { top: 20, right: 20, bottom: 30, left: 50 };
	const width = 1200 - margin.left - margin.right;
	const height = 300 - margin.top - margin.bottom;

	onMount(() => {
		const svg = select('#chart')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		const xScale = scaleUtc()
			.domain(
				extent(portfolioData.valueSnapshots, (d: { timestamp: Date }) => d.timestamp) as [
					Date,
					Date
				]
			)
			.range([0, width]);

		const yScale = scaleLinear()
			.domain(
				extent(portfolioData.valueSnapshots, (d: { value: number }) => d.value) as [number, number]
			)
			.range([height, 0]);

		const lineGenerator = line<valueSnapshot>()
			.curve(curveMonotoneX)
			.x((d) => xScale(d.timestamp))
			.y((d) => yScale(d.value));

		const chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

		chart
			.append('path')
			.datum(portfolioData.valueSnapshots)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 2)
			.attr('d', lineGenerator);

		chart
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			//@ts-ignore
			.call(
				axisBottom(xScale)
					//@ts-ignore
					.tickFormat(utcFormat('%d %m %y'))
					.ticks(portfolioData.valueSnapshots.length)
			)
			.call((g) => g.select('.domain').remove())
			.call((g: any) =>
				g.selectAll('.tick line').clone().attr('y2', -height).attr('stroke-opacity', 0.1)
			);

		chart
			.append('g')
			.call(axisLeft(yScale).ticks(height / 40))
			.call((g) => g.select('.domain').remove())
			.call((g: any) =>
				g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', 0.1)
			);
	});
</script>

<svelte:head>
	<title>Portfolio</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>
<div class="px-11">
	<div class="grid grid-cols-4 gap-4 mb-4">
		<div class="col-span-1 bg-white p-2 text-center">
			<div class="text-xs text-neutral-500 tracking-widest mb-1">ACCOUNT VALUE</div>
			<span class="font-bold text-black text-2xl">{portfolioData.totalValue}$<span /></span>
		</div>
		<div class="col-span-3 bg-white p-2">
			<svg id="chart" />
		</div>
	</div>
	<p class="text-xs text-white mb-1 tracking-widest">SECURITIES</p>
	<div class="bg-white py-2 mb-2">
		<table class="min-w-full divide-y divide-neutral-200">
			<thead>
				<tr class="hover:bg-neutral-200 tracking-tighter">
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Symbol</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Current Price</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Purchase Price</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">QTY</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Total Value</th>
				</tr>
			</thead>
			<tbody>
				{#each securities as security}
					<tr class="hover:bg-neutral-200 text-left">
						<td class="px-6 py-3 text-indigo-400 font-light tracking-tighter">{security.symbol}</td>
						<td class="px-6 py-2 text-sm font-semibold">${security.currentPrice}</td>
						<td class="px-6 py-2 text-sm font-semibold">${security.purchasedPrice}</td>
						<td class="px-6 py-2 text-sm font-semibold">{security.quantity}</td>
						<td class="px-6 py-2 text-sm font-semibold">${security.totalValue}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="text-xs text-white mb-2 tracking-widest">TRADES</p>
	<div class="bg-white py-2">
		<table class="min-w-full divide-y divide-neutral-200">
			<thead>
				<tr class="hover:bg-neutral-200 tracking-tighter">
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Symbol</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Timestamp</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Price</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">OrderAmount</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">QTY</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Type</th>
					<th class="px-6 py-3 text-left text-neutral-400 text-xs font-semibold">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each trades as trade}
					<tr class="hover:bg-neutral-200 text-left">
						<td class="px-6 py-3 text-indigo-400 font-light tracking-tighter">{trade.symbol}</td>
						<td class="px-6 py-2 text-sm font-semibold">{trade.timestamp}</td>
						<td class="px-6 py-2 text-sm font-semibold">${trade.price}</td>
						<td class="px-6 py-2 text-sm font-semibold">{trade.orderAmount}</td>
						<td class="px-6 py-2 text-sm font-semibold">{trade.quantity}</td>
						<td class="px-6 py-2 text-sm font-semibold">{trade.type}</td>
						<td class="px-6 py-2 text-sm font-semibold">{trade.isBuy ? 'Buy' : 'Sell'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div />
</div>
