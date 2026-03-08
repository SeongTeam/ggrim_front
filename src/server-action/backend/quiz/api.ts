"use server";
import { withErrorHandler } from "../_common/middleware";
import { getSignInResponse } from "../_common/cookie";
import { QuizStatus } from "./type";
import {
	getQuizCacheTag,
	getQuizListCacheTag,
	revalidateQuizList,
	revalidateQuizTag,
} from "./util";
import {
	CreateQuizDto,
	CreateQuizReactionDto,
	QuizContextDto,
	SubmitQuizDto,
} from "../../../generated/dto-types";
import { getBearerAuth } from "../auth/util";
import { client, createServerActionError } from "../_common/util";

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
) => {
	const { data, error } = await client.GET("/quiz", {
		params: {
			query: {
				artists,
				tags,
				styles,
				page,
				count,
			},
		},
		cache: "no-store",
	});

	if (!data) {
		throw error;
	}

	return data;
};

const getQuizList = async (page: number = 0, count: number = 50) => {
	const { data, error } = await client.GET("/quiz", {
		params: {
			query: {
				page,
				count,
			},
		},
		next: { tags: [getQuizListCacheTag()] },
	});

	if (!data) {
		throw error;
	}

	return data;
};

const getQuiz = async (id: string) => {
	const signInResponse = await getSignInResponse();
	const { data, error } = await client.GET("/quiz/{id}", {
		params: {
			path: { id },
			query: {
				isS3Access: true,
				userId: signInResponse?.user.id || "",
			},
		},
		next: { tags: [getQuizCacheTag(id)] },
	});

	if (!data) {
		throw error;
	}

	return data;
};

const addQuiz = async (dto: CreateQuizDto) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.POST("/quiz", {
		params: {
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	return data;
};

const updateQuiz = async (quizId: string, dto: CreateQuizDto) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.PUT("/quiz/{id}", {
		params: {
			path: { id: quizId },
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	revalidateQuizTag(quizId);
	revalidateQuizList();

	return data;
};

const deleteQuiz = async (quizId: string) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.DELETE("/quiz/{id}", {
		params: {
			path: { id: quizId },
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
	});

	if (!data) {
		throw error;
	}

	revalidateQuizTag(quizId);
	revalidateQuizList();
};

const submitQuiz = async (quizId: string, dto: SubmitQuizDto) => {
	const { data, error } = await client.POST("/quiz/submit/{id}", {
		params: {
			path: { id: quizId },
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	return data;
};

const getQuizReactions = async (quizId: string, page?: number) => {
	const { data, error } = await client.GET("/quiz/{id}/reactions", {
		params: {
			path: { id: quizId },
			query: {
				page,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const addQuizReactions = async (quizId: string, dto: CreateQuizReactionDto) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.POST("/quiz/{id}/reaction", {
		params: {
			path: { id: quizId },
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	revalidateQuizTag(quizId);
};

const deleteQuizReaction = async (quizId: string) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.DELETE("/quiz/{id}/reaction", {
		params: {
			path: { id: quizId },
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
	});

	if (!data) {
		throw error;
	}

	revalidateQuizTag(quizId);
};

const scheduleQuiz = async (quizStatus?: QuizStatus) => {
	const { data, error } = await client.GET("/quiz/schedule", {
		params: {
			query: {
				currentIndex: quizStatus?.currentIndex,
				endIndex: quizStatus?.endIndex,
				context: quizStatus?.context,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const addQuizContext = async (dto: QuizContextDto) => {
	const { data, error } = await client.POST("/quiz/schedule", {
		body: dto,
	});

	if (!data) {
		throw error;
	}

	return data;
};

export const findQuizAction = withErrorHandler("findQuiz", findQuiz);
export const getQuizListAction = withErrorHandler("getQuizList", getQuizList);
export const getQuizAction = withErrorHandler("getQuiz", getQuiz);

export const getQuizReactionsAction = withErrorHandler("getQuizReactions", getQuizReactions);

export const addQuizAction = withErrorHandler("addQuiz", addQuiz);
export const updateQuizAction = withErrorHandler("updateQuiz", updateQuiz);
export const deleteQuizAction = withErrorHandler("deleteQuiz", deleteQuiz);

export const submitQuizAction = withErrorHandler("submitQuiz", submitQuiz);

export const addQuizReactionsAction = withErrorHandler("addQuizReactions", addQuizReactions);

export const deleteQuizReactionAction = withErrorHandler("deleteQuizReaction", deleteQuizReaction);

export const scheduleQuizAction = withErrorHandler("scheduleQuiz", scheduleQuiz);

export const addQuizContextAction = withErrorHandler("addQuizContext", addQuizContext);
