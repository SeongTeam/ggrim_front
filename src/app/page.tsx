// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';
import { getWeekArtWorkData } from '@/app/lib/api.backend';
import ScrollTriggerNavigator from '../components/quiz/ScrollTriggerNavigator';
import { getQuizIDByContext } from './lib/api.quiz';
import { Quiz } from '../model/interface/quiz';

// TODO 배포할때 더 좋은 방법이 있을지 생각해보기

// TODO 함수 이름 변경 예정
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
