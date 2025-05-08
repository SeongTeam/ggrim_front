import { SignInForm } from "../../../components/auth/SignInForm";
import { signInAction } from "../../../server-action/backend/auth/api";


interface SignInProps {
  searchParams : Promise<{ [key: string] : string | string[] | undefined }>
}

//TODO : 로그인 페이지 개선
// - [ ] 회원가입 및 비밀번호 찾기 라우팅 로직 적용하기
export default async function SignIn({
  searchParams
} : SignInProps) {

  const prevRoute = (await searchParams).prev ?? '/';
  const createAccountRoute = '';
  const forgotPasswordRoute = '';

  return (
    <main className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-black bg-opacity-75 p-8 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <SignInForm 
          formAction={signInAction}
          NextRoute={Array.isArray(prevRoute) ? prevRoute[0] : prevRoute} 
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
