'use server';

import { MCQ } from '@/model/interface/MCQ';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';
import { serverLogger } from '@/util/logger';
import { Painting } from '../../model/interface/painting';
import { CreateQuizDTO, FindPaintingResult, FindQuizResult } from './dto';
import { Quiz } from '../../model/interface/quiz';

// TODO: HTTP API 에러 핸들링 로직 추가
// - [ ] : fetch()가 반환한 응답 상태 확인 및 에러 핸들링 로직 추가
// - [ ] : fetch() 동작 도중 발생하는 에러 핸들링 로직 추가
// - [ ] : fetch() 오류 발생시, front-end의 요청을 추적하기 위해서 request-id 추가하기
//  -> 또는 backend에서 반환한 응답에 백엔드의 request ID 삽입하기.
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

function getServerUrl(): string {
    const url = process.env.BACKEND_URL;
    serverLogger.info(`BACKEND_URL=${url} `);

    if (url == undefined) {
        console.error(` 'process.env.BACKEND_URL' not read`);
        return '';
    }
    return url;
}
// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
export const getWeekArtWorkData = async (): Promise<CuratedArtWorkAttribute[]> => {
    // const response = await fetch('http://localhost:4000/api/artwork_week', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용
    const serverUrl = getServerUrl();

    const url: string = serverUrl + '/painting/artwork_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();
    return res.data;
};

export const getMCQData = async (): Promise<MCQ[]> => {
    // const response = await fetch('http://localhost:4000/api/mcq', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용
    const serverUrl = getServerUrl();

    const url: string = serverUrl + '/quiz/quiz_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();
    return res.data;
};

export const findPainting = async (
    title: string = '',
    artist: string = '',
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindPaintingResult> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/painting?title=${title}&artistName=${artist}&tags=${JSON.stringify(
        tags,
    )}&styles=${JSON.stringify(styles)}&page=${page}`;
    serverLogger.info(`[findPaintings] url=${url}`);
    const response = await fetch(url);
    const result: FindPaintingResult = await response.json();
    return result;
};

export const getPainting = async (id: string): Promise<Painting | undefined> => {
    try {
        const backendUrl = getServerUrl();
        const url = `${backendUrl}/painting/by-ids?ids[]=${id}`;
        const response = await fetch(url);
        const paintings: Painting[] = await response.json();

        if (response.ok) {
            if (paintings.length === 0) {
                return undefined;
            }

            return paintings.at(0);
        }

        if (response.status === 400) {
            return undefined;
        }

        throw Error(
            `error from backend. status : ${response.status}, statusText : ${response.statusText}`,
        );
    } catch (e: unknown) {
        serverLogger.error(`[getPainting] error : ${JSON.stringify(e)}`);
        throw e;
    }
};

export const findQuiz = async (
    artists: string[] = [],
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindQuizResult> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz?artist=${JSON.stringify(artists)}&tags=${JSON.stringify(
        tags,
    )}&styles=${JSON.stringify(styles)}&page=${page}`;
    serverLogger.info(`[findQuiz] url=${url}`);
    const response = await fetch(url);
    const result: FindQuizResult = await response.json();
    return result;
};

export const getQuiz = async (id: string): Promise<Quiz> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${id}`;
    serverLogger.info(`[getQuiz] url=${url}`);
    const response = await fetch(url);
    const result: Quiz = await response.json();
    serverLogger.debug(`[getQuiz] ${JSON.stringify(result, null, 2)}`);
    return result;
};

export const addQuiz = async (dto: CreateQuizDTO): Promise<Quiz | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`add Quiz fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }
    const result: Quiz = await response.json();

    return result;
};
