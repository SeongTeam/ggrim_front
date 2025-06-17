'use client';

import Image from "next/image";
import { ShortPainting } from '@/server-action/backend/painting/type';


interface PreviewPaintingProps {
    shortPainting: ShortPainting;
}

export const PreviewPainting = ({ shortPainting }: PreviewPaintingProps) => {


    return (
        <div className="absolute bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg  z-10">

            <Image 
                src={shortPainting.image_url} 
                alt="Preview" 
                width={shortPainting.width}
                height={shortPainting.height}
                className="w-screen h-auto object-cover rounded" />

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
