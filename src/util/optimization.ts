export function throttle<T extends (...args: any[]) => void>(
    func: T,
    ms: number,
): (...args: Parameters<T>) => void {
    let isThrottled = false;
    let savedArgs: Parameters<T> | null = null;
    let savedThis: ThisParameterType<T> | null = null;

    function wrapper(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
        }
        isThrottled = true;

        func.apply(this, args);

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis!, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}
