import {
	axisBottom,
	axisLeft,
	create,
	curveLinear,
	extent,
	line,
	map,
	max,
	min,
	range,
	scaleLinear,
	scaleUtc,
	select,
	utcFormat
} from 'd3';
import type { StockValuesResponse } from '../contracts/stockContracts';

export function drawGraph(
	timeSeries: StockValuesResponse[] | undefined,
	widthInput: number,
	heightInput: number,
	xFormat: string
) {
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

		const x = scaleUtc()
			.domain(extent(date) as [Date, Date])
			.range([0, width]);

		const y = scaleLinear()
			.domain([min(close), max(close)] as [number, number])
			.range([height, 0])
			.nice(4);

		const lineGenerator = line<StockValuesResponse>()
			.curve(curveLinear)
			.x((d) => x(d.datetime))
			.y((d) => y(d.open));

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

		const path = svg
			.selectAll('path')
			.data([timeSeries])
			.join('path')
			.attr('class', 'line')
			.attr('class', 'stroke-2 stroke-blue-500')
			.style('fill', 'none')
			.attr('d', lineGenerator);

		//@ts-ignore
		const length = path.node().getTotalLength();
		path
			.attr('stroke-dasharray', length + ' ' + length)
			.attr('stroke-dashoffset', -length)
			.transition()
			.attr('stroke-dashoffset', 0)
			.duration(1000);

		svg
			.append('g')
			.attr('class', 'y-axis')
			.call(axisLeft(y).ticks(height / 40))
			.call((g: any) => g.select('.domain').remove())
			.call((g: any) =>
				g.selectAll('.tick line').clone().attr('x2', width).attr('stroke-opacity', 0.1)
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
					.ticks(width / 60)
			)
			.call((g: any) => g.select('.domain').remove());
		svg.selectAll('text').attr('class', 'text-neutral-500');

		const g = svg
			.append('g')
			.attr('class', 'stroke-zinc-200 ')
			.attr('stroke-linecap', 'square')
			.selectAll('g')
			.data(cnt)
			.join('g')
			.attr('transform', (i: any) => `translate(${x(date[i])},0)`)
			.on('mouseover', (event: any, i: number) => {
				const tooltipText = `Date: ${date[i].toLocaleDateString()}<br>
                        High ($): ${Math.round(high[i] * 100) / 100}<br>
                        Low ($): ${Math.round(low[i] * 100) / 100}<br>
                        Close ($): ${Math.round(close[i] * 100) / 100}`;

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
			.attr('y1', (i: any) => y(low[i]))
			.attr('y2', (i: any) => y(high[i]))
			.attr('stroke-width', 0)
			.transition()
			.delay(150)
			.attr('stroke-width', fitValueInRange(date.length, 1, 750, 2, 1))
			.duration(1250);

		g.append('line')
			.attr('y1', (i: any) => y(open[i]))
			.attr('y2', (i: any) => y(close[i]))
			.attr('stroke-width', 0)
			.attr('stroke', (i: any) => colors[1 + Math.sign(open[i] - close[i])])
			.attr('class', (i: any) => colors[1 + Math.sign(open[i] - close[i])])
			.transition()
			.delay(150)
			.attr('stroke-width', fitValueInRange(date.length, 1, 750, 2, 1))
			.duration(1250);
	} //@ts-ignore
}

function fitValueInRange(
	value: number,
	oldMin: number,
	oldMax: number,
	newMin: number,
	newMax: number
) {
	const ratio = (value - oldMin) / (oldMax - oldMin);
	const scaledValue = ratio * (newMax - newMin);
	const newValue = scaledValue + newMin;

	return newValue;
}
