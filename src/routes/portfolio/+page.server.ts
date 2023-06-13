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
		let url = baseUrl + `portfolio/${userId}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			const result = await response.json();
			console.log(result);
			if (result.securities) {
				result.securities.map((x: any) => {
					x.timestamp = new Date(x.timestamp);
				});
			}
			result.valueSnapshots.map((x: any) => {
				x.timestamp = new Date(x.timestamp);
			});
			return {
				portfolio: result
			};
		}
	}
};
