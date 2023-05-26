import type { PageServerLoad } from "./$types";
import { baseUrl } from "./baseUrl"

export const load: PageServerLoad = async ({fetch, cookies}) => {
    // const response = await fetch(baseUrl + "stock/AAPL" , {
    //     method: "GET",
    //     headers: { "content-type": "application/json",
    //     Authorization: `Bearer ${cookies.get("token")}`},        
    // });
    // const data = await response.json();
}