// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import { ArtworkQuiz } from '../components/home/artworkQuiz';
import { MCQAttribute } from '@/model/interface/MCQ';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';
import { getMCQData, getWeekArtWorkData } from '@/app/lib/api.backend';

// TODO 배포할때 더 좋은 방법이 있을지 생각해보기

// TODO 함수 이름 변경 예정
export default async function Campaign() {
    const quizOfWeekData: MCQAttribute[] = await getMCQData();
    const artworkOfWeekData: CuratedArtWorkAttribute[] = await getWeekArtWorkData();

    return (
        <>
            {/* <Navbar /> */}
            <ArtworkCarousel curatedWorkAttributes={artworkOfWeekData} />
            <ArtworkQuiz mcqAttributes={quizOfWeekData} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
        </>
    );
}
