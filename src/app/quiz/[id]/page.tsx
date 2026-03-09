import { DetailQuiz } from "@/components/quiz/DetailQuiz";
import { getQuizAction } from "../../../server-action/backend/quiz/api";
import { getSignInResponse } from "../../../server-action/backend/_common/cookie";

interface QuizDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function QuizDetailPage(props: QuizDetailPageProps) {
    const params = await props.params;
    const quizID = params.id;

    const [quizActionResponse, signInResponse] = await Promise.all([
		getQuizAction(quizID),
		getSignInResponse(),
	]);

    const isOwnerAccess = signInResponse?.user
		? quizActionResponse.quiz.owner.id === signInResponse.user.id
		: false;

    return (
		<div>
			<DetailQuiz detailQuizDTO={quizActionResponse} isOwnerAccess={isOwnerAccess} />
		</div>
	);
}
