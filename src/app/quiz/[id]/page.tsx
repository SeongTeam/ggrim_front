import { DetailQuiz } from '@/components/quiz/DetailQuiz'
import { getQuizAction } from '../../../server-action/backend/quiz/api';
import { isHttpException, isServerActionError } from '../../../server-action/backend/common/util';
import { getSignInInfo } from '../../../server-action/backend/common/cookie';



interface QuizDetailPageProps {
    params: { id: string };
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
    const quizID = params.id;

    const [response,user] = await Promise.all( [getQuizAction(quizID),getSignInInfo()]);
    if(isServerActionError(response)){
        throw new Error(response.message);
    }
    else if(isHttpException(response)){
        const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
        throw new Error(errorMessage);
    }

    const isOwnerAccess = user !== undefined ?  
                            response.quiz.owner_id === user.id :
                            false;


    return (
        <div>
            <DetailQuiz detailQuizDTO={response} isOwnerAccess={isOwnerAccess} />
        </div>
    );
}
