'use client';

import React, { useState } from 'react';
import { CuratedWorkAttribute, curatedContentType } from '@/types/curatedArtwork-types';
import { CldImage } from 'next-cloudinary';
import { div } from 'framer-motion/client';
import NavigatePlayerButton from './navigatePlayerButton';

export type FeaturedImageGalleryProps = {
    imageData: CuratedWorkAttribute[];
};

export const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({ imageData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // TODO 아래 변수 3개 함수로 변화시켜야 한다.
    const painting = imageData[currentIndex]?.painting;
    const aspectRatio = imageData[currentIndex]?.aspectRatio;
    const currentType = imageData[currentIndex].type;

    // 이전 이미지로 이동하는 함수
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageData.length - 1 : prevIndex - 1));
    };

    // 다음 이미지로 이동하는 함수
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === imageData.length - 1 ? 0 : prevIndex + 1));
    };

    // TODO 그림에 따라서 이미지 크기 조절
    //TOTO play MP3 audio content
    return (
        <div className="flex flex-col md:flex-row items-start gap-5 px-4 py-6 max-w-4xl mx-auto min-h-[600px]">
            {/* Main Image Carousel */}
            <div className="w-full md:w-7/12 min-h-[450px] relative flex justify-center items-center bg-gray-200">
                {/* <img
                    src={currentImage}
                    alt="Main Image"
                    className="object-contain max-h-[850px] max-w-full  p-1 "
                /> */}
                <section
                    onClick={handleOpen}
                    className="relative flex items-center justify-center  min-h-64 max-h-[850px] max-w-full p-1"
                >
                    {currentType === curatedContentType.GIF ? (
                        // TODO 각각에 그림마다 크기를 알려주는 함수 필요
                        <div
                            style={{
                                width: painting.width,
                                height: painting.height > painting.width ? painting.height : 287,
                            }}
                        >
                            <CldImage
                                alt=" Ower profile image"
                                src={imageData[currentIndex].cldId}
                                fill={true}
                            />
                        </div>
                    ) : (
                        <img src={painting.image} alt="Main Image" />
                    )}
                </section>
                {/* // TODO 
                    1. curatedContentType.NOTHING 말고 MP3 추가 
                    2. src 하드코팅 X */}
                <NavigatePlayerButton
                    isDisplay={currentType === curatedContentType.NOTHING}
                    src="On_a_throne_of_velvet_he_sits_all_alone_dwvwtl"
                />

                {/* 왼쪽 버튼 */}

                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                >
                    ◀
                </button>
                {/* 오른쪽 버튼 */}
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                >
                    ▶
                </button>
            </div>
            {/* Thumbnail Navigation */}
            <div className="flex flex-col w-full md:w-1/2 bg-yellow-400">
                <h2 className="text-xl font-bold text-gray-800 mb-2">PAINTING OF THE WEEK</h2>
                <h3 className="text-2xl font-semibold text-gray-900"> {painting.title}</h3>
                <p className="text-blue-600 text-sm mb-2">{painting.artistName}</p>
                <p className="text-gray-700 text-sm mb-4">"artwork-description"</p>
            </div>

            {/* Fullscreen Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={handleClose}
                >
                    <img
                        src={painting.image}
                        alt="mock full"
                        className="max-w-full max-h-full object-contain"
                    />
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white text-3xl"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};
