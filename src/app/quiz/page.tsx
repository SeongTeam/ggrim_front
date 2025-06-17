import { QuizCardGrid } from '../../components/quiz/QuizCardGrid';
import { getQuizListAction } from '../../server-action/backend/quiz/api';
import { isHttpException, isServerActionError } from '../../server-action/backend/common/util';



export default async function QuizListPage() {


    const response  = await getQuizListAction();

    if(isServerActionError(response)){
        throw new Error(response.message);
    }
    else if(isHttpException(response)){
        const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
        //TODO GET Method HTTP Exception 처리방법
        // 에러 팝업으로 에러메세지를 보여주고, Home으로 이동?
        throw new Error(errorMessage);
    }

    return (
        <div className='pt-2'>
            <QuizCardGrid findResult={response} />
        </div>
    );
}
