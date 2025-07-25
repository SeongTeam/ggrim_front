import { useCallback, useEffect, useRef } from "react";
import { debounce } from "../util/optimization";

export function useDebounceCallback<T extends (...args: any[]) => void>(
	callback: T,
	delayMS: number,
	deps: React.DependencyList = [],
): (...args: Parameters<T>) => void {
	const callbackRef = useRef(callback);

	// 콜백 함수 업데이트
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(
		debounce<Parameters<T>, (...args: Parameters<T>) => void>(
			(...args) => callbackRef.current(...args),
			delayMS,
		),
		[...deps, delayMS],
	);
}
