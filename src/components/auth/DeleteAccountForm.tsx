"use client";

import { useState, FormEvent } from "react";
import { deleteUserAction } from "../../server-action/backend/user/api";
import toast from "react-hot-toast";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";
import { GuideModal } from "../modal/GuideModal";
import { useRouter } from "next/navigation";
import { ErrorModal } from "../modal/ErrorModal";

interface DeleteAccountState {
	error: string;
	success: string;
	input: string;
}

const initState: DeleteAccountState = {
	error: "",
	success: "",
	input: "",
};

export const DeleteAccountForm = () => {
	const [state, setState] = useState(initState);
	const router = useRouter();

	// TODO : 계정 삭제 로직 개선하기
	// - [ ] 로그인 상태가 아니면 로그인으로 이동시키기
	// - [ ] 로그인 상태인 경우, 사용자 이름 입력하도록 하기

	//   const username = 'test-user';
	//   const expectedPhrase = `Delete Account ${username}`;

	const expectedPhrase = `Delete Account`;

	const handleSuccess = () => {
		router.push("/");
	};

	const handleError = async () => {
		router.push("/");
	};

	const handleStateChange = (key: keyof DeleteAccountState, value: string) => {
		setState((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (state.input !== expectedPhrase) {
			toast.error("The phrase does not match. Please try again.");
			return;
		}
		try {
			await deleteUserAction();
			setState((prev) => ({ ...prev, success: `Success Delete Account` }));
		} catch (error) {
			if (!isServerActionError(error)) {
				toast.error("An unexpected error occurred. Please try again.");
				throw error;
			}

			if (error.status === "clientError") {
				setState((prev) => ({ ...prev, error: JSON.stringify(error.cause) }));
			} else {
				toast.error(error.message);
			}
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<label className="text-sm text-zinc-400">
					To confirm, type{" "}
					<span className="font-semibold text-red-500">{expectedPhrase}</span>
				</label>
				<input
					type="text"
					className="rounded border border-zinc-700 bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
					placeholder="Type here..."
					value={state.input}
					onChange={(e) => handleStateChange("input", e.target.value)}
				/>
				<button
					type="submit"
					className="rounded bg-red-600 py-2 font-semibold text-white transition-colors hover:bg-red-700"
				>
					Delete My Account
				</button>
			</form>
			{state.success && <GuideModal message={state.success} onClickNext={handleSuccess} />}
			{state.error && <ErrorModal message={state.error} onClose={handleError} />}
		</div>
	);
};
