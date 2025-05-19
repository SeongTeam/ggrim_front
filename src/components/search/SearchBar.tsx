'use client'
import { Search } from "lucide-react";
import React, {  RefObject, useEffect, useRef, useState } from "react";
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


interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue? : string;
  inputRef : RefObject<HTMLInputElement>
}
export function SearchBar({ onSearch, defaultValue,inputRef }: SearchBarProps) {

  const [inputValue, setInputValue] = useState(defaultValue||"");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(defaultValue !== undefined ? defaultValue.length :0);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [query, setQuery ] = useState('');

  const moveCursor = ( position : number) => {
    const input = inputRef.current!;
    console.log('moveCursor' , {input});

    input.setSelectionRange(position,position);
    input.focus();

    setCursorPosition(position);
  }

  const applySuggestion = ( suggestion : string) =>{

    const cursorWithoutEnter = cursorPosition-1;
    const paramCase = getParamCase(inputValue,cursorWithoutEnter);
    let newInput = inputValue;
    let newCursor = cursorPosition;

    switch(paramCase){

      case 'NO_QUOTED' : {
        const beforeCurSor = inputValue.slice(0,cursorWithoutEnter+1);
        const afterCursor = inputValue.slice(cursorWithoutEnter+1);
        newInput = beforeCurSor +' '+ suggestion + ' ' + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.length + 1;
        break;
      }

      case 'NO_PARAM' : {
        const keyParts = getInsideDoubleQuotes(inputValue,cursorWithoutEnter);
        const beforeKey = inputValue.slice(0,cursorWithoutEnter+1-keyParts!.length);
        const afterCursor = inputValue.slice(cursorWithoutEnter+1);
        newInput = beforeKey + suggestion + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.slice(keyParts!.length).length +1;
        break;
      }

      case 'PARAM_KEY_ONLY' : {

        const quoted = getInsideDoubleQuotes(inputValue,cursorWithoutEnter);
        const param = parseKeyValue(quoted!);
        const beforeValue = inputValue.slice(0,cursorWithoutEnter+1-param!.value.length);
        const afterCursor = inputValue.slice(cursorWithoutEnter+1);
        newInput = beforeValue + suggestion + afterCursor;
        newCursor = cursorWithoutEnter + suggestion.slice(param!.value.length).length+2;
      }
      break;
      case 'DEFAULT' : {
      }
      default :
      break;
    }

    setInputValue(newInput);
    setCursorPosition(newCursor);
    setTimeout(()=>moveCursor(newCursor),0);
    onSearch(newInput);
  }


  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        selectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };


  const changeSuggestion = async (value : string) =>{

    const paramCase = getParamCase(value,cursorPosition);
    console.log('changeSuggestion' , paramCase);

    switch(paramCase){

      case 'NO_QUOTED' : {
        setSuggestions(quotedBaseSuggestion);
        setShowSuggestions(true);
        break;
      }

      case 'NO_PARAM' : {
        const quoted = getInsideDoubleQuotes(value,cursorPosition);
        setSuggestions(baseSuggestion.filter(suggestion=>suggestion.startsWith(quoted!)));
        setQuery(quoted!);
        setShowSuggestions(true);
        break;
      }

      case 'PARAM_KEY_ONLY' : {

        const quoted = getInsideDoubleQuotes(value,cursorPosition);
        const param = parseKeyValue(quoted!);
        console.log('PARAM_KEY_ONLY',param);
        const serverAction = getServerAction(param?.key||'');
        const response = await serverAction(param?.value ??'');
        setQuery(param?.value ??'');

        if(isServerActionError(response)){
          throw new Error(response.message);
        }
        else if(isHttpException(response)){
          toast.error( Array.isArray(response.message) ? response.message.join('\n') : response.message);
          return;
        }
        console.log('auto complete suggestion', response);

        const filtered = response.data.length > 0 ? response.data.map( d =>  d.name) : [''];
        
        console.log('filtered data ', filtered);
        setSuggestions(filtered);
        setShowSuggestions(true);

        
      }
      break;
      case 'DEFAULT' : 
      default :
        setShowSuggestions(false);
      break;
    }


  }


  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>)=>{
    console.log('changeHandler : ',e.target.value);
    setInputValue(e.target.value);
    onSearch(e.target.value);
    setCursorPosition(e.target.selectionStart ?? 0);

    changeSuggestion(e.target.value);
    setHighlightedIndex(-1);


  };

  const handleClickOrKeyUp = ( ) => {
    console.log(`handleClickOrKeyUp`,inputRef?.current);
    if (inputRef&&inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart ?? 0);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    applySuggestion(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
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
        value={inputValue}
        type="text"
        placeholder="Search Title..."
        onChange={changeHandler}
        className="w-full pl-10 pr-4 py-2 text-white bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500" 
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        onKeyUp={handleClickOrKeyUp}
        onClick={handleClickOrKeyUp}
        onKeyDown={keyDownHandler}
      />
        {showSuggestions && (
          <AutocompleteList
            suggestions={suggestions}
            onSelect={selectSuggestion}
            query={query}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
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
