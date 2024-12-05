// extracted types from the MCQ conglomerate
// the first two are for the API, the last 3 are from the frontend code

import { Painting } from '@/mock/data/entity/mock_painting';

export interface MCQSubmission {
    mcq_id: string;
    selected_answer: string;
    is_correct: boolean;
}

export interface MCQHintRequest {
    question: string;
    attemptedAnswers: string[];
    remainingAnswers: string[];
}

export interface MCQAttribute {
    question: string;
    displayPaintings: Painting[];
    answers: Painting[];
    selectedAnswer: number | null;
    isFinalized: boolean;
    id: string;
    showHintButton?: boolean;
}

export interface MCQInstructorViewProps {
    attribute: MCQAttribute;
    updateAttributes: (attribute: Partial<MCQAttribute>) => void;
}

export interface MCQReaderViewProps {
    attribute: MCQAttribute;
    currentAttributeIndex: number;
    handelNextMCQ: () => void;
}
