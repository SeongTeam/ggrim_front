/* Usage Warning 
- If you use these functions on react component, you should consider returned wrapper function is not kept.
  because render or Re-render call these functions again and get new returned wrapper.
  in result, your expectation from these wrapper is from actual result.
*/
export function throttle<T extends (...args: any[]) => void>(
	func: T,
	ms: number,
): (...args: Parameters<T>) => void {
	let isThrottled = false;
	let savedArgs: Parameters<T> | undefined = undefined;
	let savedThis: ThisParameterType<T> | undefined = undefined;

	function wrapper(this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (isThrottled) {
			console.debug("isThrottled true");
			savedArgs = args;
			savedThis = this;
			return;
		}
		console.debug("isThrottled false");
		isThrottled = true;

		func.apply(this, args);

		setTimeout(() => {
			isThrottled = false;
			if (savedArgs) {
				wrapper.apply(savedThis!, savedArgs);
				savedArgs = savedThis = undefined;
			}
		}, ms);
	}

	return wrapper;
}

export function debounce<A extends unknown[], T extends (...args: A) => void>(
	func: T,
	ms: number,
): (this: ThisParameterType<T>, ...args: A) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return function (this: ThisParameterType<T>, ...args: A) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), ms);
	};
}
