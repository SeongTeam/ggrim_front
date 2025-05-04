'server only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OneTimeToken, SignInResponse } from './auth/type';

export const ENUM_COOKIE_KEY = {
    SIGN_IN_RESPONSE: 'SignInResponse',
    ONE_TIME_TOKEN: 'OneTimeToken',
};

export function getOneTimeTokenOrRedirect(): OneTimeToken {
    const cookieStore = cookies();
    const oneTimeToken = cookieStore.get(ENUM_COOKIE_KEY.ONE_TIME_TOKEN)?.value;

    if (!oneTimeToken) {
        redirect('/home');
    }

    return JSON.parse(oneTimeToken) as OneTimeToken;
}

export function getSignInResponseOrRedirect(): SignInResponse {
    const cookieStore = cookies();
    const signInResponse = cookieStore.get(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE)?.value;

    if (!signInResponse) {
        redirect('/home');
        // return undefined;
    }

    return JSON.parse(signInResponse) as SignInResponse;
}

export function setOneTimeToken(oneTimeToken: OneTimeToken): void {
    const cookieStore = cookies();
    cookieStore.set(ENUM_COOKIE_KEY.ONE_TIME_TOKEN, JSON.stringify(oneTimeToken), {
        maxAge: 10 * 60, // 확인필요
        secure: Boolean(process.env.COOKIE_SECURE) ?? true,
        httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
        sameSite: 'lax',
    });
}

export function setSignInResponse(signInResponse: SignInResponse): void {
    const cookieStore = cookies();
    cookieStore.set(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE, JSON.stringify(signInResponse), {
        maxAge: 2 * 60 * 60, // 확인필요
        secure: Boolean(process.env.COOKIE_SECURE) ?? true,
        httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY) ?? true,
        sameSite: 'lax',
    });
}
