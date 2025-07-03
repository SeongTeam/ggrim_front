import { INPUT_KEY, SEARCH_PARAM_KEY } from "./const";

// Types
export type ParamCase = "NO_QUOTED" | "NO_PARAM" | "PARAM_KEY_ONLY" | "DEFAULT";

export interface AutoCompleteState {
	suggestions: string[];
	selectedIndex: number;
	query: string;
	loading: boolean;
	error?: string;
}

export type AutoCompleteAction =
	| { type: "SET_SUGGESTIONS"; payload: string[] }
	| { type: "SET_SELECTED_INDEX"; payload: number }
	| { type: "SET_QUERY"; payload: string }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload?: string }
	| { type: "SET_ALL"; payload: Partial<AutoCompleteState> }
	| { type: "RESET" };

export interface InputState {
	text: string;
	cursorPos: number;
}

export type InputAction =
	| { type: "SET_TEXT"; payload: string }
	| { type: "SET_CURSOR_POS"; payload: number }
	| { type: "SET_ALL"; payload: Partial<InputState> };

export type InputKeyValue = (typeof INPUT_KEY)[keyof typeof INPUT_KEY];
export type SearchParamKeyValue = (typeof SEARCH_PARAM_KEY)[keyof typeof SEARCH_PARAM_KEY];
