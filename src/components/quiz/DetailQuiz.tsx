"use client";
import MCQView from "@/components/quiz/mcq/MCQView";
import { MCQ } from "./mcq/type";

import { useRouter } from "next/navigation";
import {
	addQuizContextAction,
	scheduleQuizAction,
	submitQuizAction,
} from "../../server-action/backend/quiz/api";
import { QuizStatus } from "../../server-action/backend/quiz/type";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import { getPaintingAction } from "../../server-action/backend/painting/api";
import { getQuizStatus, saveQuizStatus } from "../../state/browser/quiz";
import { ErrorModal } from "../modal/ErrorModal";
import { QuizMenu } from "./QuizMenu";
import {
	DetailQuizResponse,
	QuizContextDto,
	ShowPainting,
	ShowPaintingResponse,
} from "../../generated/dto-types";
import toast from "react-hot-toast";
interface DetailQuizProps {
	detailQuizDTO: DetailQuizResponse;
	isOwnerAccess: boolean;
}

// TODO: <DetailQuiz/> 성능 개선
// - [x] localStorage 사용하여 quizContext 상태 저장하기
// - [x] localStorage 사용하여 quizContext 업데이트 로직 훅에 반영하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export const DetailQuiz = ({
	detailQuizDTO,
	isOwnerAccess,
}: DetailQuizProps): React.JSX.Element => {
	const { quiz, reactionCount, userReaction } = detailQuizDTO;
	const mcq: MCQ = {
		id: quiz.id,
		distractorPaintings: quiz.distractor_paintings,
		answerPaintings: quiz.answer_paintings,
		title: quiz.title,
		description: quiz.description,
		timeLimit: quiz.time_limit,
		type: quiz.type,
	};

	const router = useRouter();

	const handelNextMCQ = async () => {
		const status: QuizStatus | undefined = getQuizStatus();
		try {
			const { endIndex, currentIndex, context, shortQuiz } = await scheduleQuizAction(status);
			saveQuizStatus({ endIndex, currentIndex, context });
			router.push(`/quiz/${shortQuiz.id}`);
		} catch (error) {
			if (!isServerActionError(error)) {
				toast.error("An unexpected error occurred. Please try again later.");
				throw error;
			}
			if (error.status === "clientError") {
				toast.error(JSON.stringify(error.cause, null, 2));
			} else {
				toast.error(error.message);
			}
		}
	};

	// TODO: 그림 제출 로직 개선하기
	// - [ ] 백엔드에 제출된 그림 정보 전달하기
	//  -> 백엔드에서 정답 여부 토보
	//  -> 백엔드에서 제출된 그림정보로 스케줄링 업데이트
	//  -> 백엔드에서 퀴즈 관련 정보 업데이트
	// - [ ] <추가 작업>
	// ! 주의: <경고할 사항>
	// ? 질문: <의문점 또는 개선 방향>
	// * 참고: <관련 정보나 링크>
	const handleImageSelected = async (selectedPainting: ShowPainting) => {
		const isCorrect = mcq.answerPaintings[0].id === selectedPainting.id;
		await Promise.all([
			updatePaintingContext(selectedPainting.id),
			submitQuizAction(quiz.id, { isCorrect }),
		]);
	};

	if (quiz.type === "ONE_CHOICE") {
		return (
			<div className="rounded-md bg-ggrimBeige2 p-4 shadow" style={{ minHeight: "744px" }}>
				<div className="flex justify-between gap-2">
					<p className="mb-6 text-3xl font-bold text-black">{`${quiz.title}`}</p>
					<QuizMenu quiz={quiz} isOwner={isOwnerAccess} />
				</div>
				<MCQView
					mcq={mcq}
					handelNextMCQ={handelNextMCQ}
					handleImageSelected={handleImageSelected}
					userReaction={userReaction}
					reactionCount={reactionCount}
				/>
				;
			</div>
		);
	}

	return <ErrorModal message="Not implemented page" />;
};

const generateQuizContextDTO = (painting: ShowPaintingResponse): QuizContextDto => {
	const contextDTO: QuizContextDto = { artist: painting.showArtist.name, page: 0 };
	return contextDTO;
};

const updatePaintingContext = async (id: string) => {
	try {
		const detailPainting = await getPaintingAction(id);
		await addQuizContextAction(generateQuizContextDTO(detailPainting));
	} catch (error) {
		if (!isServerActionError(error)) {
			toast.error("An unexpected error occurred. Please try again later.");
			throw error;
		}
		if (error.status === "clientError") {
			toast.error(JSON.stringify(error.cause, null, 2));
		} else {
			toast.error(error.message);
		}
	}
};
