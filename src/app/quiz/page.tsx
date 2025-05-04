import { findQuiz } from '../../server-action/api.backend';
import { QuizCardGrid } from '../../components/quiz/QuizCardGrid';
import { FindQuizResult } from '../../server-action/dto';


export default async function QuizListPage() {


    const findQuizResult : FindQuizResult = await findQuiz();

    return (
        <div>
            <QuizCardGrid findResult={findQuizResult} />
        </div>
    );
}
