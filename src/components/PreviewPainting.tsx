'use client';
import { Painting } from '../model/interface/painting';
import Image from 'next/image';

interface PreviewPaintingProps {
    painting: Painting;
}

export const PreviewPainting = ({ painting }: PreviewPaintingProps) => {


    return (
        <div className="absolute bottom-0 right-0 mt-8 bg-gray-900 shadow-lg border-0 rounded-lg  z-10">
            <div className="max-h-64 rounded">
                <Image height={painting.height} width={painting.width} src={painting.image_url} alt="Preview" className="w-full object-cover rounded" />
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
            </div>
        </div>
    );
};
