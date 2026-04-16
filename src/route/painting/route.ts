import { PAINTING_PARAM_KEY } from "../../components/painting/const";

export const PAINTING_LOGIC_ROUTE = {
	SEARCH_PAINTING: (keyword: string) => {
		let url = `/painting?`;
		url += `${PAINTING_PARAM_KEY.KEYWORD}=${keyword}`;
		return url;
	},
} as const;
