"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isServerActionError } from "../../server-action/backend/_common/util";
import toast from "react-hot-toast";

export interface SignInFormProps {
	formAction: (email: string, password: string) => Promise<void>;
	NextRoute: string;
}

export const SignInForm = ({ formAction, NextRoute }: SignInFormProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await formAction(email, password);
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
					type="email"
					placeholder="Email"
					className="rounded bg-gray-800 p-3 text-white placeholder-gray-400"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="rounded bg-gray-800 p-3 text-white placeholder-gray-400"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="rounded bg-red-600 p-3 font-semibold transition hover:bg-red-700"
				>
					Sign In
				</button>
			</form>
		</div>
	);
};
