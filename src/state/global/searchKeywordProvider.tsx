"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";
import { type SearchKeyWordStore, createSearchKeyWordStore } from "./searchKeyword";

export type SearchKeyWordApi = ReturnType<typeof createSearchKeyWordStore>;
export const SearchKeywordContext = createContext<SearchKeyWordApi | undefined>(undefined);

export interface SearchKeywordProviderProps {
	children: ReactNode;
}

export const SearchKeywordProvider = ({ children }: SearchKeywordProviderProps) => {
	const [store] = useState(() => createSearchKeyWordStore());

	return <SearchKeywordContext.Provider value={store}>{children}</SearchKeywordContext.Provider>;
};

export const userSearchKeywordStore = <T,>(selector: (store: SearchKeyWordStore) => T): T => {
	const searchKeywordStoreContext = useContext(SearchKeywordContext);
	if (!searchKeywordStoreContext) {
		throw new Error("SearchKeywordContext is not provided");
	}

	return useStore(searchKeywordStoreContext, selector);
};
