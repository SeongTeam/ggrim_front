import { DetailQuiz } from '@/components/quiz/DetailQuiz'
import { Quiz } from '../../../model/interface/quiz';
import { getQuiz } from '../../../api/api.backend';

interface QuizDetailPageProps {
    params: { id: string };
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
    const quizID = params.id;

    const quiz: Quiz = await getQuiz(quizID);

    return (
        <div>
            <DetailQuiz quiz={quiz} />
        </div>
    );
}
