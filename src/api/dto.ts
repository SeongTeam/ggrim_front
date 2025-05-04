import { ShortPainting } from '../model/interface/painting';
import { QUIZ_TYPE, ShortQuiz } from '../model/interface/quiz';
import { OneTimeTokenPurpose } from './api.backend';
import { QuizReactionType } from './api.backend.option';
import { QuizStatus } from '../app/lib/api.quiz';
import { QuizContext } from '../app/lib/api.quiz.scheduler';

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

export class QuizReactionDTO {
    type!: QuizReactionType;
}

export interface CreateUserDTO {
    email: string;

    password: string;

    username: string;

    // oauth_provider?: string;

    // oauth_provider_id?: string;
}

export interface ReplacePassWordDTO {
    password: string;
}

export interface ReplaceUsernameDTO {
    username: string;
}

export type QuizContextDTO = QuizContext;

export interface ResponseQuizDTO {
    shortQuiz: ShortQuiz;
    status: QuizStatus;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
}

export interface requestVerificationDTO {
    email: string;
}

export interface VerifyDTO extends requestVerificationDTO {
    pinCode: string;
}

export interface CreateOneTimeTokenDTO {
    purpose: OneTimeTokenPurpose;
}

export class SendOneTimeTokenDTO {
    email!: string;

    // @IsInArray([OneTimeTokenPurposeValues.UPDATE_PASSWORD, OneTimeTokenPurposeValues.RECOVER_ACCOUNT])
    purpose!: OneTimeTokenPurpose;
}
