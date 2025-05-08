'use client';

import React, { useState} from 'react';
import { Painting } from '../../../model/interface/painting';

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
                    <img src={painting.image_url} alt="Main Image" />
                </section>
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
                <p className="text-blue-600 text-sm mb-2">{painting.artist.name}</p>
                <p className="text-gray-700 text-sm mb-4">
                    {painting.description}
                </p>
            </div>

            {/* Fullscreen Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={handleClose}
                >
                    <img
                        src={painting.image_url}
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
