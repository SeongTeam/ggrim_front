import { QuizStatus } from '../../server-action/backend/quiz/type';
import { ENUM_LOCAL_STORAGE_KEY } from './const';

export function getQuizStatus(): undefined | QuizStatus {
    const rawStatus = localStorage.getItem(ENUM_LOCAL_STORAGE_KEY.QUIZ_STATUS);

    try {
        const status: QuizStatus | undefined = rawStatus ? JSON.parse(rawStatus) : undefined;
        return status;
    } catch (e) {
        console.warn('Failed to parse QuizStatus from localStorage', e);
        return undefined;
    }
}

export function saveQuizStatus(quizStatus: QuizStatus): boolean {
    localStorage.setItem(ENUM_LOCAL_STORAGE_KEY.QUIZ_STATUS, JSON.stringify(quizStatus));

    return true;
}
