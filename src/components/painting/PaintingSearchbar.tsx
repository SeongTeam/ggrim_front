"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "../../hooks/useDebounceCallback";
import { getInput, getURL, transformToInput } from "./util";
import { AutocompleteList } from "./AutoCompleteList";
import { Search } from "lucide-react";
import { useSearchBar } from "./useSearchBar";

interface SearchPaintingBarProps {}

// TODO: <PaintingSearchBar /> 기능 개선
// - [ ] 여러번 검색 후, 뒤로가기 버튼 클릭시, URL searchParams은 변경되지만, 검색창의 값이 동기화되지않음.
//  -> 사용자 편의성 개선을 위해 수정되어야하는 버그
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
export const PaintingSearchBar = ({}: SearchPaintingBarProps): React.JSX.Element => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);
	const [input, setInput] = useState(getInput(searchParams));
	// const [results, setResults] = useState<Painting[]>([]);
	const saveRouteHandler = async (searchTarget: string) => {
		console.log("handleSearch");
		if (searchTarget.trim() === "") {
			if (pathName !== "/") {
				router.push("/");
			}
			return;
		}

		router.push(getURL(searchTarget));
		setInput(searchTarget);
		return;
	};

	const onSearch = useDebounceCallback(saveRouteHandler, 500);

	const { inputState, autoCompleteState, suggestionsRef, autoCompleteDispatch, handlers } =
		useSearchBar({
			onSearch,
			defaultValue: input,
			inputRef,
		});

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<div className="relative" ref={suggestionsRef}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
			<input
				ref={inputRef}
				value={inputState.text}
				type="text"
				placeholder="Search Painting..."
				onChange={handlers.onChange}
				className="w-full rounded-lg bg-gray-800 py-2 pl-10 pr-4 text-lg text-white outline-none focus:ring-2 focus:ring-red-500"
				spellCheck={false}
				onKeyUp={handlers.onClickOrKeyUp}
				onClick={handlers.onClickOrKeyUp}
				onKeyDown={handlers.onKeyDown}
			/>

			{autoCompleteState.loading && (
				<div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-b-gray-200 border-l-gray-200 border-r-blue-500 border-t-blue-500" />
				</div>
			)}

			{autoCompleteState.suggestions.length > 0 && (
				<AutocompleteList
					suggestions={autoCompleteState.suggestions}
					onSelect={handlers.onSelectSuggestion}
					query={autoCompleteState.query}
					highlightedIndex={autoCompleteState.selectedIndex}
					setHighlightedIndex={(selectedIndex: number) =>
						autoCompleteDispatch({ type: "SET_SELECTED_INDEX", payload: selectedIndex })
					}
				/>
			)}
		</div>
	);
};
