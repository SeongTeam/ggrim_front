// import { Navbar } from '@/components';
import { ArtworkCarousel } from '@/components/home/ArtworkCarousel';
import ScrollTriggerNavigator from '../components/quiz/ScrollTriggerNavigator';
import { ScrollExpander } from '../components/home/ScrollExpander';
import {  getWeekArtWorkDataAction } from '../server-action/backend/painting/api';
import {  getQuizListAction, scheduleQuizAction, } from '../server-action/backend/quiz/api';
import { isHttpException, isServerActionError } from '../server-action/backend/common/util';

// TODO: Main Page 리팩토링하기
// - [ ] 컴포넌트 함수 이름 변경하여 기능 명확성 향상시키기
// - [ ] 프로젝트 구조 리팩토링하기
// ! 주의: <경고할 사항>
// ? 질문: UX를 향상시키는 더 좋은 점이 있는가?
// * 참고: <관련 정보나 링크>

export default async function Campaign() {
    const domID = `main`;
    
    const [artworkOfWeekData , quizzes, responseQuizDTO] = await Promise.all([getWeekArtWorkDataAction(),getQuizListAction(),scheduleQuizAction()]);

    if(isServerActionError(responseQuizDTO)){

        throw new Error(responseQuizDTO.message);
    }
    else if(isHttpException(responseQuizDTO)){
        const errorMessage = Array.isArray(responseQuizDTO.message) ? responseQuizDTO.message.join('\n') : responseQuizDTO.message;
        
        throw new Error(errorMessage,);
    }

    if(isServerActionError(artworkOfWeekData)){
        throw new Error(artworkOfWeekData.message);
    }
    else if(isHttpException(artworkOfWeekData)){
        const errorMessage = Array.isArray(artworkOfWeekData.message) ? artworkOfWeekData.message.join('\n') : artworkOfWeekData.message;
        
        throw new Error(errorMessage);
    }

    if(isServerActionError(quizzes)){
        throw new Error(quizzes.message);
    }
    else if(isHttpException(quizzes)){
        const errorMessage = Array.isArray(quizzes.message) ? quizzes.message.join('\n') : quizzes.message;
        
        throw new Error(errorMessage);
    }
    




    return (

        <div >
            {/* <Navbar /> */}
            <ArtworkCarousel curatedWorkAttributes={artworkOfWeekData} quizzes={quizzes.data} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
            <div id={domID} className='flex justify-center bg-yellow-400 overflow-hidden transition-all duration-300' style={{ height: '50px' }}>
                <p className='text-3xl text-black'>Scroll and Enjoy Quiz</p>
                <ScrollExpander domId={domID} maxHeight={400} incrementAmount={20} />
                <ScrollTriggerNavigator section={{id : domID, path : `/quiz/${responseQuizDTO.shortQuiz.id}` }} criticalRatio={0.1} />
            </div>
        </div>
    );
}
