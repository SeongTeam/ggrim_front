import { _CuratedContentType } from '@/model/interface/curatedArtwork-types';

export interface FormState {
    cldId: string;
    imageUrl: string;
    artistName: string;
    operatorDescription: string;
    type: _CuratedContentType | '';
    id: string;
    aspectRatio: [string, number, number];
}

export function getEmptyFormState(): FormState {
    const result: FormState = {
        cldId: '',
        imageUrl: '',
        artistName: '',
        operatorDescription: '',
        type: '',
        id: '',
        aspectRatio: ['', 0, 0],
    };
    return result;
}
