import type { Handle, HandleFetch } from '@sveltejs/kit';
import {baseUrl} from './routes/baseUrl';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("token");

    if(event.locals.user !== undefined){
        return await resolve(event);
    }

    console.log("handle happend");
    if(!token){
        return await resolve(event);
    }
    const body = JSON.stringify({ token });

    const response = await fetch(baseUrl + "identity/identify" , {
      body,
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`,
        "content-type": "application/json" },
    });

    if(response.ok){
        const data = await response.json();
        console.log(data);
        event.locals.user = {
            username: data.userName
        }
    }
    return await resolve(event);
};
//hook for refreshToken && baseUrl
export const handleFetch: HandleFetch = (async ({ request , fetch, event: { cookies } }) => {

    if(request.url.startsWith(baseUrl)){
        //console.log("something happend");
        //request.headers.set('Authorization', `Bearer ${cookie}`);
        //const response = await fetch(request);
        //console.log(await response.json());

        // if(response.status != 401){
        //     return response;
        // }
    }
    return fetch(request);
}) ;