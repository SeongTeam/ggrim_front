// app/auth/callback/page.tsx
"use client";

import { useReducer } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { isOnetimeTokenPurpose } from "../../../../server-action/backend/auth/util";
import { generateSecurityTokenByEmailVerificationAction } from "../../../../server-action/backend/auth/api";
import { ErrorModal } from "../../../../components/modal/ErrorModal";
import { GuideModal } from "../../../../components/modal/GuideModal";
import { AUTH_LOGIC_ROUTE } from "../../../../route/auth/route";
import { ONE_TIME_TOKEN_PURPOSE } from "../../../../generated/dto-types";
import { isServerActionError } from "@/server-action/backend/_common/serverActionError";

interface AuthenticateState {
	errorMessage: string;
	purpose: string;
	successMessage: string;
}

function isError(state: AuthenticateState) {
	return state.errorMessage.trim().length !== 0;
}

function isSuccess(state: AuthenticateState) {
	return state.successMessage.trim().length !== 0;
}

function isInit(state: AuthenticateState) {
	return !(isError(state) || isSuccess(state));
}

type Action =
	| { type: "SUCCESS"; message: string }
	| { type: "ERROR"; message: string }
	| { type: "SET_PURPOSE"; purpose: string };

function reducer(state: AuthenticateState, action: Action): AuthenticateState {
	switch (action.type) {
		case "SUCCESS":
			return { ...state, successMessage: action.message, errorMessage: "" };
		case "ERROR":
			return { ...state, errorMessage: action.message, successMessage: "" };
		case "SET_PURPOSE":
			return { ...state, purpose: action.purpose };
		default:
			return state;
	}
}

export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, dispatch] = useReducer(reducer, {
		errorMessage: "",
		purpose: "",
		successMessage: "",
	});
	const homeRoute = "/";

	const handleError = () => {
		router.push(homeRoute);
	};

	const handleSuccess = () => {
		switch (state.purpose) {
			case ONE_TIME_TOKEN_PURPOSE.update_password:
				router.push(AUTH_LOGIC_ROUTE.UPDATE_PASSWORD);
				break;
			case ONE_TIME_TOKEN_PURPOSE.recover_account:
			default:
				toast.error("sorry. not implement ");
		}
	};

	const handleVerify = async () => {
		const token = searchParams.get("token");
		const identifier = searchParams.get("identifier");
		const purpose = searchParams.get("purpose");

		if (!token || !identifier || !purpose || !isOnetimeTokenPurpose(purpose)) {
			toast.error("wrong access with wrong query");
			return;
		}
		dispatch({ type: "SET_PURPOSE", purpose });

		const result = await generateSecurityTokenByEmailVerificationAction(
			{ purpose },
			identifier,
			token,
		);
		if (result.ok) {
			dispatch({ type: "SUCCESS", message: `Success ${purpose}` });
		} else {
			dispatch({ type: "ERROR", message: result.message });
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-black text-white">
			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold">Authenticating...</h1>
				<p className="text-gray-400">Please wait for second.</p>
			</div>
			{isInit(state) && (
				<GuideModal
					message={`Click Next button to authenticate`}
					onClickNext={handleVerify}
				/>
			)}
			{isSuccess(state) && (
				<GuideModal message={state.successMessage} onClickNext={handleSuccess} />
			)}
			{isError(state) && <ErrorModal message={state.errorMessage} onClose={handleError} />}
		</div>
	);
}
