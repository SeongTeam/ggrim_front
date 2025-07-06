import { ErrorModal } from "../../../../components/modal/ErrorModal";
import { QuizForm } from "../../../../components/quiz/QuizForm";
import { getSignInInfo } from "../../../../server-action/backend/_common/cookie";
import { getQuizAction } from "../../../../server-action/backend/quiz/api";
import {
	isHttpException,
	isServerActionError,
} from "../../../../server-action/backend/_common/util";

interface QuizEditPageProps {
	params: { id: string };
}

export default async function QuizEditPage({ params }: QuizEditPageProps) {
	const [user, response] = await Promise.all([getSignInInfo(), getQuizAction(params.id)]);

	if (!user) {
		return <ErrorModal message="Need to Sign In" />;
	}

	if (isServerActionError(response)) {
		throw new Error("unstable Situation");
	} else if (isHttpException(response)) {
		return <ErrorModal message="Can't Find Quiz" />;
	}
	const quiz = response.quiz;

	if (quiz.owner_id !== user.id) {
		return <ErrorModal message="No Authorized to edit" />;
	}

	return (
		<div className="mt-10 px-40 pt-10">
			<div className="rounded-lg bg-zinc-800 pt-10">
				<h2 className="mb-6 text-center text-2xl font-bold text-white">Edit Quiz</h2>
				<QuizForm quiz={quiz} />
			</div>
		</div>
	);
}
