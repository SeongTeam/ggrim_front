import { Painting } from '../../model/interface/painting';
import { Quiz, QUIZ_TYPE } from '../../model/interface/quiz';

export interface FindPaintingResult {
    data: Painting[];
    isMore: boolean;
    pagination: number;
    count: number;
}

export interface FindQuizResult {
    data: Quiz[];
    isMore: boolean;
    pagination: number;
    count: number;
}

export interface CreateQuizDTO {
    answerPaintingIds: string[];

    distractorPaintingIds: string[];

    examplePaintingId?: string;

    title: string;

    timeLimit: number;

    type: QUIZ_TYPE;

    description: string;
}
