"use client";

import { FeaturedImageGallery } from "@/components/home/FeaturedImageGallery";
import React from "react";
import { Painting } from "@/server-action/backend/painting/type";
import { ShortQuiz } from "@/server-action/backend/quiz/type";
import { QuizCard } from "../quiz/QuizCard";
import { useRouter } from "next/navigation";

interface ArtworkCarouselProps {
	curatedWorkAttributes: Painting[];
	quizzes: ShortQuiz[];
}

export const ArtworkCarousel = (props: ArtworkCarouselProps) => {
	const { curatedWorkAttributes, quizzes } = props;
	const router = useRouter();

	const handleClickCard = (quiz: ShortQuiz) => {
		const url: string = `/quiz/${quiz.id}`;
		router.push(url);
	};

	return (
		<section className="lg:60 !py-20 sm:px-16 md:px-40">
			<section>
				<p className="text-3xl font-bold text-yellow-400">Enjoy Classic Paintings</p>
				<div className="mt-5 rounded-md bg-ggrimGrey1">
					<FeaturedImageGallery paintings={curatedWorkAttributes} />
				</div>
			</section>
			<section>
				<p className="text-3xl font-bold text-yellow-400">Enjoy Painting Quizzes</p>
				<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
					{quizzes.slice(0, 21).map((quiz) => (
						<div key={`${quiz.id}`} className="max-w-xs">
							<QuizCard title={quiz.title} onClick={() => handleClickCard(quiz)} />
						</div>
					))}
				</div>
			</section>
		</section>
	);
};
