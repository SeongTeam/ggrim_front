'use server';
import { getServerUrl, withErrorHandler } from '../lib';
import {
    CreateOneTimeTokenDTO,
    requestVerificationDTO,
    SendOneTimeTokenDTO,
    VerifyDTO,
} from './dto';
import { OneTimeToken, SignInResponse } from './type';
import { deleteSignInResponse, setOneTimeToken, setSignInResponse } from '../cookie';
import { HttpException } from '../common.dto';

//TODO : 사용자 정보를 반환하도록 수정하기
const signIn = async (id: string, password: string): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/sign-in`;
    const credentials = btoa(`${id}:${password}`);
    const headers = {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: SignInResponse = await response.json();

    setSignInResponse(result);

    return true;
};

const requestVerification = async (
    dto: requestVerificationDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/request-verification`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

const verifyEmail = async (dto: VerifyDTO): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/verify`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: OneTimeToken = await response.json();

    setOneTimeToken(result);

    return true;
};

const generateSecurityToken = async (
    id: string,
    password: string,
    dto: CreateOneTimeTokenDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/security-token`;
    const credentials = btoa(`${id}:${password}`);
    const headers = {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: OneTimeToken = await response.json();

    setOneTimeToken(result);

    return true;
};

const sendSecurityTokenToEmail = async (
    dto: SendOneTimeTokenDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/security-token/send`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

const signOut = async () => {
    deleteSignInResponse();
};

export const signInAction = withErrorHandler(signIn);

export const requestVerificationAction = withErrorHandler(requestVerification);
export const verifyEmailAction = withErrorHandler(verifyEmail);

export const generateSecurityTokenAction = withErrorHandler(generateSecurityToken);

export const sendSecurityTokenToEmailAction = withErrorHandler(sendSecurityTokenToEmail);

export const signOutAction = withErrorHandler(signOut);
