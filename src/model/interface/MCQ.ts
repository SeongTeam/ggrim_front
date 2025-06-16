import { QuizReactionCount } from '../../server-action/backend/quiz/dto';
import { QuizReactionType } from '../../server-action/backend/quiz/type';
import { Painting } from '@/server-action/backend/painting/dto';
import { QUIZ_TYPE } from './quiz';

//Multiple-Choice-Question
export interface MCQ {
    id: string;
    distractorPaintings: Painting[];
    answerPaintings: Painting[];
    title: string;
    description: string;
    timeLimit: number;
    type: QUIZ_TYPE;
    // category: string;
    // similarity: string;
}

export interface MCQReaderViewProps {
    mcq: MCQ;
    // currentAttributeIndex: number;
    handelNextMCQ: () => Promise<void>;
    handleImageSelected?: (selectedPainting: Painting) => Promise<void>;
    reactionCount: QuizReactionCount;
    userReaction?: QuizReactionType;
}
