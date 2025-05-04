export const QuizReactionTypeValues = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export type QuizReactionType = (typeof QuizReactionTypeValues)[keyof typeof QuizReactionTypeValues];
