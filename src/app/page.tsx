import { Navbar, Footer } from '@/components';
import { ArtworkCarousel } from './home/artwork_carousel';
import Gallery from '@/components/coverflowGallery';
import { ArtworkQuiz } from './home/artwork_quiz';
import { MackRecoilUI } from '../mock/mock_recoil';
import { Painting } from '@/mock/data/entity/mock_painting';
import { MCQAttribute } from '@/types/mcq_types';

function makeDisplayAnswer(answer: Painting[], wrongAnswer: Painting[]): Painting[] {
    // 두 배열을 합칩니다.
    const combined = [...answer, ...wrongAnswer];

    // Fisher-Yates 알고리즘으로 배열을 랜덤하게 섞습니다.
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]]; // 요소 교환
    }

    return combined;
}

const getData = async (): Promise<Painting[]> => {
    const response = await fetch('http://localhost:3000/api/json', {
        cache: 'no-cache',
    });
    const res = await response.json();
    return res.data;
};

export default async function Campaign() {
    const data: Painting[] = await getData();

    // TODO quiz 데이터 변경 추가
    const attrs1: MCQAttribute = {
        displayPaintings: makeDisplayAnswer(data.slice(0, 3), data.slice(3, 4)),
        answers: data.slice(3, 4),
        id: '1234',
        isFinalized: true,
        question:
            '라파엘로의 가장 유명한 작품 중 하나로, 바티칸 궁전의 벽화를 장식하며 고전 철학자들을 묘사한 작품의 제목은 무엇인가?',
        selectedAnswer: 3,
        showHintButton: true,
    };

    const attrs2: MCQAttribute = {
        displayPaintings: makeDisplayAnswer(data.slice(4, 7), data.slice(7, 8)),
        answers: data.slice(4, 5),
        id: '1234',
        isFinalized: true,
        question:
            'GET / 500 in 1866ms ✓ Compiled /favicon.ico in 63ms (713 modules) GET /favicon.ico 200 in 98ms',
        selectedAnswer: 3,
        showHintButton: true,
    };

    const attrs3: MCQAttribute = {
        displayPaintings: makeDisplayAnswer(data.slice(8, 11), data.slice(11, 12)),
        answers: data.slice(8, 9),
        id: '1234',
        isFinalized: true,
        question:
            'GET / 500 in 1866ms ✓ Compiled /favicon.ico in 63ms (713 modules) GET /favicon.ico 200 in 98ms',
        selectedAnswer: 3,
        showHintButton: true,
    };

    return (
        <>
            <h1>{data[0].artistName}</h1>
            <ArtworkCarousel />
            <ArtworkQuiz mcqAttributes={[attrs1, attrs2, attrs3]} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
        </>
    );
}
