// import { Navbar } from '@/components';
import { ArtworkCarousel } from '../components/home/artworkCarousel';
import { ArtworkQuiz } from '../components/home/artworkQuiz';
import { Painting } from '@/mock/data/entity/mock_painting';
import { MCQAttribute } from '@/types/mcq_types';
import { CuratedWorkAttribute } from '@/types/curatedArtwork-types';

// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
// TODO 함수 분리 예정
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

const getWeekArtWorkData = async (): Promise<Painting[]> => {
    const response = await fetch('http://localhost:4000/api/artwork_week', {
        cache: 'no-cache',
    });
    const res = await response.json();
    return res.data;
};

const getMCQData = async (): Promise<Painting[]> => {
    const response = await fetch('http://localhost:4000/api/mcq', {
        cache: 'no-cache',
    });
    const res = await response.json();
    return res.data;
};

// TODO 추후에 옯길 예정
function getAspectRatio(width: number, height: number): [string, number, number] {
    if (height === 0) {
        throw new Error('Height cannot be zero.');
    }

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

    const divisor = gcd(width, height);
    const aspectWidth = width / divisor;
    const aspectHeight = height / divisor;

    return [`${aspectWidth}/${aspectHeight}`, aspectWidth, aspectHeight];
}

function getCuratedArtworks(paintings: Painting[]): CuratedWorkAttribute[] {
    const result: CuratedWorkAttribute[] = [];
    const clds: string[] = [
        'monet-haystack_glvvse',
        '202412070152_vsfc5k',
        'fotor-ai-20241209135526_xjnobp',
        'Rq_d_wkurqh_ri_yhoyhw_kh_vlwv_doo_dorqh_gzyzwo',
        '',
    ];

    for (let i: number = 0; i < 5; i++) {
        const temp: CuratedWorkAttribute = {
            id: `mock_${i}`,
            painting: paintings[i],
            type: i > 2 ? 'MP4' : 'GIF',
            cldId: clds[i],
            operatorDescription: `temp [${i}]`,
            aspectRatio: getAspectRatio(paintings[i].width, paintings[i].height),
        };
        result.push(temp);
    }
    return result;
}

// TODO 함수 이름 변경 예정
export default async function Campaign() {
    const data: Painting[] = await getMCQData();
    const weekOfArtworkData: Painting[] = await getWeekArtWorkData();
    const mockData = getCuratedArtworks(weekOfArtworkData);

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
            {/* <Navbar /> */}
            <h1>{data[0].artistName}</h1>
            <ArtworkCarousel curatedWorkAttributes={mockData} />
            <ArtworkQuiz mcqAttributes={[attrs1, attrs2, attrs3]} />
            {/* <MackRecoilUI></MackRecoilUI> */}
            {/* <Footer /> */}
        </>
    );
}
