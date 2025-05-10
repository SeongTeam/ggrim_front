import EmailForm from '../../../components/auth/EmailForm';
import ErrorModal from '../../../components/ErrorModal';
import { sendSecurityTokenToEmailAction } from '../../../server-action/backend/auth/api';
import { isOnetimeTokenPurpose } from '../../../server-action/backend/auth/util';



interface verifyUserByEmailProps {
    searchParams : Promise<{ [key: string] : string | string[] | undefined }>
  }
  
  export default async function Verify({
    searchParams
  } : verifyUserByEmailProps) {

  const purpose = (await searchParams).purpose;
  const createAccountRoute = '';
  const signInRoute = '';

  
  if( !purpose || Array.isArray(purpose)
    ){
    return <ErrorModal message="wrong access"/>
  }

  if(!isOnetimeTokenPurpose(purpose)){
    return <ErrorModal  message="wrong access with wrong purpose"/>
  }


  const handleAction = async ( email : string ) =>{
    'use server'
    const response = await sendSecurityTokenToEmailAction({ purpose , email});
    return response;

  }



  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-neutral-900 p-8 rounded-md shadow-md w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold mb-6">Verify By Email</h1>
        <EmailForm  
            emailFormAction={handleAction}
        />

        <div className="flex justify-between">
          <p className="mt-4 text-sm text-gray-400">
            <a href={createAccountRoute} className="text-white hover:underline">Create Account</a>
          </p>
          <p className="mt-4 text-sm text-gray-400">
            <a href={signInRoute} className="text-white hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </main>
  )
}
