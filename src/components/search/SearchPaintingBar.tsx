"use client";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefObject, useState } from "react";
import { SearchBar } from "./SearchBar";
import { INPUT_KEY, SEARCH_PARAM_KEY } from "./const";
import { SEARCH_LOGIC_ROUTE } from "../../route/search/route";
import { useDebounceCallback } from "../../hooks/useDebounceCallback";
import { parseWord, transformToInput, transformToUrlParam } from "./util";

interface ParsedInput {
	title: string;
	artist: string;
	tags: string[];
	styles: string[];
}

function parseInput(input: string): ParsedInput {
	const delimiter = " ";
	const words = input.split(delimiter);
	const map = new Map<string, string[]>();
	const TITLE = "title";
	const keys = [TITLE, ...Object.values(INPUT_KEY)];

	for (const word of words) {
		const keyValue = parseWord(word);
		if (keys.includes(keyValue.key)) {
			const existing = map.get(keyValue.key) || [];
			existing.push(keyValue.value);
			map.set(keyValue.key, existing);
		} else {
			const existing = map.get(TITLE) || [];
			existing.push(word);
			map.set(TITLE, existing);
		}
	}

	// 각 필드 추출
	const tags = map.get(INPUT_KEY.TAG) || [];
	const styles = map.get(INPUT_KEY.STYLE) || [];

	// 'artist'는 첫 번째 값만 추출
	const artist = (map.get(INPUT_KEY.ARTIST) || [])[0] || "";

	const title = (map.get(TITLE) || []).join(" ");

	return { title, tags, styles, artist };
}

function getInput(searchParams: ReadonlyURLSearchParams) {
	const title: string = searchParams.get(SEARCH_PARAM_KEY.TITLE) || "";
	const artist: string = searchParams.get(SEARCH_PARAM_KEY.ARTIST) || "";
	const tags: string[] = searchParams.getAll(SEARCH_PARAM_KEY.TAGS) || [];
	const styles: string[] = searchParams.getAll(SEARCH_PARAM_KEY.STYLES) || [];

	const inputs: string[] = [title];
	const delimiter = " ";

	if (artist.trim() !== "") {
		const value = transformToInput(artist);
		inputs.push(`${INPUT_KEY.ARTIST}:${value}`);
	}

	if (tags.length !== 0) {
		inputs.push(...tags.map((t) => `${INPUT_KEY.TAG}:${transformToInput(t)}`));
	}

	if (styles.length !== 0) {
		inputs.push(...styles.map((s) => `${INPUT_KEY.STYLE}:${transformToInput(s)}`));
	}

	return inputs.join(delimiter);
}

function getURL(input: string): string {
	const parsed: ParsedInput = parseInput(input);
	const { title, artist, tags, styles } = parsed;

	return SEARCH_LOGIC_ROUTE.SEARCH_PAINTING(
		title,
		transformToUrlParam(artist),
		tags.map((t) => transformToUrlParam(t)),
		styles.map((s) => transformToUrlParam(s)),
	);
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
