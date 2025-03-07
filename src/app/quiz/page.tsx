import { findQuiz } from '../lib/api.backend';
import { QuizCardGrid } from '../../components/quiz/QuizCardGrid';
import { FindQuizResult } from '../lib/dto';

interface QuizListPageProps {
    page? : number
}

export default async function QuizListPage({ }: QuizListPageProps) {


    const findQuizResult : FindQuizResult = await findQuiz();

    return (
        <div>
            <QuizCardGrid findResult={findQuizResult} />
        </div>
    );
}
