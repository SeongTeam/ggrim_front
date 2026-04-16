"use client";
import { Dispatch, RefObject, useCallback, useEffect, useReducer, useRef } from "react";
import { BASE_SUGGESTIONS } from "./const";
import { findArtistsAction } from "../../../server-action/backend/artist/api";
import { findTagsAction } from "../../../server-action/backend/tag/api";
import { findStylesAction } from "../../../server-action/backend/style/api";
import toast from "react-hot-toast";
import {
	calculateNewInput,
	getAutoCompleteCase,
	readCurrentWord,
	parseWord,
	transformToInput,
} from "./util";
import { AUTOCOMPLETE_CASE } from "./const";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";
import { AutoCompleteAction, AutoCompleteState, InputAction, InputState } from "./type";
import { PaginationResponse } from "../../../server-action/backend/_common/type";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import { ServerActionFailure, ServerActionSuccess } from "../../../server-action/client/type";

// Constants

interface UseSearchBarProps {
	onSearch: (query: string) => void;
	defaultValue?: string;
	inputRef: RefObject<HTMLInputElement | null>;
	debounceMs?: number;
}

interface UseSearchBarReturn {
	inputState: InputState;
	autoCompleteState: AutoCompleteState;
	suggestionsRef: RefObject<HTMLDivElement | null>;
	autoCompleteDispatch: Dispatch<AutoCompleteAction>;
	handlers: {
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		onClickOrKeyUp: () => void;
		onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
		onSelectSuggestion: (suggestion: string) => void;
	};
}

// Utility functions

function createServerAction(key: string) {
	const runAction = async (
		value: string,
		action: (
			value: string,
		) => Promise<
			ServerActionSuccess<PaginationResponse<{ name: string }>> | ServerActionFailure
		>,
	): Promise<PaginationResponse<{ name: string }>> => {
		const result = await action(value);
		if (result.ok) {
			return result.data;
		}

		throw new Error(result.message);
	};

	const actionMap: Record<
		string,
		(value: string) => Promise<PaginationResponse<{ name: string }>>
	> = {
		artist: (value: string) => runAction(value, findArtistsAction),
		style: (value: string) => runAction(value, findStylesAction),
		tag: (value: string) => runAction(value, findTagsAction),
	};

	return (
		actionMap[key] ||
		(async (value: string): Promise<PaginationResponse<{ name: string }>> => ({
			data: [{ name: value }],
			count: 0,
			page: 0,
			total: 0,
			pageCount: 0,
		}))
	);
}

// Reducers
function autoCompleteReducer(
	state: AutoCompleteState,
	action: AutoCompleteAction,
): AutoCompleteState {
	switch (action.type) {
		case "SET_SUGGESTIONS":
			return { ...state, suggestions: action.payload };
		case "SET_SELECTED_INDEX":
			return { ...state, selectedIndex: action.payload };
		case "SET_QUERY":
			return { ...state, query: action.payload };
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "SET_ALL":
			return { ...state, ...action.payload };
		case "RESET":
			return {
				suggestions: [],
				selectedIndex: -1,
				query: "",
				loading: false,
				error: undefined,
			};
		default:
			return state;
	}
}

