import type { LookUpFailure, LookUpSucces } from '../../contracts/lookupContracts';
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
			const result: LookUpFailure = await response.json();
			return fail(400, { errors: result });
		}
		return fail(500, { errors: ['Something went wrong'] });
	}
} satisfies Actions;
