import { ONE_TIME_TOKEN_PURPOSE } from "../../generated/dto-types";

export const AUTH_LOGIC_ROUTE = {
	SIGN_IN: "/auth/sign-in",
	SIGN_UP: `/auth/sign-up`,
	VERIFY_USER: (purpose: ONE_TIME_TOKEN_PURPOSE) => `/auth/verify-user?purpose=${purpose}`,
	VERIFY_USER_BY_EMAIL: (purpose: ONE_TIME_TOKEN_PURPOSE) =>
		`/auth/verify-user-by-email?purpose=${purpose}`,
	DELETE_ACCOUNT: `/auth/delete-account`,
	VERIFY_EMAIL: `/auth/verify-email`,
	UPDATE_PASSWORD: `/auth/update-password`,
} as const;
