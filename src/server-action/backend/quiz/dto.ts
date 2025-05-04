import { IPaginationResult } from '..';
import { QuizStatus } from '../../../app/lib/api.quiz';
import { QuizContext } from '../../../app/lib/api.quiz.scheduler';
import { QUIZ_TYPE, ShortQuiz } from '../../../model/interface/quiz';
import { QuizReactionType } from './type';
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
