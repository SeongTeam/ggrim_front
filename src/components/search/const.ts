export const INPUT_KEY = {
	TAG: "tag",
	ARTIST: "artist",
	STYLE: "style",
} as const;

export const SEARCH_PARAM_KEY = {
	KEYWORD: "keyword",
} as const;

export const BASE_SUGGESTIONS = ["tag:", "artist:", "style:"] as const;
export const AUTOCOMPLETE_CASE = {
	BASE: "BASE",
	EMPTY: "EMPTY",
	KEY_VALUE: "KEY_VALUE",
} as const;
export const DELIMITER = {
	SPACE: " ",
	COLON: ":",
	UNDER_BAR: "_",
};
