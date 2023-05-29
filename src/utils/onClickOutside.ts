export function clickOutside(element: HTMLElement, callBackFunction: any) {
	function onClick(event: any) {
		if (!element.contains(event.target)) {
			callBackFunction();
		}
	}

	document.body.addEventListener('click', onClick);
	return {
		update(newCallbackFunction: any) {
			callBackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	};
}
