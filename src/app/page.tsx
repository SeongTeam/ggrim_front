// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import {  getWeekArtWorkDataAction } from '../server-action/backend/painting/api';
import ScrollTriggerNavigator from '../components/quiz/ScrollTriggerNavigator';
import {  scheduleQuizAction } from '../server-action/backend/quiz/api';
import { isHttpException, isServerActionError } from '../server-action/backend/util';

// TODO: Main Page 리팩토링하기
// - [ ] 컴포넌트 함수 이름 변경하여 기능 명확성 향상시키기
// - [ ] 프로젝트 구조 리팩토링하기
// ! 주의: <경고할 사항>
// ? 질문: UX를 향상시키는 더 좋은 점이 있는가?
// * 참고: <관련 정보나 링크>

export default async function Campaign() {
    const artworkOfWeekData = await getWeekArtWorkDataAction();
    const domID = `main`;
    
    const responseQuizDTO = (await scheduleQuizAction());

    if(isServerActionError(responseQuizDTO)){

        throw new Error(responseQuizDTO.message);
    }

    if(isHttpException(responseQuizDTO)){
        const errorMessage = Array.isArray(responseQuizDTO.message) ? responseQuizDTO.message.join('\n') : responseQuizDTO.message;
        
        throw new Error(errorMessage,);
    }

    if(isServerActionError(artworkOfWeekData)){
        throw new Error(artworkOfWeekData.message);
    }

    if(isHttpException(artworkOfWeekData)){
        const errorMessage = Array.isArray(artworkOfWeekData.message) ? artworkOfWeekData.message.join('\n') : artworkOfWeekData.message;
        
        throw new Error(errorMessage);
    }


    return (

        <div id={domID}>
            {/* <Navbar /> */}
            <ArtworkCarousel curatedWorkAttributes={artworkOfWeekData} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
            <ScrollTriggerNavigator section={{id : domID, path : `/quiz/${responseQuizDTO.shortQuiz.id}` }} />
            </div>
    );
}
