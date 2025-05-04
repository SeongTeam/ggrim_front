import { getServerUrl } from '..';
import { MCQ } from '../../../model/interface/MCQ';
import { Quiz, QuizDislike, QuizLike } from '../../../model/interface/quiz';
import { serverLogger } from '../../../util/logger';
import { getSignInResponseOrRedirect } from '../cookie';
import {
    CreateQuizDTO,
    FindQuizResult,
    QuizContextDTO,
    QuizReactionDTO,
    QuizSubmitDTO,
    ResponseQuizDTO,
} from './dto';
import { QuizReactionType } from './type';

export const getMCQData = async (): Promise<MCQ[]> => {
    // const response = await fetch('http://localhost:4000/api/mcq', {
    //     cache: 'no-cache',
    // });  // src/data에 파일을 읽어 올 때 사용
    const serverUrl = getServerUrl();

    const url: string = serverUrl + '/quiz/quiz_of_week';
    const response = await fetch(url, {
        cache: 'no-cache',
    }); // 서버에 있는 데이터 읽어 올때 사용
    const res = await response.json();
    return res.data;
};

export const findQuiz = async (
    artists: string[] = [],
    tags: string[] = [],
    styles: string[] = [],
    page: number = 0,
): Promise<FindQuizResult> => {
    const backendUrl = getServerUrl();
    const artistsParam = artists.map((a) => `artists[]=${a}`).join('&');
    const tagParam = tags.map((t) => `tags[]=${t}`).join('&');
    const styleParam = styles.map((s) => `styles[]=${s}`).join('&');
    const url = `${backendUrl}/quiz?${artistsParam}&${tagParam}&${styleParam}&page=${page}`;
    serverLogger.info(`[findQuiz] url=${url}`);
    const response = await fetch(url);
    const result: FindQuizResult = await response.json();
    return result;
};

export const getQuiz = async (id: string): Promise<Quiz> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${id}`;
    serverLogger.info(`[getQuiz] url=${url}`);
    const response = await fetch(url);
    const result: Quiz = await response.json();
    serverLogger.debug(`[getQuiz] ${JSON.stringify(result, null, 2)}`);
    return result;
};

export const addQuiz = async (dto: CreateQuizDTO): Promise<Quiz | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz`;

    const signInResponse = getSignInResponseOrRedirect();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${signInResponse.accessToken}`,
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`add Quiz fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }
    const result: Quiz = await response.json();

    return result;
};

export const submitQuiz = async (
    quizID: string,
    dto: QuizSubmitDTO,
): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/submit/${quizID}`;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`signUp fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: boolean = await response.json();
    return result;
};

export const getQuizReactions = async (
    quizID: string,
    type: QuizReactionType,
    page?: number,
    findUserId?: string,
): Promise<QuizDislike[] | QuizLike[] | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reactions`;
    const typeParam = `type=${type}`;
    const pageParam = `page=${page}`;
    const userIdParam = `user_id=${findUserId}`;
    const response = await fetch(url + `?${typeParam}&${pageParam}&${userIdParam}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`getQuizReactions fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: QuizDislike[] | QuizLike[] = await response.json();
    return result;
};

export const addQuizReactions = async (
    quizID: string,
    dto: QuizReactionDTO,
): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reactions`;

    const signInResponse = getSignInResponseOrRedirect();

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
        const result = await response.json();
        serverLogger.error(`getQuizReactions fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    return true;
};

export const deleteQuizReaction = async (quizID: string): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/${quizID}/reactions`;

    const signInResponse = getSignInResponseOrRedirect();

    const headers = {
        Authorization: `Bearer ${signInResponse.accessToken}`,
    };
    const response = await fetch(url, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`getQuizReactions fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    return true;
};

export const scheduleQuiz = async (
    context?: QuizContextDTO,
    currentIndex?: number,
    endIndex?: number,
): Promise<ResponseQuizDTO | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/schedule`;
    const currentIndexParam = `currentIndex=${currentIndex}`;
    const endIndexParam = `endIndex=${endIndex}`;
    const contextParam = `context=` + JSON.stringify(context);
    const response = await fetch(url + `?${currentIndexParam}&${endIndexParam}&${contextParam}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`getQuizReactions fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }
    const result: ResponseQuizDTO = await response.json();
    return result;
};

export const addQuizContext = async (dto: QuizContextDTO): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/quiz/schedule`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`getQuizReactions fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }
    const result: boolean = await response.json();
    return result;
};
