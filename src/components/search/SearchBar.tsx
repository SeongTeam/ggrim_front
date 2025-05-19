'use client'
import { Search } from "lucide-react";
import React, {  RefObject, useEffect, useReducer, useRef,} from "react";
import { INPUT_KEY, } from "./const";
import {  findArtistsAction } from "../../server-action/backend/artist/api";
import { findTagsAction } from "../../server-action/backend/tag/api";
import { findStylesAction } from "../../server-action/backend/style/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/util";
import toast from "react-hot-toast";
import { getInsideDoubleQuotes, parseKeyValue } from "./util"; 
import { IPaginationResult } from "../../server-action/backend/common.dto";


const baseSuggestion = Object.values(INPUT_KEY).map(str => str+':');
const quotedBaseSuggestion = baseSuggestion.map(str => `"${str}"`);


type ParamCase = 'NO_QUOTED'|'NO_PARAM'|'PARAM_KEY_ONLY'|'DEFAULT';
function getParamCase( input : string, cursorPosition : number) : ParamCase {
  
  const result = getInsideDoubleQuotes(input,cursorPosition);
  console.log('getSuggestionCase' , {input, cursorPosition , char : input[cursorPosition],result});

  if(!result ){
    return 'NO_QUOTED'
  }
  const param = parseKeyValue(result);

  if(!param) {
    return 'NO_PARAM'
  }

  if(param?.key){
    return 'PARAM_KEY_ONLY'
  }
  
  return 'DEFAULT'


}



function getServerAction( key : string) {

  switch(key){

    case 'artist' : {
       
      return ( value : string) => {

          return findArtistsAction(value);
      }

    }

    case 'style' :{
      return ( value : string) => 
         findStylesAction(value);
    }

    case 'tag' : {
      return ( value : string) => findTagsAction(value);
    }

    default :
      return async ( value : string) : Promise<IPaginationResult<{name : string}>> => ({ data : [{name : value}], count : 0, page : 0, total : 0, pageCount : 0});

  }

}

interface AutoCompleteState {
 suggestions : string[];
 selectedIndex : number;
 query : string;
}



type AutoCompleteAction = 
  | {type : 'SET_SUGGESTIONS', suggestions: string[] }
  | {type : 'SET_SELECTED_INDEX' , selectedIndex : number}
  | {type : 'SET_QUERY' , query : string } 
  | {type : 'SET_ALL' , suggestions: string[] , selectedIndex : number, query : string }
  | {type : 'RESET'}
  


 function autoCompleteReducer(state : AutoCompleteState, action : AutoCompleteAction) {

  const { type } = action;

  switch(type) {

    case 'SET_SUGGESTIONS' :{
      const { suggestions } = action;
      return { ...state, suggestions};
    }
    case 'SET_SELECTED_INDEX' : {
      const { selectedIndex } = action;
      return { ...state, selectedIndex};
    }
    case 'SET_QUERY' : {
      const { query } = action;
      return { ...state, query};
    }
    case 'SET_ALL' : {
      const { suggestions, selectedIndex,query } = action;
      return { ...state,suggestions, selectedIndex,query};
    }
    case 'RESET' : {
      return { suggestions : [], selectedIndex : -1, query : ''}
    }
    default : 
      return state;
  }
}

interface InputState {
  text : string;
  cursorPos : number;
 }

type InputAction = 
| { type : 'SET_TEXT' , text : string }
| { type : 'SET_CURSOR_POS' , cursorPos : number} 
| { type : 'SET_ALL' , text : string, cursorPos : number };
 
function inputReducer(state : InputState, action : InputAction) {

  const { type } = action;

  switch(type) {

    case 'SET_TEXT' :{
      const { text }= action;
      return { ...state, text};
    }
    case 'SET_CURSOR_POS' : {
      const { cursorPos} = action;
      return { ...state, cursorPos};
    }
    case 'SET_ALL' : {
      const { text, cursorPos } = action;
      return { ...state, text, cursorPos };
    }
    default : 
      return state;
  }
}




interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue? : string;
  inputRef : RefObject<HTMLInputElement>
}
export function SearchBar({ onSearch, defaultValue,inputRef }: SearchBarProps) {

  const initInputState : InputState = {
    text : defaultValue ?? '',
    cursorPos : 0
  }

  const initAutoCompleteState : AutoCompleteState = {
    suggestions : [],
    selectedIndex : -1,
    query : '',

  }

  const [ inputState , inputDispatch ] = useReducer(inputReducer,initInputState)
  const [ autoCompleteState, autoCompleteDispatch ] = useReducer(autoCompleteReducer,initAutoCompleteState);
  const suggestionsRef = useRef<HTMLDivElement>(null);


  const moveCursor = ( position : number) => {
    const input = inputRef.current!;
    console.log('moveCursor' , {input});

    input.setSelectionRange(position,position);
    input.focus();
  }

  const applySuggestion = ( suggestion : string) =>{
    const { cursorPos, text } = inputState;

    const cursorWithoutEnter = cursorPos-1;
    const paramCase = getParamCase(text,cursorWithoutEnter);
    let newInput = text;
    let newCursor = cursorWithoutEnter;

    switch(paramCase){

      case 'NO_QUOTED' : {
        const beforeCurSor = text.slice(0,cursorWithoutEnter+1);
        const afterCursor = text.slice(cursorWithoutEnter+1);
        newInput = beforeCurSor +' '+ suggestion + ' ' + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.length + 1;
        break;
      }

      case 'NO_PARAM' : {
        const keyParts = getInsideDoubleQuotes(text,cursorWithoutEnter);
        const beforeKey = text.slice(0,cursorWithoutEnter+1-keyParts!.length);
        const afterCursor = text.slice(cursorWithoutEnter+1);
        newInput = beforeKey + suggestion + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.slice(keyParts!.length).length +1;
        break;
      }

      case 'PARAM_KEY_ONLY' : {

        const quoted = getInsideDoubleQuotes(text,cursorWithoutEnter);
        const param = parseKeyValue(quoted!);
        const beforeValue = text.slice(0,cursorWithoutEnter+1-param!.value.length);
        const afterCursor = text.slice(cursorWithoutEnter+1);
        newInput = beforeValue + suggestion + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.slice(param!.value.length).length+2;
      }
      break;
      case 'DEFAULT' : {
      }
      default :
      break;
    }

    inputDispatch({ type : 'SET_TEXT', text : newInput});
    inputDispatch({ type : 'SET_CURSOR_POS', cursorPos : newCursor});
    setTimeout(()=>moveCursor(newCursor),0);
    onSearch(newInput);
  }


  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestions, selectedIndex : prev} = autoCompleteState;
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const selectedIndex =  (prev + 1) % suggestions.length;
      autoCompleteDispatch({ type : 'SET_SELECTED_INDEX' , selectedIndex});
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const selectedIndex =  (prev - 1 + suggestions.length) % suggestions.length;
      autoCompleteDispatch({ type : 'SET_SELECTED_INDEX' , selectedIndex});
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (prev >= 0) {
        selectSuggestion(suggestions[prev]);
      }
    } else if (e.key === 'Escape') {
      autoCompleteDispatch({type :'SET_SUGGESTIONS' , suggestions : []});
    }
  };


  const changeSuggestion = async (value : string , cursorPosition : number) =>{

    const paramCase = getParamCase(value,cursorPosition);
    console.log('changeSuggestion' , paramCase);
    let suggestions : string[] = [];
    let query = '';
    const selectedIndex = -1;

    switch(paramCase){

      case 'NO_QUOTED' : {
        suggestions = quotedBaseSuggestion;
        
        break;
      }

      case 'NO_PARAM' : {
        const quoted = getInsideDoubleQuotes(value,cursorPosition);
        const filtered = baseSuggestion.filter(suggestion=>suggestion.startsWith(quoted!));
        suggestions = filtered;
        query = quoted!;
        break;
      }

      case 'PARAM_KEY_ONLY' : {

        const quoted = getInsideDoubleQuotes(value,cursorPosition);
        const param = parseKeyValue(quoted!);
        console.log('PARAM_KEY_ONLY',param);
        const serverAction = getServerAction(param?.key||'');
        const response = await serverAction(param?.value ??'');
        
        if(isServerActionError(response)){
          throw new Error(response.message);
        }
        else if(isHttpException(response)){
          toast.error( Array.isArray(response.message) ? response.message.join('\n') : response.message);
          return;
        }
        console.log('auto complete suggestion', response);
        
        suggestions = response.data.length > 0 ? response.data.map( d =>  d.name) : [''];
        query = param?.value ??'';

        
      }
      break;
      case 'DEFAULT' : 
      default :
      break;
    }

    autoCompleteDispatch({type :'SET_ALL' , query,suggestions,selectedIndex});


  }


  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>)=>{
    console.log('changeHandler : ',e.target.value);
    const text = e.target.value;

    // 커서의 위치에 있는 문자 기준은 커서의 왼쪽 문자를 기준으로 한다.
    const cursorPos = e.target.selectionStart ? e.target.selectionStart-1 : 0;
    changeSuggestion(e.target.value,cursorPos);
    inputDispatch({type :'SET_ALL' , text,cursorPos});


    
    onSearch(e.target.value);

  };

  const handleClickOrKeyUp = ( ) => {
    console.log(`handleClickOrKeyUp`,inputRef?.current);
    if (inputRef&&inputRef.current) {
      const cursorPos = inputRef.current.selectionStart ?? 0;
      inputDispatch({type :'SET_CURSOR_POS', cursorPos});
    }
  };

  const selectSuggestion = (suggestion: string) => {
    applySuggestion(suggestion);
    autoCompleteDispatch({type : 'RESET'});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        autoCompleteDispatch({type : 'RESET'});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  


  return (
    <div className="relative" ref={suggestionsRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        ref={inputRef}
        value={inputState.text}
        type="text"
        placeholder="Search Title..."
        onChange={changeHandler}
        className="w-full pl-10 pr-4 py-2 text-white bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500" 
        onKeyUp={handleClickOrKeyUp}
        onClick={handleClickOrKeyUp}
        onKeyDown={keyDownHandler}
      />
        {autoCompleteState.suggestions.length >0 && (
          <AutocompleteList
            suggestions={autoCompleteState.suggestions}
            onSelect={selectSuggestion}
            query={autoCompleteState.query}
            highlightedIndex={autoCompleteState.selectedIndex}
            setHighlightedIndex={(selectedIndex : number)=> autoCompleteDispatch({type : 'SET_SELECTED_INDEX',selectedIndex })}
          />
        )}
    </div>
  );
}


interface AutocompleteListProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  query : string;
  highlightedIndex : number,
  setHighlightedIndex : (index : number) => void;
}

export function AutocompleteList({
  suggestions,
  onSelect,
  query,
  highlightedIndex,
  setHighlightedIndex ,
}: AutocompleteListProps) {
  if (suggestions.length === 0) return null;

  const highlightMatch = (text: string, query: string) => {
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <span className="font-semibold text-red-400">{text.slice(i, i + query.length)}</span>
        {text.slice(i + query.length)}
      </>
    );
  };

  return (
    <ul
      className={`absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto `}
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => setHighlightedIndex(index)}
          className={`px-4 py-2 cursor-pointer text-white ${
            index === highlightedIndex ? 'bg-gray-600' : 'hover:bg-gray-600'
          }`}
        >
          {highlightMatch(suggestion,query)}
        </li>
      ))}
    </ul>
  );
}
