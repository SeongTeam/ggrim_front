"use client";
import { Search } from "lucide-react";
import React, { RefObject } from "react";

import { useSearchBar } from "./useSearchBar";
import { AutocompleteList } from "./AutoCompleteList";

interface SearchBarProps {
	onSearch: (query: string) => void;
	defaultValue?: string;
	inputRef: RefObject<HTMLInputElement>;
}
export const SearchBar = ({ onSearch, defaultValue, inputRef }: SearchBarProps) => {
	const { inputState, autoCompleteState, suggestionsRef, autoCompleteDispatch, handlers } =
		useSearchBar({
			onSearch,
			defaultValue,
			inputRef,
		});

	return (
		<div className="relative" ref={suggestionsRef}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
			<input
				ref={inputRef}
				value={inputState.text}
				type="text"
				placeholder="Search Painting..."
				onChange={handlers.onChange}
				className="w-full rounded-lg bg-gray-800 py-2 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-red-500"
				onKeyUp={handlers.onClickOrKeyUp}
				onClick={handlers.onClickOrKeyUp}
				onKeyDown={handlers.onKeyDown}
			/>

			{autoCompleteState.loading && (
				<div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-b-gray-200 border-l-gray-200 border-r-blue-500 border-t-blue-500" />
				</div>
			)}

			{autoCompleteState.suggestions.length > 0 && (
				<AutocompleteList
					suggestions={autoCompleteState.suggestions}
					onSelect={handlers.onSelectSuggestion}
					query={autoCompleteState.query}
					highlightedIndex={autoCompleteState.selectedIndex}
					setHighlightedIndex={(selectedIndex: number) =>
						autoCompleteDispatch({ type: "SET_SELECTED_INDEX", payload: selectedIndex })
					}
				/>
			)}
		</div>
	);
};
