"use client";

import React, { useState } from "react";
import { Painting } from "@/server-action/backend/painting/type";
import Image from "next/image";
import { PaintingDetailView } from "../search/PaintingDetailView";
import { Modal } from "../modal/Modal";

export interface FeaturedImageGalleryProps {
	paintings: Painting[];
}

export const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({ paintings }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	const painting = paintings[currentIndex];

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex + paintings.length - 1) % paintings.length);
	};

	// 다음 이미지로 이동하는 함수
	const goToNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % paintings.length);
	};

	return (
		<div className="mb-2 ml-5 flex flex-col justify-start pt-5">
			<section className="mr-auto flex max-w-4xl flex-col items-start gap-2 pb-10 pt-6">
				{/* Main Image Carousel */}
				<div className="relative flex h-[480px] w-full items-center justify-center overflow-hidden lg:h-[960px]">
					{/* <img
                        src={currentImage}
                        alt="Main Image"
                        className="object-contain max-h-[850px] max-w-full  p-1 "
                    /> */}
					<Image
						src={painting.image_url}
						width={painting.width}
						height={painting.height}
						onClick={handleOpen}
						alt="Main Image"
						// fill={true}
						className="h-auto w-[350px] lg:w-[700px]"
						priority={true}
					/>
					{/* 왼쪽 버튼 */}
					<button
						onClick={goToPrevious}
						className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-600 p-2 text-white opacity-50 hover:bg-gray-800"
					>
						◀
					</button>
					{/* 오른쪽 버튼 */}
					<button
						onClick={goToNext}
						className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-600 p-2 text-white opacity-50 hover:bg-gray-800"
					>
						▶
					</button>
				</div>
				{/* Thumbnail Navigation */}
				<div className="flex w-full flex-col rounded-lg bg-black py-5 pl-2 text-gray-200">
					<h3 className="text-2xl font-semibold"> {painting.title}</h3>
					<p className="text-sm"> by {painting.artist.name}</p>
				</div>
			</section>
			{isOpen && (
				<Modal onClose={handleClose}>
					<PaintingDetailView painting={painting} />
				</Modal>
			)}
		</div>
	);
};
