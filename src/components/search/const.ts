export const INPUT_KEY = {
	TAG: "tag",
	ARTIST: "artist",
	STYLE: "style",
} as const;

export const SEARCH_PARAM_KEY = {
	ARTIST: "artist",
	TAGS: "tags[]",
	STYLES: "styles[]",
	TITLE: "title",
} as const;

export const BASE_SUGGESTIONS = Object.values(INPUT_KEY).map((str) => `${str}:`);
export const QUOTED_BASE_SUGGESTIONS = BASE_SUGGESTIONS.map((str) => `"${str}"`);
