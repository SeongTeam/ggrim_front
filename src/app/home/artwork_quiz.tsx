'use client';

import MCQView from '@/components/extensions/mcq/reader/MCQ_view';
import SubmissionPane from '@/components/ui/sudmission_pane';
import { MCQSelectionProvider } from '@/context/MCQ_selection_context';
import { mcqListState } from '@/recoil/atoms/mcq_state';
import { MCQAttribute, MCQReaderViewProps } from '@/types/mcq_types';
import { Typography } from '@material-tailwind/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Painting } from '@/mock/data/entity/mock_painting'; // Artwork 클래스를 정의한 파일 경로

interface ArtworkQuizProps {
    mcqAttributes: MCQAttribute[];
}

export function ArtworkQuiz<C extends React.ElementType>(artworkQuizProps: ArtworkQuizProps) {
    const { mcqAttributes } = artworkQuizProps;
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handelNextMCQ = async (): Promise<void> => {
        // TODO 순환말고 단방향으로 변경 예정
        console.log(`index: ${currentIndex}, mcqList.length: ${mcqAttributes.length}`);
        setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % mcqAttributes.length; // 순환 방식
            return nextIndex;
        });
    };

    const currentMCQ = mcqAttributes[currentIndex];
    return (
        <section className=" sm:px-16 md:px-40 lg:60 !py-20">
            <div className="container mx-auto bg-ggrimGrey1">
                <div className="flex max-w-md flex-col items-start">
                    {/* 여기서 max-w-lg로 조정 */}
                    <div className="pt-5 pl-20 mb-2 ">
                        <Typography className="!text-ggrimBrown1 text-3xl font-bold relative after:content-[''] after:block after:w-full after:h-1 after:bg-ggrimBrown1 after:mt-2">
                            Quiz of the Week
                        </Typography>
                    </div>
                </div>
                <div className="w-lg bg-ggrimGrey1">
                    <div className="relative w-full mt-4 mb-12 px-16">
                        <MCQView attribute={currentMCQ} handelNextMCQ={handelNextMCQ} />
                    </div>
                </div>
            </div>
        </section>
    );
}
