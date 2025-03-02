'use server';

import { MCQAttribute } from '@/model/interface/MCQ';
import { CuratedArtWorkAttribute } from '@/model/interface/curatedArtwork-types';
import { serverLogger } from '@/util/logger';
import { Painting } from '../../model/interface/painting';
import { FindPaintingResult } from './dto';

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

export const getMCQData = async (): Promise<MCQAttribute[]> => {
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
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/painting/by-ids?ids[]=${id}`;
    const response = await fetch(url);
    const paintings: Painting[] = await response.json();

    if (paintings.length === 0) {
        return undefined;
    }

    return paintings.at(0);
};
