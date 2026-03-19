import { QuizCardGrid } from "../../components/quiz/QuizCardGrid";
import { getQuizListAction } from "../../server-action/backend/quiz/api";

export default async function QuizListPage() {
	const result = await getQuizListAction();

	if (!result.ok) {
		throw new Error(result.message);
	}

	return (
		<div className="pt-2">
			<QuizCardGrid findResult={result.data} />
		</div>
	);
}
