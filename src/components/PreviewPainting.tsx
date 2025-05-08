'use client';

import { ShortPainting } from "../model/interface/painting";


interface PreviewPaintingProps {
    shortPainting: ShortPainting;
}

export const PreviewPainting = ({ shortPainting }: PreviewPaintingProps) => {


    return (
        <div className="absolute bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg  z-10">
            <div className="max-h-64 rounded">
                <img src={shortPainting.image_url} alt="Preview" className="w-full object-cover rounded" />
            </div>
            <div className='p-2'>
                <h3 className='mb-8 text-white'>
                    {shortPainting.title}
                </h3>
                {/* <p className="text-sm text-gray-500 mt-2">
                    Artist : {shortPainting.artist.name}
                </p> */}
                <p className="text-sm text-gray-500 mt-2">
                    Size: {shortPainting.width}px × {shortPainting.height}px
                </p>
            </div>
        </div>
    );
};
