import { Painting } from './painting';

export interface MCQAttribute {
    distractorPaintings: Painting[];
    answerPaintings: Painting[];
    category: string;
    similarity: string;
}

export interface MCQReaderViewProps {
    attribute: MCQAttribute;
    currentAttributeIndex: number;
    handelNextMCQ: () => void;
}
