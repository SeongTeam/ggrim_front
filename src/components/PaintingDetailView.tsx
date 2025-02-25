
'use client'
import React, { useState } from "react";
import { Painting } from "../model/interface/painting";
import { ChevronRight, ChevronUp } from 'lucide-react'
import Image from "next/image";
interface PaintingDetailViewProps {
    painting : Painting | undefined;
}

/*TODO
- painting = undefined 인 경우 어떻게 할것인지 생각하기
*/
export const PaintingDetailView = ( {painting } : PaintingDetailViewProps) => {
    
    const [showFullDescription, setShowFullDescription] = useState(false);
    
    if(!painting){
        return (
            <div className="bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg">
                no painting
            </div>
        )
    }



    const handleToggleDescription = () => {
        setShowFullDescription((prev) => !prev);
      };

    return (
        <div className="bottom-0 right-0 mt-8 bg-gray-900 shadow-lg w-full border-0 rounded-lg">
            <div className="max-h-fit rounded">
                <Image width={painting.width} height={painting.height} src={painting.image_url} alt="Preview" className="w-full object-cover rounded" />
            </div>
            <div className='p-2'>
                <h3 className='mb-8 text-white'>
                    {painting.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    Artist : {painting.artist.name}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Size: {painting.width}px × {painting.height}px
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    tags: {painting.tags.map( tag => tag.name).join(', ')}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Styles: {painting.styles.map( style => style.name).join(', ')}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    painting: {painting.id}
                </p>
                <p className="text-base text-gray-500 mt-2">
                    Description:{" "}
                    {painting.description.length > 30 && !showFullDescription
                        ? painting.description.substring(0, 30) + "..."
                        : painting.description}
                </p>
                {painting.description.length > 30 && (
                <button
                    className="mt-2 p-1 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800"
                    onClick={handleToggleDescription}
                    >
                    {showFullDescription ? (
                        <ChevronUp className="text-gray-300 w-4 h-4" />
                    ) : (
                        <ChevronRight className="text-gray-300 w-4 h-4" />
                    )}
                </button>
                )}
            </div>
        </div>
    )
}