'use server';
import { getServerUrl, withErrorHandler } from '../lib';
import { Painting } from '../../../model/interface/painting';
import { FindPaintingResult } from './dto';
import { HttpException } from '../common.dto';

// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
const getWeekArtWorkData = async (): Promise<Painting[] | HttpException> => {
    // const response = await fetch('http://localhost:4000/api/artwork_week', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용
    const serverUrl = getServerUrl();
    const isS3AccessParam = `isS3Access=true`;
    const url: string = serverUrl + `/painting/artwork-of-week?${isS3AccessParam}`;
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result = await response.json();

    return result;
};

const findPainting = async (
    title: string = '',
    artist: string = '',
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindPaintingResult | HttpException> => {
    const backendUrl = getServerUrl();
    const titleParam = `title=${title}`;
    const artistParam = `artistName=${artist}`;
    const tagParam = tags.map((t) => `tags[]=${t}`).join('&');
    const styleParam = styles.map((s) => `styles[]=${s}`).join('&');
    const isS3AccessParam = `isS3Access=true`;
    const url = `${backendUrl}/painting?${isS3AccessParam}&${titleParam}&${artistParam}&${tagParam}&${styleParam}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: FindPaintingResult = await response.json();
    return result;
};

const getPainting = async (id: string): Promise<Painting | HttpException> => {
    const backendUrl = getServerUrl();
    const isS3AccessParam = `isS3Access=true`;
    const url = `${backendUrl}/painting/${id}?${isS3AccessParam}`;
    const response = await fetch(url);
    const painting: Painting = await response.json();

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return painting;
};

export const getWeekArtWorkDataAction = withErrorHandler('getWeekArtWorkData', getWeekArtWorkData);

export const findPaintingAction = withErrorHandler('findPainting', findPainting);

export const getPaintingAction = withErrorHandler('getPainting', getPainting);
