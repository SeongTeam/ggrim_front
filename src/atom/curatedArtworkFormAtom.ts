import { FormState } from '@/components/generate/CuratedArtworkSection/states';
import { atom } from 'recoil';

export const formStateAtom = atom<FormState[]>({
    key: 'formStateAtom', // 고유 키
    default: [], // 초기 상태
});
