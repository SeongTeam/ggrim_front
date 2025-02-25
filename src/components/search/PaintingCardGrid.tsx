'use client';
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Painting } from "../../model/interface/painting";
import HoverCard from "../HoverCard";
import { PreviewPainting } from '../PreviewPainting';
import { Modal } from "../Modal";
import { PaintingDetailView } from "../PaintingDetailView";
import { findPainting, getPainting } from "../../app/lib/apis";
import { FindPaintingResult } from '@/app/lib/dto';
import { useSearchParams } from "next/navigation";
import { throttle } from "../../util/optimization";

interface PaintingCardGridProps  {
    findResult : FindPaintingResult;
}

export function PaintingCardGrid( props: PaintingCardGridProps ): React.JSX.Element {

    const [selectedPainting , setSelectedPainting] = useState<Painting|undefined>(undefined);
    const [searchPaintings,setSearchPaintings] = useState<Painting[]>(props.findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값? 
    const isLoadingRef : MutableRefObject<boolean>= useRef(false);
    const findResultRef = useRef<FindPaintingResult>(props.findResult);
    const searchParam = useSearchParams();

    const openModal = async (paintingId : string) =>{
        const painting = await getPainting(paintingId)
        setSelectedPainting(painting);
    }

    const closeModal = () =>{
        setSelectedPainting(undefined);
    }



      // 스크롤 이벤트 핸들러
    useEffect(() => {
        const loadMorePainting = async ()  => {
        
            if(!findResultRef.current.isMore || isLoadingRef.current){
                console.log('not load painting')
                console.log(findResultRef,isLoadingRef);
                return;
            }
            isLoadingRef.current = true;
            const searchTitle : string = searchParam.get('title') || "";
            const searchArtist : string = searchParam.get('artist') || "";
            const searchTags : string[]= searchParam.getAll('tags') || [];
            const searchStyles : string[] = searchParam.getAll('styles') || [];
            console.log(`load ${findResultRef.current.pagination +1} page`);
            const result : FindPaintingResult = await findPainting(searchTitle,searchArtist,searchTags,searchStyles,findResultRef.current.pagination+1);
            findResultRef.current = result;
            setSearchPaintings(prev=> [...prev, ...result.data]);
            
            isLoadingRef.current = false;
        }


        const handleScroll = () => {
            console.log(`[handleScroll]`);
            if (
                /*TODO
                - 성능저하 방지 필요
                - 기대치 않은 동작 예방 필요
                - 대응 방법
                [x]1. throttle 구현
                        - innerHeight,scrollY,offsetHeight 참조는 리플로우를 발생시킬 수 있다.
                        - throttle을 통해서, 스크롤 핸들러가 특정 주기마다만 호출할 수 있게 하면, 리플로우 발생 횟수가 감소
                [ ]2. Intersection Observer API 사용
                        - throttle에 의해 리플로우 발생 횟수를 줄이더라도, 스크롤 이벤트에 특정 주기마다 리플로우가 발생할 수 있다.
                        - 브라우저가 직접 요소의 가시성을 감지하므로, 리플로우가 발생할 때만 처리된다.
                    - ref: https://tech.kakaoenterprise.com/149
                */
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
                {searchPaintings.map((item) => (
                    <div key={`${item.id}+searchPaintingHoverCard`} className="max-w-xs">
                    <HoverCard  
                        cardProps ={{imageSrc : item.image_url, alt : item.title, title : item.title, height : item.height, width : item.width}}
                        onClick={()=>openModal(item.id)}
                        >
                        <PreviewPainting painting={item} />
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