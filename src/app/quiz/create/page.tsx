import ErrorModal from "../../../components/ErrorModal";
import QuizForm from "../../../components/quiz/QuizForm";
import { getSignInInfo } from "../../../server-action/backend/cookie";

export default async function QuizCreatePage(){

    const user = await getSignInInfo();

    if(!user){
        return <ErrorModal message="Need to Sign In" />
    }

    return(
    <div className="mt-10">
        <QuizForm />
     </div>
    );
}