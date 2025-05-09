import { EmailVerificationForm } from '../../../components/auth/EmailVerificationForm'



interface VerifyProps {
    searchParams : Promise<{ [key: string] : string | string[] | undefined }>
  }
  
  export default async function Verify({
    searchParams
  } : VerifyProps) {

  const nextRoute = (await searchParams).next ?? '/';
  const createAccountRoute = '';
  const forgotPasswordRoute = '';



  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-neutral-900 p-8 rounded-md shadow-md w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold mb-6">Verify Email</h1>
        <EmailVerificationForm 
            nextRoute={Array.isArray(nextRoute) ? nextRoute[0] : nextRoute}
        />

        <div className="flex justify-between">
          <p className="mt-4 text-sm text-gray-400">
            <a href={createAccountRoute} className="text-white hover:underline">Create Account</a>
          </p>
          <p className="mt-4 text-sm text-gray-400">
            <a href={forgotPasswordRoute} className="text-white hover:underline">Forgot Password</a>
          </p>
        </div>
      </div>
    </main>
  )
}
