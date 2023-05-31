<script lang="ts">
	import { onMount } from 'svelte';
	import {
		select,
		scaleLinear,
		line,
		extent,
		max,
		min,
		utcFormat,
		scaleUtc,
		axisBottom,
		map,
		curveLinear,
		axisLeft,
		range
	} from 'd3';
	import type { StockValuesResponse } from '../contracts/stockContracts';
	import * as d3 from 'd3';

	export let widthInput: number = 0;
	export let heightInput: number = 0;
	export let timeSeries: StockValuesResponse[] | undefined;
	//@ts-ignore
	function fitValueInRange(value, oldMin, oldMax, newMin, newMax) {
		const ratio = (value - oldMin) / (oldMax - oldMin);
		const scaledValue = ratio * (newMax - newMin);
		const newValue = scaledValue + newMin;

		return newValue;
	}

	onMount(() => {
		if (timeSeries) {
			const date = map(timeSeries, (x) => x.datetime);
			const close = map(timeSeries, (x) => x.close);
			const open = map(timeSeries, (x) => x.open);
			const high = map(timeSeries, (x) => x.high);
			const low = map(timeSeries, (x) => x.low);
			const cnt = range(date.length);

			const margin = { top: 20, right: 30, bottom: 20, left: 30 };
			const width = widthInput - margin.left - margin.right;
			const height = heightInput - margin.top - margin.bottom;
			const svg = select('#chart-container')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.style('-webkit-tap-highlight-color', 'transparent')
				.style('overflow', 'visible')
				.style('-webkit-tap-highlight-color', 'transparent')
				.style('overflow', 'visible')
				.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

			const xFormat = '%b %-d';

			const x = scaleUtc()
				.domain(extent(date) as [Date, Date])
				.range([0, width]);

			const y = scaleLinear()
				.domain([0, max(close) as number])
				.range([height, 0])
				.nice();

			const lineGenerator = line<StockValuesResponse>()
				.curve(curveLinear)
				.x((d) => x(d.datetime))
				.y((d) => y(d.close));

			const tooltip = select('#chart-container')
				.append('div')
				.attr('id', 'tooltip')
				.style('position', 'absolute')
				.style('pointer-events', 'none')
				.style('opacity', 0)
				.style('background-color', 'rgba(0, 0, 0, 0.7)')
				.style('color', '#fff')
				.style('padding', '8px')
				.style('border-radius', '4px')
				.style('font-size', '12px');

			svg
				.selectAll('path')
				.data([timeSeries])
				.join('path')
				.attr('d', lineGenerator)
				.attr('class', 'stroke-2 stroke-blue-500')
				.style('fill', 'none');

			svg
				.append('g')
				.attr('class', 'y-axis')
				.call(axisLeft(y).ticks(height / 40))
				.call((g) => g.select('.domain').remove())
				.call((g) =>
					g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', 0.1)
				)
				.call((g) =>
					g
						.append('text')
						.attr('x', -margin.left)
						.attr('y', -11)
						.attr('fill', 'currentColor')
						.attr('text-anchor', 'start')
						.text('Price ($)')
				);

			const colors = ['stroke-lime-500', '#999999', 'stroke-red-500'];
			svg
				.append('g')
				.attr('class', 'x-axis')
				.attr('transform', `translate(0, ${height})`)
				//@ts-ignore
				.call(
					axisBottom(x)
						//@ts-ignore
						.tickFormat(utcFormat(xFormat))
						.ticks(width / 50)
				)
				.call((g) => g.select('.domain').remove());

			const g = svg
				.append('g')
				.attr('class', 'stroke-zinc-200 ')
				.attr('stroke-width', fitValueInRange(date.length, 1, 750, 4, 1))
				.attr('stroke-linecap', 'square')
				.selectAll('g')
				.data(cnt)
				.join('g')
				.attr('transform', (i: any) => `translate(${x(date[i])},0)`)
				.on('mouseover', (event, i: number) => {
					const tooltipText = `Date: ${date[i].toLocaleDateString()}<br>
                        Price ($): ${Math.round(close[i] * 100) / 100}`;

					tooltip
						.style('opacity', 1)
						.style('left', event.pageX + 'px')
						.style('top', event.pageY + 'px')
						.html(tooltipText);
				})
				.on('mouseout', () => {
					tooltip.style('opacity', 0);
				});

			g.append('line')
				.attr('y1', (i) => y(low[i]))
				.attr('y2', (i) => y(high[i]));

			g.append('line')
				.attr('y1', (i) => y(open[i]))
				.attr('y2', (i) => y(close[i]))
				.attr('stroke-width', fitValueInRange(date.length, 1, 750, 4, 1))
				.attr('stroke', (i) => colors[1 + Math.sign(open[i] - close[i])])
				.attr('class', (i) => colors[1 + Math.sign(open[i] - close[i])]);
		}
	});
</script>

<div id="chart-container" />
