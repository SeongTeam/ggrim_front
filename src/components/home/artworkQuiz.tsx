'use client';

import MCQView from '@/components/quiz/mcq/MCQ_view';
import { MCQ } from '@/model/interface/MCQ';
import React from 'react';
interface ArtworkQuizProps {
    mcqAttributes: MCQ[];
}

export function ArtworkQuiz(artworkQuizProps: ArtworkQuizProps) {
    const { mcqAttributes } = artworkQuizProps;
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handelNextMCQ = async (): Promise<void> => {
        if (currentIndex === 2) {
            setCurrentIndex(0);
            return;
        }
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, mcqAttributes.length - 1));
    };

    return (
        <section className="sm:px-16 md:px-40 lg:60 !py-20 ">
            <div className="container mx-auto  bg-ggrimGrey1">
                <div className="flex max-w-md flex-col items-start">
                    {/* 여기서 max-w-lg로 조정 */}
                    <div className="pt-5 pl-20 mb-2 ">
                        <p className="!text-ggrimBrown1 text-3xl font-bold relative after:content-[''] after:block after:w-full after:h-1 after:bg-ggrimBrown1 after:mt-2">
                            Quiz of the Week
                        </p>
                    </div>
                </div>
                <div className=" bg-ggrimGrey1 ">
                    <MCQView
                        mcq={mcqAttributes[currentIndex]}
                        // currentAttributeIndex={currentIndex}
                        handelNextMCQ={handelNextMCQ}
                    />
                </div>
            </div>
        </section>
    );
}
