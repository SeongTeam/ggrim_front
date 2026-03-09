"server-only";
import { cookies } from "next/headers";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import {
	EmailVerificationTokenResponse,
	ShowOneTimeTokenResponse,
	SignInResponse,
} from "../../../generated/dto-types";
const COOKIE_KEY = {
	SIGN_IN_RESPONSE: "SignInResponse",
	ONE_TIME_TOKEN: "OneTimeToken",
	EMAIL_VERIFICATION_TOKEN: "emailVerificationToken",
} as const;

export interface SignInInfo {
	username: string;
}

export async function getOneTimeToken(): Promise<ShowOneTimeTokenResponse | undefined> {
	const cookieStore = cookies();
	const oneTimeToken = cookieStore.get(COOKIE_KEY.ONE_TIME_TOKEN)?.value;

	if (!oneTimeToken) {
		return undefined;
	}

	return JSON.parse(oneTimeToken) as ShowOneTimeTokenResponse;
}

export async function getSignInResponse(): Promise<SignInResponse | undefined> {
	const cookieStore = cookies();
	const signInResponse = cookieStore.get(COOKIE_KEY.SIGN_IN_RESPONSE)?.value;

	if (!signInResponse) {
		return undefined;
	}

	return JSON.parse(signInResponse) as SignInResponse;
}

export async function setOneTimeToken(oneTimeToken: ShowOneTimeTokenResponse): Promise<void> {
	const cookieStore = cookies();
	cookieStore.set(COOKIE_KEY.ONE_TIME_TOKEN, JSON.stringify(oneTimeToken), {
		maxAge: 15 * 60, // 확인필요
		secure: Boolean(process.env.COOKIE_SECURE) ?? true,
		httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
		sameSite: "lax",
	});
}

export async function setSignInResponse(signInResponse: SignInResponse): Promise<void> {
	const cookieStore = cookies();
	cookieStore.set(COOKIE_KEY.SIGN_IN_RESPONSE, JSON.stringify(signInResponse), {
		maxAge: 2 * 60 * 60, // 확인필요
		secure: Boolean(process.env.COOKIE_SECURE) ?? true,
		httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
		sameSite: "lax",
	});
}
export async function getEmailVerificationToken() {
	const cookieStore = cookies();
	const emailVerificationToken = cookieStore.get(COOKIE_KEY.EMAIL_VERIFICATION_TOKEN)?.value;

	if (!emailVerificationToken) {
		return undefined;
	}

	return JSON.parse(emailVerificationToken) as EmailVerificationTokenResponse;
}

export async function setEmailVerificationToken(
	emailVerificationToken: EmailVerificationTokenResponse,
) {
	const cookieStore = cookies();
	cookieStore.set(COOKIE_KEY.EMAIL_VERIFICATION_TOKEN, JSON.stringify(emailVerificationToken), {
		maxAge: 15 * 60, // 확인필요
		secure: Boolean(process.env.COOKIE_SECURE) ?? true,
		httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
		sameSite: "lax",
	});
}

export async function deleteSignInResponse(): Promise<ResponseCookies> {
	const cookieStore = cookies();
	const result = cookieStore.delete(COOKIE_KEY.SIGN_IN_RESPONSE);
	return result;
}
//TODO oneTimeToken 사용 성공시, 반드시 삭제하자.
export async function deleteOneTimeToken(): Promise<ResponseCookies> {
	const cookieStore = cookies();
	const result = cookieStore.delete(COOKIE_KEY.ONE_TIME_TOKEN);
	return result;
}

export async function deleteEmailVerificationToken(): Promise<ResponseCookies> {
	const cookieStore = cookies();
	const result = cookieStore.delete(COOKIE_KEY.EMAIL_VERIFICATION_TOKEN);
	return result;
}
