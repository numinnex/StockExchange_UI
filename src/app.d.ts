// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
			 user:{
				 username: string
			 }
		 }
		// interface PageData {}
		// interface Platform {}
	}
}
declare module 'svelte-ripple/material-ripple';
export {};
