import React, { Suspense } from "react";
import { findPainting } from "../lib/api.backend";
import { FindPaintingResult } from '../lib/dto';
import { PaintingCardGrid } from "../../components/search/PaintingCardGrid";
import { serverLogger } from "../../util/logger";


// TODO: Search Page 개선
// - [x] '/'page에 search bar 추가
// - [x] Search Bar에서 검색 키워드 입력 후, /search?title='입력값' page로 이동로직 추가
// - [x] 검색 키워드가 빈칸이면, '/' page로 이동로직 추가
// - [ ] home 디자인과 Search Bar 디자인 컨셉 일관성 지키기
// ! 주의: <경고할 사항>
// ? 질문: 검색 결과 출력시,모든 그림이 개별적으로 보이는 것보단, 한꺼번에 보이는게 좋지 않은가?
//   -> No. 사용자 입장에서는 검색 로직이 동작하는 것처럼 보여야하므로, 모든 그림의 로딩 완료 후 결과가 보이는 것은 사용자를 답답하게 만들 것이다.
// * 참고: <관련 정보나 링크>


  interface SearchPageProps {
    searchParams : Promise<{ [key: string] : string | string[] | undefined }>
  }

  export default async function SearchPage( {searchParams  } : SearchPageProps
  ) {

    const title = (await searchParams).title || "";
    const artist = (await searchParams).artist || "";
    const tags = (await searchParams).tags || [];
    const styles = ( await searchParams).styles || [];


    
    const searchTitle = typeof title === 'string' ? title : JSON.stringify(title);
    const searchArtist = typeof artist === 'string' ? artist : JSON.stringify(artist);
    const searchTags = typeof tags === 'string' ? [tags] : tags;
    const searchStyles = typeof styles ==='string' ? [styles] : styles;

    const result : FindPaintingResult = await findPainting(searchTitle,searchArtist,searchTags,searchStyles);
    serverLogger.info(`{path : /search}current param : $${JSON.stringify({title,artist,tags,styles})}`);
    return (
      <Suspense>
        <div className="mt-20">
          <PaintingCardGrid findResult={result}  />
        </div>
      </Suspense>
    );
  }