import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { imageListState } from '../store';
import Image from './image';

const Images = () => {
    const imageList = useRecoilValue(imageListState);
    return (
        <div className="images">
            {imageList.map((id) => (
                <Suspense key={id} fallback="Loading...">
                    <Image id={id} />
                </Suspense>
            ))}
        </div>
    );
};

export default Images;
