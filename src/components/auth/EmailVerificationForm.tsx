"use client";

import { useState } from "react";
import { sendPinCodeAction, verifyPinCodeAction } from "../../server-action/backend/auth/api";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
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

		const result = await toast.promise(sendPinCodeAction({ email }), {
			loading: `Verifying ...`,
		});
		if (result.ok) {
			setIsPinCodeSent(true);
			toast.success("check your email");
		} else {
			toast.error(result.message);
		}
	};

	const handleVerifyPinCode = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await verifyPinCodeAction({ email, pinCode: pin });
		if (result.ok) {
			toast.success("success verification");
			router.push(nextRoute);
		} else {
			toast.error(result.message);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<form onSubmit={handleVerifyEmail} className="flex flex-col gap-4">
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
					className="rounded bg-red-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-gray-300 disabled:hover:bg-[#555]"
					disabled={isPinCodeSent}
				>
					Send
				</button>
			</form>
			<form onSubmit={handleVerifyPinCode} className="flex flex-col gap-4">
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
