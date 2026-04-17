"use client";

import { SubmitEvent, useCallback, useEffect, useReducer, useState, type JSX } from "react";
import {
	CreateQuizDto,
	QUIZ_TYPE,
	ShowPainting,
	ShowQuizResponse,
} from "../../../generated/dto-types";
import { NewQuiz, Action, StatePaintingKey } from "./type";
import { isDuplicatedPaintingPainting, validateQuiz } from "./utils";
import { addQuizAction, updateQuizAction } from "../../../server-action/backend/quiz/api";
import { removeSavedNewQuiz } from "../../../state/browser/quiz";
import { useRouter } from "next/navigation";
import { getPaintingAction } from "../../../server-action/backend/painting/api";

function reducer(state: NewQuiz, action: Action): NewQuiz {
	switch (action.type) {
		case "SET_TITLE":
			return { ...state, title: action.title };
		case "SET_DESCRIPTION":
			return { ...state, description: action.description };
		case "SET_ANSWER":
			return { ...state, answer: action.painting };
		case "SET_DISTRACTOR1":
			return { ...state, distractor1: action.painting };
		case "SET_DISTRACTOR2":
			return { ...state, distractor2: action.painting };
		case "SET_DISTRACTOR3":
			return { ...state, distractor3: action.painting };
		case "SET_ALL":
			return { ...action.newQuiz };
		default:
			return state;
	}
}
const initState: NewQuiz = {
	answer: undefined,
	distractor1: undefined,
	distractor2: undefined,
	distractor3: undefined,
	title: "",
	description: "",
	type: QUIZ_TYPE.ONE_CHOICE,
	timeLimit: 30,
};
const initializeState = (quiz?: ShowQuizResponse): NewQuiz => {
	if (!quiz) {
		return initState;
	}

	return {
		answer: quiz.answer_paintings[0],
		distractor1: quiz.distractor_paintings[0],
		distractor2: quiz.distractor_paintings[1],
		distractor3: quiz.distractor_paintings[2],
		title: quiz.title,
		description: quiz.description,
		type: QUIZ_TYPE.ONE_CHOICE,
		timeLimit: quiz.time_limit,
	};
};

export const useQuizForm = (prevQuiz?: ShowQuizResponse) => {
	const [newQuiz, dispatch] = useReducer(reducer, prevQuiz, initializeState);
	const router = useRouter();

	const setQuizPainting = (key: StatePaintingKey, painting: ShowPainting | undefined) => {
		switch (key) {
			case "answer":
				return dispatch({ type: "SET_ANSWER", painting });
			case "distractor1":
				return dispatch({ type: "SET_DISTRACTOR1", painting });
			case "distractor2":
				return dispatch({ type: "SET_DISTRACTOR2", painting });
			case "distractor3":
				return dispatch({ type: "SET_DISTRACTOR3", painting });
			default:
				throw new Error("wrong handler run");
		}
	};

	const submitQuiz = async (newQuiz: NewQuiz) => {
		try {
			if (!validateQuiz(newQuiz)) {
				return;
			}

			const { answer, distractor1, distractor2, distractor3 } = newQuiz;

			const dto: CreateQuizDto = {
				answerPaintingIds: [answer?.id],
				distractorPaintingIds: [distractor1?.id, distractor2?.id, distractor3?.id],
				title: newQuiz!.title,
				description: newQuiz!.description,
				type: newQuiz!.type,
				timeLimit: newQuiz.timeLimit,
			};

			const serverAction =
				prevQuiz === undefined
					? addQuizAction
					: (dto: CreateQuizDto) => updateQuizAction(prevQuiz.id, dto);

			const result = await serverAction(dto);
			if (result.ok) {
				removeSavedNewQuiz();
				router.push(`/quiz/${result.data.id}`);
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw "An unexpected error occurred.";
			}
		}
	};

	const selectPainting = async (key: StatePaintingKey, id: string): Promise<boolean> => {
		const result = await getPaintingAction(id);

		if (!result.ok) {
			throw new Error(result.message);
		}
		const painting = result.data;
		if (isDuplicatedPaintingPainting(newQuiz, painting)) {
			throw new Error(`Can't Add painting. ${id} is already exist. `);
		}
		setQuizPainting(key, painting);

		return true;
	};

	const deletePainting = async (key: StatePaintingKey): Promise<boolean> => {
		setQuizPainting(key, undefined);
		return true;
	};

	const setTitle = async (title: string) => {
		const MAX_LENGTH = 150;
		if (title.length > MAX_LENGTH) {
			throw new Error(`title can't be over ${MAX_LENGTH} characters`);
		}

		dispatch({ type: "SET_TITLE", title });
	};

	const setDescription = async (description: string) => {
		const MAX_LENGTH = 2000;

		if (description.length > MAX_LENGTH) {
			throw new Error(`description can't be over ${MAX_LENGTH} characters`);
		}
		dispatch({ type: "SET_DESCRIPTION", description });
	};

	const setNewQuiz = (newQuiz: NewQuiz) => {
		dispatch({ type: "SET_ALL", newQuiz });
	};

	return {
		newQuiz,
		setTitle,
		setDescription,
		selectPainting,
		deletePainting,
		submitQuiz,
		setNewQuiz,
	};
};
