'use client';

import { FeaturedImageGallery } from '@/components/home/components/featured_image_gallery';
import { CuratedWorkAttribute } from '@/types/curatedArtwork-types';
import React from 'react';

interface ArtworkCarouselProps {
    curatedWorkAttributes: CuratedWorkAttribute[];
}

export function ArtworkCarousel(props: ArtworkCarouselProps) {
    const { curatedWorkAttributes } = props;

    return (
        <section className=" sm:px-16 md:px-40 lg:60 !py-20">
            <div className="container mx-auto bg-ggrimGrey1">
                <div className="flex max-w-md flex-col items-start">
                    {/* 여기서 max-w-lg로 조정 */}
                    <div className="pt-5 pl-20 mb-2 ">
                        <p className="!text-ggrimBrown1 text-3xl font-bold relative after:content-[''] after:block after:w-full after:h-1 after:bg-ggrimBrown1 after:mt-2">
                            Painting of the Week
                        </p>
                    </div>
                </div>
                <div className="w-lg bg-ggrimGrey1">
                    <FeaturedImageGallery imageData={curatedWorkAttributes} />
                </div>
            </div>
        </section>
    );
}
