import { ShowPainting, QUIZ_TYPE } from "../../../generated/dto-types";

export interface NewQuiz {
	answer: ShowPainting | undefined;
	distractor1: ShowPainting | undefined;
	distractor2: ShowPainting | undefined;
	distractor3: ShowPainting | undefined;
	title: string;
	timeLimit: number;
	description: string;
	type: QUIZ_TYPE.ONE_CHOICE;
}
export type StatePaintingKey = "answer" | "distractor1" | "distractor2" | "distractor3";
type PaintingActionType = "SET_ANSWER" | "SET_DISTRACTOR1" | "SET_DISTRACTOR2" | "SET_DISTRACTOR3";
type PaintingAction = { type: PaintingActionType; painting: ShowPainting | undefined };
export type Action =
	| { type: "SET_TITLE"; title: string }
	| { type: "SET_DESCRIPTION"; description: string }
	| { type: "SET_ALL"; newQuiz: NewQuiz }
	| PaintingAction;
