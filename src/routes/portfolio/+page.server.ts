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

		const responsePortfolio = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		url = baseUrl + `portfolio/securities/${userId}`;
		const responseSecurities = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		let resultFolio = null;
		let resultSecurities = null;

		if (responsePortfolio.ok) {
			resultFolio = await responsePortfolio.json();
			resultFolio.valueSnapshots.map((x: any) => {
				x.timestamp = new Date(x.timestamp);
			});
			console.log(resultFolio);
		}
		if (responseSecurities.ok) {
			resultSecurities = await responseSecurities.json();
			console.log(resultSecurities);
		}

		return {
			portfolio: resultFolio,
			securities: resultSecurities
		};
	}
};
