import AuthFooter from '../../../components/auth/AuthFooter';
import { EmailVerificationForm } from '../../../components/auth/EmailVerificationForm'
import { AUTH_LOGIC_ROUTE } from '../route';



// interface VerifyProps {
//     searchParams : Promise<{ [key: string] : string | string[] | undefined }>
//   }
  
  export default async function Verify() {

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-neutral-900 p-8 rounded-md shadow-md w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold mb-6">Verify Email</h1>
        <EmailVerificationForm 
            nextRoute={AUTH_LOGIC_ROUTE.SIGN_UP}
        />

        <AuthFooter state='VERIFY_EMAIL' />
      </div>
    </main>
  )
}
