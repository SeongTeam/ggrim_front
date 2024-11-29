'use client';

import { motion } from 'framer-motion';
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

    const handelNextMCQ = (): void => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, mcqAttributes.length - 1));
    };

    return (
        <section className="sm:px-16 md:px-40 lg:60 !py-20">
            <div className="container mx-auto bg-ggrimGrey1">
                <div className="w-lg bg-ggrimGrey1">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <MCQView
                            attribute={mcqAttributes[currentIndex]}
                            handelNextMCQ={handelNextMCQ}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
