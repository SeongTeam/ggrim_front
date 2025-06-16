'use client';
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { FindPaintingResult, Painting } from '@/server-action/backend/painting/dto';
import { ShortPainting } from '@/server-action/backend/painting/dto';
import HoverCard from "../HoverCard";
import { PreviewPainting } from '../PreviewPainting';
import { Modal } from "../modal/Modal";
import { PaintingDetailView } from "../PaintingDetailView";
import { useSearchParams } from "next/navigation";
import { throttle } from "../../util/optimization";
import { findPaintingAction, getPaintingAction } from "../../server-action/backend/painting/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/util";

interface PaintingCardGridProps  {
    findResult : FindPaintingResult;
}

export function PaintingCardGrid( props: PaintingCardGridProps ): React.JSX.Element {

    const [selectedPainting , setSelectedPainting] = useState<Painting|undefined>(undefined);
    const [searchPaintings,setSearchPaintings] = useState<ShortPainting[]>(props.findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값? 
    const isLoadingRef : MutableRefObject<boolean>= useRef(false);
    const findResultRef = useRef<FindPaintingResult>(props.findResult);
    const searchParam = useSearchParams();

    const openModal = async (paintingId : string) =>{
        const response = await getPaintingAction(paintingId)
            if(isServerActionError(response)){
                throw new Error(response.message);
            }
            else if(isHttpException(response)){
                const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
                console.log(`id(${paintingId} error.
                    ${errorMessage}`);
                
            }else{
                setSelectedPainting(response);
            }
    }

    const closeModal = () =>{
        setSelectedPainting(undefined);
    }



      // 스크롤 이벤트 핸들러
    useEffect(() => {
        const loadMorePainting = async ()  => {
        
            if(!(findResultRef.current.page !== findResultRef.current.pageCount )|| isLoadingRef.current){
                console.log('not load painting')
                console.log(findResultRef,isLoadingRef);
                return;
            }
            isLoadingRef.current = true;
            const searchTitle : string = searchParam.get('title') || "";
            const searchArtist : string = searchParam.get('artist') || "";
            const searchTags : string[]= searchParam.getAll('tags') || [];
            const searchStyles : string[] = searchParam.getAll('styles') || [];
            console.log(`load ${findResultRef.current.page +1} page`);
            const response = await findPaintingAction(searchTitle,searchArtist,searchTags,searchStyles,findResultRef.current.page+1);

            if(isServerActionError(response)){
                throw new Error(response.message);
            }
            else if(isHttpException(response)){
                const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
                
                throw new Error(errorMessage);
            }

            findResultRef.current = response;
            setSearchPaintings(prev=> [...prev, ...response.data]);
            
            isLoadingRef.current = false;
        }


        const handleScroll = () => {
            console.log(`[handleScroll]`);
            if (
                // TODO: handleScroll 로직 성능 개선
                // - [x] throttle 구현
                //   -> innerHeight,scrollY,offsetHeight 참조는 리플로우를 발생시킬 수 있다.
                //   -> throttle을 통해서, 스크롤 핸들러가 특정 주기마다만 호출할 수 있게 하면, 리플로우 발생 횟수가 감소
                // - [ ] Intersection Observer API 사용
                //    -> throttle에 의해 리플로우 발생 횟수를 줄이더라도, 스크롤 이벤트에 특정 주기마다 리플로우가 발생할 수 있다.
                //    -> 브라우저가 직접 요소의 가시성을 감지하므로, 리플로우가 발생할 때만 처리된다.
                // ! 주의: <경고할 사항>
                // ? 질문: <의문점 또는 개선 방향>
                // * 참고: - infinite Scroll 참조 문서 https://tech.kakaoenterprise.com/149


                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !isLoadingRef.current
            ) {
                console.log(`[loadMorePainting]`);
                loadMorePainting();
            }
        };

        const handleScrollThrottle = throttle(handleScroll,300);

        console.log('[useEffect] : for config scroll event');
        window.addEventListener("scroll", handleScrollThrottle);
        return () => window.removeEventListener("scroll", handleScrollThrottle);
    }, [searchParam]); 

    useEffect(()=>{
        setSearchPaintings(props.findResult.data);
        console.log('[useEffect] : for init  SearchPainting');
        findResultRef.current = props.findResult;
        return ()=>{
            setSearchPaintings(prev=>prev);
        }

    },[props.findResult])

    // useEffect(() => {
    //     console.log("searchPaintings 상태가 변경됨:", searchPaintings);
    // }, [searchPaintings]); // searchPaintings 상태가 변경될 때마다 로그 출력



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 
                gap-4 
                mt-4
                px-4 sm:px-0
                ">
                {searchPaintings.map((item) => (
                    <div key={`${item.id}+searchPaintingHoverCard`} className="max-w-2xl h-[400px]">
                    <HoverCard  
                        cardProps ={{ imageProps : { src : item.image_url, height : item.height, width : item.width, alt : item.title } , title : item.title}}
                        onClick={()=>openModal(item.id)}
                        >
                        <PreviewPainting shortPainting={item} />
                    </HoverCard>
                    </div>
                ))}
                {selectedPainting &&
                <Modal onClose={closeModal}>
                    <PaintingDetailView painting={selectedPainting}/>
                </Modal>
                }
                {isLoadingRef.current && <p className="text-center mt-4">Loading...</p>}
        </div>
    );
}