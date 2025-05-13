'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OneTimeToken, SignInResponse } from './auth/type';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
const ENUM_COOKIE_KEY = {
    SIGN_IN_RESPONSE: 'SignInResponse',
    ONE_TIME_TOKEN: 'OneTimeToken',
};

export async function getOneTimeTokenOrRedirect(): Promise<OneTimeToken> {
    const cookieStore = cookies();
    const oneTimeToken = cookieStore.get(ENUM_COOKIE_KEY.ONE_TIME_TOKEN)?.value;

    if (!oneTimeToken) {
        redirect('/');
    }

    return JSON.parse(oneTimeToken) as OneTimeToken;
}

export async function getSignInResponseOrRedirect(): Promise<SignInResponse> {
    const cookieStore = cookies();
    const signInResponse = cookieStore.get(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE)?.value;

    if (!signInResponse) {
        redirect('/auth/sign-in');
        // return undefined;
    }

    return JSON.parse(signInResponse) as SignInResponse;
}

export async function setOneTimeToken(oneTimeToken: OneTimeToken): Promise<void> {
    const cookieStore = cookies();
    cookieStore.set(ENUM_COOKIE_KEY.ONE_TIME_TOKEN, JSON.stringify(oneTimeToken), {
        maxAge: 15 * 60, // 확인필요
        secure: Boolean(process.env.COOKIE_SECURE) ?? true,
        httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
        sameSite: 'lax',
    });
}

export async function setSignInResponse(signInResponse: SignInResponse): Promise<void> {
    const cookieStore = cookies();
    cookieStore.set(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE, JSON.stringify(signInResponse), {
        maxAge: 2 * 60 * 60, // 확인필요
        secure: Boolean(process.env.COOKIE_SECURE) ?? true,
        httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
        sameSite: 'lax',
    });
}

export async function deleteSignInResponse(): Promise<ResponseCookies> {
    const cookieStore = cookies();
    const result = cookieStore.delete(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE);
    return result;
}

export async function deleteOneTimeToken(): Promise<ResponseCookies> {
    const cookieStore = cookies();
    const result = cookieStore.delete(ENUM_COOKIE_KEY.ONE_TIME_TOKEN);
    return result;
}
