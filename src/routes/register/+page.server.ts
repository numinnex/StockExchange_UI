import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { baseUrl } from '../baseUrl';
import type { AuthResponseSucces, AuthResponseFailure } from '../../contracts/authContracts';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/portfolio');
	}
};

export const actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const body = await JSON.stringify({ email, password });

		const url = baseUrl + 'identity/register';

		const response = await fetch(url, {
			body,
			method: 'POST',
			headers: { 'content-type': 'application/json' }
		});

		if (response.ok) {
			const data: AuthResponseSucces = await response.json();
			cookies.set('token', data.token, { path: '/' });
			cookies.set('refreshtoken', data.refreshToken, { path: '/' });

			throw redirect(301, '/');
		}

		if (response.status == 400) {
			const data: AuthResponseFailure = await response.json();
			return fail(400, { errors: data.errors });
		}

		return fail(500, { errors: ['Something went wrong'] });
	}
};
