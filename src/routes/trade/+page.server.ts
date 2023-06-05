import type { PageServerLoad } from '../$types';
import type { LookUpSucces } from '../../contracts/lookupContracts';
import type { StockResponse } from '../../contracts/stockContracts';
import { baseUrl } from '../baseUrl';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import jwt_decode from 'jwt-decode';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
export const actions: Actions = {
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
	},
	order: async ({ request, cookies }) => {
		const formData = await request.formData();

		const quantity = formData.get('quantity');
		const isBuy = formData.get('action');
		const orderType = formData.get('ordertype');
		const stockId = formData.get('stockId');
		const stopPrice = formData.get('stopprice');

		const url = baseUrl + 'order/';
		const token = cookies.get('token');
		let userId: string = '';
		if (token !== undefined) {
			const decoded = jwt_decode(token);
			//@ts-ignore
			userId = decoded.sub;
		}

		if (isBuy === 'Buy') {
			if (orderType === 'Market') {
				const body = JSON.stringify({
					isBuy: true,
					stockId: stockId,
					userId: userId,
					quantity: quantity
				});
				const response = await fetch(url + 'market/quantity', {
					body,
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const result = await response.json();
				if (response.status === 400) {
					return fail(400, { orderErrors: result });
				}
				if (!response.ok) {
					return fail(500, { errors: 'Something went wrong' });
				}
				if (response.ok) {
				}
			} else if (orderType === 'Stop') {
				const body = JSON.stringify({
					isBuy: true,
					stockId: stockId,
					userId: userId,
					stopPrice: stopPrice,
					quantity: quantity
				});
				const response = await fetch(url + 'stop/quantity', {
					body,
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const result = await response.json();
				if (response.status === 400) {
					return fail(400, { orderErrors: result });
				}
				if (!response.ok) {
					return fail(500, { errors: 'Something went wrong' });
				}

				if (response.ok) {
					return;
				}
			}
		} else {
			if (orderType === 'Market') {
				const body = JSON.stringify({
					isBuy: false,
					stockId: stockId,
					userId: userId,
					quantity: quantity
				});
				const response = await fetch(url + '/market/quantity', {
					body,
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const result = await response.json();
				if (response.status === 400) {
					return fail(400, { orderErrors: result });
				}
				if (!response.ok) {
					return fail(500, { errors: 'Something went wrong' });
				}
				if (response.ok) {
					return;
				}
			} else if (orderType === 'Stop') {
				const body = JSON.stringify({
					isBuy: false,
					stockId: stockId,
					userId: userId,
					stopPrice: stopPrice,
					quantity: quantity
				});
				const response = await fetch(url + 'stop/quantity', {
					body,
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const result = await response.json();
				if (response.status === 400) {
					return fail(400, { orderErrors: result });
				}
				if (!response.ok) {
					return fail(500, { errors: 'Something went wrong' });
				}
				if (response.ok) {
					return;
				}
			}
		}
	}
} satisfies Actions;
