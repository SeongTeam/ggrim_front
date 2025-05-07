import { getServerUrl, withErrorHandler } from '../util';
import { CuratedArtWorkAttribute } from '../../../model/interface/curatedArtwork-types';
import { Painting } from '../../../model/interface/painting';
import { serverLogger } from '../../../util/logger';
import { FindPaintingResult } from './dto';
import { HttpException } from '../common.dto';

// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
const getWeekArtWorkData = async (): Promise<CuratedArtWorkAttribute[]> => {
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
    const url = `${backendUrl}/painting?${titleParam}&${artistParam}&${tagParam}&${styleParam}&page=${page}`;
    serverLogger.info(`[findPaintings] url=${url}`);
    const response = await fetch(url);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: FindPaintingResult = await response.json();
    return result;
};

const getPainting = async (id: string): Promise<Painting | undefined | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/painting/by-ids?ids[]=${id}`;
    const response = await fetch(url);
    const paintings: Painting[] = await response.json();

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return paintings.length !== 0 ? paintings.at(0) : undefined;
};

export const getWeekArtWorkDataAction = withErrorHandler(getWeekArtWorkData);

export const findPaintingAction = withErrorHandler(findPainting);

export const getPaintingAction = withErrorHandler(getPainting);
