import { Painting } from "../../../server-action/backend/painting/type";
import { QuizReactionCount } from "../../../server-action/backend/quiz/dto";
import { QuizType, QuizReaction } from "../../../server-action/backend/quiz/type";

//Multiple-Choice-Question

export interface MCQ {
	id: string;
	distractorPaintings: Painting[];
	answerPaintings: Painting[];
	title: string;
	description: string;
	timeLimit: number;
	type: QuizType;
}

export interface MCQReaderViewProps {
	mcq: MCQ;
	// currentAttributeIndex: number;
	handelNextMCQ: () => Promise<void>;
	handleImageSelected?: (selectedPainting: Painting) => Promise<void>;
	reactionCount: QuizReactionCount;
	userReaction?: QuizReaction;
}
