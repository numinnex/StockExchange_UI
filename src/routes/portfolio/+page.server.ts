import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import jwt_decode from 'jwt-decode';
import { baseUrl } from '../baseUrl';

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const token = cookies.get('token');
	if (token) {
		const decoded: any = jwt_decode(token);
		const userId = decoded.sub;
		console.log(userId);
		let url = baseUrl + `portfolio/${userId}`;
		let tradesUrl = baseUrl + `order/trades?userId=${userId}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const responseTrades = await fetch(tradesUrl, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};

		if (response.ok) {
			const result = await response.json();
			if (result.securities) {
				result.securities.map((x: any) => {
					x.timestamp = new Date(x.timestamp);
				});
			}
			result.valueSnapshots.map((x: any) => {
				x.timestamp = new Date(x.timestamp);
			});
			console.log(responseTrades.status);
			if (responseTrades.ok) {
				const resultTrades = await responseTrades.json();
				resultTrades.map((x: any) => {
					x.timestamp = new Date(x.timestamp).toLocaleDateString('en-US', options);
				});
				console.log(resultTrades);
				return {
					portfolio: result,
					trades: resultTrades
				};
			}
		}
	}
};
