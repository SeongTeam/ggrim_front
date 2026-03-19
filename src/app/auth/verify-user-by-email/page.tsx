import AuthFooter from "../../../components/auth/AuthFooter";
import { EmailForm } from "../../../components/auth/EmailForm";
import { ErrorModal } from "../../../components/modal/ErrorModal";
import { mailSecurityTokenAction } from "../../../server-action/backend/auth/api";
import { isSendOneTimeTokenPurpose } from "../../../server-action/backend/auth/util";

interface verifyUserByEmailProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyUserByEmail({ searchParams }: verifyUserByEmailProps) {
	const purpose = (await searchParams).purpose;

	if (!purpose || Array.isArray(purpose)) {
		return <ErrorModal message="wrong access" />;
	}

	if (!isSendOneTimeTokenPurpose(purpose)) {
		return <ErrorModal message="wrong access with wrong purpose" />;
	}

	const handleAction = async (email: string) => {
		"use server";
		return mailSecurityTokenAction({ purpose, email });
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-black text-white">
			<div className="w-full max-w-md space-y-6 rounded-md bg-neutral-900 p-8 shadow-md">
				<h1 className="mb-6 text-3xl font-bold">Verify User By Email</h1>
				<EmailForm emailFormAction={handleAction} />

				<AuthFooter state="VERIFY_USER_BY_EMAIL" />
			</div>
		</main>
	);
}
