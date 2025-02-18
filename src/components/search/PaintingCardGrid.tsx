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
                return;
            }
            isLoadingRef.current = true;
            const searchTitle : string = searchParam.get('title') || "";
            const searchArtist : string = searchParam.get('artist') || "";
            const searchTags : string[]= searchParam.getAll('tags') || [];
            const searchStyles : string[] = searchParam.getAll('styles') || [];
        
            const result : FindPaintingResult = await findPainting(searchTitle,searchArtist,searchTags,searchStyles,findResultRef.current.pagination+1);
            findResultRef.current = result;
            setSearchPaintings(prev=> [...prev, ...result.data]);
            
            isLoadingRef.current = false;
        }

        const handleScroll = () => {
            console.log(`[handleScroll]`);
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
            !isLoadingRef.current
        ) {
            console.log(`[loadMorePainting]`);
            loadMorePainting();
        }
        };

        console.log('[useEffect] : for config scroll event');
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [searchParam]); 

    useEffect(()=>{
        setSearchPaintings(props.findResult.data);
        console.log('[useEffect] : for init  SearchPainting');
        return ()=>{
            setSearchPaintings(prev=>prev);
        }

    },[props.findResult])

    // useEffect(() => {
    //     console.log("searchPaintings 상태가 변경됨:", searchPaintings);
    // }, [searchPaintings]); // searchPaintings 상태가 변경될 때마다 로그 출력



    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {paintings.map((item) => (
                    <HoverCard key={`${item.id}+HoverCardItem`} 
                        cardProps ={{imageSrc : item.image_url, alt : item.title, title : item.title}}
                        onClick={()=>openModal(item.id)}
                        >
                        <PreviewPainting painting={item} />
                    </HoverCard>
                ))}
                {selectedPainting &&
                <Modal onClose={closeModal}>
                    <PaintingDetailView painting={selectedPainting}/>
                </Modal>
                }
        </div>
    );
}