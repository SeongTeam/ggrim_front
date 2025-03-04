// displays feedback after mcq submission in reader mode

import React from 'react';
import * as Icons from '@/components/ui/icons';

interface SubmissionFeedbackProps {
    isCorrect: boolean;
    isSubmitted: boolean;

    handleSubmit: () => void;
    handleHintButtonClick: () => void;
    handleClearSubmission: () => void;
    handleNextMCQ: () => void;
    handleTryAgain: () => void;
    showHintButton: boolean;
}

const SubmissionFeedback: React.FC<SubmissionFeedbackProps> = ({
    isCorrect,
    isSubmitted,
    handleSubmit,
    handleNextMCQ,
    handleTryAgain,
}) => {
    return (
        <div className="mt-6 text-right">
            {' '}
            {/* 오른쪽 정렬 */}
            {isSubmitted && !isCorrect ? (
                <div>
                    <div className="text-lg font-semibold text-error mb-2 text-red-500">
                        Incorrect...
                    </div>
                    <div className="flex justify-end items-center space-x-4">
                        <button
                            onClick={handleNextMCQ}
                            className="btn btn-sm btn-primary text-ggrimBrown1"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            ) : isCorrect ? (
                <div>
                    <div className="text-2xl font-semibold text-success mb-2 text-green-500">
                        Correct!
                    </div>
                    <button
                        onClick={handleTryAgain}
                        className="btn btn-sm btn-secondary text-base text-black border-black"
                    >
                        Next Quiz
                    </button>
                </div>
            ) : (
                <div className="flex justify-end items-center space-x-4">
                    {' '}
                    {/* 버튼 우측 정렬 */}
                    <button
                        onClick={handleSubmit}
                        className="py-2 px-4 flex items-center gap-3 text-gray-600 bg-green-200"
                    >
                        Submit
                        <Icons.CornerRightUp />
                    </button>
                    <button
                        onClick={handleNextMCQ}
                        className="btn btn-sm btn-primary text-ggrimBrown1"
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubmissionFeedback;
