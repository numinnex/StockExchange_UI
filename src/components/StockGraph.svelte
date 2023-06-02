<script lang="ts">
	import { drawGraph } from '../utils/stockGraph';
	import type { StockValuesResponse } from '../contracts/stockContracts';
	import { onMount } from 'svelte';

	export let widthInput: number = 0;
	export let heightInput: number = 0;
	export let timeSeriesStockResponse: StockValuesResponse[] | undefined;

	let numberOfDaysToSubtract = 479;
	let xFormat = '%b %Y ';
	let timeSeries = timeSeriesStockResponse;

	const filterData = (days: number) => {
		numberOfDaysToSubtract = days;
		if (days < 479) {
			xFormat = '%b %d ';
		} else {
			xFormat = '%b %Y';
		}
		const startDate = new Date();
		const endDate = new Date(startDate.getTime() - numberOfDaysToSubtract * 24 * 60 * 60 * 1000);

		timeSeries = timeSeriesStockResponse?.filter((x) => {
			return x.datetime >= endDate && x.datetime <= startDate;
		});

		const svg = document.getElementById('chart-container');
		while (svg?.lastElementChild) {
			svg.removeChild(svg?.lastElementChild);
		}
		drawGraph(timeSeries, widthInput, heightInput, xFormat);
	};

	onMount(() => {
		const startDate = new Date();
		const endDate = new Date(startDate.getTime() - numberOfDaysToSubtract * 24 * 60 * 60 * 1000);

		timeSeries = timeSeriesStockResponse?.filter((x) => {
			return x.datetime >= endDate && x.datetime <= startDate;
		});
		drawGraph(timeSeries, widthInput, heightInput, xFormat);
	});
</script>

<div class="flex gap-4 mb-3 text-sm">
	<div
		class:text-indigo-500={numberOfDaysToSubtract === 10}
		class:bg-indigo-100={numberOfDaysToSubtract === 10}
		class="rounded-md hover:bg-neutral-100 px-3 py-1 cursor-pointer"
		on:click={() => {
			filterData(10);
		}}
	>
		1W
	</div>
	<div
		class:text-indigo-500={numberOfDaysToSubtract === 40}
		class:bg-indigo-100={numberOfDaysToSubtract === 40}
		class="rounded-md hover:bg-neutral-100 px-3 py-1 cursor-pointer"
		on:click={() => {
			filterData(40);
		}}
	>
		1M
	</div>
	<div
		class:text-indigo-500={numberOfDaysToSubtract === 240}
		class:bg-indigo-100={numberOfDaysToSubtract === 240}
		class="rounded-md hover:bg-neutral-100 px-3 py-1 cursor-pointer"
		on:click={() => {
			filterData(240);
		}}
	>
		6M
	</div>
	<div
		class:text-indigo-500={numberOfDaysToSubtract === 479}
		class:bg-indigo-100={numberOfDaysToSubtract === 479}
		class="rounded-md hover:bg-neutral-100 px-3 py-1 cursor-pointer"
		on:click={() => {
			filterData(479);
		}}
	>
		1Y
	</div>
	<div
		class:text-indigo-500={numberOfDaysToSubtract === 2000}
		class:bg-indigo-100={numberOfDaysToSubtract === 2000}
		class="rounded-md hover:bg-neutral-100 px-3 py-1 cursor-pointer"
		on:click={() => {
			filterData(2000);
		}}
	>
		3Y
	</div>
</div>
<div id="chart-container" />
