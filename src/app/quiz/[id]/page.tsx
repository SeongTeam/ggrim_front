import { DetailQuiz } from '@/components/quiz/DetailQuiz'
import { getQuizAction } from '../../../server-action/backend/quiz/api';
import { isHttpException, isServerActionError } from '../../../server-action/backend/util';



interface QuizDetailPageProps {
    params: { id: string };
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
    const quizID = params.id;

    const response = await getQuizAction(quizID);

    if(isServerActionError(response)){
        throw new Error(response.message);
    }
    else if(isHttpException(response)){
        const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
        throw new Error(errorMessage);
    }

    return (
        <div>
            <DetailQuiz quiz={response} />
        </div>
    );
}
