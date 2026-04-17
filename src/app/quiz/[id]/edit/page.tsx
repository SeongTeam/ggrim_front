import { ErrorModal } from "../../../../components/modal/ErrorModal";
import { QuizForm } from "../../../../components/quiz/form/QuizForm";
import { getQuizAction } from "../../../../server-action/backend/quiz/api";
import { getSignInResponse } from "../../../../server-action/backend/_common/cookie";

interface QuizEditPageProps {
	params: Promise<{ id: string }>;
}

export default async function QuizEditPage(props: QuizEditPageProps) {
	const params = await props.params;
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
	const [signInResponse, quizActionResult] = await Promise.all([
		getSignInResponse(),
		getQuizAction(id),
	]);

	if (!signInResponse) {
		return { message: "Need to Sign In" };
	}
	if (!quizActionResult.ok) {
		return { message: quizActionResult.message };
	}
	const { quiz } = quizActionResult.data;
	const { user } = signInResponse;

	if (quiz.owner.id !== user.id) {
		return { message: "No Authorized to edit" };
	}
	return { quiz };
};
