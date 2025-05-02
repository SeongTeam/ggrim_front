import { ShortPainting } from '../../model/interface/painting';
import { QUIZ_TYPE, ShortQuiz } from '../../model/interface/quiz';

export interface IPaginationResult<T> {
    data: T[];
    count: number;
    pagination: number;
    isMore?: boolean;
}

export type FindPaintingResult = IPaginationResult<ShortPainting>;

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
