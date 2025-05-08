import { QuizContextDTO } from './dto';

export const QuizReactionTypeValues = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export type QuizReactionType = (typeof QuizReactionTypeValues)[keyof typeof QuizReactionTypeValues];

export interface QuizStatus {
    context: QuizContextDTO;
    currentIndex: number;
    endIndex: number;
}
