// main component for the reader's mcq interface

import React from 'react';
import useMCQReader from './mcq/reader/use_MCQ_reader';
import { ErrorMessage } from './mcq/shared';
import SubmissionFeedback from './mcq/reader/parts/submission_feedback';
import { motion } from 'framer-motion';
import { MCQReaderViewProps } from '@/model/interface/MCQ';

// TODO displayAnswers 필드 값 변경
const MCQView = ({ attribute, currentAttributeIndex, handelNextMCQ }: MCQReaderViewProps) => {
    const { answerPaintings } = attribute;

    const {
        errorMessage,
        readerSelectedAnswer,
        isSubmitted,
        isCorrect,
        displayPaintings,
        handleReaderSelectAnswer,
        handleSubmit,
        handleHintButtonClick,
        cleatSubmitState,
        handleClearSubmission,
    } = useMCQReader(attribute, 0);

    const answerKey = answerPaintings[0].id;

    const handleImageClick = (answerId: string) => {
        if (!isSubmitted) {
            // setSelectedIndex(index);
            handleReaderSelectAnswer(answerId);
        }
    };

    // TODO 틀렸을 경우 어떻게 할지 의논 필요
    const handleTryAgain = () => {
        console.log(`isSubmitted: ${isSubmitted}`);

        cleatSubmitState();
        handelNextMCQ();
    };

    return (
        // TODO display size 마다 minHeight을 정하여 깜빡임 형상 방지 (모바일 크기만 신경쓰면 됨)
        <div className="p-4 rounded-md shadow bg-ggrimBeige2" style={{ minHeight: '744px' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
                {'Which of the following is not a work by the same author?'}
            </h3>
            {/* <div>
                <h1>API Data</h1>
                <pre className="text-black">{JSON.stringify(attribute, null, 2)}</pre>
            </div> */}

            <motion.div
                key={currentAttributeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                // transition={{ duration: 1.0 }}
                transition={{
                    duration: 0.7, // 애니메이션이 총 걸리는 시간
                    delay: 0.3, // 처음 애니메이션 delay
                    delayChildren: 0.3,
                }}
            >
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
                            } shadow-md ${
                                readerSelectedAnswer === painting.id
                                    ? 'border-4 border-primary'
                                    : ''
                            }`}
                            onClick={() => handleImageClick(painting.id)}
                        >
                            <img
                                src={painting.image_url}
                                alt={`Answer ${index}`}
                                className={`w-50 h-auto max-h-[250px] max-w-full  mb-2 ${
                                    readerSelectedAnswer === painting.id
                                        ? 'ring-4 ring-primary'
                                        : ''
                                }`}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>
            <div className="flex justify-end items-center">
                <SubmissionFeedback
                    isCorrect={isCorrect}
                    isSubmitted={isSubmitted}
                    handleSubmit={handleSubmit}
                    handleHintButtonClick={handleHintButtonClick}
                    handleClearSubmission={handleClearSubmission}
                    handleNextMCQ={handelNextMCQ}
                    handelTryAgain={handleTryAgain}
                    showHintButton={false}
                />
            </div>
        </div>
    );
};

export default MCQView;
