import { SEARCH_PARAM_KEY } from "../../components/search/const";

export const SEARCH_LOGIC_ROUTE = {
	SEARCH_PAINTING: (keyword: string) => {
		let url = `/search?`;
		url += `${SEARCH_PARAM_KEY.KEYWORD}=${keyword}`;
		return url;
	},
} as const;
