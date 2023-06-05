import type { Handle } from '@sveltejs/kit';
import { baseUrl } from './routes/baseUrl';
import type { AuthIdentifyResponse, AuthResponseSucces } from './contracts/authContracts';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const refreshToken = event.cookies.get('refreshtoken')!;

	if (event.locals.user) {
		return await resolve(event);
	}

	if (!token) {
		return await resolve(event);
	}
	const body = JSON.stringify({ token });

	const request = new Request(baseUrl + 'identity/identify', {
		body,
		method: 'POST',
		headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }
	});

	const response = await fetch(request);

	if (response.ok) {
		const data: AuthIdentifyResponse = await response.json();
		event.locals.user = {
			username: data.userName
		};
	}
	if (response.status === 401) {
		const newAuthResult: AuthResponseSucces | undefined = await RefreshToken(token, refreshToken);
		if (newAuthResult !== undefined) {
			event.cookies.set('token', newAuthResult.token, { path: '/', maxAge: 60 * 60 * 24 });
			event.cookies.set('refreshtoken', newAuthResult.refreshToken, {
				path: '/',
				maxAge: 60 * 60 * 24
			});

			const newRequest = new Request(baseUrl + 'identity/identify', {
				body,
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${newAuthResult?.token}`
				}
			});

			const response = await fetch(newRequest);
			if (response.ok) {
				const data: AuthIdentifyResponse = await response.json();
				event.locals.user = {
					username: data.userName
				};
			}
		}
	}
	return await resolve(event);
};
//hook for refreshToken && baseUrl
async function RefreshToken(token: string, refreshToken: string) {
	const body = JSON.stringify({ token, refreshToken });
	const request = new Request(baseUrl + 'identity/refresh', {
		body,
		method: 'POST',
		headers: { 'content-type': 'application/json' }
	});
	const response = await fetch(request);

	if (response.ok) {
		const result: AuthResponseSucces = await response.json();
		return result;
	}
}
