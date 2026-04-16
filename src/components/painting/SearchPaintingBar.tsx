"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefObject, useState } from "react";
import { SearchBar } from "./SearchBar";
import { useDebounceCallback } from "../../hooks/useDebounceCallback";
import { getInput, getURL, transformToInput } from "./util";

export interface ParsedInput {
	title: string;
	artist: string;
	tags: string[];
	styles: string[];
}

interface SearchPaintingBarProps {
	inputRef: RefObject<HTMLInputElement | null>;
}

// TODO: <SearchPaintingBar /> 기능 개선
// - [ ] 여러번 검색 후, 뒤로가기 버튼 클릭시, URL searchParams은 변경되지만, 검색창의 값이 동기화되지않음.
//  -> 사용자 편의성 개선을 위해 수정되어야하는 버그
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
export const SearchPaintingBar = (props: SearchPaintingBarProps): React.JSX.Element => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const [input, setInput] = useState(getInput(searchParams));
	// const [results, setResults] = useState<Painting[]>([]);
	const handleSearchOrigin = async (searchTarget: string) => {
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

	const handleSearch = useDebounceCallback(handleSearchOrigin, 500);

	return <SearchBar inputRef={props.inputRef} onSearch={handleSearch} defaultValue={input} />;
};
