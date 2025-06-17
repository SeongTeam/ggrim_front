'use client';

import { useRecoilState } from 'recoil';
import { CuratedArtworkList }from './CuratedArtworkList';
import { CuratedArtworkForm }from './CuratedArtworkForm';
import { FormState } from './states';
import { formStateAtom } from './atom';

export const CuratedArtworkSection = () => {
    const [curatedArtworkFormStates, setCuratedArtwork] = useRecoilState(formStateAtom);

    const addCuratedArtwork = (memo: FormState) => {
        setCuratedArtwork((prevMemos) => [...prevMemos, memo]);
    };

    return (
        <div className="flex justify-center gap-8 px-4">
            <div className="w-full max-w-sm">
                <CuratedArtworkForm addCuratedArtwork={addCuratedArtwork} />
            </div>
            <div className="w-full max-w-xl">
                <CuratedArtworkList curatedArtworks={curatedArtworkFormStates} />
            </div>
        </div>
    );
}
