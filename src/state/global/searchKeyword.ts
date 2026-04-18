import { createStore } from "zustand/vanilla";

export type SearchKeyWordState = {
	keyword: string;
};

export type SearchKeyWordAction = {
	setKeyword: (keyword: string) => void;
	resetKeyword: () => void;
};

export type SearchKeyWordStore = SearchKeyWordState & SearchKeyWordAction;

const defaultKeyword = "";

export const createSearchKeyWordStore = (
	initState: SearchKeyWordState = { keyword: defaultKeyword },
) => {
	return createStore<SearchKeyWordStore>()((set) => ({
		...initState,
		setKeyword: (keyword: string) => set({ keyword }),
		resetKeyword: () => set({ keyword: defaultKeyword }),
	}));
};
