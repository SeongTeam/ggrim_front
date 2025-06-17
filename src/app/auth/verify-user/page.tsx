import { SignInForm } from "../../../components/auth/SignInForm";
import { generateSecurityTokenAction } from "../../../server-action/backend/auth/api";
import { ONE_TIME_TOKEN_PURPOSE } from "../../../server-action/backend/auth/type";
import { ErrorModal } from "../../../components/modal/ErrorModal";
import AuthFooter from "../../../components/auth/AuthFooter";
import { AUTH_LOGIC_ROUTE } from "../../../route/auth/route";



interface VerifyUserProps {
  searchParams : Promise<{ [key: string] : string | string[] | undefined }>
}


export default async function VerifyUser({
  searchParams
} : VerifyUserProps) {

  const purpose = (await searchParams).purpose;
  let nextRoute = '/auth';

  // TODO Modal??? 무엇을 사용해야지 Server component에서 에러 메세지를 출력할 수 있을까?
  if(Array.isArray(purpose) || !purpose){
    return <ErrorModal message="invalid access" />
  }


  switch(purpose){

    case ONE_TIME_TOKEN_PURPOSE.UPDATE_PASSWORD : 
        nextRoute = AUTH_LOGIC_ROUTE.UPDATE_PASSWORD;
        break;
    case ONE_TIME_TOKEN_PURPOSE.DELETE_ACCOUNT :
        nextRoute = AUTH_LOGIC_ROUTE.DELETE_ACCOUNT
        break;
    default : 
      return <ErrorModal message="invalid query" />
  }

  const handleFormAction = async (id: string, password : string)=>{
    'use server'
    return generateSecurityTokenAction(id,password,{purpose })
  }




  // TODO 브라우저 쿠키 ID와 PW 미적용해야함

  return (
    <main className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-black bg-opacity-75 p-8 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Verify User</h1>
        <SignInForm 
          formAction={handleFormAction}
          NextRoute={nextRoute} 
        />
        <AuthFooter state='VERIFY_EMAIL' />
      </div>
    </main>
  )
}
