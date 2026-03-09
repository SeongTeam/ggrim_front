import { revalidateTag } from "next/cache";

const QUIZ_LIST_TAG = "quiz_list_tag";

export function getQuizCacheTag(quizId: string) {
	return `quiz-${quizId}`;
}

export function revalidateQuizTag(id: string) {
	const tag = getQuizCacheTag(id);
	revalidateTag(tag);
}

export function revalidateQuizList() {
	revalidateTag(QUIZ_LIST_TAG);
}

export function getQuizListCacheTag() {
	return QUIZ_LIST_TAG;
}
