import type { PageServerLoad } from './$types';
import { baseUrl } from './baseUrl';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	const pageNumber = 1;
	const pageSize = 25;
	const url = baseUrl + `order/active?pageNumber=${pageNumber}&pageSize=${pageSize}`;
	console.log(url);
	const response = await fetch(url + '', {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	let result = undefined;
	if (response.ok) {
		result = await response.json();
		console.log(result);
		return {
			trades: result
		};
	}
};
