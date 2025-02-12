import React from "react";
import { findPainting } from "../lib/apis";
import { SearchPainting } from "../../components/search/SearchPainting";
import { redirect } from "next/navigation";
import { PaintingCardGrid } from "../../components/search/PaintingCardGrid";



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

  interface SearchPageProps {
    searchParams : Promise<{ [key: string] : string | string[] | undefined }>
  }
  export default async function SearchPage( {searchParams  } : SearchPageProps
  ) {

    const title = (await searchParams).title || "";
    
    if(title==""){
      redirect('/');
    }
    const searchTitle = typeof title === 'string' ? title : JSON.stringify(title)

    const paintings = await findPainting(searchTitle);
  
    return (
      <div className="min-h-screen bg-white text-white p-4">
        <h1 className="text-3xl font-bold text-black mb-4">Search Painting</h1>
        <SearchPainting searchTitle={searchTitle} />
        <PaintingCardGrid paintings={paintings} />
      </div>
    );
  }