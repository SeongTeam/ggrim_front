'use client';
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {  findQuiz } from "../../app/lib/api.backend";
import { FindQuizResult } from '@/app/lib/dto';
import { throttle } from "../../util/optimization";
import { Quiz } from "../../model/interface/quiz";
import { QuizCard } from "../QuizCard";
import { useRouter } from "next/navigation";

interface QuizCardGridProps  {
    findResult : FindQuizResult;
}

export function QuizCardGrid( props: QuizCardGridProps ): React.JSX.Element {

    const [findQuizzes,setFindQuizzes] = useState<Quiz[]>(props.findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값? 
    const isLoadingRef : MutableRefObject<boolean>= useRef(false);
    const findResultRef = useRef<FindQuizResult>(props.findResult);
    const router = useRouter();
    // const searchParam = useSearchParams();



    const handleClickCard = (quiz : Quiz) =>{
        const url : string = `/quiz/${quiz.id}`;
        router.push(url);
    }

      // 스크롤 이벤트 핸들러
    useEffect(() => {
        const loadMoreQuiz = async ()  => {
        
            if(!findResultRef.current.isMore || isLoadingRef.current){
                console.log('not load quiz')
                console.log(findResultRef,isLoadingRef);
                return;
            }
            isLoadingRef.current = true;

            console.log(`load ${findResultRef.current.pagination +1} page`);
            const result : FindQuizResult = await findQuiz([],[],[],findResultRef.current.pagination+1);
            findResultRef.current = result;
            setFindQuizzes(prev=> [...prev, ...result.data]);
            
            isLoadingRef.current = false;
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