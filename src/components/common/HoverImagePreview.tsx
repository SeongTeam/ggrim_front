import { getUrlImageSize } from "@/util/imageUtiles";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HoverImagePreviewProps {
	url: string;
}

export const HoverImagePreview = ({ url }: HoverImagePreviewProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [imageSize, setImageSize] = useState<{ width: number; height: number }>();

	useEffect(() => {
		getUrlImageSize(url).then(setImageSize);
	}, [url]);

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<p className="cursor-pointer text-blue-500 underline">{url}</p>
			{isHovered && (
				<div className="absolute bottom-0 right-0 z-10 mt-8 rounded-lg border bg-white p-2 shadow-lg">
					{/*TODO : <Image /> prop 개선하기
                        - [ ] : 컴포넌트 목적 및 필요 상황 파악한 뒤 적절한 width,height 설정하기
                    */}
					<Image
						src={url}
						alt="Preview"
						width={100}
						height={150}
						className="max-h-64 max-w-xs rounded"
					/>
					{imageSize && (
						<p className="mt-2 text-sm text-gray-500">
							Size: {imageSize.width}px × {imageSize.height}px
						</p>
					)}
				</div>
			)}
		</div>
	);
};
