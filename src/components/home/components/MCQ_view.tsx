// main component for the reader's mcq interface

import React from 'react';
import useMCQReader from './mcq/reader/use_MCQ_reader';
import { ErrorMessage } from './mcq/shared';
import SubmissionFeedback from './mcq/reader/parts/submission_feedback';
import { motion } from 'framer-motion';
import { MCQReaderViewProps } from '@/model/interface/MCQ';


const MCQView = ({ mcq, handelNextMCQ, handleImageSelected }: MCQReaderViewProps) => {


    // TODO: <MCQView /> 개선
    // - [x] mcq 타입 이름 리팩 토링
    // - [x]useMCQReader 훅 점검 및 리팩토링
    // - [ ]퀴즈 틀렸을 경우와 맞았을 경우 동작 설계하기
    // - [ ] <MCQView /> 모듈로 나누기
    // - [ ] <MCQView /> 리팩토링하여 가독성 높이기
    // - [ ] display size 마다 minHeight을 정하여 깜빡임 형상 방지 (모바일 크기만 신경쓰면 됨)
    // - [ ] component 와 custom hook 폴더 구조 정리하기
    // - [ ] 시간 제한 추가하기
    // - [ ] backend에서 맞힌 횟수와 틀린 횟수 카운팅하기
    // ! 주의: <경고할 사항>
    // ? 질문: 각각의 mcq 데이터의 title 필드를 사용해야하는가?
    // * 참고: <관련 정보나 링크>
    const { answerPaintings } = mcq;

    const {
        errorMessage,
        readerSelectedAnswer,
        isSubmitted,
        isCorrect,
        displayPaintings,
        handleReaderSelectAnswer,
        handleSubmit,
        handleHintButtonClick,
        clearSubmitState,
        handleClearSubmission,
    } = useMCQReader(mcq, 0);

    const answerKey = answerPaintings[0].id;

    const handleImageClick = (answerId: string) => {
        if (!isSubmitted) {
            // setSelectedIndex(index);
            handleReaderSelectAnswer(answerId);
        }
    };

    const handleSubmitImage = ()=>{
        const selectedPainting = displayPaintings.find(p=>
            p.id === readerSelectedAnswer
        );
        if(handleImageSelected && selectedPainting){
            handleImageSelected(selectedPainting);
        }
        handleSubmit();
    }

    const handleTryAgain = () => {
        console.log(`isSubmitted: ${isSubmitted}`);

        clearSubmitState();
        handelNextMCQ();
    };

    const getCardClasses = (paintingId : string) => {
        if (isSubmitted) {
            return paintingId === answerKey ? 'bg-green-300' : 'bg-red-300';
        }
        return 'bg-white';
    };
    
    const getBorderClasses = (paintingId : string) => (
        readerSelectedAnswer === paintingId ? 'border-4 border-primary' : ''
    );
    
    const getImageClasses = (paintingId : string) => (
        readerSelectedAnswer === paintingId ? 'ring-4 ring-primary' : ''
    );
    

    return (

        <div className="p-4 rounded-md shadow bg-ggrimBeige2" style={{ minHeight: '744px' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">

                {`${mcq.title}`}
            </h3>
            {/* <div>
                <h1>API Data</h1>
                <pre className="text-black">{JSON.stringify(mcq, null, 2)}</pre>
            </div> */}

            <motion.div
                key={mcq.id}
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
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                    {displayPaintings.map(({ id, image_url }, index) => (
                        <div
                            key={id}
                            className={`flex flex-col items-center p-4 rounded-md shadow-md ${getCardClasses(id)} ${getBorderClasses(id)}`}
                            onClick={() => handleImageClick(id)}
                        >
                            <img
                                src={image_url}
                                alt={`Answer ${index}`}
                                className={`w-50 h-auto max-h-[250px] max-w-full mb-2 ${getImageClasses(id)}`}
                            />
            </div>
        ))}
    </div>
            </motion.div>
            <div className="flex justify-end items-center">
                <SubmissionFeedback
                    isCorrect={isCorrect}
                    isSubmitted={isSubmitted}
                    handleSubmit={handleSubmitImage}
                    handleHintButtonClick={handleHintButtonClick}
                    handleClearSubmission={handleClearSubmission}
                    handleNextMCQ={handelNextMCQ}
                    handleTryAgain={handleTryAgain}
                    showHintButton={false}
                />
            </div>
        </div>
    );
};

export default MCQView;
