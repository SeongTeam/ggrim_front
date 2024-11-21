import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedImageState, imageState } from '../store';

const Metadata = () => {
    const selectedImageId: number = useRecoilValue(selectedImageState);
    const [image, setImage] = useRecoilState(imageState(selectedImageId));
    const onChange = (e: any) => {
        const value = e.target.value;
        setImage({
            ...image,
            name: value,
        });
    };
    return (
        <div className="metadata">
            <div>
                <input type="text" value={image.name} onChange={onChange} />
            </div>
            <img src={image.url} alt={image.name} />
            <div>
                <b>Id:</b> {image.id}
            </div>
            <div>
                <b>Width:</b> {image.metadata.width}
            </div>
            <div>
                <b>Height:</b> {image.metadata.height}
            </div>
        </div>
    );
};

export default Metadata;
