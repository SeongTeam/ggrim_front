// custom hook for managing mcq logic in reader mode

import { MCQAttribute } from '@/types/mcq_types';
import { useState } from 'react';
// import { submitMCQAnswer } from "@/services/mcqClientService";

const useMCQReader = (attrs: MCQAttribute) => {
    const { answers, selectedAnswer } = attrs;

    // State Initialization
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);

    const answerID = answers[0].id;

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

    const cleatSubmitState = async (): Promise<void> => {
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
        setAttemptedAnswers([]);
        setIsCorrect(false);
        setErrorMessage(null);
    };

    return {
        // State
        errorMessage,
        readerSelectedAnswer,
        isSubmitted,
        attemptedAnswers,
        isCorrect,
        showHint,
        // Handlers
        handleReaderSelectAnswer,
        handleSubmit,
        handleHintButtonClick,
        handleClearSubmission,
        cleatSubmitState,
        setErrorMessage,
    };
};

export default useMCQReader;
