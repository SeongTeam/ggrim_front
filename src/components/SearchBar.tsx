'use client'
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";


interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue? : string;
}
export function SearchBar({ onSearch, defaultValue }: SearchBarProps) {

  const [inputValue, setInputValue] = useState(defaultValue||"");

  const DELAY_MS = 500;
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(inputValue);
    }, DELAY_MS);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, onSearch]);
  


  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        value={inputValue}
        type="text"
        placeholder="Search Title..."
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-white bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
    </div>
  );
}
