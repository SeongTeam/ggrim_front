"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { isHttpException, isServerActionError } from "../../server-action/backend/common/util";
import { HTTP_STATUS } from "../../server-action/backend/common/status";
import { HttpException, ServerActionError } from "../../server-action/backend/common/dto";

interface EmailFormProp {
	emailFormAction: (email: string) => Promise<boolean | ServerActionError | HttpException>;
}

export const EmailForm = ({ emailFormAction }: EmailFormProp) => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await toast.promise(emailFormAction(email), {
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
			toast.success("success");
		} else {
			toast.error("invalid access");
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
