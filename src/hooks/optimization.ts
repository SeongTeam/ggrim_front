import { useCallback, useEffect, useRef } from 'react';
import { debounce } from '../util/optimization';

export function useDebounceCallback<T extends (...args: any[]) => any>(
    callback: T,
    delayMS: number,
    deps: React.DependencyList = [],
): T {
    const callbackRef = useRef(callback);

    // 콜백 함수 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        debounce((...args: Parameters<T>) => {
            return callbackRef.current(...args);
        }, delayMS) as T,
        [...deps, delayMS],
    );
}
