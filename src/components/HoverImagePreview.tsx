import React, { useState } from 'react';

interface HoverImagePreviewProps {
    url: string;
}

export default function HoverImagePreview({ url }: HoverImagePreviewProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image URL Text */}
            <p className="cursor-pointer text-blue-500 underline">{url}</p>

            {/* Preview on Hover */}
            {isHovered && (
                <div className="absolute bottom-0 right-0 mt-8 p-2 bg-white shadow-lg border rounded-lg z-10">
                    <img src={url} alt="Preview" className="max-w-xs max-h-64 rounded" />
                    ``
                </div>
            )}
        </div>
    );
}
