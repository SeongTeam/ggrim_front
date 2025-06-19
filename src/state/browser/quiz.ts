import { NewQuiz } from '../../components/quiz/QuizForm';
import { QuizStatus } from '../../server-action/backend/quiz/type';
import { LOCAL_STORAGE_KEY } from './const';
import { getItemWithExpiry, setItemWithExpiry } from './util';

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
	setItemWithExpiry(LOCAL_STORAGE_KEY.NEW_QUIZ, JSON.stringify(newQuiz), ttl);
}

export function removeSavedNewQuiz() {
	localStorage.removeItem(LOCAL_STORAGE_KEY.NEW_QUIZ);
}

export function getSavedNewQuiz(): NewQuiz | null {
	const rawPrevNewQuiz: string | null = getItemWithExpiry(LOCAL_STORAGE_KEY.NEW_QUIZ);
	const prevNewQuiz: NewQuiz | null =
		rawPrevNewQuiz && JSON.parse(rawPrevNewQuiz) ? JSON.parse(rawPrevNewQuiz) : undefined;

	return prevNewQuiz;
} /* This util lib is for Browser Environment

*/
