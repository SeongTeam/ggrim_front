'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OneTimeToken, SignInResponse } from './auth/type';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { AUTH_LOGIC_ROUTE } from '../../route/auth/route';
import { getUserAction } from './user/api';
import { isHttpException, isServerActionError } from './util';
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
        //TODO 쿠키 만료 핸들 로직 개선
        // - [ ] : 페이지 이동을 클라이언트가 담당하도록 하기
        //  -> redirect 사용시 2가지 문제 존재
        //      1. 서버 컴포넌트 재렌더링 불가(layout 내의 <NavBar/>가 렌더링되지 않음)
        //      2. 클라이언트 측의 로직 예상 어려움
        //      - 개선 방법으로는, server-action 에러를 정의하여, 클라이언트에서 핸들링하도록 하기.
        // revalidatePath('/', 'layout');
        redirect(AUTH_LOGIC_ROUTE.SIGN_IN);
        // return undefined;
    }

    return JSON.parse(signInResponse) as SignInResponse;
}

export async function getSignInResponse(): Promise<SignInResponse | undefined> {
    const cookieStore = cookies();
    const signInResponse = cookieStore.get(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE)?.value;

    if (!signInResponse) {
        return undefined;
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

export async function getSignInInfo() {
    const cookieStore = cookies();
    const rawSignInResponse = cookieStore.get(ENUM_COOKIE_KEY.SIGN_IN_RESPONSE)?.value;
    if (rawSignInResponse) {
        const signInResponse: SignInResponse = JSON.parse(rawSignInResponse);
        const { id } = signInResponse.user;

        const response = await getUserAction(id);
        if (isServerActionError(response)) {
            throw new Error('unstable situation');
        } else if (isHttpException(response)) {
            throw new Error('unstable situation');
        }

        const user = response;

        return user;
    }

    return undefined;
}
export interface SignInInfo {
    username: string;
}
