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

const QUIZ_LIST_TAG = 'quiz_list_tag';

function getQuizCacheTag(quizId: string) {
    return `quiz-${quizId}`;
}

function revalidateQuizTag(id: string) {
    const tag = getQuizCacheTag(id);
    revalidateTag(tag);
}

function revalidateQuizList() {
    revalidateTag(QUIZ_LIST_TAG);
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

// TODO 빌드 오류 개선하기
// - 해당 API를 사용하는 SSR page는 빌드시, 다음 오류가 발생한다.
//      - Error: Dynamic server usage: no-store fetch http://localhost:3000/quiz?&&&page=0&count=50 /quiz
//      - 다음 사이트 확인 결과, nextjs의 SSR 최적화를 위해서 DynamicServerError가 발생하였고, withErrorHandler()에 의해 에러가 catch된 것으로 보인다.
//      - 에러 원인은 no-store 캐시 옵션 fetch를 감지한 static SSR 작업이 발생시켰다.
//          - https://github.com/vercel/next.js/issues/46737#issuecomment-2449603499
// - 해결방법은 여러가지 이지만, cache를 사용하는 getQuizList()를 새로 선언하여 해결하였다.
// - 추후 findQuiz()를 사용하여 동일 문제가 발생시, revalidate : 30s 을 적용 고려.

const findQuiz = async (
    artists: string[] = [],
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
    count: number = 50,
): Promise<FindQuizResult | HttpException> => {
    const backendUrl = getServerUrl();
    const artistsParam = artists.map((a) => `artists[]=${a}`).join('&');
    const tagParam = tags.map((t) => `tags[]=${t}`).join('&');
    const styleParam = styles.map((s) => `styles[]=${s}`).join('&');
    const url = `${backendUrl}/quiz?${artistsParam}&${tagParam}&${styleParam}&page=${page}&count=${count}`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }
    const result: FindQuizResult = await response.json();
    return result;
};

const getQuizList = async (page: number = 0) => {
    const backendUrl = getServerUrl();
    const count = 50;
    const url = `${backendUrl}/quiz?page=${page}&count=${count}`;

    const response = await fetch(url, { next: { tags: [QUIZ_LIST_TAG] } });
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
    const userIdParam = signInResponse ? `user-id=${signInResponse.user.id}` : '';
    const isS3AccessParam = `isS3Access=true`;
    const url = `${backendUrl}/quiz/${id}?${isS3AccessParam}&${userIdParam}`;
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

    revalidateQuizList();
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

    const response = await fetch(url, {
        method: 'PUT',
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
    revalidateQuizTag(quizId);
    revalidateQuizList();

    return result;
};

const deleteQuiz = async (
    signInResponse: SignInResponse,
    quizId: string,
): Promise<void | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizId}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${signInResponse.accessToken}`,
        },
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    revalidateQuizTag(quizId);
    revalidateQuizList();
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

export const getMCQDataAction = withErrorHandler('getMCQData', getMCQData);

export const findQuizAction = withErrorHandler('findQuiz', findQuiz);
export const getQuizListAction = withErrorHandler('getQuizList', getQuizList);
export const getQuizAction = withErrorHandler('getQuiz', getQuiz);

export const getQuizReactionsAction = withErrorHandler('getQuizReactions', getQuizReactions);

export const addQuizAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'addQuiz',
    addQuiz,
);
export const updateQuizAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'updateQuiz',
    updateQuiz,
);
export const deleteQuizAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'deleteQuiz',
    deleteQuiz,
);

export const submitQuizAction = withErrorHandler('submitQuiz', submitQuiz);

export const addQuizReactionsAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'addQuizReactions',
    addQuizReactions,
);

export const deleteQuizReactionAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'deleteQuizReaction',
    deleteQuizReaction,
);

export const scheduleQuizAction = withErrorHandler('scheduleQuiz', scheduleQuiz);

export const addQuizContextAction = withErrorHandler('addQuizContext', addQuizContext);
