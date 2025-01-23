// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import { ArtworkQuiz } from '../components/home/artworkQuiz';
import { MCQAttribute } from '@/model/interface/MCQ';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';

// TODO 배포할때 더 좋은 방법이 있을지 생각해보기
const SERVER_URL =
    process.env.BACKEND_URL ||
    'https://port-0-grim-dev-nest-server-m4i5o7t86f50fb45.sel4.cloudtype.app';

// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
const getWeekArtWorkData = async (): Promise<CuratedArtWorkAttribute[]> => {
    // const response = await fetch('http://localhost:4000/api/artwork_week', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용

    const url: string = SERVER_URL + '/artwork_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();
    return res.data;
};

const getMCQData = async (): Promise<MCQAttribute[]> => {
    // const response = await fetch('http://localhost:4000/api/mcq', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용

    const url: string = SERVER_URL + '/quiz_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();
    return res.data;
};

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
