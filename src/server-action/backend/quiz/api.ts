'use server';
import { cookieWithErrorHandler, getServerUrl, withErrorHandler } from '../lib';
import { MCQ } from '../../../model/interface/MCQ';
import { Quiz, QuizDislike, QuizLike } from '../../../model/interface/quiz';
import { getSignInResponse, getSignInResponseOrRedirect } from '../cookie';
import {
    CreateQuizDTO,
    DetailQuizDTO,
    FindQuizResult,
    QuizContextDTO,
    QuizReactionDTO,
    QuizSubmitDTO,
    ResponseQuizDTO,
} from './dto';
import { QuizReactionType, QuizStatus } from './type';
import { HttpException } from '../common.dto';
import { SignInResponse } from '../auth/type';
import { revalidateTag } from 'next/cache';

function getQuizCacheTag(quizId: string) {
    return `quiz-${quizId}`;
}

function revalidateQuizTag(id: string) {
    const tag = getQuizCacheTag(id);
    revalidateTag(tag);
}

const getMCQData = async (): Promise<MCQ[] | HttpException> => {
    // const response = await fetch('http://localhost:4000/api/mcq', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용
    const serverUrl = getServerUrl();

    const url: string = serverUrl + '/quiz/quiz_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();

    if (!res.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return res.data;
};

const findQuiz = async (
    artists: string[] = [],
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindQuizResult | HttpException> => {
    const backendUrl = getServerUrl();
    const artistsParam = artists.map((a) => `artists[]=${a}`).join('&');
    const tagParam = tags.map((t) => `tags[]=${t}`).join('&');
    const styleParam = styles.map((s) => `styles[]=${s}`).join('&');
    const url = `${backendUrl}/quiz?${artistsParam}&${tagParam}&${styleParam}&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: FindQuizResult = await response.json();
    return result;
};

const getQuiz = async (id: string): Promise<DetailQuizDTO> => {
    const backendUrl = getServerUrl();
    const signInResponse = await getSignInResponse();
    const param = signInResponse ? `?user-id=${signInResponse.user.id}` : '';
    const url = `${backendUrl}/quiz/${id}` + param;
    const cacheTag = getQuizCacheTag(id);
    const response = await fetch(url, { next: { tags: [cacheTag] } });
    const result: DetailQuizDTO = await response.json();
    return result;
};

const addQuiz = async (
    signInResponse: SignInResponse,
    dto: CreateQuizDTO,
): Promise<Quiz | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${signInResponse.accessToken}`,
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: Quiz = await response.json();

    return result;
};

const updateQuiz = async (
    signInResponse: SignInResponse,
    quizId: string,
    dto: CreateQuizDTO,
): Promise<Quiz | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizId}`;
    const cacheTag = getQuizCacheTag(quizId);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${signInResponse.accessToken}`,
        },
        body: JSON.stringify(dto),
        next: { tags: [cacheTag] },
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: Quiz = await response.json();

    return result;
};

const submitQuiz = async (quizID: string, dto: QuizSubmitDTO): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/submit/${quizID}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: boolean = await response.json();
    return result;
};

const getQuizReactions = async (
    quizID: string,
    type: QuizReactionType,
    page?: number,
    findUserId?: string,
): Promise<QuizDislike[] | QuizLike[] | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reactions`;
    const typeParam = `type=${type}`;
    const pageParam = `page=${page}`;
    const userIdParam = `user_id=${findUserId}`;
    const response = await fetch(url + `?${typeParam}&${pageParam}&${userIdParam}`);

    if (!response.ok) {
        const result = await response.json();
        return result;
    }

    const result: QuizDislike[] | QuizLike[] = await response.json();
    return result;
};

const addQuizReactions = async (
    signInResponse: SignInResponse,
    quizID: string,
    dto: QuizReactionDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reaction`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signInResponse.accessToken}`,
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    revalidateQuizTag(quizID);
    return true;
};

const deleteQuizReaction = async (
    signInResponse: SignInResponse,
    quizID: string,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reaction`;

    const headers = {
        Authorization: `Bearer ${signInResponse.accessToken}`,
    };
    const response = await fetch(url, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    revalidateQuizTag(quizID);
    return true;
};

const scheduleQuiz = async (quizStatus?: QuizStatus): Promise<ResponseQuizDTO | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/schedule`;
    let param = '';
    if (quizStatus) {
        const currentIndexParam = `currentIndex=${quizStatus?.currentIndex || ''}`;
        const endIndexParam = `endIndex=${quizStatus?.endIndex || ''}`;
        const contextParam = `context=` + JSON.stringify(quizStatus?.context) || '';
        param += `?${currentIndexParam}&${endIndexParam}&${contextParam}`;
    }
    const response = await fetch(url + param);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: ResponseQuizDTO = await response.json();
    return result;
};

const addQuizContext = async (dto: QuizContextDTO): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/schedule`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: boolean = await response.json();
    return result;
};

export const getMCQDataAction = withErrorHandler(getMCQData);

export const findQuizAction = withErrorHandler(findQuiz);
export const getQuizAction = withErrorHandler(getQuiz);

export const getQuizReactionsAction = withErrorHandler(getQuizReactions);

export const addQuizAction = cookieWithErrorHandler(getSignInResponseOrRedirect, addQuiz);
export const updateQuizAction = cookieWithErrorHandler(getSignInResponseOrRedirect, updateQuiz);

export const submitQuizAction = withErrorHandler(submitQuiz);

export const addQuizReactionsAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    addQuizReactions,
);

export const deleteQuizReactionAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    deleteQuizReaction,
);

export const scheduleQuizAction = withErrorHandler(scheduleQuiz);

export const addQuizContextAction = withErrorHandler(addQuizContext);
