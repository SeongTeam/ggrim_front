
import React from "react";
import { Painting } from "../model/interface/painting";

interface PaintingDetailViewProps {
    painting : Painting | undefined;
}

/*TODO
- painting = undefined 인 경우 어떻게 할것인지 생각하기
*/
export const PaintingDetailView = ( {painting } : PaintingDetailViewProps) => {

    if(!painting){
        return (
            <div className="bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg">
                no painting
            </div>
        )
    }

    return (
        <div className="bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg">
            <div className="max-w-lg max-h-fit rounded">
                <img src={painting.image_url} alt="Preview" className="w-full object-cover rounded" />
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
                <p className="text-base text-gray-500 mt-2">
                    Description: {painting.description}
                </p>

            </div>
        </div>
    )
}