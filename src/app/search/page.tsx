import React, { Suspense } from "react";
import { PaintingCardGrid } from "../../components/search/PaintingCardGrid";
import {  findPaintingAction } from "../../server-action/backend/painting/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/common/util";
import ErrorModal from "../../components/modal/ErrorModal";
import { SEARCH_PARAM_KEY } from "../../components/search/const";


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

    const title = (await searchParams)[SEARCH_PARAM_KEY.TITLE] || "";
    const artist = (await searchParams)[SEARCH_PARAM_KEY.ARTIST] || "";
    const tags = (await searchParams)[SEARCH_PARAM_KEY.TAGS]|| [];
    const styles = ( await searchParams)[SEARCH_PARAM_KEY.STYLES]|| [];


    if(Array.isArray(title) || Array.isArray(artist)){
        return <ErrorModal message="wrong access with invalid parameter"/>
    }

    const response = await findPaintingAction(
        title,
        artist,
        Array.isArray(tags) ? tags : [tags],
        Array.isArray(styles) ? styles : [styles]
      );

      if(isServerActionError(response)){
          throw new Error(response.message);
      }
      else if(isHttpException(response)){
          const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
          
          throw new Error(errorMessage);
      }

    return (
      <Suspense>
        <div className="mt-20">
          <PaintingCardGrid findResult={response}  />
        </div>
      </Suspense>
    );
  }