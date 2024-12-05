import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { imageState, selectedImageState } from '../store';

interface ImageProps {
    id: number;
}

const Image: React.FC<ImageProps> = ({ id }) => {
    const { name, url } = useRecoilValue(imageState(id));
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);

    const onClick = () => {
        setSelectedImage(id);
    };

    return (
        <div className="image">
            <div className="name">{name}</div>
            <img
                className={selectedImage === id ? 'selected' : ''}
                src={url}
                alt={name}
                onClick={onClick}
            />
        </div>
    );
};

export default Image;
