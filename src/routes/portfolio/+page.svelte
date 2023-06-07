<script lang="ts">
	import {
		scaleTime,
		scaleLinear,
		line,
		extent,
		max,
		select,
		axisBottom,
		axisLeft,
		utcFormat
	} from 'd3';
	import { onMount } from 'svelte';

	const data = [
		{ date: new Date('2023-06-01'), value: 1000 },
		{ date: new Date('2023-06-02'), value: 1500 },
		{ date: new Date('2023-06-03'), value: 1200 }
		// Add more data points as needed
	];

	const margin = { top: 20, right: 20, bottom: 30, left: 50 };
	const width = 1200 - margin.left - margin.right;
	const height = 300 - margin.top - margin.bottom;

	onMount(() => {
		const svg = select('#chart')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		const xScale = scaleTime()
			.domain(extent(data, (d: { date: Date }) => d.date) as [Date, Date])
			.range([0, width]);

		const yScale = scaleLinear()
			.domain([0, max(data, (d) => d.value) || 0])
			.range([height, 0]);

		const lineGenerator = line<{ date: Date; value: number }>()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.value));

		const chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

		chart
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 2)
			.attr('d', lineGenerator);

		chart
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			//@ts-ignore
			.call(axisBottom(xScale).tickFormat(utcFormat('%Y-%m-%d')))
			.call((g: any) =>
				g.selectAll('.tick line').clone().attr('y2', -height).attr('stroke-opacity', 0.1)
			);

		chart
			.append('g')
			.call(axisLeft(yScale))
			.call((g: any) =>
				g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', 0.1)
			);
	});

	function tickSize(height: number) {
		throw new Error('Function not implemented.');
	}
</script>

<svelte:head>
	<title>Portfolio</title>
	<meta name="description" content="Stock Exchange" />
</svelte:head>
<div class="px-11">
	<div class="grid grid-cols-4 gap-4">
		<div class="col-span-1 bg-white p-2 text-center">
			<div class="text-xs text-neutral-500 tracking-widest mb-1">ACCOUNT VALUE</div>
			<span class="font-bold text-black text-2xl">$1,234.56</span>
		</div>
		<div class="col-span-3 bg-white p-2">
			<svg id="chart" />
		</div>
	</div>
</div>
