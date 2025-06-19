'use client';

import { useState } from 'react';
import { requestVerificationAction, verifyEmailAction } from '../../server-action/backend/auth/api';
import { isHttpException, isServerActionError } from '../../server-action/backend/common/util';
import { HTTP_STATUS } from '../../server-action/backend/common/status';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface EmailVerificationForm {
	nextRoute: string;
}

export const EmailVerificationForm = ({ nextRoute }: EmailVerificationForm) => {
	const [email, setEmail] = useState('');
	const [isPinCodeSent, setIsPinCodeSent] = useState(false);
	const [pin, setPin] = useState('');
	const router = useRouter();

	const handleVerifyEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await toast.promise(requestVerificationAction({ email }), {
			loading: `Verifying ...`,
		});
		if (isServerActionError(response)) {
			throw new Error(response.message);
		} else if (isHttpException(response)) {
			const { statusCode } = response;
			const errorMessage = Array.isArray(response.message)
				? response.message.join('\n')
				: response.message;

			switch (statusCode) {
				case HTTP_STATUS.FORBIDDEN:
				case HTTP_STATUS.UNAUTHORIZED:
				case HTTP_STATUS.BAD_REQUEST:
					toast.error(errorMessage);
					break;
				default:
					throw new Error(`${response.statusCode}\n` + errorMessage);
			}
		} else if (response === true) {
			setIsPinCodeSent(true);
			toast.success('check your email');
		} else {
			toast.error('invalid access');
		}
	};

	const handleVerifyPinCode = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await verifyEmailAction({ email, pinCode: pin });
		if (isServerActionError(response)) {
			throw new Error(response.message);
		} else if (isHttpException(response)) {
			const { statusCode } = response;
			const errorMessage = Array.isArray(response.message)
				? response.message.join('\n')
				: response.message;

			switch (statusCode) {
				case HTTP_STATUS.FORBIDDEN:
				case HTTP_STATUS.UNAUTHORIZED:
				case HTTP_STATUS.BAD_REQUEST:
					toast.error(errorMessage);
					break;
				default:
					throw new Error(`${response.statusCode}\n` + errorMessage);
			}
		} else {
			toast.success('success verification');
			router.push(nextRoute);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<form onSubmit={handleVerifyEmail} className="flex space-x-4">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isPinCodeSent}
					required
					className="w-full px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50 disabled:bg-[#222] disabled:cursor-not-allowed
            border border-transparent focus:outline-none"
				/>
				<button
					type="submit"
					className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold disabled:text-gray-300  disabled:bg-[#555] disabled:cursor-not-allowed disabled:hover:bg-[#555] "
					disabled={isPinCodeSent}
				>
					Send
				</button>
			</form>
			<form onSubmit={handleVerifyPinCode} className="flex space-x-4">
				<input
					type="text"
					disabled={!isPinCodeSent}
					maxLength={8}
					placeholder="PinCode"
					value={pin}
					onChange={(e) => setPin(e.target.value)}
					className="w-full px-4 py-2 rounded bg-gray-800 text-white tracking-widest disabled:opacity-50 disabled:bg-[#222] disabled:cursor-not-allowed border border-transparent focus:outline-none"
				/>
				<button
					type="submit"
					className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold disabled:bg-[#555] disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-[#555]"
					disabled={!isPinCodeSent}
				>
					Verify
				</button>
			</form>
		</div>
	);
};
