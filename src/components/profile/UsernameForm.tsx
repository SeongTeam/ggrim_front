"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GuideModal } from "../modal/GuideModal";
import { isServerActionError } from "../../server-action/backend/_common/util";

interface UsernameFormProps {
	NextRoute: string;
	submitHandler: (username: string) => Promise<void>;
	initialValue?: string;
}

const UpdateUsernameForm = ({ NextRoute, submitHandler, initialValue }: UsernameFormProps) => {
	const [username, setUsername] = useState(initialValue || "");
	const [success, setSuccess] = useState("");
	const router = useRouter();

	const successHandler = () => {
		router.push(NextRoute);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (initialValue?.trim() && initialValue === username) {
			toast.error("username is not changed");
			return;
		}

		try {
			await toast.promise(submitHandler(username), {
				loading: `Verifying ...`,
			});
			setSuccess("success task");
			router.refresh();
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
		<>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="w-full rounded bg-gray-800 px-4 py-2 text-white"
				/>
				<button
					type="submit"
					className="w-full rounded bg-red-600 px-4 py-2 font-semibold text-white"
				>
					Submit
				</button>
			</form>
			{success && <GuideModal message={success} onClickNext={successHandler} />}
		</>
	);
};

export default UpdateUsernameForm;
