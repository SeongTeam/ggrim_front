import AuthFooter from "../../../components/auth/AuthFooter";
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

  return (
    <main className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-black bg-opacity-75 p-8 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <SignInForm 
          formAction={signInAction}
          NextRoute={Array.isArray(prevRoute) ? prevRoute[0] : prevRoute} 
        />
        <AuthFooter state='SIGN_IN' />
      </div>
    </main>
  )
}
