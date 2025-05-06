export const QuizReactionTypeValues = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export type QuizReactionType = (typeof QuizReactionTypeValues)[keyof typeof QuizReactionTypeValues];

export interface QuizContext {
    artist?: string;
    tag?: string;
    style?: string;
    page: number;
}
export interface QuizStatus {
    context: QuizContext;
    currentIdx: number;
    endIdx: number;
}
