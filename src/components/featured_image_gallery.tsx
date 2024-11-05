"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "@/components/style/gallery.module.css";

type FeaturedImageGalleryProps = {
  imageData: { imgelink: string }[];
};

export const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({
  imageData,
}) => {
  const [active, setActive] = React.useState(
    "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = imageData[currentIndex]?.imgelink;

  // 이전 이미지로 이동하는 함수
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageData.length - 1 : prevIndex - 1
    );
  };

  // 다음 이미지로 이동하는 함수
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // TODO 그림에 따라서 이미지 크기 조절
  return (
    <div className="flex flex-col md:flex-row items-start gap-4 p-6 max-w-4xl mx-auto border-b border-gray-300">
      {/* Main Image Carousel */}
      <div className="w-full md:w-1/2 bg-purple-400 relative">
        <img
          src={currentImage}
          alt="Main Image"
          className="object-cover w-full h-full rounded-lg"
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
      <div className="xl:w-[126px] w-full bg-red-800">
        {/* Thumbnail images here, if needed */}
      </div>
    </div>
  );
};

export default FeaturedImageGalleryProps;
