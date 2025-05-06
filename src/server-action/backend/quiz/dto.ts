import { QUIZ_TYPE, ShortQuiz } from '../../../model/interface/quiz';
import { IPaginationResult } from '../common.dto';
import { QuizContext, QuizReactionType, QuizStatus } from './type';
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

export type QuizContextDTO = QuizContext;

export interface ResponseQuizDTO {
    shortQuiz: ShortQuiz;
    status: QuizStatus;
}

export interface QuizSubmitDTO {
    isCorrect: boolean;
}
