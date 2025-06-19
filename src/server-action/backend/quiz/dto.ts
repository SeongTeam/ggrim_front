import { Quiz, QuizType, ShortQuiz } from './type';
import { QuizReaction, QuizStatus } from './type';
export interface CreateQuizDTO {
	answerPaintingIds: string[];

	distractorPaintingIds: string[];

	examplePaintingId?: string;

	title: string;

	timeLimit: number;

	type: QuizType;

	description: string;
}

export class QuizReactionDTO {
	type!: QuizReaction;
}

export interface QuizContextDTO {
	artist?: string;
	tag?: string;
	style?: string;
	page: number;
}

export interface ResponseQuizDTO {
	shortQuiz: ShortQuiz;
	status: QuizStatus;
}

export interface QuizSubmitDTO {
	isCorrect: boolean;
}

export interface QuizReactionCount {
	likeCount: number;
	dislikeCount: number;
}

export interface DetailQuizDTO {
	quiz: Quiz;
	reactionCount: QuizReactionCount;
	userReaction?: QuizReaction;
}
