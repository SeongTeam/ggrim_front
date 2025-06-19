import AuthFooter from '../../../components/auth/AuthFooter';
import UpdateUsernameForm from '../../../components/profile/UsernameForm';
import { getSignInInfo } from '../../../server-action/backend/common/cookie';
import { AUTH_LOGIC_ROUTE } from '../../../route/auth/route';
import { redirect } from 'next/navigation';
import { updateUserUsernameAction } from '../../../server-action/backend/user/api';

//TODO : 로그인 페이지 개선
// - [ ] 회원가입 및 비밀번호 찾기 라우팅 로직 적용하기
export default async function UpdateUsername() {
	const userInfo = await getSignInInfo();

	if (!userInfo) {
		redirect(AUTH_LOGIC_ROUTE.SIGN_IN);
	}

	const submitHandler = async (username: string) => {
		'use server';
		return updateUserUsernameAction({ username });
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-cover bg-center">
			<div className="w-full max-w-md rounded-md bg-black bg-opacity-75 p-8">
				<h1 className="mb-6 text-3xl font-bold">Update Username</h1>
				<UpdateUsernameForm
					NextRoute={'/'}
					submitHandler={submitHandler}
					initialValue={userInfo.username}
				/>
				<AuthFooter state="UPDATE_PASSWORD" />
			</div>
		</main>
	);
}
