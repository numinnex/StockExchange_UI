import type { PageServerLoad } from "./$types";
import { baseUrl } from "./baseUrl"


export const load: PageServerLoad = async ({fetch}) => {
    const response = await fetch(baseUrl + "stock/AAPL" , {
        method: "GET",
        headers: { "content-type": "application/json" },        
    });
    const data = await response.json();
    return {
        result: data 
    }
}