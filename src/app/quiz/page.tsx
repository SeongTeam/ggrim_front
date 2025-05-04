import { findQuiz } from '../../api/api.backend';
import { QuizCardGrid } from '../../components/quiz/QuizCardGrid';
import { FindQuizResult } from '../../api/dto';


export default async function QuizListPage() {


    const findQuizResult : FindQuizResult = await findQuiz();

    return (
        <div>
            <QuizCardGrid findResult={findQuizResult} />
        </div>
    );
}
