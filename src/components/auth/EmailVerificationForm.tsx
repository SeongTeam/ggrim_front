"use client";

import { useState } from "react";
import { requestVerificationAction, verifyEmailAction } from "../../server-action/backend/auth/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/_common/util";
import { HTTP_STATUS } from "../../server-action/backend/_common/status";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EmailVerificationForm {
	nextRoute: string;
}

export const EmailVerificationForm = ({ nextRoute }: EmailVerificationForm) => {
	const [email, setEmail] = useState("");
	const [isPinCodeSent, setIsPinCodeSent] = useState(false);
	const [pin, setPin] = useState("");
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
				? response.message.join("\n")
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
			toast.success("check your email");
		} else {
			toast.error("invalid access");
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
				? response.message.join("\n")
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
			toast.success("success verification");
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
					className="w-full rounded border border-transparent bg-gray-800 px-4 py-2 text-white focus:outline-none disabled:cursor-not-allowed disabled:bg-[#222] disabled:opacity-50"
				/>
				<button
					type="submit"
					className="w-full rounded bg-red-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-gray-300 disabled:hover:bg-[#555]"
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
					className="w-full rounded border border-transparent bg-gray-800 px-4 py-2 tracking-widest text-white focus:outline-none disabled:cursor-not-allowed disabled:bg-[#222] disabled:opacity-50"
				/>
				<button
					type="submit"
					className="w-full rounded bg-red-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-gray-300 disabled:hover:bg-[#555]"
					disabled={!isPinCodeSent}
				>
					Verify
				</button>
			</form>
		</div>
	);
};
