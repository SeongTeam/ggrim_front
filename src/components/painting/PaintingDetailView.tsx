"use client";
import React, { useState } from "react";
import { ChevronRight, ChevronUp } from "lucide-react";
import { CopyButton } from "../common/Copybutton";
import Image from "next/image";
import { ShowPaintingResponse } from "../../generated/dto-types";

interface PaintingDetailViewProps {
	painting: ShowPaintingResponse | undefined;
}

// TODO: <PaintingDetailView /> 성능 개선
// - [ ] painting = undefined 인 경우 상황 예외처리 로직 추가
// - [ ] painting id 복사 기능 추가
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export const PaintingDetailView = ({ painting }: PaintingDetailViewProps) => {
	const [showFullDescription, setShowFullDescription] = useState(false);

	if (!painting) {
		return (
			<div className="bottom-0 right-0 mt-8 rounded-lg border-0 bg-gray-900 shadow-lg">
				no painting
			</div>
		);
	}

	const handleToggleDescription = () => {
		setShowFullDescription((prev) => !prev);
	};

	return (
		<div className="bottom-0 right-0 mt-8 w-full rounded-lg border-0 bg-gray-900 shadow-lg">
			<Image
				src={painting.image_url}
				alt="Detail Image View"
				width={painting.width}
				height={painting.height}
				className="h-auto w-screen rounded"
			/>

			<div className="p-2">
				<h3 className="mb-8 text-white">{painting.title}</h3>
				<p className="mt-2 text-sm text-gray-500">Artist : {painting.showArtist.name}</p>
				<p className="mt-2 text-sm text-gray-500">
					Size: {painting.width}px × {painting.height}px
				</p>
				<p className="mt-2 text-sm text-gray-500">
					tags: {painting.showTags.map((tag) => tag.name).join(", ")}
				</p>
				<p className="mt-2 text-sm text-gray-500">
					Styles: {painting.showStyles.map((style) => style.name).join(", ")}
				</p>
				<p className="mt-2 text-base text-gray-500">
					Description:{" "}
					{painting.description.length > 30 && !showFullDescription
						? painting.description.substring(0, 30) + "..."
						: painting.description}
				</p>
				{painting.description.length > 30 && (
					<button
						className="mt-2 flex items-center justify-center rounded-full bg-gray-700 p-1 hover:bg-gray-800"
						onClick={handleToggleDescription}
					>
						{showFullDescription ? (
							<ChevronUp className="h-4 w-4 text-gray-300" />
						) : (
							<ChevronRight className="h-4 w-4 text-gray-300" />
						)}
					</button>
				)}
			</div>
		</div>
	);
};
