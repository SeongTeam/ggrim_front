"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { isServerActionError } from "../../server-action/backend/_common/util";

interface EmailFormProp {
	emailFormAction: (email: string) => Promise<void>;
}

export const EmailForm = ({ emailFormAction }: EmailFormProp) => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await toast.promise(emailFormAction(email), {
				loading: `Verifying ...`,
			});

			toast.success("success");
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
