'use client'
import { Quiz } from '../../model/interface/quiz';
import MCQView from '@/components/home/components/MCQ_view';
import { MCQ } from '../../model/interface/MCQ';
import {  getQuizIDByContext, QuizStatus, ResponseQuizDTO } from '../../app/lib/api.quiz';

import { useRouter } from 'next/navigation';
import { Painting } from '../../model/interface/painting';
interface DetailQuizProps {
    quiz: Quiz;
}

// TODO: <DetailQuiz/> 성능 개선
// - [x] localStorage 사용하여 quizContext 상태 저장하기
// - [x] localStorage 사용하여 quizContext 업데이트 로직 훅에 반영하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export function DetailQuiz({ quiz }: DetailQuizProps): React.JSX.Element {
    const mcq : MCQ= {
        id : quiz.id,
        distractorPaintings : quiz.distractor_paintings,
        answerPaintings : quiz.answer_paintings,
        title : quiz.title,
        description : quiz.description,
        timeLimit : quiz.time_limit,
        type : quiz.type
    } 

   const router = useRouter();


    const handelNextMCQ = async () => {
        const key = `quiz-status`
        let rawStatus : string | undefined = undefined;
        if(localStorage){
            rawStatus = localStorage.getItem(key) || undefined;
        }
        const status : QuizStatus | undefined = rawStatus ? JSON.parse(rawStatus) : undefined;
        const res : ResponseQuizDTO = await getQuizIDByContext(status);
        localStorage.setItem(key,JSON.stringify(res.status));
        router.push(`/quiz/${res.quiz.id}`);
        
    };

    // TODO: 그림 제출 로직 개선하기
    // - [ ] 백엔드에 제출된 그림 정보 전달하기
    //  -> 백엔드에서 정답 여부 토보
    //  -> 백엔드에서 제출된 그림정보로 스케줄링 업데이트
    //  -> 백엔드에서 퀴즈 관련 정보 업데이트 
    // - [ ] <추가 작업>
    // ! 주의: <경고할 사항>
    // ? 질문: <의문점 또는 개선 방향>
    // * 참고: <관련 정보나 링크>
    const handleImageSelected = async (selectedPainting : Painting) => {

        //const result = await addQuizContextByPainting(selectedPainting);
        console.info(`[handleImageSelected]`,selectedPainting);
    }

    if(quiz.type === 'ONE_CHOICE'){

        return <MCQView mcq={mcq} handelNextMCQ={handelNextMCQ} handleImageSelected={handleImageSelected} />;
    }

    return <p> not implemented</p>

}
