'use client'
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Painting } from "../../model/interface/painting";
import { findPainting } from "../lib/apis";


interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {

  const [inputValue, setInputValue] = useState("");

  const DELAY_MS = 500;
  useEffect(()=>{
    const delayDebounce = setTimeout(()=>{
        onSearch(inputValue);
  },  DELAY_MS);

    return () => clearTimeout(delayDebounce);
},[inputValue,onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search Title..."
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-white bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

interface SearchResultsProps {
    results: Painting[];
  }
  
function SearchResults({ results }: SearchResultsProps) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {results.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-2">
              <p className="text-white text-sm">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /*TODO
  [ ]'/'page에 search bar 추가
    - 검색 키워드 입력 후, /search?title='입력값' page로 이동해야함. 
    - 검색 키워드가 빈칸이면, '/' page로 이동
    - 넷플릭스 기능 참조
  [ ]검색 결과 출력시,모든 그림이 개별적으로 보이는 것보단, 한꺼번에 보이는게 좋지 않은가?
  [ ] '/' 디자인과 컨셉 맞추기
  [ ] backend 검색 로직 수정
      - title 검색시, 대문자 소문자 구별 없이 진행 필요.
  */
  export default function Page() {
    const [title, setTitle] = useState("");
    const [results, setResults] = useState<Painting[]>([]);
  
    const handleSearch = useCallback( async (searchTitle: string) => {

        if(searchTitle.trim() === ""){
          return;
        }

        setTitle(searchTitle);
        const data = await findPainting(searchTitle);
        setResults(data);

  },[]);
  
    return (
      <div className="min-h-screen bg-white text-white p-4">
        <h1 className="text-3xl font-bold text-black mb-4">Search Painting</h1>
        <SearchBar onSearch={handleSearch} />
        <SearchResults results={results} />
      </div>
    );
  }