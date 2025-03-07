// custom hook for managing mcq logic in reader mode

import { MCQ } from '@/model/interface/MCQ';
import { shuffleMerge } from '@/util/shuffleMerge';
import { useState } from 'react';
// import { submitMCQAnswer } from "@/services/mcqClientService";

const useMCQReader = (attrs: MCQ, selectedAnswer: number) => {
    const { answerPaintings, distractorPaintings } = attrs;

    // State Initialization
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);

    // TODO: <useMCQReader /> 개선
    // - [ ] 클릭시 마다 그림 재배치 되는 버그 수정
    //  -> shuffleMerge()가 여러번 호출되는 것이 문제의 원인으로 추정됨
    // - [ ] <추가 작업>
    // ! 주의: <경고할 사항>
    // ? 질문: <의문점 또는 개선 방향>
    // * 참고: <관련 정보나 링크>
    const displayPaintings = shuffleMerge(distractorPaintings, answerPaintings);

    const answerID = answerPaintings[0].id;

    // Event Handlers

    // Handle selecting an answer
    const handleReaderSelectAnswer = (paintingId: string): void => {
        setReaderSelectedAnswer(paintingId);
    };

    // Submit the selected answer
    const handleSubmit = async (): Promise<void> => {
        if (readerSelectedAnswer !== null) {
            const isCorrectAnswer = readerSelectedAnswer === answerID;
            setIsSubmitted(true);
            // setAttemptedAnswers((prev) => [...prev, readerSelectedAnswer]);
            setIsCorrect(isCorrectAnswer);
            console.log(
                `isCorrectAnswer: ${isCorrectAnswer} / ${readerSelectedAnswer} == ${selectedAnswer}`,
            );

            try {
                // await submitMCQAnswer(id, selectedAnswerText, isCorrectAnswer);
                console.log('submitMCQAnswer(id, selectedAnswerText)');
            } catch {
                setErrorMessage('Failed to submit your answer. Please try again.');
            }
        }
    };

    const clearSubmitState = async (): Promise<void> => {
        if (readerSelectedAnswer !== null) {
            setIsSubmitted(false);
            setIsCorrect(false);
            setReaderSelectedAnswer(null);

            try {
                // await submitMCQAnswer(id, selectedAnswerText, isCorrectAnswer);
                console.log('submitMCQAnswer(id, selectedAnswerText)');
            } catch {
                setErrorMessage('Failed to submit your answer. Please try again.');
            }
        }
    };

    // Toggle the hint pane
    const handleHintButtonClick = (): void => {
        setShowHint((prev) => !prev);
    };

    // Clear the submission state
    const handleClearSubmission = (): void => {
        setIsSubmitted(false);
        setReaderSelectedAnswer(null);
        setIsCorrect(false);
        setErrorMessage(null);
    };

    return {
        // State
        errorMessage,
        readerSelectedAnswer,
        isSubmitted,
        isCorrect,
        showHint,
        displayPaintings,
        // Handlers
        handleReaderSelectAnswer,
        handleSubmit,
        handleHintButtonClick,
        handleClearSubmission,
        clearSubmitState,
        setErrorMessage,
    };
};

export default useMCQReader;
