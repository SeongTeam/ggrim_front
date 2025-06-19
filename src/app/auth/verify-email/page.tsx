import AuthFooter from '../../../components/auth/AuthFooter';
import { EmailVerificationForm } from '../../../components/auth/EmailVerificationForm';
import { AUTH_LOGIC_ROUTE } from '../../../route/auth/route';

// interface VerifyProps {
//     searchParams : Promise<{ [key: string] : string | string[] | undefined }>
//   }

export default async function Verify() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-black text-white">
			<div className="w-full max-w-md space-y-6 rounded-md bg-neutral-900 p-8 shadow-md">
				<h1 className="mb-6 text-3xl font-bold">Verify Email</h1>
				<EmailVerificationForm nextRoute={AUTH_LOGIC_ROUTE.SIGN_UP} />

				<AuthFooter state="VERIFY_EMAIL" />
			</div>
		</main>
	);
}
