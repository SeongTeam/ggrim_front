import AuthFooter from "../../../components/auth/AuthFooter";
import { PasswordUpdateForm } from "../../../components/auth/PasswordUpdateForm";
import { updateUserPWAction } from "../../../server-action/backend/user/api";

interface ForgetPasswordProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

//TODO : 로그인 페이지 개선
// - [ ] 회원가입 및 비밀번호 찾기 라우팅 로직 적용하기
export default async function UpdatePassword({}: ForgetPasswordProps) {
	const handleAction = async (password: string) => {
		"use server";
		return updateUserPWAction({ password });
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-cover bg-center">
			<div className="w-full max-w-md rounded-md bg-black bg-opacity-75 p-8">
				<h1 className="mb-6 text-3xl font-bold">Update Password</h1>
				<PasswordUpdateForm formAction={handleAction} NextRoute={"/"} />
				<AuthFooter state="UPDATE_PASSWORD" />
			</div>
		</main>
	);
}
