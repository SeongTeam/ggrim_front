"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import toast from "react-hot-toast";
import { ServerActionResult } from "../../server-action/client/type";

export interface SignInFormProps {
	formAction: (email: string, password: string) => Promise<ServerActionResult<void>>;
	NextRoute: string;
}

export const SignInForm = ({ formAction, NextRoute }: SignInFormProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSignIn = async (e: React.SubmitEvent) => {
		e.preventDefault();

		const result = await formAction(email, password);
		if (result.ok) {
			toast.success("success");
			router.push(NextRoute);
		} else {
			toast.error(result.message);
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
