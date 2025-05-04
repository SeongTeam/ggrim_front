// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';
import { getWeekArtWorkData } from '../server-action/backend/painting/api';
import ScrollTriggerNavigator from '../components/quiz/ScrollTriggerNavigator';
import { getQuizIDByContext } from './lib/api.quiz';
import { Quiz } from '../model/interface/quiz';

// TODO: Main Page 리팩토링하기
// - [ ] 컴포넌트 함수 이름 변경하여 기능 명확성 향상시키기
// - [ ] 프로젝트 구조 리팩토링하기
// ! 주의: <경고할 사항>
// ? 질문: UX를 향상시키는 더 좋은 점이 있는가?
// * 참고: <관련 정보나 링크>

export default async function Campaign() {
    const artworkOfWeekData: CuratedArtWorkAttribute[] = await getWeekArtWorkData();
    const domID = `main`;
    const quiz : Quiz = (await getQuizIDByContext()).quiz;
    return (

        <div id={domID}>
            {/* <Navbar /> */}
            <ArtworkCarousel curatedWorkAttributes={artworkOfWeekData} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
            <ScrollTriggerNavigator section={{id : domID, path : `/quiz/${quiz.id}` }} />
            </div>
    );
}
