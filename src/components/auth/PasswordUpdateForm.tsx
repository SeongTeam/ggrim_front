"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import toast from "react-hot-toast";

export interface PasswordUpdateFormProps {
	formAction: (password: string) => Promise<boolean>;
	NextRoute: string;
}

export const PasswordUpdateForm = ({ formAction, NextRoute }: PasswordUpdateFormProps) => {
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password.trim() !== passwordRepeat.trim()) {
			toast.error("password is not matched");
			return;
		}

		try {
			await formAction(password);
			toast.success("success");
			router.push(NextRoute);
		} catch (error) {
			if (!isServerActionError(error)) {
				toast.error("An unexpected error occurred. Please try again later.");
				throw error;
			}
			if (error.status === "clientError") {
				toast.error(JSON.stringify(error.cause, null, 2));
			} else {
				toast.error(error.message);
			}
		}
	};

	return (
		<div>
			<form onSubmit={handleSignIn} className="flex flex-col gap-4">
				<input
					type="password"
					placeholder="Password"
					className="rounded bg-gray-800 p-3 text-white placeholder-gray-400"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Repeat Password"
					className="rounded bg-gray-800 p-3 text-white placeholder-gray-400"
					value={passwordRepeat}
					onChange={(e) => setPasswordRepeat(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="rounded bg-red-600 p-3 font-semibold transition hover:bg-red-700"
				>
					Update password
				</button>
			</form>
		</div>
	);
};
