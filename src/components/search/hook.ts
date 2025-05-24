'use client';
import { Dispatch, RefObject, useCallback, useEffect, useReducer, useRef } from 'react';
import { BASE_SUGGESTIONS, QUOTED_BASE_SUGGESTIONS } from './const';
import { findArtistsAction } from '../../server-action/backend/artist/api';
import { findTagsAction } from '../../server-action/backend/tag/api';
import { findStylesAction } from '../../server-action/backend/style/api';
import { isHttpException, isServerActionError } from '../../server-action/backend/util';
import toast from 'react-hot-toast';
import {
    calculateNewInput,
    determineParamCase,
    getInsideDoubleQuotes,
    parseKeyValue,
} from './util';
import {
    HttpException,
    IPaginationResult,
    ServerActionError,
} from '../../server-action/backend/common.dto';
import { useDebounceCallback } from '../../hooks/optimization';
import { AutoCompleteAction, AutoCompleteState, InputAction, InputState } from './type';

// Constants

interface UseSearchBarProps {
    onSearch: (query: string) => void;
    defaultValue?: string;
    inputRef: RefObject<HTMLInputElement>;
    debounceMs?: number;
}

interface UseSearchBarReturn {
    inputState: InputState;
    autoCompleteState: AutoCompleteState;
    suggestionsRef: RefObject<HTMLDivElement>;
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
    const actionMap: Record<
        string,
        (
            value: string,
        ) => Promise<IPaginationResult<{ name: string }> | HttpException | ServerActionError>
    > = {
        artist: (value: string) => findArtistsAction(value),
        style: (value: string) => findStylesAction(value),
        tag: (value: string) => findTagsAction(value),
    };

    return (
        actionMap[key] ||
        (async (value: string): Promise<IPaginationResult<{ name: string }>> => ({
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
        case 'SET_SUGGESTIONS':
            return { ...state, suggestions: action.payload };
        case 'SET_SELECTED_INDEX':
            return { ...state, selectedIndex: action.payload };
        case 'SET_QUERY':
            return { ...state, query: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_ALL':
            return { ...state, ...action.payload };
        case 'RESET':
            return {
                suggestions: [],
                selectedIndex: -1,
                query: '',
                loading: false,
                error: null,
            };
        default:
            return state;
    }
}

function inputReducer(state: InputState, action: InputAction): InputState {
    switch (action.type) {
        case 'SET_TEXT':
            return { ...state, text: action.payload };
        case 'SET_CURSOR_POS':
            return { ...state, cursorPos: action.payload };
        case 'SET_ALL':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

// Main hook
export function useSearchBar({
    onSearch,
    defaultValue = '',
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
        query: '',
        loading: false,
        error: null,
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
            if (!inputRef.current) return;

            try {
                inputRef.current.setSelectionRange(position, position);
                inputRef.current.focus();
            } catch (error) {
                console.warn('Failed to move cursor:', error);
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

            inputDispatch({ type: 'SET_ALL', payload: { text: newInput, cursorPos: newCursor } });

            // Use setTimeout to ensure DOM update before cursor movement
            setTimeout(() => safeMoveCursor(newCursor), 0);
            onSearch(newInput);
        },
        [inputState.text, inputState.cursorPos, safeMoveCursor, onSearch],
    );

    const fetchSuggestions = async (value: string, cursorPosition: number) => {
        const paramCase = determineParamCase(value, cursorPosition);
        let suggestions: string[] = [];
        let query = '';

        autoCompleteDispatch({ type: 'SET_LOADING', payload: true });
        autoCompleteDispatch({ type: 'SET_ERROR', payload: null });
        switch (paramCase) {
            case 'NO_QUOTED': {
                suggestions = QUOTED_BASE_SUGGESTIONS;
                break;
            }

            case 'NO_PARAM': {
                const quoted = getInsideDoubleQuotes(value, cursorPosition);
                if (quoted) {
                    suggestions = BASE_SUGGESTIONS.filter((suggestion) =>
                        suggestion.startsWith(quoted),
                    );
                    query = quoted;
                }
                break;
            }

            case 'PARAM_KEY_ONLY': {
                const quoted = getInsideDoubleQuotes(value, cursorPosition);
                if (!quoted) break;

                const param = parseKeyValue(quoted);
                if (!param?.key) break;

                const serverAction = createServerAction(param.key);
                const response = await serverAction(param.value || '');

                if (isServerActionError(response)) {
                    throw new Error(response.message);
                }

                if (isHttpException(response)) {
                    const errorMessage = Array.isArray(response.message)
                        ? response.message.join('\n')
                        : response.message;
                    toast.error(errorMessage);
                    autoCompleteDispatch({ type: 'SET_ERROR', payload: errorMessage });
                    return;
                }

                suggestions = response.data.length > 0 ? response.data.map((d) => d.name) : [''];
                query = param.value || '';
                break;
            }

            default:
                break;
        }

        autoCompleteDispatch({
            type: 'SET_ALL',
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
        const cursorPos = Math.max(0, (e.target.selectionStart || 1) - 1);
        inputDispatch({ type: 'SET_ALL', payload: { text, cursorPos } });
        debouncedFetchSuggestions(text, cursorPos);
        onSearch(text);
    };

    const handleClickOrKeyUp = () => {
        if (!inputRef.current) return;

        const cursorPos = inputRef.current.selectionStart || 0;
        inputDispatch({ type: 'SET_CURSOR_POS', payload: cursorPos });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { suggestions, selectedIndex } = autoCompleteState;
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                autoCompleteDispatch({
                    type: 'SET_SELECTED_INDEX',
                    payload: (selectedIndex + 1) % suggestions.length,
                });
                break;

            case 'ArrowUp':
                e.preventDefault();
                autoCompleteDispatch({
                    type: 'SET_SELECTED_INDEX',
                    payload: (selectedIndex - 1 + suggestions.length) % suggestions.length,
                });
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    applySuggestion(suggestions[selectedIndex]);
                    autoCompleteDispatch({ type: 'RESET' });
                }
                break;

            case 'Escape':
                autoCompleteDispatch({ type: 'RESET' });
                break;

            default:
                break;
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        applySuggestion(suggestion);
        autoCompleteDispatch({ type: 'RESET' });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                autoCompleteDispatch({ type: 'RESET' });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
