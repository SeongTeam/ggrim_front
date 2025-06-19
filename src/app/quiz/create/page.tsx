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
			<div className="rounded-lg bg-zinc-800 pt-10">
				<h2 className="mb-6 text-center text-2xl font-bold text-white">Create Quiz</h2>
				<QuizForm />
			</div>
		</div>
	);
}
