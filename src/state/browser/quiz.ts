import { NewQuiz } from '../../components/quiz/QuizForm';
import { QuizStatus } from '../../server-action/backend/quiz/type';
import { localStorageUtils } from '../../util/browser';
import { LOCAL_STORAGE_KEY } from './const';

export function getQuizStatus(): undefined | QuizStatus {
    const rawStatus = localStorage.getItem(LOCAL_STORAGE_KEY.QUIZ_STATUS);

    try {
        const status: QuizStatus | undefined = rawStatus ? JSON.parse(rawStatus) : undefined;
        return status;
    } catch (e) {
        console.warn('Failed to parse QuizStatus from localStorage', e);
        return undefined;
    }
}

export function saveQuizStatus(quizStatus: QuizStatus): boolean {
    localStorage.setItem(LOCAL_STORAGE_KEY.QUIZ_STATUS, JSON.stringify(quizStatus));

    return true;
}

const STORAGE_TTL_MS = 1800000;

export function saveNewQuiz(newQuiz: NewQuiz, ttl = STORAGE_TTL_MS) {
    localStorageUtils.setItemWithExpiry(LOCAL_STORAGE_KEY.NEW_QUIZ, JSON.stringify(newQuiz), ttl);
}

export function removeSavedNewQuiz() {
    localStorage.removeItem(LOCAL_STORAGE_KEY.NEW_QUIZ);
}

export function getSavedNewQuiz(): NewQuiz | undefined {
    const rawPrevNewQuiz: string | null = localStorageUtils.getItemWithExpiry(
        LOCAL_STORAGE_KEY.NEW_QUIZ,
    );
    const prevNewQuiz: NewQuiz | undefined =
        rawPrevNewQuiz && JSON.parse(rawPrevNewQuiz) ? JSON.parse(rawPrevNewQuiz) : undefined;

    return prevNewQuiz;
}
