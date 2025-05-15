import { Quiz, QUIZ_TYPE, ShortQuiz } from '../../../model/interface/quiz';
import { IPaginationResult } from '../common.dto';
import { QuizReactionType, QuizStatus } from './type';
export type FindQuizResult = IPaginationResult<ShortQuiz>;
export interface CreateQuizDTO {
    answerPaintingIds: string[];

    distractorPaintingIds: string[];

    examplePaintingId?: string;

    title: string;

    timeLimit: number;

    type: QUIZ_TYPE;

    description: string;
}

export class QuizReactionDTO {
    type!: QuizReactionType;
}

export interface QuizContextDTO {
    artist?: string;
    tag?: string;
    style?: string;
    page: number;
}

export interface ResponseQuizDTO {
    shortQuiz: ShortQuiz;
    status: QuizStatus;
}

export interface QuizSubmitDTO {
    isCorrect: boolean;
}

export interface QuizReactionCount {
    likeCount: number;
    dislikeCount: number;
}

export interface DetailQuizDTO {
    quiz: Quiz;
    reactionCount: QuizReactionCount;
    userReaction?: QuizReactionType;
}
