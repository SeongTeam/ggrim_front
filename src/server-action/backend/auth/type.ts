import { User } from "../user/type";

export const ONE_TIME_TOKEN_PURPOSE = {
	UPDATE_PASSWORD: "update-password",
	DELETE_ACCOUNT: "delete-account",
	MAGIC_LOGIN: "magic-login",
	EMAIL_VERIFICATION: "email-verification",
	RECOVER_ACCOUNT: "recover-account",
	// SET_USER_ACTIVE : 'set-user-active',
	// RESET_PASSWORD: 'reset-password',
} as const;
export type OneTimeTokenPurpose =
	(typeof ONE_TIME_TOKEN_PURPOSE)[keyof typeof ONE_TIME_TOKEN_PURPOSE];

export interface OneTimeToken {
	id: string;
	email: string;
	token: string;
	used_date: Date;
	expired_date: Date;
	purpose: OneTimeTokenPurpose;
}

export interface SignInResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}
