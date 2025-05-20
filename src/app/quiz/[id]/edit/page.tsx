import ErrorModal from "../../../../components/modal/ErrorModal";
import QuizForm from "../../../../components/quiz/QuizForm";
import { getSignInInfo } from "../../../../server-action/backend/cookie";
import { getQuizAction } from "../../../../server-action/backend/quiz/api";
import { isHttpException, isServerActionError } from "../../../../server-action/backend/util";


interface QuizEditPageProps {
    params: { id: string };
}


export default async function QuizEditPage({params} : QuizEditPageProps){

    const [user,response] = await Promise.all([getSignInInfo(),getQuizAction(params.id)]);

    if(!user){
        return <ErrorModal message="Need to Sign In" />
    }

    if(isServerActionError(response)){
        throw new Error('unstable Situation');
    }
    else if(isHttpException(response)){
        return <ErrorModal message="Can't Find Quiz" /> 
    }
    const quiz = response.quiz;

    if(quiz.owner_id !== user.id){
        return <ErrorModal message="No Authorized to edit" /> 
    }

    return(
    <div className="mt-10 pt-10 px-40">
        <div className="bg-zinc-800 pt-10 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
                Edit Quiz
            </h2>
            <QuizForm quiz={quiz}/>
        </div>
     </div>
    );
}