import { Painting } from '@/model/interface/painting';

export const curatedContentType = {
    GIF: 'GIF',
    MP4: 'MP4',
    NOTHING: 'NOTHING',
};

type _CuratedContentType = keyof typeof curatedContentType;

export interface CuratedWorkAttribute {
    id: string; // TODO ID는 Painting ID를 따라갈지 고민
    type: _CuratedContentType;
    cldId: string;
    operatorDescription: string;
    painting: Painting;
    aspectRatio: [string, number, number];
}
