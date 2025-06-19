'use client';

import { MCQ } from '../quiz/mcq/type';
import React from 'react';
import MCQView from '../quiz/mcq/MCQView';
import { QuizReactionCount } from '../../server-action/backend/quiz/dto';
interface ArtworkQuizProps {
	mcqAttributes: MCQ[];
	reactionCounts: QuizReactionCount[];
}

export const ArtworkQuiz = (artworkQuizProps: ArtworkQuizProps) => {
	const { mcqAttributes, reactionCounts } = artworkQuizProps;
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const handelNextMCQ = async (): Promise<void> => {
		if (currentIndex === 2) {
			setCurrentIndex(0);
			return;
		}
		setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, mcqAttributes.length - 1));
	};

	return (
		<section className="lg:60 !py-20 sm:px-16 md:px-40">
			<div className="container mx-auto bg-ggrimGrey1">
				<div className="flex max-w-md flex-col items-start">
					{/* 여기서 max-w-lg로 조정 */}
					<div className="mb-2 pl-20 pt-5">
						<p className="relative text-3xl font-bold !text-ggrimBrown1 after:mt-2 after:block after:h-1 after:w-full after:bg-ggrimBrown1 after:content-['']">
							Quiz of the Week
						</p>
					</div>
				</div>
				<div className="bg-ggrimGrey1">
					<MCQView
						mcq={mcqAttributes[currentIndex]}
						// currentAttributeIndex={currentIndex}
						handelNextMCQ={handelNextMCQ}
						reactionCount={reactionCounts[currentIndex]}
					/>
				</div>
			</div>
		</section>
	);
};
