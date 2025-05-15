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
    toggleLike : ()=> void;
    toggleDislike : () => void;
    liked : boolean;
    disliked : boolean;
    likeCount : number;
    dislikeCount : number
}

const SubmissionFeedback: React.FC<SubmissionFeedbackProps> = ({
    isCorrect,
    isSubmitted,
    handleSubmit,
    handleNextMCQ,
    toggleLike ,
    toggleDislike,
    liked,
    disliked,
    likeCount,
    dislikeCount
}) => (
    <div className="mt-6 text-right">
        {' '}
        {/* 오른쪽 정렬 */}
        <FeedBackResult isCorrect={isCorrect} isSubmitted={isSubmitted} />

        <div className="flex justify-end items-center space-x-4">
            <button
                onClick={handleSubmit}
                className="font-semibold py-2 px-4 flex items-center gap-3 text-gray-600 bg-green-200 rounded-lg"
            >
                Submit
                <Icons.CornerRightUp />
            </button>
            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={toggleLike}
                    className={`p-4 rounded-full border-2 transition-colors duration-300 text-black
                    ${liked ? 'bg-green-500 border-green-500' : 'border-gray-400 dark:border-gray-600'}
                    `}
                >
                    <ThumbsUp className="w-4 h-4" />
                </button>
                <span className="text-sm text-black">{likeCount}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={toggleDislike}
                    className={`p-4 rounded-full border-2 transition-colors duration-300  text-black
                    ${disliked ? 'bg-red-500 border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    `}
                >
                    <ThumbsDown className="w-4 h-4" />
                </button>
                <span className="text-sm text-black">{dislikeCount}</span>
            </div>

            <button
                onClick={handleNextMCQ}
                className="py-2 px-4 flex items-center gap-3 text-white bg-black rounded-lg"
            >
                NEXT
                <ArrowRightCircleIcon />
            </button>
        </div>

    </div>
);

export default SubmissionFeedback;

interface FeedBackResultProps {
    isCorrect : boolean;
    isSubmitted : boolean
}

const FeedBackResult = ({ isCorrect ,  isSubmitted } : FeedBackResultProps) => {

    if(!isSubmitted){
        return (<div className="text-2xl font-semibold text-success mb-2 text-zinc-800">
                Could you find?
        </div>);
    }

    if(isCorrect){
        return (<div className="text-2xl font-semibold text-success mb-2 text-green-500">
            Correct!
        </div>);
    }

    return (
        <div className="text-2xl font-semibold text-error mb-2 text-red-500">
            Incorrect...
        </div>
    );
}