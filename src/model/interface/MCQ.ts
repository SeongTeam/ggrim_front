import { Painting } from './painting';
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
}
