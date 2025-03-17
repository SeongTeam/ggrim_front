'use client'
import { Search } from "lucide-react";
import React, {  RefObject, useState } from "react";


interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue? : string;
  inputRef? : RefObject<HTMLInputElement>
}
export function SearchBar({ onSearch, defaultValue,inputRef }: SearchBarProps) {

  const [inputValue, setInputValue] = useState(defaultValue||"");

  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>)=>{
    console.log('changeHandler : ',e.target.value);
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  


  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        ref={inputRef}
        value={inputValue}
        type="text"
        placeholder="Search Title..."
        onChange={changeHandler}
        className="w-full pl-10 pr-4 py-2 text-white bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
    </div>
  );
}
