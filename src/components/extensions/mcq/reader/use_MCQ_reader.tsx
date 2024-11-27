// custom hook for managing mcq logic in reader mode

import { MCQAttribute } from '@/types/mcq_types';
import { useState } from 'react';
// import { submitMCQAnswer } from "@/services/mcqClientService";

const useMCQReader = (attrs: MCQAttribute) => {
    const { displayPaintings: answers, selectedAnswer, id } = attrs;

    // State Initialization
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);

    // Event Handlers

    // Handle selecting an answer
    const handleReaderSelectAnswer = (index: number): void => {
        if (!attemptedAnswers.includes(index)) {
            setReaderSelectedAnswer(index);
        }
    };

    // Submit the selected answer
    const handleSubmit = async (): Promise<void> => {
        if (readerSelectedAnswer !== null) {
            const selectedAnswerText = answers[readerSelectedAnswer];
            const isCorrectAnswer = readerSelectedAnswer === selectedAnswer;
            setIsSubmitted(true);
            setAttemptedAnswers((prev) => [...prev, readerSelectedAnswer]);
            setIsCorrect(isCorrectAnswer);

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
        setErrorMessage,
    };
};

export default useMCQReader;
