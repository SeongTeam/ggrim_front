'use client'
import { Quiz } from '../../model/interface/quiz';
import MCQView from '@/components/home/components/MCQ_view';
import { MCQ } from '../../model/interface/MCQ';
import { getQuizIDByContext, QuizStatus, ResponseQuizDTO } from '../../app/lib/api.quiz';

import { useRouter } from 'next/navigation';
interface DetailQuizProps {
    quiz: Quiz;
}

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
    /*TODO
    - [x] localStorage 사용하여 quizContext 상태 저장하기
    - [x] localStorage 사용하여 quizContext 업데이트 로직 훅에 반영하기
    */
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

    if(quiz.type === 'ONE_CHOICE'){

        return <MCQView mcq={mcq} handelNextMCQ={handelNextMCQ} />;
    }

    return <p> not implemented</p>

}
