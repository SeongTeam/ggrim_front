"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import { ServerActionResult } from "../../server-action/client/type";

interface EmailFormProp {
	emailFormAction: (email: string) => Promise<ServerActionResult<void>>;
}

export const EmailForm = ({ emailFormAction }: EmailFormProp) => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await toast.promise(emailFormAction(email), {
			loading: `Verifying ...`,
		});
		if (result.ok) {
			toast.success("success");
		} else {
			toast.error(result.message);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="w-full rounded bg-gray-800 px-4 py-2 text-white"
			/>
			<button
				type="submit"
				className="w-full rounded bg-red-600 px-4 py-2 font-semibold text-white"
			>
				Send
			</button>
		</form>
	);
};
