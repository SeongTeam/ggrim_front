'use client';

import Image from 'next/image';
import { ShortPainting } from '@/server-action/backend/painting/type';

interface PreviewPaintingProps {
	shortPainting: ShortPainting;
}

export const PreviewPainting = ({ shortPainting }: PreviewPaintingProps) => {
	return (
		<div className="absolute bottom-0 right-0 z-10 mt-8 rounded-lg border-0 bg-gray-900 shadow-lg">
			<Image
				src={shortPainting.image_url}
				alt="Preview"
				width={shortPainting.width}
				height={shortPainting.height}
				className="h-auto w-screen rounded object-cover"
			/>

			<div className="p-2">
				<h3 className="mb-8 text-white">{shortPainting.title}</h3>
				{/* <p className="text-sm text-gray-500 mt-2">
                    Artist : {shortPainting.artist.name}
                </p> */}
				<p className="mt-2 text-sm text-gray-500">
					Size: {shortPainting.width}px × {shortPainting.height}px
				</p>
			</div>
		</div>
	);
};
