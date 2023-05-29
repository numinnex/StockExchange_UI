export const createDebouncedSubmit = (delay: number) => {
	return debounce((form: any) => {
		if (typeof HTMLFormElement.prototype.requestSubmit === 'function') {
			form.requestSubmit();
		}
	}, delay);
};

function debounce(func: any, delay: any) {
	let timerId: any;

	return function (...args: any) {
		clearTimeout(timerId);

		timerId = setTimeout(() => {
			//@ts-ignore
			func.apply(this, args);
		}, delay);
	};
}
