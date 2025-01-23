import { getUrlImageSize } from '@/util/imageUtiles';
import { useEffect, useState } from 'react';

interface HoverImagePreviewProps {
    url: string;
}

export default function HoverImagePreview({ url }: HoverImagePreviewProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

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
                <div className="absolute bottom-0 right-0 mt-8 p-2 bg-white shadow-lg border rounded-lg z-10">
                    <img src={url} alt="Preview" className="max-w-xs max-h-64 rounded" />
                    {imageSize && (
                        <p className="text-sm text-gray-500 mt-2">
                            Size: {imageSize.width}px × {imageSize.height}px
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
