'use client'
import MCQView from '@/components/home/components/MCQ_view';
import { MCQ } from '../../model/interface/MCQ';

import { useRouter } from 'next/navigation';
import { Painting } from '../../model/interface/painting';
import { addQuizContextAction, scheduleQuizAction, submitQuizAction } from '../../server-action/backend/quiz/api';
import { QuizStatus } from '../../server-action/backend/quiz/type';
import { isHttpException, isServerActionError } from '../../server-action/backend/util';
import { DetailQuizDTO, QuizContextDTO } from '../../server-action/backend/quiz/dto';
import {  getPaintingAction } from '../../server-action/backend/painting/api';
import { getQuizStatus, saveQuizStatus } from '../../storage/local/quiz';
import ErrorModal from '../ErrorModal';
interface DetailQuizProps {
    detailQuizDTO: DetailQuizDTO;
}

// TODO: <DetailQuiz/> 성능 개선
// - [x] localStorage 사용하여 quizContext 상태 저장하기
// - [x] localStorage 사용하여 quizContext 업데이트 로직 훅에 반영하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export function DetailQuiz({ detailQuizDTO }: DetailQuizProps): React.JSX.Element {
    const { quiz, reactionCount, userReaction  } = detailQuizDTO;
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

        const status : QuizStatus | undefined = getQuizStatus();
        const response = await scheduleQuizAction(status);

        if(isHttpException(response)){
            const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
            throw new Error(errorMessage);
        }
        else if(isServerActionError(response)){
            throw new Error(response.message);
        }
        else{
            saveQuizStatus(response.status);
            router.push(`/quiz/${response.shortQuiz.id}`);
        }
        
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
        const isCorrect = mcq.answerPaintings[0].id === selectedPainting.id;
         await Promise.all([updatePaintingContext(selectedPainting.id), submitQuizAction(quiz.id,{isCorrect})]);   
    }

    if(quiz.type === 'ONE_CHOICE'){

        return <MCQView 
                    mcq={mcq} 
                    handelNextMCQ={handelNextMCQ} 
                    handleImageSelected={handleImageSelected} 
                    userReaction={userReaction}
                    reactionCount={reactionCount}
                />;
    }

    return <ErrorModal message='Not implemented page' />

}

const generateQuizContextDTO = (painting : Painting) : QuizContextDTO => {
    const contextDTO : QuizContextDTO= {artist : painting.artist.name, page : 0};
    return contextDTO;
}

const updatePaintingContext = async (id : string) => {
    const detailPainting = await getPaintingAction(id);
    if(isHttpException(detailPainting)){
        const errorMessage = Array.isArray(detailPainting.message) ? detailPainting.message.join('\n') : detailPainting.message;
        throw new Error(errorMessage);
    }
    else if(isServerActionError(detailPainting)){
        throw new Error(detailPainting.message);
    }

    const response = await addQuizContextAction(generateQuizContextDTO(detailPainting));
    if(isHttpException(response)){
        const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
        if(response.statusCode < 500){
            alert(errorMessage);
        }
        else {
            throw new Error(errorMessage);
        }

    }
    else if(isServerActionError(response)){
        throw new Error(response.message);
    }
}

