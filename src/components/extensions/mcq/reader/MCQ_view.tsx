// main component for the reader's mcq interface

import React, { useState } from 'react';
import * as Icons from '@/components/ui/icons';
import useMCQReader from './use_MCQ_reader';
import HintPane from '@/components/extensions/mcq/reader/parts/hint_pane';
import { ErrorMessage } from '../shared';
import SubmissionFeedback from './parts/submission_feedback';
import { MCQReaderViewProps } from '@/types/mcq_types';
import { Painting } from '@/mock/data/entity/mock_painting';

// TODO displayAnswers 필드 값 변경
const MCQView = ({ attribute: attrs, handelNextMCQ }: MCQReaderViewProps) => {
    const { question, answers, displayPaintings, selectedAnswer, id } = attrs;

    const {
        errorMessage,
        readerSelectedAnswer,
        isSubmitted,
        attemptedAnswers,
        isCorrect,
        showHint,
        handleReaderSelectAnswer,
        handleSubmit,
        handleHintButtonClick,
        handleClearSubmission,
    } = useMCQReader(attrs);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const answerKey = answers[0].id;

    const handleImageClick = (index: number) => {
        if (!isSubmitted && !attemptedAnswers.includes(index)) {
            setSelectedIndex(index);
            handleReaderSelectAnswer(index);
        }
    };

    return (
        <div className="p-4 rounded-md shadow bg-ggrimBeige2">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{question}</h3>
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {displayPaintings.map((painting, index) => (
                    <div
                        key={painting.id}
                        className={`flex flex-col items-center p-4 rounded-md ${
                            isSubmitted
                                ? painting.id === answerKey
                                    ? 'bg-green-300'
                                    : 'bg-red-300'
                                : 'bg-white'
                        } shadow-md ${selectedIndex === index ? 'border-4 border-primary' : ''}`}
                        onClick={() => handleImageClick(index)}
                    >
                        <img
                            src={painting.image}
                            alt={`Answer ${index}`}
                            className={`w-50 h-auto max-h-[250px] max-w-full  mb-2 ${
                                selectedIndex === index ? 'ring-4 ring-primary' : ''
                            }`}
                        />

                        {/* {isSubmitted && isCorrect && index === selectedAnswer && (
                            <Icons.CircleCheck className="w-6 h-6 text-success ml-2" fill="green" />
                        )}
                        {isSubmitted &&
                            attemptedAnswers.includes(index) &&
                            index !== selectedAnswer && (
                                <Icons.CircleX className="w-6 h-6 text-error ml-2" fill="red" />
                            )} */}
                    </div>
                ))}
            </div>
            <div className="flex justify-end items-center">
                <SubmissionFeedback
                    isCorrect={isCorrect}
                    isSubmitted={isSubmitted}
                    readerSelectedAnswer={readerSelectedAnswer}
                    handleSubmit={handleSubmit}
                    handleHintButtonClick={handleHintButtonClick}
                    handleClearSubmission={handleClearSubmission}
                    handleNextMCQ={handelNextMCQ}
                    showHintButton={false}
                />
            </div>
        </div>
    );
};

export default MCQView;
