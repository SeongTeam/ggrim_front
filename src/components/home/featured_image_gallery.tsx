'use client';

import React, { useState} from 'react';
import { Painting } from '../../model/interface/painting';
import Image from 'next/image';
import { PaintingDetailView } from '../PaintingDetailView';
import { Modal } from '../modal/Modal';

export type FeaturedImageGalleryProps = {
    paintings: Painting[];
};

export const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({ paintings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const painting = paintings[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => ((prevIndex+paintings.length-1)%paintings.length));
    };

    // 다음 이미지로 이동하는 함수
    const goToNext = () => {
        setCurrentIndex((prevIndex) => ((prevIndex+1)%paintings.length));
    };
    const imageH = 480;
    const imageW = 300;

    return (
        <div className="flex flex-col ml-5 pt-5 mb-2 justify-start">

            <section className="flex flex-col mr-auto items-start gap-5 pt-6 pb-10 max-w-4xl ">
                {/* Main Image Carousel */}
                <div className="flex w-full relative justify-center items-center">
                    {/* <img
                        src={currentImage}
                        alt="Main Image"
                        className="object-contain max-h-[850px] max-w-full  p-1 "
                    /> */}
                    <div className={`relative w-[${imageW}px] h-[${imageH}px] xl:w-[${imageW*2} px] xl:h-[${imageH*2} px]`}>
                        <Image src={painting.image_url} fill={true} onClick={handleOpen} alt="Main Image" />
                    </div>
                    {/* 왼쪽 버튼 */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2  bg-gray-600 opacity-50 hover:bg-gray-800 text-white p-2 rounded-full"
                    >
                        ◀
                    </button>
                    {/* 오른쪽 버튼 */}
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 opacity-50 hover:bg-gray-800 text-white p-2 rounded-full"
                    >
                        ▶
                    </button>
                </div>
                {/* Thumbnail Navigation */}
                <div className="flex flex-col w-full py-5 pl-2 bg-black rounded-lg text-gray-200">
                    <h3 className="text-2xl font-semibold "> {painting.title}</h3>
                    <p className="text-sm"> by {painting.artist.name}</p>
                </div>

            </section>
            {isOpen && <Modal onClose={handleClose}>
                <PaintingDetailView painting={painting}/>
            </Modal>}
        </div>
    );
};
