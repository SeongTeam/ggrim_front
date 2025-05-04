import { getServerUrl } from '..';
import { CuratedArtWorkAttribute } from '../../../model/interface/curatedArtwork-types';
import { Painting } from '../../../model/interface/painting';
import { serverLogger } from '../../../util/logger';
import { FindPaintingResult } from './dto';

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

export const findPainting = async (
    title: string = '',
    artist: string = '',
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindPaintingResult> => {
    const backendUrl = getServerUrl();
    const titleParam = `title=${title}`;
    const artistParam = `artistName=${artist}`;
    const tagParam = tags.map((t) => `tags[]=${t}`).join('&');
    const styleParam = styles.map((s) => `styles[]=${s}`).join('&');
    const url = `${backendUrl}/painting?${titleParam}&${artistParam}&${tagParam}&${styleParam}&page=${page}`;
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
