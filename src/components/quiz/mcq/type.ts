import {
	QUIZ_REACTION,
	QUIZ_TYPE,
	ShowPainting,
	ShowQuizReactionCount,
} from "../../../generated/dto-types";

//Multiple-Choice-Question

export interface MCQ {
	id: string;
	distractorPaintings: ShowPainting[];
	answerPaintings: ShowPainting[];
	title: string;
	description: string;
	timeLimit: number;
	type: QUIZ_TYPE;
}

export interface MCQReaderViewProps {
	mcq: MCQ;
	// currentAttributeIndex: number;
	handelNextMCQ: () => Promise<void>;
	handleImageSelected?: (selectedPainting: ShowPainting) => Promise<void>;
	reactionCount: ShowQuizReactionCount;
	userReaction?: QUIZ_REACTION;
}
