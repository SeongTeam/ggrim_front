import { QuizCardGrid } from "../../components/quiz/QuizCardGrid";
import { getQuizListAction } from "../../server-action/backend/quiz/api";

export default async function QuizListPage() {
	const { quizList } = await fetchQuizListData();

	return (
		<div className="pt-2">
			<QuizCardGrid findResult={quizList} />
		</div>
	);
}

const fetchQuizListData = async () => {
	try {
		const quizList = await getQuizListAction();

		return { quizList };
	} catch (error) {
		throw error;
	}
};
