import { ReadonlyURLSearchParams } from "next/navigation";
import { AUTOCOMPLETE_CASE, DELIMITER, INPUT_KEY, PAINTING_PARAM_KEY } from "./const";
import { ParsedInput } from "./SearchPaintingBar";
import { InputKeyValue, ParamCase } from "./type";
import { PAINTING_LOGIC_ROUTE } from "../../route/painting/route";

export function transformToInput(urlParam: string) {
	return urlParam.split(DELIMITER.SPACE).join(DELIMITER.UNDER_BAR);
}

export function transformToSearchParam(input: string) {
	return input.split(DELIMITER.UNDER_BAR).join(DELIMITER.SPACE);
}

export function extractValues(param: string, key: InputKeyValue): string[] {
	const regex = new RegExp(`${key}:(\\S+)`, "g");
	const values: string[] = [];
	let match;
	while ((match = regex.exec(param)) !== null) {
		values.push(match[1]);
	}
	return values;
}

export function calculateNewInput(
	text: string,
	cursorPos: number,
	suggestion: string,
): { newInput: string; newCursor: number } {
	const keyValue = parseWord(readCurrentWord(text, cursorPos));
	const wordCase = getAutoCompleteCase(keyValue);
	switch (wordCase) {
		case AUTOCOMPLETE_CASE.BASE:
			const beforeCursor = text.slice(0, cursorPos);
			const afterCursor = text.slice(cursorPos);
			const newInput = `${beforeCursor} ${suggestion} ${afterCursor}`;
			return {
				newInput: newInput,
				newCursor: beforeCursor.length + suggestion.length + 1,
			};
		case AUTOCOMPLETE_CASE.KEY_VALUE:
			const beforeValue = text.slice(0, cursorPos - keyValue.value.length);
			const afterValue = text.slice(cursorPos);
			return {
				newInput: `${beforeValue}${suggestion} ${afterValue}`,
				newCursor: beforeValue.length + suggestion.length,
			};
		default:
			return { newInput: text, newCursor: cursorPos };
	}
}

export function readCurrentWord(input: string, cursorPos: number) {
	if (cursorPos < 0 || cursorPos > input.length) {
		return "";
	}

	const delimiter = " ";
	let start = cursorPos;
	while (start > 0 && input[start - 1] !== delimiter) {
		start--;
	}

	const word = input.slice(start, cursorPos);
	console.log("currentWord", { word, input, cursorPos, start });
	return word;
}

export function parseWord(word: string): { key: string; value: string } {
	const match = word.match(/^(\w+):(.+)$/);
	if (match) {
		const [, key, value] = match;
		return { key, value };
	}
	return { key: "", value: word };
}

export function getAutoCompleteCase(parsed: { key: string; value: string }) {
	const keys = Object.values(INPUT_KEY);

	if (parsed.key === "" && parsed.value === "") {
		return AUTOCOMPLETE_CASE.BASE;
	} else if (keys.some((key) => key === parsed.key)) {
		return AUTOCOMPLETE_CASE.KEY_VALUE;
	}

	return AUTOCOMPLETE_CASE.EMPTY;
}
export function parseInput(input: string): ParsedInput {
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

export function getInput(searchParams: ReadonlyURLSearchParams) {
	const input = searchParams.get(PAINTING_PARAM_KEY.KEYWORD) || "";

	return input;
}
export function getURL(input: string): string {
	return PAINTING_LOGIC_ROUTE.SEARCH_PAINTING(input);
}

export function getSearchParams(input: string) {
	const parsed = parseInput(input);
	const params = {
		title: transformToSearchParam(parsed.title),
		artist: transformToSearchParam(parsed.artist),
		tags: parsed.tags.map(transformToSearchParam),
		styles: parsed.styles.map(transformToSearchParam),
	};

	return params;
}
