'use client'
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Painting } from "../../model/interface/painting";
import { findPainting } from "../lib/apis";
import { SearchBar } from "@/components/search/searchBar";
import { Card } from "../../components/card";


interface SearchResultsProps {
    results: Painting[];
  }
  
function SearchResults({ results }: SearchResultsProps) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {results.map((item) => (
          <Card key={item.id} imageSrc={item.image_url} alt={item.title} title={item.title} />
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
      => No. 사용자 입장에서는 검색 로직이 동작하는 것처럼 보여야하므로, 모든 그림의 로딩 완료 후 결과가 보이는 것은 사용자를 답답하게 만들 것이다.
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