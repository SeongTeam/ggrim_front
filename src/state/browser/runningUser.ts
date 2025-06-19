'use client';
import { User } from '@/server-action/backend/user/type';
import { CreateQuizDTO } from '../../server-action/backend/quiz/dto';
import { LOCAL_STORAGE_KEY } from './const';

export interface RunningUser {
	username: string;
	id: string;
	quizDraft?: QuizDraft;
	editingQuizSet?: Record<string, QuizDraft>;
}

export interface QuizDraft {
	dto: CreateQuizDTO;
}

function saveRunningUser(runningUser: RunningUser): boolean {
	localStorage.setItem(LOCAL_STORAGE_KEY.RUNNING_USER, JSON.stringify(runningUser));
	return true;
}

export function syncUserToLocalStorage(user: User): boolean {
	const { username, id } = user;
	const runningUser: RunningUser = { username, id };

	localStorage.setItem(LOCAL_STORAGE_KEY.RUNNING_USER, JSON.stringify(runningUser));

	return true;
}

export function getRunningUser(): undefined | RunningUser {
	const result = localStorage.getItem(LOCAL_STORAGE_KEY.RUNNING_USER);
	if (!result) {
		return undefined;
	}
	try {
		return JSON.parse(result) as RunningUser;
	} catch (e) {
		console.warn('Failed to parse runningUser from localStorage', e);
		return undefined;
	}
}

export function removeRunningUser() {
	localStorage.removeItem(LOCAL_STORAGE_KEY.RUNNING_USER);
}

export function saveQuizDraft(quizDraft: QuizDraft): boolean {
	const runningUser = getRunningUser();

	if (!runningUser) {
		return false;
	}

	runningUser.quizDraft = quizDraft;
	saveRunningUser(runningUser);
	return true;
}

export function removeQuizDraft(): boolean {
	const runningUser = getRunningUser();

	if (!runningUser) {
		return false;
	}

	runningUser.quizDraft = undefined;
	saveRunningUser(runningUser);
	return true;
}

export function saveEditingQuiz(quizId: string, quizDraft: QuizDraft): boolean {
	const runningUser = getRunningUser();

	if (!runningUser) {
		return false;
	}

	if (!runningUser.editingQuizSet) {
		runningUser.editingQuizSet = {};
	}

	runningUser.editingQuizSet[quizId] = quizDraft;

	return true;
}

export function removeEditingQuiz(quizId: string): boolean {
	const runningUser = getRunningUser();

	if (!runningUser?.editingQuizSet?.[quizId]) {
		return false;
	}

	delete runningUser.editingQuizSet[quizId];

	saveRunningUser(runningUser);
	return true;
}
