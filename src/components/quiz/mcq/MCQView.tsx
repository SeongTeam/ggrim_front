// main component for the reader's mcq interface

import React, { useReducer, useState } from "react";
import useMCQReader from "./reader/useMCQReader";
import { ErrorMessage } from "./shared";
import SubmissionFeedback from "./reader/parts/SubmissionFeedback";
import { motion } from "framer-motion";
import { MCQReaderViewProps } from "./type";
import {
	addQuizReactionsAction,
	deleteQuizReactionAction,
} from "../../../server-action/backend/quiz/api";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import toast from "react-hot-toast";
import { ErrorModal } from "../../modal/ErrorModal";
import Image from "next/image";
import { QUIZ_REACTION, ShowQuizReactionCount } from "../../../generated/dto-types";

interface ReactionState {
	like: number;
	dislike: number;
	userReaction?: QUIZ_REACTION;
}

type Action = { type: "SET_LIKE" } | { type: "SET_DISLIKE" } | { type: "RESET_REACTION" };

function reducer(state: ReactionState, action: Action): ReactionState {
	switch (action.type) {
		case "SET_LIKE": {
			const next = { ...state };
			next.like += 1;
			next.userReaction = QUIZ_REACTION.like;
			return next;
		}
		case "SET_DISLIKE":
			const next = { ...state };
			next.dislike += 1;
			next.userReaction = QUIZ_REACTION.dislike;
			return next;

		case "RESET_REACTION": {
			const next = { ...state };
			if (state.userReaction === QUIZ_REACTION.like) {
				next.userReaction = undefined;
				next.like -= 1;
			} else if (state.userReaction === QUIZ_REACTION.dislike) {
				next.dislike -= 1;
				next.userReaction = undefined;
			}
			return next;
		}
		default:
			return state;
	}
}

const initializeState = (reactionCount: ShowQuizReactionCount, userReaction?: QUIZ_REACTION) => {
	return {
		like: reactionCount.likeCount,
		dislike: reactionCount.dislikeCount,
		userReaction,
	};
};

const MCQView = ({
	mcq,
	handelNextMCQ,
	handleImageSelected,
	userReaction,
	reactionCount,
}: MCQReaderViewProps) => {
	// TODO: <MCQView /> 개선
	// - [x] mcq 타입 이름 리팩 토링
	// - [x]useMCQReader 훅 점검 및 리팩토링
	// - [x]퀴즈 틀렸을 경우와 맞았을 경우 동작 설계하기
	// - [ ] <MCQView /> 모듈로 나누기
	// - [ ] <MCQView /> 리팩토링하여 가독성 높이기
	// - [ ] display size 마다 minHeight을 정하여 깜빡임 형상 방지 (모바일 크기만 신경쓰면 됨)
	// - [ ] component 와 custom hook 폴더 구조 정리하기
	// - [ ] 시간 제한 추가하기
	// - [x] backend에서 맞힌 횟수와 틀린 횟수 카운팅하기
	// ! 주의: <경고할 사항>
	// ? 질문: 각각의 mcq 데이터의 title 필드를 사용해야하는가?
	// * 참고: <관련 정보나 링크>
	const { answerPaintings } = mcq;
	const [reaction, dispatch] = useReducer(reducer, initializeState(reactionCount, userReaction));
	const [error, setError] = useState("");

	const callReactionServerAction = async (type: QUIZ_REACTION) => {
		try {
			await addQuizReactionsAction(mcq.id, { type });
		} catch (error) {
			if (!isServerActionError(error)) {
				toast.error("An unexpected error occurred. Please try again later.");
				throw error;
			}

			if (error.status === "clientError") {
				setError(JSON.stringify(error.cause, null, 2));
			} else {
				toast.error(error.message);
			}
		}
	};

	const handleLike = async () => {
		const prevReaction: QUIZ_REACTION | undefined = reaction.userReaction;
		dispatch({ type: "RESET_REACTION" });
		if (prevReaction === "like") {
			await deleteQuizReactionAction(mcq.id);
		} else {
			dispatch({ type: "SET_LIKE" });
			await callReactionServerAction(QUIZ_REACTION.like);
		}
	};

	const handleDisLike = async () => {
		const prevReaction: QUIZ_REACTION | undefined = reaction.userReaction;
		dispatch({ type: "RESET_REACTION" });
		if (prevReaction === "dislike") {
			await deleteQuizReactionAction(mcq.id);
		} else {
			dispatch({ type: "SET_DISLIKE" });
			await callReactionServerAction(QUIZ_REACTION.dislike);
		}
	};

	const {
		errorMessage,
		readerSelectedAnswer,
		isSubmitted,
		isCorrect,
		displayPaintings,
		handleReaderSelectAnswer,
		handleSubmit,
		handleClearSubmission,
	} = useMCQReader(mcq, 0);

	const answerKey = answerPaintings[0].id;

	const handleImageClick = (answerId: string) => {
		if (!isSubmitted) {
			// setSelectedIndex(index);
			handleReaderSelectAnswer(answerId);
		}
	};

	const handleSubmitImage = () => {
		const selectedPainting = displayPaintings.find((p) => p.id === readerSelectedAnswer);
		if (handleImageSelected && selectedPainting) {
			handleImageSelected(selectedPainting);
		}
		handleSubmit();
	};

	const getCardClasses = (paintingId: string) => {
		if (isSubmitted) {
			return paintingId === answerKey ? "bg-green-300" : "bg-red-300";
		}
		return "bg-white";
	};

	const getBorderClasses = (paintingId: string) =>
		readerSelectedAnswer === paintingId
			? "border-4 border-primary"
			: "border-transparent border-4 ";

	const getImageClasses = (paintingId: string) =>
		readerSelectedAnswer === paintingId ? "ring-4 ring-primary" : "ring-4 ring-transparent";

	return (
		<div>
			<motion.div
				key={mcq.id}
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -50 }}
				// transition={{ duration: 1.0 }}
				transition={{
					duration: 0.7, // 애니메이션이 총 걸리는 시간
					delay: 0.3, // 처음 애니메이션 delay
					delayChildren: 0.3,
				}}
			>
				{errorMessage && <ErrorMessage message={errorMessage} />}
				<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
					{displayPaintings.map(({ id, image_url, width, height }, index) => (
						<div
							key={id}
							className={`flex flex-col items-center rounded-md p-4 shadow-md ${getCardClasses(id)} ${getBorderClasses(id)}`}
							onClick={() => handleImageClick(id)}
						>
							<Image
								src={image_url}
								alt={`Answer ${index}`}
								width={width}
								height={height}
								priority={true}
								className={`mb-2 h-[250px] w-auto md:h-[350px] xl:h-[500px] ${getImageClasses(id)}`}
							/>
						</div>
					))}
				</div>
			</motion.div>
			<div className="flex items-center justify-end">
				<SubmissionFeedback
					isCorrect={isCorrect}
					isSubmitted={isSubmitted}
					handleSubmit={handleSubmitImage}
					handleClearSubmission={handleClearSubmission}
					handleNextMCQ={handelNextMCQ}
					showHintButton={false}
					toggleDislike={handleDisLike}
					toggleLike={handleLike}
					likeCount={reaction.like}
					dislikeCount={reaction.dislike}
					liked={reaction.userReaction !== undefined && reaction.userReaction === "like"}
					disliked={
						reaction.userReaction !== undefined && reaction.userReaction === "dislike"
					}
				/>
			</div>
			{error && <ErrorModal message={error} />}
		</div>
	);
};

export default MCQView;
