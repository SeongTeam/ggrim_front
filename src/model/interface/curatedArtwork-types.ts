import { Painting } from '@/model/interface/painting';

export const curatedContentType = {
    GIF: 'GIF',
    MP4: 'MP4',
    NOTHING: 'NOTHING',
};

export type _CuratedContentType = keyof typeof curatedContentType;

// TODO CuratedWorkAttribute이름 변경 CuratedArtWorkAttribute이름
export interface CuratedArtWorkAttribute {
    id: string; // TODO ID는 Painting ID를 따라갈지 고민
    type: _CuratedContentType;
    cldId: string;
    operatorDescription: string;
    painting: Painting;
    aspectRatio: [string, number, number]; // 추후 필요할 수 있음
}
