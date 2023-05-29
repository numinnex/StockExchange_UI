import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import { baseUrl } from '../baseUrl';
import type { AuthResponseSucces , AuthResponseFailure} from '../../contracts/authContracts';


export const load: PageServerLoad = async ({locals}) => {
    if(locals.user){
        throw redirect(302, '/portfolio');
    }
};
export const actions = {
    //@ts-ignore
    login: async ({request , cookies}) => {
        const formData = await request.formData();
        const email = formData.get("email");
        const password = formData.get("password");
        const body = JSON.stringify({ email, password });


        const url = baseUrl + "identity/login";

        const response = await fetch(url , {
      body,
      method: "POST",
      headers: { "content-type": "application/json" },

    });

    if(response.ok){
        const data: AuthResponseSucces = await response.json();
        cookies.set("token", data.token, { path: "/" , maxAge: 60 * 60 * 24 });
        cookies.set("refreshtoken", data.refreshToken, { path: "/", maxAge: 60 * 60 * 24 });

        throw redirect(301, "/portfolio");
    }

    if(response.status == 400){
        const data : AuthResponseFailure = await response.json();
        return fail(400, {errors: data.errors});
    }

    return fail(500, {errors: ["Something went wrong"]});
    }
}