function inputReducer(state: InputState, action: InputAction): InputState {
	switch (action.type) {
		case "SET_TEXT":
			return { ...state, text: action.payload };
		case "SET_CURSOR_POS":
			return { ...state, cursorPos: action.payload };
		case "SET_ALL":
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

// Main hook
export function usePaintingSearchBar({
	onSearch,
	defaultValue = "",
	inputRef,
	debounceMs = 300,
}: UseSearchBarProps): UseSearchBarReturn {
	// Initial states
	const initialInputState: InputState = {
		text: defaultValue,
		cursorPos: 0,
	};

	const initialAutoCompleteState: AutoCompleteState = {
		suggestions: [],
		selectedIndex: -1,
		query: "",
		loading: false,
		error: undefined,
	};

	// State management
	const [inputState, inputDispatch] = useReducer(inputReducer, initialInputState);
	const [autoCompleteState, autoCompleteDispatch] = useReducer(
		autoCompleteReducer,
		initialAutoCompleteState,
	);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	const safeMoveCursor = useCallback(
		(position: number) => {
			if (!inputRef.current) {
				return;
			}
			try {
				inputRef.current.setSelectionRange(position, position);
				inputRef.current.focus();
			} catch (error) {
				console.warn("Failed to move cursor:", error);
			}
		},
		[inputRef],
	);

	const applySuggestion = useCallback(
		(suggestion: string) => {
			const { newInput, newCursor } = calculateNewInput(
				inputState.text,
				inputState.cursorPos,
				suggestion,
			);

			inputDispatch({ type: "SET_ALL", payload: { text: newInput, cursorPos: newCursor } });

			// Use setTimeout to ensure DOM update before cursor movement
			setTimeout(() => safeMoveCursor(newCursor), 0);
			onSearch(newInput);
		},
		[inputState.text, inputState.cursorPos, safeMoveCursor, onSearch],
	);

	const fetchSuggestions = async (value: string, cursorPosition: number) => {
		const word = readCurrentWord(value, cursorPosition);
		const keyValue = parseWord(word);
		const wordCase = getAutoCompleteCase(keyValue);
		let suggestions: string[] = [];
		let query = "";

		autoCompleteDispatch({ type: "SET_LOADING", payload: true });
		autoCompleteDispatch({ type: "SET_ERROR", payload: undefined });
		switch (wordCase) {
			case AUTOCOMPLETE_CASE.BASE: {
				suggestions = [...BASE_SUGGESTIONS];
				break;
			}

			case AUTOCOMPLETE_CASE.KEY_VALUE: {
				const serverAction = createServerAction(keyValue.key);
				try {
					const response = await serverAction(keyValue.value || "");
					suggestions =
						response.data.length > 0
							? response.data.map((d) => transformToInput(d.name))
							: [""];
					query = keyValue.value || "";
					break;
				} catch (error) {
					if (!isServerActionError(error)) {
						toast.error("An unexpected error occurred. Please try again later.");
						throw error;
					}
					if (error.status === "clientError") {
						const message = JSON.stringify(error.cause, null, 2);
						autoCompleteDispatch({ type: "SET_ERROR", payload: message });
					} else {
						toast.error(error.message);
					}
				}
			}

			default:
				break;
		}

		autoCompleteDispatch({
			type: "SET_ALL",
			payload: {
				suggestions,
				query,
				selectedIndex: -1,
				loading: false,
			},
		});
	};

	const debouncedFetchSuggestions = useDebounceCallback(fetchSuggestions, debounceMs);

	// Event handlers
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		const cursorPos = Math.max(0, e.target.selectionStart || 1);
		inputDispatch({ type: "SET_ALL", payload: { text, cursorPos } });
		debouncedFetchSuggestions(text, cursorPos);
		onSearch(text);
	};

	const handleClickOrKeyUp = () => {
		if (!inputRef.current) {
			return;
		}
		const cursorPos = inputRef.current.selectionStart || 0;
		inputDispatch({ type: "SET_CURSOR_POS", payload: cursorPos });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const { suggestions, selectedIndex } = autoCompleteState;
		if (suggestions.length === 0) {
			return;
		}
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				autoCompleteDispatch({
					type: "SET_SELECTED_INDEX",
					payload: (selectedIndex + 1) % suggestions.length,
				});
				break;

			case "ArrowUp":
				e.preventDefault();
				autoCompleteDispatch({
					type: "SET_SELECTED_INDEX",
					payload: (selectedIndex - 1 + suggestions.length) % suggestions.length,
				});
				break;

			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && suggestions[selectedIndex]) {
					applySuggestion(suggestions[selectedIndex]);
					autoCompleteDispatch({ type: "RESET" });
				}
				break;

			case "Escape":
				autoCompleteDispatch({ type: "RESET" });
				break;

			default:
				break;
		}
	};

	const handleSelectSuggestion = (suggestion: string) => {
		applySuggestion(suggestion);
		autoCompleteDispatch({ type: "RESET" });
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
				autoCompleteDispatch({ type: "RESET" });
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return {
		inputState,
		autoCompleteState,
		suggestionsRef,
		autoCompleteDispatch,
		handlers: {
			onChange: handleChange,
			onClickOrKeyUp: handleClickOrKeyUp,
			onKeyDown: handleKeyDown,
			onSelectSuggestion: handleSelectSuggestion,
		},
	};
}
