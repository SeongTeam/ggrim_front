import { ErrorModal } from "../../../../components/modal/ErrorModal";
import { QuizForm } from "../../../../components/quiz/QuizForm";
import { getQuizAction } from "../../../../server-action/backend/quiz/api";
import { getSignInResponse } from "../../../../server-action/backend/_common/cookie";
import {
	createServerActionError,
	isServerActionError,
} from "../../../../server-action/backend/_common/util";

interface QuizEditPageProps {
	params: { id: string };
}

export default async function QuizEditPage({ params }: QuizEditPageProps) {
	const { quiz, message } = await fetchQuizEditData(params.id);

	if (message) {
		return <ErrorModal message={message} />;
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

const fetchQuizEditData = async (id: string) => {
	try {
		const [signInResponse, quizActionResponse] = await Promise.all([
			getSignInResponse(),
			getQuizAction(id),
		]);

		if (!signInResponse) {
			throw createServerActionError("clientError", "Need to Sign In");
		}
		const { quiz } = quizActionResponse;
		const { user } = signInResponse;

		if (quiz.owner.id !== user.id) {
			throw createServerActionError("clientError", "No Authorized to edit");
		}
		return { quiz };
	} catch (error) {
		if (!isServerActionError(error)) {
			throw error;
		}

		if (error.status === "clientError") {
			return { message: JSON.stringify(error.cause) };
		} else {
			return { message: error.message };
		}
	}
};
