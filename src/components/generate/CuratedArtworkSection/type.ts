import { Painting } from '../../../server-action/backend/painting/type';

export const curatedContentType = {
    GIF: 'GIF',
    MP4: 'MP4',
    NOTHING: 'NOTHING',
};

export type _CuratedContentType = keyof typeof curatedContentType;

export interface CuratedArtWorkAttribute {
    id: string;
    type: _CuratedContentType;
    cldId: string;
    operatorDescription: string;
    painting: Painting;
    aspectRatio: [string, number, number]; // 추후 필요할 수 있음
}
