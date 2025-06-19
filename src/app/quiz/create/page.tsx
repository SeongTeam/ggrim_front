import { ErrorModal } from '../../../components/modal/ErrorModal';
import { QuizForm } from '../../../components/quiz/QuizForm';
import { getSignInInfo } from '../../../server-action/backend/common/cookie';

export default async function QuizCreatePage() {
	const user = await getSignInInfo();

	if (!user) {
		return <ErrorModal message="Need to Sign In" />;
	}

	return (
		<div className="mt-10 pt-10 sm:px-10 lg:px-40">
			<div className="bg-zinc-800 pt-10 rounded-lg">
				<h2 className="text-2xl font-bold mb-6 text-center text-white">Create Quiz</h2>
				<QuizForm />
			</div>
		</div>
	);
}
