// displays feedback after mcq submission in reader mode

import React from 'react';
import * as Icons from '@/components/ui/icons';
import { ArrowRightCircleIcon, ThumbsDown, ThumbsUp } from 'lucide-react';

interface SubmissionFeedbackProps {
	isCorrect: boolean;
	isSubmitted: boolean;

	handleSubmit: () => void;
	handleClearSubmission: () => void;
	handleNextMCQ: () => void;
	showHintButton: boolean;
	toggleLike: () => void;
	toggleDislike: () => void;
	liked: boolean;
	disliked: boolean;
	likeCount: number;
	dislikeCount: number;
}

const SubmissionFeedback: React.FC<SubmissionFeedbackProps> = ({
	isCorrect,
	isSubmitted,
	handleSubmit,
	handleNextMCQ,
	toggleLike,
	toggleDislike,
	liked,
	disliked,
	likeCount,
	dislikeCount,
}) => (
	<div className="mt-6 text-right">
		{' '}
		{/* 오른쪽 정렬 */}
		<FeedBackResult isCorrect={isCorrect} isSubmitted={isSubmitted} />
		<div className="flex items-center justify-end space-x-4">
			<button
				onClick={handleSubmit}
				className="flex items-center gap-3 rounded-lg bg-green-200 px-4 py-2 font-semibold text-gray-600"
			>
				<p className="hidden md:block">Submit</p>
				<Icons.CornerRightUp />
			</button>
			<div className="flex flex-col items-center gap-1">
				<button
					onClick={toggleLike}
					className={`rounded-full border-2 p-4 text-black transition-colors duration-300 ${liked ? 'border-green-500 bg-green-500' : 'border-gray-400 dark:border-gray-600'} `}
				>
					<ThumbsUp className="h-4 w-4" />
				</button>
				<span className="text-sm text-black">{likeCount}</span>
			</div>

			<div className="flex flex-col items-center gap-1">
				<button
					onClick={toggleDislike}
					className={`rounded-full border-2 p-4 text-black transition-colors duration-300 ${disliked ? 'border-red-500 bg-red-500' : 'border-gray-400 dark:border-gray-600'} `}
				>
					<ThumbsDown className="h-4 w-4" />
				</button>
				<span className="text-sm text-black">{dislikeCount}</span>
			</div>

			<button
				onClick={handleNextMCQ}
				className="flex items-center gap-3 rounded-lg bg-black px-4 py-2 text-white"
			>
				<p className="hidden md:block">NEXT</p>
				<ArrowRightCircleIcon />
			</button>
		</div>
	</div>
);

export default SubmissionFeedback;

interface FeedBackResultProps {
	isCorrect: boolean;
	isSubmitted: boolean;
}

const FeedBackResult = ({ isCorrect, isSubmitted }: FeedBackResultProps) => {
	if (!isSubmitted) {
		return (
			<div className="text-success mb-2 text-2xl font-semibold text-zinc-800">
				Could you find?
			</div>
		);
	}

	if (isCorrect) {
		return (
			<div className="text-success mb-2 text-2xl font-semibold text-green-500">Correct!</div>
		);
	}

	return <div className="text-error mb-2 text-2xl font-semibold text-red-500">Incorrect...</div>;
};
