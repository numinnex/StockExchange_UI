import type { LookUpFailure, LookUpSucces } from '../../contracts/lookupContracts';
import type { StockResponse } from '../../contracts/stockContracts';
import { baseUrl } from '../baseUrl';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	search: async ({ request, cookies }) => {
		const formData = await request.formData();
		const symbol = formData.get('Symbol');
		if (symbol === '') {
			return;
		}
		const body = JSON.stringify({ symbol });

		const url = baseUrl + 'stock/lookup';
		const response = await fetch(url, {
			body,
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${cookies.get('token')}`
			}
		});

		if (response.ok) {
			const result: LookUpSucces[] = await response.json();
			return {
				data: result
			};
		}
		if (response.status == 400) {
			const result = await response.json();
			return fail(400, { errors: result[0].message });
		}
		return fail(500, { errors: 'Something went wrong' });
	},

	symbol: async ({ request, cookies }) => {
		const formData = await request.formData();
		const symbol = formData.get('Symbol');
		if (symbol === '') {
			return;
		}

		const url = baseUrl + `stock/${symbol}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${cookies.get('token')}`
			}
		});

		if (response.ok) {
			const result: StockResponse[] = await response.json();
			result[0].timeSeries.stockValues.map((value) => {
				value.datetime = new Date(value.datetime);
			});
			return {
				stock: result
			};
		} else if (response.status == 404) {
			const result = await response.json();
			return fail(404, { stockErrors: result });
		}
	}
} satisfies Actions;
