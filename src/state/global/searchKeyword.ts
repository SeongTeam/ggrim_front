import { createStore } from "zustand/vanilla";

export type SearchKeyWordState = {
	keyword: string;
};

export type SearchKeyWordAction = {
	setKeyword: (keyword: string) => void;
};

export type SearchKeyWordStore = SearchKeyWordState & SearchKeyWordAction;

export const createSearchKeyWordStore = (initState: SearchKeyWordState = { keyword: "" }) => {
	return createStore<SearchKeyWordStore>()((set) => ({
		...initState,
		setKeyword: (keyword: string) => set({ keyword }),
	}));
};
