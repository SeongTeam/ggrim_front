import { DetailQuiz } from '@/components/quiz/DetailQuiz'
import { Quiz } from '../../../model/interface/quiz';
import { getQuiz } from '../../lib/api.backend';

interface QuizDetailPageProps {
    dynamicParams: { slug: string };
}

export default async function QuizDetailPage({ dynamicParams }: QuizDetailPageProps) {
    const quizID = dynamicParams.slug;

    const quiz: Quiz = await getQuiz(quizID);

    return (
        <div>
            <DetailQuiz quiz={quiz} />
        </div>
    );
}
