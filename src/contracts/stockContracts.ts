export type StockResponse = {
	symbol: string;
	name: string;
	price: number;
	currency: string;
	country: string;
	change: number | undefined;
	volume: number;
	highMonth: number;
	lowMonth: number;
	trendingScore: number | undefined;
	timeSeries: TimeSeriesResponse;
};

type TimeSeriesResponse = {
	interval: string;
	timeZone: string;
	stockValues: StockValuesResponse[];
};

export type StockValuesResponse = {
	close: number;
	low: number;
	high: number;
	open: number;
	volume: number;
	datetime: Date;
};
