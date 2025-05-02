export const ENUM_SECURITY_TOKEN_HEADER = {
    X_SECURITY_TOKEN_ID: `x-security-token-identifier`,
    X_SECURITY_TOKEN: 'x-security-token-value',
};

export const ENUM_ONE_TIME_TOKEN_HEADER = {
    X_ONE_TIME_TOKEN_ID: `x-one-time-token-identifier`,
    X_ONE_TIME_TOKEN: 'x-one-time-token-value',
};

export interface QuizSubmitDTO {
    isCorrect: boolean;
}

export const QuizReactionTypeValues = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export type QuizReactionType = (typeof QuizReactionTypeValues)[keyof typeof QuizReactionTypeValues];
