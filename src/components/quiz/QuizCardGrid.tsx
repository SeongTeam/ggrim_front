'use client';
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { throttle } from "../../util/optimization";
import {  ShortQuiz } from "../../model/interface/quiz";
import { QuizCard } from "../QuizCard";
import { useRouter } from "next/navigation";
import { FindQuizResult } from "../../server-action/backend/quiz/dto";
import { getQuizListAction } from "../../server-action/backend/quiz/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/util";

interface QuizCardGridProps  {
    findResult : FindQuizResult;
}

export function QuizCardGrid( props: QuizCardGridProps ): React.JSX.Element {

    const [findQuizzes,setFindQuizzes] = useState<ShortQuiz[]>(props.findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값? 
    const isLoadingRef : MutableRefObject<boolean>= useRef(false);
    const findResultRef = useRef<FindQuizResult>(props.findResult);
    const router = useRouter();
    // const searchParam = useSearchParams();



    const handleClickCard = (quiz : ShortQuiz) =>{
        const url : string = `/quiz/${quiz.id}`;
        router.push(url);
    }

      // 스크롤 이벤트 핸들러
    useEffect(() => {
        const loadMoreQuiz = async ()  => {

            const isMore = findResultRef.current.page < findResultRef.current.pageCount;
        
            if(!isMore || isLoadingRef.current){
                console.log('not load quiz')
                console.log(findResultRef,isLoadingRef);
                return;
            }
            isLoadingRef.current = true;

            console.log(`load ${findResultRef.current.page +1} page`);
            const response  = await getQuizListAction(findResultRef.current.page+1);
            if(isServerActionError(response)){
                throw new Error(response.message);
            }
            else if(isHttpException(response)){
                const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
                
                throw new Error(errorMessage);
            }else{
                findResultRef.current = response;
                setFindQuizzes(prev=> [...prev, ...response.data]);
                
                isLoadingRef.current = false;
            }
        }


        const handleScroll = () => {
            console.log(`[handleScroll]`);
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !isLoadingRef.current
            ) {
                console.log(`[loadMoreQuiz]`);
                loadMoreQuiz();
            }
        };

        const handleScrollThrottle = throttle(handleScroll,300);

        console.log('[useEffect] : for config scroll event');
        window.addEventListener("scroll", handleScrollThrottle);
        return () => window.removeEventListener("scroll", handleScrollThrottle);
    }, []); 

    useEffect(()=>{
        setFindQuizzes(props.findResult.data);
        console.log('[useEffect] : for init  SearchPainting');
        findResultRef.current = props.findResult;
        return ()=>{
            setFindQuizzes(prev=>prev);
        }

    },[props.findResult])

    // useEffect(() => {
    //     console.log("findQuizzes 상태가 변경됨:", findQuizzes);
    // }, [findQuizzes]); // findQuizzes 상태가 변경될 때마다 로그 출력


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
                {findQuizzes.map((quiz) => (
                    <div key={`${quiz.id}`} className="max-w-xs">
                    <QuizCard title={quiz.title} onClick={()=> handleClickCard(quiz)} />  

                    </div>
                ))}
                {isLoadingRef.current && <p className="text-center mt-4">Loading...</p>}
        </div>
    );
}